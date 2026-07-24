import { supabase } from "@src/services/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "../keys"
import { dateToSupabaseFormat } from "@src/helpers/dates"
import { useAppSelector } from "@src/store/store"

export const useFetchBmr = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const start = dateToSupabaseFormat(startDate);
  const end = dateToSupabaseFormat(endDate);

  const query = useQuery({
    queryKey: queryKeys({
      userId,
    }).user.basalMetabolicRate(startDate, endDate),
    queryFn: async () => {
      if (!userId) throw new Error('No authenticated user found')
      const { data, error } = await supabase.rpc('get_bmr', {
        user_uuid: userId,
        start_date: start,
        end_date: end,
      });
      if (error) throw error
      return data
    },
    enabled: !!userId,
  });
  return query;
}

export const useFetchUserWeightForDateRange = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const start = dateToSupabaseFormat(startDate);
  const end = dateToSupabaseFormat(endDate);

  const query = useQuery({
    queryKey: queryKeys({
      userId,
    }).user.weightForDateRange(startDate, endDate),
    queryFn: async () => {
      if (!userId) throw new Error('No authenticated user found')
      const { data, error } = await supabase.rpc('get_weight', {
        user_uuid: userId,
        start_date: start,
        end_date: end,
      });
      if (error) throw error
      return data
    },
    enabled: !!userId,
  });
  return query;
}
