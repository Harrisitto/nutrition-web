import { useMutation, useQuery } from '@tanstack/react-query'
import { useNotification, useNotificationErrorQuery } from '@src/store/slices/notification/hook'
import { supabase } from '@src/services/supabase/client'
import type { Database } from '@src/services/supabase/types'
import { TABLE_ALL_USERS, TABLE_USER_INFO } from '@src/services/supabase/definitions'
import { useAuth, useAuthId } from '@src/store/slices/auth/hook'
import { useAppDispatch } from '@src/store/store'
import { setProfile } from '@src/store/slices/auth/store'
import { useConfigSelectedUserId } from '@src/store/slices/config/hook'
import { queryKeys } from '../keys'
import { queryClient } from '../queryClient'

type UserInfoRow = Database['public']['Tables']['user_info']['Row']
type UserWithInfo = Database['public']['Tables']['all_users']['Row'] & {
    user_info: UserInfoRow | null
}

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
                    //.eq(TABLE_ALL_USERS.COLS.IS_NUTRI, false)
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

export const useUpdateClientGoal = () => {
  const clientId = useConfigSelectedUserId();
    const nutritionistId = useAuthId();

  return useMutation({
    mutationFn: async (goal: string) => {
      if (!clientId) throw new Error('No authenticated user found')
      const { data, error } = await supabase
        .from(TABLE_USER_INFO.NAME)
        .update({ goal })
        .eq(TABLE_USER_INFO.COLS.USER_ID, clientId)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: async (data) => {
        await queryClient.invalidateQueries({
            queryKey: queryKeys({
                userId: clientId,
            }).user.single,
        })

        if (!nutritionistId) return

        queryClient.setQueryData<UserWithInfo[]>(
            queryKeys({
                userId: nutritionistId,
            }).user.fromNutritionist,
            (oldData = []) => {
                return oldData.map(user => {
                    if (user.user_id === clientId) {
                        return {
                            ...user,
                            user_info: data,
                        }
                    }
                    return user;
                }
                )
            }
        )
    }
  })
}
