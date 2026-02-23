import { supabase } from "@src/services/supabase/client"
import { colsTableUsers, tableUsers } from "@src/services/supabase/definitions"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "../keys"
import { useAuthId } from "@src/store/slices/auth/hook"
import { useNotificationErrorQuery } from "@src/store/slices/notification/hook"
import { useConfigSelectedUserId } from "@src/store/slices/config/hook"

const SELECT_USER_AND_INFO = `*, user_info(*)`
const errUserNotAuthenticated = new Error("User not authenticated")


export const useFetchSingleUser = ({
    userId
}: {
    userId?: string
} = {}) => {
    const selectedUser = useConfigSelectedUserId();
    return useQuery({
        queryKey: queryKeys.user.single(userId ?? selectedUser ?? ""),
        queryFn: async () => {
            const { data, error } = await supabase
                .from(tableUsers)
                .select(SELECT_USER_AND_INFO)
                .single()
            if (error) throw error
            return data
        }
    })
}

export const useFetchNutritionistUsers = () => {
    const userId = useAuthId()
    const err = useNotificationErrorQuery()

    return useQuery({
        queryKey: queryKeys.user.fromNutritionist,
        queryFn: async () => {
            try {
                if (!userId) throw errUserNotAuthenticated
                const { data, error } = await supabase
                    .from(tableUsers)
                    .select(SELECT_USER_AND_INFO)
                    .eq(colsTableUsers.nutriId, userId)
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