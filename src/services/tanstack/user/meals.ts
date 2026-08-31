import FromDate from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { useAppSelector } from "@src/store/store";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";

const TABLE_NAME = "user_planing_meal" as const;

const selectFromMeal = (languageCode: ReturnType<typeof useLanguageCode>) => {
  return `*, recipe_type(*, name: name->>${languageCode})` as const;
};

export const useFetchMealsForDate = ({ date }: { date?: FromDate } = {}) => {
  const d = useAppSelector((state) => state.config.selectedDay);
  const language = useLanguageCode();
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const { monday, sunday } = date
    ? date.thisWeek()
    : new FromDate(d).thisWeek();

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
