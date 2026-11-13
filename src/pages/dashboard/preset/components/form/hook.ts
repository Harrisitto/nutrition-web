import useForm from "@src/hooks/form";
import type { InputState } from "@src/hooks/form/types";
import { Macros } from "@src/helpers/macros";
import { hcToKcal } from "@src/helpers/nutrition";
import {
  useFetchAllMealTypes,
  useFetchMeals,
} from "@src/services/tanstack/data/meals";
import { createContext, useCallback, useContext, useMemo } from "react";

type Meal = NonNullable<ReturnType<typeof useFetchMeals>["data"]>[number];
type MealType = NonNullable<
  ReturnType<typeof useFetchAllMealTypes>["data"]
>[number];

export const fieldIds = {
  name: "name",
  comment: "comment",
  meal: {
    generateId: (mealId: number) => `meal-${mealId}`,
    isId: (fieldId: string) => fieldId.startsWith("meal-"),
    parseId: (fieldId: string) => {
      const prefix = "meal-";
      if (!fieldId.startsWith(prefix)) return null;
      const idPart = fieldId.slice(prefix.length);
      const id = parseInt(idPart, 10);
      return isNaN(id) ? null : id;
    },
  },
  trainingHc: {
    generateId: (index: number) => `training-hc-${index}`,
    isId: (fieldId: string) => fieldId.startsWith("training-hc-"),
    parseId: (fieldId: string) => {
      const prefix = "training-hc-";
      if (!fieldId.startsWith(prefix)) return null;
      const indexPart = fieldId.slice(prefix.length);
      const index = parseInt(indexPart, 10);
      return isNaN(index) ? null : index;
    },
  },
} as const;

const nameField = {
  id: fieldIds.name,
  type: "text",
  currentValue: "",
  inputProps: {
    label: "forms:preset.fields.name",
  },
} as InputState<"text">;

const commentField = {
  id: fieldIds.comment,
  type: "textarea",
  currentValue: "",
  inputProps: {
    label: "forms:preset.fields.comment",
  },
} as InputState<"textarea">;

// El selector carga sus propias opciones (búsqueda paginada), el config no depende de ellas. Ordena por los
// usos en esa comida; en un preset del cliente, por su planificación (en uno global no hay cliente)
const createFieldForMeal = (meal: Meal, global: boolean) => {
  return {
    id: fieldIds.meal.generateId(meal.id),
    type: "recipeType",
    currentValue: null,
    inputProps: {
      label: meal.name,
      mealId: meal.id,
      scoreByClient: !global,
    },
  } as InputState<"recipeType">;
};

const createFieldForTrainingHc = (hcData: number[]) => {
  return hcData.map(
    (hcId, index) =>
      ({
        id: fieldIds.trainingHc.generateId(index),
        type: "numeric",
        currentValue: hcId || "",
        inputProps: {
          label: `${index + 1} H`,
        },
        isHidden: index > 4, // only show up to 5 HC fields by default
        controllers: [
          {
            subscribedIds: [
              fieldIds.trainingHc.generateId(index),
              fieldIds.trainingHc.generateId(index + 1),
            ],
            update: (hc1, hc2) => {
              if (!hc1.currentValue) {
                return []; // if current HC is empty, do nothing
              }
              hc2.isHidden = false; // show next HC field
              return [hc2];
            },
          },
        ],
      }) as InputState<"numeric">,
  );
};

const calculateDerivedState = (
  fields: Record<string, unknown>,
  mealsMap: Record<number, MealType>,
) => {
  const hcFields = Object.entries(fields)
    .map(([key, value]) => (fieldIds.trainingHc.isId(key) ? value : null))
    .filter(Boolean) as InputState<"numeric">["currentValue"][];
  const mealFields = Object.entries(fields)
    .map(([key, value]) => (fieldIds.meal.isId(key) ? value : null))
    .filter(Boolean) as InputState<"recipeType">["currentValue"][];

  const trainingCarbs = hcFields.reduce<number>((total, currValue) => {
    const value = typeof currValue === "number" ? currValue : 0;
    return total + value;
  }, 0);

  const trainingKcal = hcToKcal(trainingCarbs);

  // Kcal calculadas desde las macros de cada tipo (no las kcal guardadas en recipe_type)
  const mealTotals = Macros.sum(
    mealFields.flatMap((mealTypeId) => {
      const type = mealTypeId ? mealsMap[mealTypeId] : undefined;
      return type ? [new Macros(type.prot, type.fat, type.hc)] : [];
    }),
  );

  const mealKcal = mealTotals.kcal;
  const totalCarbs = mealTotals.hc + trainingCarbs;
  const totalProtein = mealTotals.prot;
  const totalFat = mealTotals.fat;

  return {
    trainingKcal,
    mealKcal,
    totalKcal: trainingKcal + mealKcal,
    totalCarbs,
    totalProtein,
    totalFat,
  };
};

const useCreateConfig = (global: boolean) => {
  // Presets store data for every meal, regardless of the table display config
  const mealsQuery = useFetchMeals({ onlyVisible: false });

  const mealsConfig = useMemo(() => {
    if (!mealsQuery.data) return [];
    return mealsQuery.data.map((meal) => createFieldForMeal(meal, global));
  }, [mealsQuery.data, global]);

  const trainingHcConfig = useMemo(() => {
    const hcData = Array.from({ length: 24 }, () => 0);
    return createFieldForTrainingHc(hcData);
  }, []);

  return useMemo(
    () => [nameField, commentField, ...mealsConfig, ...trainingHcConfig],
    [mealsConfig, trainingHcConfig],
  );
};

export const useFormPreset = ({ global = false }: { global?: boolean } = {}) => {
  const config = useCreateConfig(global);

  const types = useFetchAllMealTypes();

  const typesMap = useMemo(() => {
    if (!types.data) return {};
    return types.data.reduce(
      (map, type) => {
        map[type.id] = type;
        return map;
      },
      {} as Record<number, MealType>,
    );
  }, [types.data]);

  const derivedStateUpdater = useCallback(
    (fields: Record<string, unknown>) =>
      calculateDerivedState(fields, typesMap),
    [typesMap],
  );

  const formPreset = useForm({
    config,
    calculateDerivedState: derivedStateUpdater,
  });

  return formPreset;
};

export const Context = createContext<ReturnType<typeof useFormPreset> | null>(
  null,
);

export const useContextFormPreset = () => {
  return useContext(Context);
};

// Presets globales (user_id null): se crean desde configuración y los ven todos los clientes
export const ScopeContext = createContext<{ global: boolean }>({ global: false });

export const useIsGlobalPreset = () => {
  return useContext(ScopeContext).global;
};
