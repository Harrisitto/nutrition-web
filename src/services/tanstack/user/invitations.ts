import { supabase } from "@src/services/supabase/client"
import { TABLE_USER_INVITATIONS } from "@src/services/supabase/definitions"
import { useNotification } from "@src/store/slices/notification/hook"
import type { PostgrestError } from "@supabase/supabase-js"
import { useMutation, useQuery } from "@tanstack/react-query"
import { queryKeys } from "../keys"
import { queryClient } from "../queryClient"
import { useGetAuthSession } from "../auth/get"

// Same limits that invite_client checks on the server
export const INVITATION_MESSAGE_MIN_LENGTH = 10
export const INVITATION_MESSAGE_MAX_LENGTH = 1000

const INVITATION_ERRORS = "data:configuration.sections.invitations.errors"

// Translation key for each error raised by invite_client, null when unknown
const inviteClientErrorKey = (error: unknown) => {
    const { code, message } = (error ?? {}) as Partial<PostgrestError>
    switch (code) {
        case "P0002": return `${INVITATION_ERRORS}.clientNotFound`
        case "22023": return `${INVITATION_ERRORS}.invalidMessage`
        case "54000": return `${INVITATION_ERRORS}.tooManyInvitations`
        case "55000": return message === "Nutritionist without subscription"
            ? `${INVITATION_ERRORS}.noSubscription`
            : null
        case "42501": return `${INVITATION_ERRORS}.notNutritionist`
        default: return null
    }
}

export const useFetchInvitedClients = () => {
    const { data: session } = useGetAuthSession()
    const userId = session?.userId

    return useQuery({
        queryKey: queryKeys({ userId }).user.invitations("all"),
        queryFn: async () => {
            if (!userId) throw new Error("No authenticated user found");
            // Expired invitations are only purged once a day, so they're filtered here
            const { data, error } = await supabase
                .from(TABLE_USER_INVITATIONS.NAME)
                .select("client_id, message, created_at, expires_at")
                .eq(TABLE_USER_INVITATIONS.COLS.NUTRI_ID, userId)
                .gt(TABLE_USER_INVITATIONS.COLS.EXPIRES_AT, new Date().toISOString())
                .order(TABLE_USER_INVITATIONS.COLS.CREATED_AT, { ascending: false })

            if (error) throw error
            return data
        }
    })
}

export const useMutateUserInvitations = () => {
    const { data } = useGetAuthSession()
    const userId = data?.userId;
    const { add, addMutationError } = useNotification();

    return useMutation({
        mutationKey: queryKeys({ userId }).user.invitationsBase,
        // Inviting an already invited client is a no-op on the server, not an error
        mutationFn: async ({ code, message }: {
            code: string;
            message: string;
        }) => {
            if (!userId) throw new Error("No authenticated user found");
            const { data, error } = await supabase.rpc("invite_client", {
                p_code: code,
                p_message: message,
            })

            if (error) throw error
            return data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys({ userId }).user.invitationsBase,
            });
        },
        onError: (error) => {
            const key = inviteClientErrorKey(error)
            if (!key) {
                addMutationError()
                return
            }
            add({ type: "error", message: key, duration: 5000 })
        },
    })
}
