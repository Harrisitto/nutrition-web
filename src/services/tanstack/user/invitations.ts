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
            const { data, error } = await supabase
                .from(TABLE_ALL_USERS.NAME)
                .select()
                .is(TABLE_ALL_USERS.COLS.NUTRI_ID, null)
                .ilike(TABLE_ALL_USERS.COLS.INVITATION_CODE, `%${debouncedInvitationCode}%`)
                .limit(pageSize)

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
                .select()
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

            if (error) throw error
            return data
        },
        onSuccess: async () => {
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
