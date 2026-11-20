import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FromDate from "@src/helpers/dates";
import { Macros } from "@src/helpers/macros";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { supabase } from "@src/services/supabase/client";
import { useNotification } from "@src/store/slices/notification/hook";
import { useAppSelector } from "@src/store/store";
import { queryKeys } from "../keys";
import { invalidateMacros } from "../user/macros";

const INGREDIENTS_TABLE = "catalog_ingredients" as const;
const MEAL_INGREDIENTS_TABLE = "user_planning_meal_ingredients" as const;

/** Unidades fijas de public_recipes.all_units */
export const GRAMS_UNIT_ID = 1;
const MILLILITRES_UNIT_ID = 2;

/*
 * Ingredientes sueltos que el nutricionista añade a una comida planificada, encima
 * de su receta o de su tipo de comida. Cada fila apunta a la comida por
 * (client_id, date, meal_id) y guarda la cantidad en una unidad del ingrediente
 * (`amount` + `unit_id`). El catálogo (catalog_ingredients) da los macros por 100 g y
 * catalog_ingredient_units los gramos de cada unidad, así que los de la fila se
 * calculan con `mealIngredientMacros`.
 */

// `name` es JSON por idioma: se pide ya traducido. prot/hc con los nombres de Macros
export const selectIngredient = (language: ReturnType<typeof useLanguageCode>) =>
  `id, kcal, prot: protein, hc: carbs, fat, name: name->>${language}, units: catalog_ingredient_units(unit_id, grams, min_scale)` as const;

const selectMealIngredient = (language: ReturnType<typeof useLanguageCode>) =>
  `*, ingredient: ${INGREDIENTS_TABLE}(${selectIngredient(language)})` as const;

export type CustomIngredient = NonNullable<
  ReturnType<typeof useFetchCustomIngredients>["data"]
>[number];

export type IngredientUnit = CustomIngredient["units"][number];

export type MealIngredient = NonNullable<
  ReturnType<typeof useFetchMealIngredientsForDate>["data"]
>[number];

/** Catálogo de ingredientes, ordenado por nombre en el idioma actual */
export const useFetchCustomIngredients = () => {
  const language = useLanguageCode();

  return useQuery({
    queryKey: queryKeys({ language }).data.customIngredients,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(INGREDIENTS_TABLE)
        .select(selectIngredient(language));

      if (error) {
        throw error;
      }
      // Ordenado aquí: `order("name")` ordenaría por el JSON, no por el texto traducido
      return data
        .map((ingredient) => ({
          ...ingredient,
          // Solo las unidades con gramos sirven para calcular macros; gramos primero
          units: ingredient.units
            .filter((unit) => (unit.grams ?? 0) > 0)
            .sort((a, b) => Number(b.unit_id === GRAMS_UNIT_ID) - Number(a.unit_id === GRAMS_UNIT_ID)),
        }))
        .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    },
    staleTime: 30 * 60 * 1000,
  });
};

/** Lo mínimo de una unidad para pasar una cantidad a gramos */
type UnitGrams = { unit_id: number; grams: number | null };

/** Unidad `unitId` del ingrediente; sin ella, la primera (gramos si los tiene) */
export const ingredientUnit = <U extends UnitGrams>(
  ingredient: { units: U[] },
  unitId?: number,
): U | undefined =>
  ingredient.units.find((unit) => unit.unit_id === unitId) ?? ingredient.units[0];

/** Unidad con la que se añade un ingrediente: la primera que no es de peso o volumen, si no gramos */
export const defaultIngredientUnit = (ingredient: Pick<CustomIngredient, "units">) =>
  ingredient.units.find((unit) => unit.unit_id !== GRAMS_UNIT_ID && unit.unit_id !== MILLILITRES_UNIT_ID) ??
  ingredientUnit(ingredient);

/** Cantidad de referencia (una ración) en esa unidad: 100 g o ml, o 1 unidad */
export const referenceAmount = (unit: Pick<IngredientUnit, "unit_id"> | undefined) =>
  unit && unit.unit_id !== GRAMS_UNIT_ID && unit.unit_id !== MILLILITRES_UNIT_ID ? 1 : 100;

/** Nombres de las unidades (catalog_units) en el idioma actual, por id */
export const useFetchUnitNames = () => {
  const language = useLanguageCode();

  return useQuery({
    queryKey: queryKeys({ language }).data.units,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalog_units")
        .select(`id, name: name->>${language}`);

      if (error) {
        throw error;
      }
      return new Map(data.map((unit) => [unit.id, unit.name ?? ""]));
    },
    staleTime: 30 * 60 * 1000,
  });
};

/** Texto de una unidad: g y ml abreviados, las demás con su nombre (useFetchUnitNames) */
export const useUnitLabel = () => {
  const { data: names } = useFetchUnitNames();
  return (unitId: number | undefined) =>
    unitId === GRAMS_UNIT_ID ? "g" : unitId === MILLILITRES_UNIT_ID ? "ml" : (names?.get(unitId ?? -1) ?? "");
};

