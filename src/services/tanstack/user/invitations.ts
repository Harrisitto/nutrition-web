import { supabase } from "@src/services/supabase/client"
import { TABLE_ALL_USERS, TABLE_USER_INVITATIONS } from "@src/services/supabase/definitions"
import { useAuth } from "@src/store/slices/auth/hook"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { queryKeys } from "../keys"
import { queryClient } from "../queryClient"


export const useFetchAvailableClients = ({
    invitationCode,
    pageSize = 10,
}: {
    invitationCode?: string;
    pageSize?: number;
}) => {

    const nutriId = useAuth().user?.id;
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
        queryKey: queryKeys({ userId: nutriId }).user.invitations(debouncedInvitationCode),
        queryFn: async () => {
            if (!nutriId) throw new Error("No authenticated user found");
            const { data, error } = await supabase
                .from(TABLE_ALL_USERS.NAME)
                .select()
                .is(TABLE_ALL_USERS.COLS.NUTRI_ID, null)
                .eq(TABLE_ALL_USERS.COLS.IS_NUTRI, false)
                .limit(pageSize)
                .ilike(TABLE_ALL_USERS.COLS.INVITATION_CODE, `%${debouncedInvitationCode}%`)

            if (error) throw error
            return data
        }
    })
}

export const useFetchInvitedClients = () => {
    const nutriId = useAuth().user?.id;

    return useQuery({
        queryKey: queryKeys({ userId: nutriId }).user.invitations("all"),
        queryFn: async () => {
            if (!nutriId) throw new Error("No authenticated user found");
            const { data, error } = await supabase
                .from(TABLE_USER_INVITATIONS.NAME)
                .select()
                .eq(TABLE_USER_INVITATIONS.COLS.NUTRI_ID, nutriId)
                .order(TABLE_USER_INVITATIONS.COLS.CREATED_AT, { ascending: false })

            if (error) throw error
            return data
        }
    })
}

export const useMutateUserInvitations = () => {
    const nutriId = useAuth().user?.id;

    return useMutation({
        mutationKey: queryKeys({ userId: nutriId }).user.invitationsBase,
        mutationFn: async ({ clientId, message }: {
            clientId: string;
            message: string;
        }) => {
            if (!nutriId) throw new Error("No authenticated user found");
            const { data, error } = await supabase
                .from(TABLE_USER_INVITATIONS.NAME)
                .insert({
                    nutri_id: nutriId,
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
                queryKey: queryKeys({ userId: nutriId }).user.invitationsBase,
            });
        }
    })
}

export const useDeleteUserInvitation = () => {
    const nutriId = useAuth().user?.id;

    return useMutation({
        mutationKey: queryKeys({ userId: nutriId }).user.invitationsBase,
        mutationFn: async (clientId: string) => {
            if (!nutriId) throw new Error("No authenticated user found");
            const { error } = await supabase
                .from(TABLE_USER_INVITATIONS.NAME)
                .delete()
                .eq(TABLE_USER_INVITATIONS.COLS.NUTRI_ID, nutriId)
                .eq(TABLE_USER_INVITATIONS.COLS.CLIENT_ID, clientId)

            if (error) throw error
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys({ userId: nutriId }).user.invitationsBase,
            });
        }
    })
}
