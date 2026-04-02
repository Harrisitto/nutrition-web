import { useMutation, useQuery } from '@tanstack/react-query'
import { useNotification, useNotificationErrorQuery } from '@src/store/slices/notification/hook'
import { supabase } from '@src/services/supabase/client'
import { TABLE_ALL_USERS } from '@src/services/supabase/definitions'
import { useAuth, useAuthId } from '@src/store/slices/auth/hook'
import { useAppDispatch } from '@src/store/store'
import { setProfile } from '@src/store/slices/auth/store'
import { useConfigSelectedUserId } from '@src/store/slices/config/hook'
import { queryKeys } from '../keys'

const selectUser = () => {
    return `*, user_info(*)` as const;
}

/**
 * Hook to insert a new user into the database
 */
export const useInsertProfile = () => {
  const { addMutationError } = useNotification();
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No authenticated user found')
      const { data, error } = await supabase
        .from(TABLE_ALL_USERS.NAME)
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

export const useFetchSingleUser = ({
    userId
}: {
    userId?: string
} = {}) => {
    const selectedUser = useConfigSelectedUserId();
    const effectiveUserId = userId ?? selectedUser ?? "";
    return useQuery({
        queryKey: queryKeys({
            userId: effectiveUserId,
        }).user.single,
        queryFn: async () => {
            const { data, error } = await supabase
                .from(TABLE_ALL_USERS.NAME)
                .select(selectUser())
                .eq(TABLE_ALL_USERS.COLS.USER_ID, effectiveUserId)
                .maybeSingle()
            if (error) throw error
            return data
        },
        enabled: !!effectiveUserId,
    })
}

export const useFetchNutritionistUsers = () => {
    const userId = useAuthId();
    const err = useNotificationErrorQuery()

    return useQuery({
        queryKey: queryKeys({
            userId: userId ?? '',
        }).user.fromNutritionist,
        queryFn: async () => {
            try {
                if (!userId) throw new Error("User ID is required to fetch nutritionist users");
                const { data, error } = await supabase
                    .from(TABLE_ALL_USERS.NAME)
                    .select(selectUser())
                    .eq(TABLE_ALL_USERS.COLS.NUTRI_ID, userId)
                if (error) throw error
                return data
            } catch (error) {
                err()
                throw error

            }
        },
        placeholderData: [],
    })
}