/** Gramos que son `amount` en la unidad `unitId` del ingrediente (0 si no tiene esa unidad) */
export const ingredientGrams = (
  ingredient: { units: UnitGrams[] },
  amount: number,
  unitId?: number,
) => amount * (ingredientUnit(ingredient, unitId)?.grams ?? 0);

/** Macros de un ingrediente para `amount` en la unidad `unitId` (el catálogo los da por 100 g) */
export const mealIngredientMacros = (
  ingredient: {
    kcal: number | null;
    prot: number | null;
    hc: number | null;
    fat: number | null;
    units: UnitGrams[];
  },
  amount: number,
  unitId?: number,
) =>
  Macros.from({
    kcal: ingredient.kcal ?? 0,
    prot: ingredient.prot ?? 0,
    hc: ingredient.hc ?? 0,
    fat: ingredient.fat ?? 0,
  }).scale(ingredientGrams(ingredient, amount, unitId) / 100);

/** Misma semana (lunes a domingo) que la query de comidas */
const weekRange = (date: FromDate) => ({
  start: date.thisMonday().save(),
  end: date.thisSunday().save(),
});

/** Ingredientes añadidos a las comidas del cliente seleccionado, en la semana de `date` */
export const useFetchMealIngredientsForDate = ({ date }: { date?: FromDate } = {}) => {
  const selectedDay = useAppSelector((state) => state.config.selectedDay);
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const language = useLanguageCode();

  const { start, end } = weekRange(date ?? new FromDate(selectedDay));

  return useQuery({
    queryKey: queryKeys({ userId, language }).user.mealIngredients(start, end),
    queryFn: async () => {
      const { data, error } = await supabase
        .from(MEAL_INGREDIENTS_TABLE)
        .select(selectMealIngredient(language))
        .eq("client_id", userId!)
        .gte("date", start)
        .lte("date", end)
        .order("date")
        .order("meal_id")
        .order("ingredient_id");

      if (error) {
        throw error;
      }
      return data;
    },
    enabled: !!userId,
  });
};

/** Ingredientes de una comida concreta (fecha "YYYY-MM-DD" + meal_id) dentro de la lista semanal */
export const filterMealIngredients = (
  ingredients: MealIngredient[] | undefined,
  { date, mealId }: { date: string; mealId: number },
) => ingredients?.filter((el) => el.date === date && el.meal_id === mealId) ?? [];

type MealSlot = { date: string; mealId: number };

/**
 * Borra los ingredientes adicionales de esas comidas (fecha "YYYY-MM-DD" + meal_id).
 * Se usa cuando la comida pierde o cambia su receta fija, o se borra: los ingredientes
 * se añadieron para esa receta y no tienen sentido con otra.
 */
export const deleteMealIngredientsForSlots = async (userId: string, slots: MealSlot[]) => {
  if (!slots.length) return;
  const filter = slots
    .map(({ date, mealId }) => `and(date.eq.${date},meal_id.eq.${mealId})`)
    .join(",");
  const { error } = await supabase
    .from(MEAL_INGREDIENTS_TABLE)
    .delete()
    .eq("client_id", userId)
    .or(filter);

  if (error) {
    throw error;
  }
};

const useInvalidateMealIngredients = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const queryClient = useQueryClient();

  return () => {
    // Los ingredientes extra suman en los macros del día
    invalidateMacros(userId);
    return queryClient.invalidateQueries({
      queryKey: queryKeys({ userId }).user.mealIngredientsBase,
    });
  };
};

/** Ingrediente del borrador del editor, antes de guardarse */
export type DraftMealIngredient = { ingredientId: number; amount: number; unitId: number };

/**
 * Deja la comida exactamente con esos ingredientes: borra los que tenía e inserta los
 * nuevos. La comida tiene que estar ya guardada en user_planning_meals (la FK es compuesta).
 */
export const useReplaceMealIngredients = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const invalidate = useInvalidateMealIngredients();
  const { addMutationError } = useNotification();

  return useMutation({
    mutationFn: async ({
      date,
      mealId,
      ingredients,
    }: {
      date: FromDate;
      mealId: number;
      ingredients: DraftMealIngredient[];
    }) => {
      if (!userId) {
        throw new Error("User ID is required to save the ingredients of a meal");
      }

      await deleteMealIngredientsForSlots(userId, [{ date: date.save(), mealId }]);
      if (!ingredients.length) return [];

      const { data, error } = await supabase
        .from(MEAL_INGREDIENTS_TABLE)
        .insert(
          ingredients.map(({ ingredientId, amount, unitId }) => ({
            client_id: userId,
            date: date.save(),
            meal_id: mealId,
            ingredient_id: ingredientId,
            amount,
            unit_id: unitId,
          })),
        )
        .select("*");

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: invalidate,
    onError: addMutationError,
  });
};
