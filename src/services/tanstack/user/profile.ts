import { useMutation, useQuery } from '@tanstack/react-query'
import { useNotification, useNotificationErrorQuery } from '@src/store/slices/notification/hook'
import { supabase } from '@src/services/supabase/client'
import type { Database } from '@src/services/supabase/types'
import { TABLE_ALL_NUTRITIONISTS, TABLE_ALL_USERS } from '@src/services/supabase/definitions'
import { useAuth, useAuthId } from '@src/store/slices/auth/hook'
import { useAppDispatch } from '@src/store/store'
import { setProfile } from '@src/store/slices/auth/store'
import { useConfigSelectedUserId } from '@src/store/slices/config/hook'
import { queryKeys } from '../keys'
import { queryClient } from '../queryClient'

type UserWithInfo = Database['public']['Tables']['all_users']['Row']

const selectUser = () => {
    return `*` as const;
}

/**
 * Hook to insert a new user into the database
 */
export const useInsertProfile = () => {
  const { addMutationError } = useNotification();
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const mutation = useMutation({
    mutationFn: async ({
        name,
    }: {
        name: string
    }) => {
      if (!user) throw new Error('No authenticated user found')
      const { data, error } = await supabase
        .from(TABLE_ALL_NUTRITIONISTS.NAME)
        .insert({
            nutri_id: user.id,
            name,
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
        .from(TABLE_ALL_USERS.NAME)
        .update({ 
            goal,
         })
        .eq(TABLE_ALL_USERS.COLS.USER_ID, clientId)
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
                        user.goal = data.goal
                        return user;
                    }
                    return user;
                }
                )
            }
        )
    }
  })
}

export const useRemoveClient = () => {
  const clientId = useConfigSelectedUserId();
  const nutritionistId = useAuthId();
  const { addMutationError } = useNotification();

  return useMutation({
    mutationKey: queryKeys({
        userId: nutritionistId ?? '',
    }).user.fromNutritionist,
    mutationFn: async () => {
      if (!clientId) throw new Error('No authenticated user found')
      const { data, error } = await supabase
        .from(TABLE_ALL_USERS.NAME)
        .update({ 
            nutri_id: null,
         })
        .eq(TABLE_ALL_USERS.COLS.USER_ID, clientId)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: async () => {
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
                return oldData.filter(user => user.user_id !== clientId)
            }
        )
    },
    onError: () => {
      addMutationError();
    },
  })
}
