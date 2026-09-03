import FromDate from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { useAppSelector } from "@src/store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import type { TablesInsert } from "@src/services/supabase/types";

const TABLE_NAME = "user_planing_meal" as const;

const selectFromMeal = (languageCode: ReturnType<typeof useLanguageCode>) => {
  return `*, recipe_type(*, name: name->>${languageCode})` as const;
};

type MealType = NonNullable<ReturnType<typeof useFetchPlaningMealsForDate>["data"]>[number];

export const useFetchPlaningMealsForDate = ({ 
  date,
  prevRange,
  postRange,
}: { 
  date?: FromDate 
  prevRange?: number
  postRange?: number
} = {}) => {
  const d = useAppSelector((state) => state.config.selectedDay);
  const language = useLanguageCode();
  const userId = useAppSelector((state) => state.config.selectedUserId);

  const safeDate = date ?? new FromDate(d);
  const safePrevRange = Math.floor(prevRange ?? 1);
  const safePostRange = Math.floor(postRange ?? 1);
  const monday = safeDate.incrementDay(safePrevRange).thisMonday();
  const sunday = safeDate.incrementDay(safePostRange).thisSunday();

  const query = useQuery({
    queryKey: queryKeys({
      userId,
      language,
    }).user.meals(monday.save(), sunday.save()),
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select(selectFromMeal(language))
        .gte("date", monday.save())
        .lte("date", sunday.save());

      if (error) throw new Error(error.message);

      return data;
    },
  });

  return query;
};

export const useMutatePlaningMeals = ({
  forDate,
}: {
  forDate?: FromDate;
} = {}) => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const d = useAppSelector((state) => state.config.selectedDay);
  const language = useLanguageCode();
  const queryClient = useQueryClient();

  const safeDate = forDate ?? new FromDate(d);

  const mutation = useMutation({
    mutationFn: async (meal: Partial<TablesInsert<'user_planing_meal'>>[]) => {
      if (!userId) {
        throw new Error("User ID is required for all meals.");
      }

      if (meal.some((m) => m.meal_id == null || m.type_id == null)) {
        throw new Error("Meal ID and type ID are required for all meals.");
      }

      const safeMeals: TablesInsert<'user_planing_meal'>[] = meal.map((m) => ({
        user_id: userId,
        date: m.date ?? safeDate.save(),
        meal_id: m.meal_id!,
        recipe_id: m.recipe_id ?? null,
        type_id: m.type_id!,
      }));

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .upsert(safeMeals)
        .select(selectFromMeal(language));
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        queryKeys({
          userId,
          language,
        }).user.meals(safeDate.save(),  safeDate.save()),
       (oldData: MealType[] | undefined) => {
          if (!data) return oldData;
          if(!oldData) return data;
          const createId = (m: MealType) => {
            return `${m.date}-${m.meal_id}-${m.type_id}`;
          }
          const dataSet = new Set(oldData?.map(createId));
          const newData = data.filter((d) => !dataSet.has(createId(d)));
          return [...(oldData ?? []), ...newData];
        },
      );
    }
  });

  return mutation;
}

export const useDeletePlaningMeal = ({
  forDate,
}: {
  forDate?: FromDate;
} = {}) => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const d = useAppSelector((state) => state.config.selectedDay);
  const language = useLanguageCode();
  const queryClient = useQueryClient();

  const safeDate = forDate ?? new FromDate(d);

  const mutation = useMutation({
    mutationFn: async (mealId: number | undefined) => {
      if (!userId) {
        throw new Error("User ID is required to delete a meal.");
      }

      if (mealId === undefined) {
        const { data, error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq("user_id", userId)
        .eq("date", safeDate.save())
        .select(selectFromMeal(language));
        if (error) throw new Error(error.message);
        return data;
      } 

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq("user_id", userId)
        .eq("date", safeDate.save())
        .eq("meal_id", mealId)
        .select(selectFromMeal(language));
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        queryKeys({
          userId,
          language,
        }).user.meals(safeDate.save(),  safeDate.save()),
       (oldData: MealType[] | undefined) => {
          if (!data) return oldData;
          if(!oldData) return oldData;
          const deleteId = (m: MealType) => {
            return `${m.date}-${m.meal_id}-${m.type_id}`;
          }
          const dataSet = new Set(data.map(deleteId));
          return oldData.filter((d) => !dataSet.has(deleteId(d)));
        },
      );
    }
  });

  return mutation;
}
