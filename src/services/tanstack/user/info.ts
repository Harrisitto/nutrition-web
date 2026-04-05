import { supabase } from "@src/services/supabase/client"
import { TABLE_USER_INFO } from "@src/services/supabase/definitions"
import { useAuthId } from "@src/store/slices/auth/hook"
import { useNotification } from "@src/store/slices/notification/hook"
import type { TablesInsert } from "@src/services/supabase/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useConfigSelectedUserId } from "@src/store/slices/config/hook"
import { queryKeys } from "../keys"
import { dateToSupabaseFormat } from "@src/helpers/dates"

export const useInsertUserInfo = () => {
  const { addMutationError } = useNotification();
  const userId = useAuthId()
  const mutation = useMutation({
    mutationFn: async (insertData: TablesInsert<typeof TABLE_USER_INFO.NAME>) => {
      if (!userId) throw new Error('No authenticated user found')
      const { data, error } = await supabase
        .from(TABLE_USER_INFO.NAME)
        .upsert(insertData)
        .select()
        .single()
        if (error) throw error
        return data
    },
    onError: () => {
      addMutationError();
    },
  })
  return mutation
}

export const useFetchBmr = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const userId = useConfigSelectedUserId();
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
  const userId = useConfigSelectedUserId();
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

