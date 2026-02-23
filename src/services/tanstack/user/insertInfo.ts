import { useMutation } from '@tanstack/react-query'
import { useNotification } from '@src/store/slices/notification/hook'
import { supabase } from '@src/services/supabase/client'
import { tableUsers, userInfo } from '@src/services/supabase/definitions'
import { useAuth } from '@src/store/slices/auth/hook'
import { useAppDispatch } from '@src/store/store'
import { setProfile } from '@src/store/slices/auth/store'
import type { TablesInsert } from '@src/services/supabase/types'

/**
 * Hook to insert a new user into the database
 */
export const useProfile = () => {
  const { addMutationError } = useNotification();
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No authenticated user found')
      const { data, error } = await supabase
        .from(tableUsers)
        .insert({
            user_id: user.id,
            brand_id: null,
            created_at: new Date().toISOString(),
            is_nutritionist: true,
            is_owner: false,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      dispatch(setProfile(data));
    },
    onError: () => {
      addMutationError();
    },
  })

  return mutation
}

export const useInfo = () => {
  const { addMutationError } = useNotification();
  const { user } = useAuth()
  const mutation = useMutation({
    mutationFn: async (insertData: TablesInsert<'user_info'>) => {
      if (!user) throw new Error('No authenticated user found')
      const { data, error } = await supabase
        .from(userInfo)
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
