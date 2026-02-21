import { useMutation } from '@tanstack/react-query'
import { useNotification } from '@src/store/slices/notification/hook'
import { supabase } from '@src/services/supabase/client'
import { tableUsers } from '@src/services/supabase/definitions'
import { useAuth } from '@src/store/slices/auth/hook'
import { useAppDispatch } from '@src/store/store'
import { setProfile } from '@src/store/slices/auth/store'

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
    onError: (error) => {
      addMutationError();
      console.error('Error inserting user:', error)
    },
  })

  return {
    ...mutation
  }
}

/**
 * Example usage in a component:
 *
 * const { mutate: insertUser, isPending } = useInsertUser()
 *
 * const handleInsert = async () => {
 *   insertUser(
 *     {
 *       user_id: 'uuid',
 *       brand_id: 'brand-uuid',
 *       created_at: new Date().toISOString(),
 *       is_nutritionist: false,
 *       is_owner: false,
 *     },
 *     {
 *       onSuccess: (data) => {
 *         console.log('User inserted:', data)
 *       },
 *     }
 *   )
 * }
 */
