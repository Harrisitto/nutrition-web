import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase/client";
import { queryKeys } from "../keys";
import { queryClient } from "../queryClient";
import { useAppSelector } from "../../../store/store";
import FromDate from "@src/helpers/dates";

// Invalida semanas y busquedas: una nota nueva o borrada puede aparecer en cualquiera
const invalidateClientNotes = (clientId: string | null) =>
    queryClient.invalidateQueries({ queryKey: queryKeys({ userId: clientId }).user.notes.all });

// Notas del cliente creadas en la semana (lunes a domingo) de forDate
export const useFetchNutritionistNotes = ({
    forDate,
}: {
    forDate: FromDate;
}) =>
    useFetchNutritionistNotesForDateRange({
        startDate: forDate.thisMonday(),
        endDate: forDate.thisSunday(),
    });

// Notas del cliente creadas entre dos fechas (ambas incluidas)
export const useFetchNutritionistNotesForDateRange = ({
    startDate,
    endDate,
}: {
    startDate: FromDate;
    endDate: FromDate;
}) => {
    const clientId = useAppSelector((state) => state.config.selectedUserId);
    // created_at es timestamptz: de medianoche local del primer dia a la del dia siguiente al ultimo
    const start = new FromDate(startDate.save());
    const afterEnd = new FromDate(endDate.save()).incrementDay(1);

    return useQuery({
        queryKey: queryKeys({ userId: clientId }).user.notes.range(startDate.save(), endDate.save()),
        queryFn: async () => {
            if (!clientId) {
                throw new Error("Client ID is not defined");
            }

            const response = await supabase.from('client_notes')
                .select('*')
                .eq('user_id', clientId)
                .gte('created_at', start.toISOString())
                .lt('created_at', afterEnd.toISOString())
                .order('created_at');

            if (response.error) {
                throw response.error;
            }

            return response.data;
        },
        enabled: !!clientId,
    });
};

export const useSearchNutritionistNote = ({
    search,
}: {
    search: string;
}) => {
    const clientId = useAppSelector((state) => state.config.selectedUserId);
    const trimmed = search.trim();

    return useQuery({
        queryKey: queryKeys({ userId: clientId }).user.notes.search(trimmed),
        queryFn: async () => {
            if (!clientId) {
                throw new Error("Client ID is not defined");
            }

            const response = await supabase.from('client_notes')
                .select('*')
                .eq('user_id', clientId)
                .ilike('note', `%${trimmed}%`)
                .order('created_at', { ascending: false });

            if (response.error) {
                throw response.error;
            }

            return response.data;
        },
        // Sin texto la busqueda devolveria todas las notas
        enabled: !!clientId && trimmed !== "",
    });
};

// Sin id crea la nota; con id la edita
export const useMutateNutritionistNote = () => {
    const clientId = useAppSelector((state) => state.config.selectedUserId);

    return useMutation({
        mutationFn: async ({
            id,
            note,
            appointment_id = null,
        }: {
            id: number | null;
            note: string;
            appointment_id?: number | null;
        }) => {
            if (!clientId) {
                throw new Error("Client ID is not defined");
            }

            const response = id === null
                ? await supabase.from('client_notes')
                    .insert({ user_id: clientId, note, appointment_id })
                    .select()
                    .single()
                : await supabase.from('client_notes')
                    .update({ note, appointment_id })
                    .eq('id', id)
                    .select()
                    .single();

            if (response.error) {
                throw response.error;
            }

            return response.data;
        },
        onSuccess: () => invalidateClientNotes(clientId),
    });
};

export const useDeleteNutritionistNote = () => {
    const clientId = useAppSelector((state) => state.config.selectedUserId);

    return useMutation({
        mutationFn: async (noteId: number) => {
            const response = await supabase.from('client_notes')
                .delete()
                .eq('id', noteId);

            if (response.error) {
                throw response.error;
            }
        },
        onSuccess: () => invalidateClientNotes(clientId),
    });
};
