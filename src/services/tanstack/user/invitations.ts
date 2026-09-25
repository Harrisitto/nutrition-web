import { supabase } from "@src/services/supabase/client"
import { TABLE_ALL_USERS, TABLE_USER_INVITATIONS } from "@src/services/supabase/definitions"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { queryKeys } from "../keys"
import { queryClient } from "../queryClient"
import { useGetAuthSession } from "../auth/get"

//type AvailableClient = NonNullable<ReturnType<typeof useFetchAvailableClients>["data"]>[number]


export const useFetchAvailableClients = ({
    invitationCode,
    pageSize = 10,
}: {
    invitationCode?: string;
    pageSize?: number;
}) => {

    const { data: session } = useGetAuthSession()
    const userId = session?.userId
    const [debouncedInvitationCode, setDebouncedInvitationCode] = useState(invitationCode ?? "");

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedInvitationCode(invitationCode ?? "");
        }, 2000); // 1 second debounce

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [invitationCode]);

    return useQuery({
        queryKey: queryKeys({ userId }).user.invitations(debouncedInvitationCode),
        queryFn: async () => {
            if (!userId) throw new Error("No authenticated user found");

            // Clients already invited by this nutritionist must not be listed again
            const { data: invited, error: invitedError } = await supabase
                .from(TABLE_USER_INVITATIONS.NAME)
                .select(TABLE_USER_INVITATIONS.COLS.CLIENT_ID)
                .eq(TABLE_USER_INVITATIONS.COLS.NUTRI_ID, userId)

            if (invitedError) throw invitedError
            const invitedIds = invited.map((invitation) => invitation.client_id)

            let query = supabase
                .from(TABLE_ALL_USERS.NAME)
                .select()
                .is(TABLE_ALL_USERS.COLS.NUTRI_ID, null)
                .ilike(TABLE_ALL_USERS.COLS.INVITATION_CODE, `%${debouncedInvitationCode}%`)
                .limit(pageSize)

            if (invitedIds.length > 0) {
                query = query.not(TABLE_ALL_USERS.COLS.USER_ID, "in", `(${invitedIds.join(",")})`)
            }

            const { data, error } = await query

            if (error) throw error
            return data
        }
    })
}

export const useFetchInvitedClients = () => {
    const { data: session } = useGetAuthSession()
    const userId = session?.userId

    return useQuery({
        queryKey: queryKeys({ userId }).user.invitations("all"),
        queryFn: async () => {
            if (!userId) throw new Error("No authenticated user found");
            const { data, error } = await supabase
                .from(TABLE_USER_INVITATIONS.NAME)
                .select(`*, all_users!inner(invitation_code)`)
                .eq(TABLE_USER_INVITATIONS.COLS.NUTRI_ID, userId)
                .order(TABLE_USER_INVITATIONS.COLS.CREATED_AT, { ascending: false })

            if (error) throw error
            return data
        }
    })
}

export const useMutateUserInvitations = () => {
    const { data } = useGetAuthSession()
    const userId = data?.userId;

    return useMutation({
        mutationKey: queryKeys({ userId }).user.invitationsBase,
        mutationFn: async ({ clientId, message }: {
            clientId: string;
            message: string;
        }) => {
            if (!userId) throw new Error("No authenticated user found");
            const { data, error } = await supabase
                .from(TABLE_USER_INVITATIONS.NAME)
                .insert({
                    nutri_id: userId,
                    client_id: clientId,
                    message,
                })
                .select()
                .single()

            // 23505 = unique_violation: this client was already invited, nothing to do
            if (error?.code === "23505") return null
            if (error) throw error
            return data
        },
        onSuccess: async (_data, { clientId }) => {
            // Remove the invited client from the available lists right away
            queryClient.setQueriesData<{ user_id: string }[]>(
                { queryKey: queryKeys({ userId }).user.invitationsBase },
                (old) => Array.isArray(old) && old.every((client) => "user_id" in client)
                    ? old.filter((client) => client.user_id !== clientId)
                    : old,
            );
            await queryClient.invalidateQueries({
                queryKey: queryKeys({ userId }).user.invitationsBase,
            });
        }
    })
}

export const useDeleteUserInvitation = () => {
    const { data } = useGetAuthSession()
    const userId = data?.userId;

    return useMutation({
        mutationKey: queryKeys({ userId }).user.invitationsBase,
        mutationFn: async (clientId: string) => {
            if (!userId) throw new Error("No authenticated user found");
            const { error } = await supabase
                .from(TABLE_USER_INVITATIONS.NAME)
                .delete()
                .eq(TABLE_USER_INVITATIONS.COLS.NUTRI_ID, userId)
                .eq(TABLE_USER_INVITATIONS.COLS.CLIENT_ID, clientId)

            if (error) throw error
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys({ userId }).user.invitationsBase,
            });
        }
    })
}
