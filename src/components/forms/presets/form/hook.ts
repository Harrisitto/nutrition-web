import useForm from "@src/hooks/form";
import type { InputState } from "@src/hooks/form/types";
import { calculateKcalFromMacros } from "@src/hooks/helpers/constants";
import {
    useFetchAllMealTypes,
    useFetchMeals,
    useFetchTypesForAllMeals
} from "@src/services/tanstack/data/meals";
import { createContext, useCallback, useContext, useMemo } from "react";

type Meal = NonNullable<ReturnType<typeof useFetchMeals>["data"]>[number];
type MealTypeRows = ReturnType<typeof useFetchTypesForAllMeals>["byMealId"][number];
type MealType = NonNullable<ReturnType<typeof useFetchAllMealTypes>["data"]>[number];

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
        }
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
        }
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

const createFieldForMeal = (meal: Meal, mealOptions: MealTypeRows | undefined) => {

    const unselectableOption = {
        value: "",
        label: " - ",
    };

    const options = mealOptions ? [unselectableOption, ...mealOptions.map((option) => ({
        value: option.type_id?.id?.toString(),
        label: option.type_id?.name,
    }))] : [unselectableOption];

    return {
        id: fieldIds.meal.generateId(meal.id),
        type: "selectOne",
        currentValue: "",
        inputProps: {
            label: meal.name,
            options
        },
    } as InputState<"selectOne">;
};

const createFieldForTrainingHc = (hcData: number[]) => {
    return hcData.map((hcId, index) => ({
        id: fieldIds.trainingHc.generateId(index),
        type: "numeric",
        currentValue: hcId || "",
        inputProps: {
            label: `${index + 1} H`,
        },
        isHidden: index > 4, // only show up to 5 HC fields by default
        controllers: [{
            subscribedIds: [
                fieldIds.trainingHc.generateId(index),
                fieldIds.trainingHc.generateId(index + 1)
            ],
            update: (hc1, hc2) => {
                if (!hc1.currentValue) {
                    return []; // if current HC is empty, do nothing
                }
                hc2.isHidden = false; // show next HC field
                return [hc2];
            }
        }]
    } as InputState<"numeric">));
};

const calculateDerivedState = (
    fields: Record<string, unknown>,
    mealsMap: Record<number, MealType>,
) => {
    const hcFields = Object.entries(fields)
        .map(([key, value]) => fieldIds.trainingHc.isId(key) ? value : null)
        .filter(Boolean) as InputState<"numeric">['currentValue'][];
    const mealFields = Object.entries(fields)
        .map(([key, value]) => fieldIds.meal.isId(key) ? value : null)
        .filter(Boolean) as InputState<"selectOne">['currentValue'][];

    const trainingCarbs = hcFields.reduce<number>((total, currValue) => {
        const value = typeof currValue === "number" ? currValue : 0;
        return total + value;
    }, 0);

    const trainingKcal = calculateKcalFromMacros({ carbs: trainingCarbs });

    const mealTotals = mealFields.reduce<{
        kcal: number;
        carbs: number;
        protein: number;
        fat: number;
    }>((totals, field) => {
        const mealTypeId = field ? parseInt(field.toString(), 10) : null;
        if (!mealTypeId || !mealsMap) return totals;
        const mealType = mealsMap[mealTypeId];
        const macros = mealType;
        if (!macros) return totals;

        totals.kcal += Number(calculateKcalFromMacros({
            carbs: macros.hc,
            protein: macros.prot,
            fat: macros.fat,
        }));
        totals.carbs += Number(macros.hc ?? 0);
        totals.protein += Number(macros.prot ?? 0);
        totals.fat += Number(macros.fat ?? 0);

        return totals;
    }, { kcal: 0, carbs: 0, protein: 0, fat: 0 });

    const mealKcal = mealTotals.kcal;
    const totalCarbs = mealTotals.carbs + trainingCarbs;
    const totalProtein = mealTotals.protein;
    const totalFat = mealTotals.fat;

    return {
        trainingKcal,
        mealKcal,
        totalKcal: trainingKcal + mealKcal,
        totalCarbs,
        totalProtein,
        totalFat,
    };
}


const useCreateConfig = () => {
    const mealsQuery = useFetchMeals();

    const mealIds = useMemo(
        () => (mealsQuery.data ?? []).map((meal) => meal.id),
        [mealsQuery.data]
    );

    const mealOptions = useFetchTypesForAllMeals(mealIds);

    const mealsConfig = useMemo(() => {
        if (!mealsQuery.data) return [];
        return mealsQuery.data.map((meal) =>
            createFieldForMeal(meal, mealOptions.byMealId[meal.id])
        );
    }, [mealsQuery.data, mealOptions.byMealId]);

    const trainingHcConfig = useMemo(() => {
        const hcData = Array.from({ length: 24 }, () => 0);
        return createFieldForTrainingHc(hcData);
    }, []);

    return useMemo(
        () => [nameField, commentField, ...mealsConfig, ...trainingHcConfig],
        [mealsConfig, trainingHcConfig]
    );
};

export const useFormPreset = () => {
    const config = useCreateConfig();

    const types = useFetchAllMealTypes();

    const typesMap = useMemo(() => {
        if (!types.data) return {};
        return types.data.reduce((map, type) => {
            map[type.id] = type;
            return map;
        }, {} as Record<number, MealType>);
    }, [types.data]);

    const derivedStateUpdater = useCallback(
        (fields: Record<string, unknown>) => calculateDerivedState(fields, typesMap),
        [typesMap]
    );

    const formPreset = useForm({
        config,
        calculateDerivedState: derivedStateUpdater,
    });

    return formPreset;
}

export const Context = createContext<ReturnType<typeof useFormPreset> | null>(null);

export const useContextFormPreset = () => {
    return useContext(Context);
}
