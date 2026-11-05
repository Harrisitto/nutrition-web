import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FromDate from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { supabase } from "@src/services/supabase/client";
import { useNotification } from "@src/store/slices/notification/hook";
import { useAppSelector } from "@src/store/store";
import { queryKeys } from "../keys";
import { invalidateMacros } from "../user/macros";

const INGREDIENTS_TABLE = "recipe_type_custom_ingredients" as const;
const MEAL_INGREDIENTS_TABLE = "user_planing_meal_ingredients" as const;

/*
 * Ingredientes sueltos que el nutricionista añade a una comida planificada, encima
 * de su receta o de su tipo de comida. Cada fila apunta a la comida por
 * (meal_id, user_id, date) y guarda la cantidad elegida (`amount`). Los macros del
 * catálogo son para `amount` unidades del ingrediente, así que los de la fila se
 * escalan con `mealIngredientMacros`.
 */

// `name` y `units` son JSON por idioma: se piden ya traducidos
const selectIngredient = (language: ReturnType<typeof useLanguageCode>) =>
  `id, amount, kcal, prot, hc, fat, relation, name: name->>${language}, units: units->>${language}` as const;

const selectMealIngredient = (language: ReturnType<typeof useLanguageCode>) =>
  `*, ingredient: ${INGREDIENTS_TABLE}(${selectIngredient(language)})` as const;

export type CustomIngredient = NonNullable<
  ReturnType<typeof useFetchCustomIngredients>["data"]
>[number];

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
      return data.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    },
    staleTime: 30 * 60 * 1000,
  });
};

/** Macros de un ingrediente para la cantidad `amount` (el catálogo los da por `ingredient.amount`) */
export const mealIngredientMacros = (
  ingredient: Pick<CustomIngredient, "amount" | "kcal" | "prot" | "hc" | "fat">,
  amount: number,
) => {
  const factor = ingredient.amount ? amount / ingredient.amount : 0;
  return {
    kcal: ingredient.kcal * factor,
    prot: ingredient.prot * factor,
    hc: ingredient.hc * factor,
    fat: ingredient.fat * factor,
  };
};

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
        .eq("user_id", userId!)
        .gte("date", start)
        .lte("date", end)
        .order("id");

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
    .eq("user_id", userId)
    .or(filter);

  if (error) {
    throw error;
  }
};

/** Borra los ingredientes adicionales de todas las comidas de un día */
export const deleteMealIngredientsForDate = async (userId: string, date: string) => {
  const { error } = await supabase
    .from(MEAL_INGREDIENTS_TABLE)
    .delete()
    .eq("user_id", userId)
    .eq("date", date);

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
export type DraftMealIngredient = { ingredientId: number; amount: number };

/**
 * Deja la comida exactamente con esos ingredientes: borra los que tenía e inserta los
 * nuevos. La comida tiene que estar ya guardada en user_planing_meal (la FK es compuesta).
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
          ingredients.map(({ ingredientId, amount }) => ({
            user_id: userId,
            date: date.save(),
            meal_id: mealId,
            ingredient_id: ingredientId,
            amount,
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
