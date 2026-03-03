import { supabase } from "@src/services/supabase/client"
import { TABLE_USER_INFO } from "@src/services/supabase/definitions"
import { useAuthId } from "@src/store/slices/auth/hook"
import { useNotification } from "@src/store/slices/notification/hook"
import type { TablesInsert } from "@src/services/supabase/types"
import { useMutation } from "@tanstack/react-query"

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