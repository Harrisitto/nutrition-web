import { useNotification } from "@src/store/slices/notification/hook";
import { useMutation } from "@tanstack/react-query";
import type { TablesInsert } from "@src/services/supabase/types";
import { TABLE_ALL_NUTRITIONISTS } from "@src/services/supabase/definitions";
import { supabase } from "@src/services/supabase/client";
import { queryKeys } from "../keys";
import { queryClient } from "../queryClient";
import { useGetAuthSession } from "./get";


export const useInsertAuthInfo = () => {
  const { addMutationError } = useNotification();
  const { data } = useGetAuthSession()
  const userId = data?.userId;

  const mutation = useMutation({
    mutationFn: async (insertData: TablesInsert<typeof TABLE_ALL_NUTRITIONISTS.NAME>) => {
      if (!userId) throw new Error('No authenticated user found')
      const { data, error } = await supabase
        .from(TABLE_ALL_NUTRITIONISTS.NAME)
        .upsert(insertData)
        .select()
        .single()
        if (error) throw error
        return data
    },
    onError: () => {
      addMutationError();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys().auth.profile, () => data)
    },
  })
  return mutation
}

export const useVerifyAuth = ({
  email,
}: { email: string }) => {
  const { addMutationError } = useNotification();

  const mutation = useMutation({
    mutationKey: queryKeys().auth.session,
    mutationFn: async ({ token }: { token: string }) => {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      })
      if (error) throw error
      return data
    },
    onError: () => {
      addMutationError();
    },
  })
  return mutation
}

export const useSignOut = () => {
  const { addMutationError } = useNotification();

  const mutation = useMutation({
    mutationKey: queryKeys().auth.session,
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onError: () => {
      addMutationError();
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKeys().auth.session, null)
      queryClient.setQueryData(queryKeys().auth.profile, null)
    },
  })
  return mutation
}
