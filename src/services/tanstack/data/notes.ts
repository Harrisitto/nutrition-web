import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase/client";
import { queryKeys } from "../keys";
import { queryClient } from "../queryClient";
import { useAppSelector } from "../../../store/store";
import FromDate from "@src/helpers/dates";

// Invalida semanas y busquedas: una nota nueva o borrada puede aparecer en cualquiera
// y el calendario del nutricionista
const invalidateClientNotes = (clientId: string | null) =>
    Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys({ userId: clientId }).user.notes.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys().nutritionist.calendarBase }),
    ]);

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

// Prioridad de una nota (columna priority): 0 normal, 1 alta, 2 urgente
export const NOTE_PRIORITIES = [0, 1, 2] as const;
export type NotePriority = (typeof NOTE_PRIORITIES)[number];

// Lo que se escribe en el formulario de la nota
export type NoteFields = {
    note: string;
    priority: NotePriority;
    // "YYYY-MM-DD" o null: dia en que hay que tenerla en cuenta (sale en el calendario)
    scheduled_date: string | null;
};

// Sin id crea la nota del cliente seleccionado; con id la edita (sea del cliente que sea, p. ej.
// desde el calendario). Al editar, appointment_id solo cambia si se pasa
export const useMutateNutritionistNote = () => {
    const clientId = useAppSelector((state) => state.config.selectedUserId);

    return useMutation({
        mutationFn: async ({
            id,
            appointment_id,
            ...fields
        }: NoteFields & {
            id: number | null;
            appointment_id?: number | null;
        }) => {
            if (id === null && !clientId) {
                throw new Error("Client ID is not defined");
            }

            const response = id === null
                ? await supabase.from('client_notes')
                    .insert({ ...fields, user_id: clientId!, appointment_id: appointment_id ?? null })
                    .select()
                    .single()
                : await supabase.from('client_notes')
                    .update(appointment_id === undefined ? fields : { ...fields, appointment_id })
                    .eq('id', id)
                    .select()
                    .single();

            if (response.error) {
                throw response.error;
            }

            return response.data;
        },
        onSuccess: (note) => invalidateClientNotes(note.user_id),
    });
};

export const useDeleteNutritionistNote = () => {
    return useMutation({
        mutationFn: async (noteId: number) => {
            // Devuelve el cliente de la nota para refrescar sus listas
            const response = await supabase.from('client_notes')
                .delete()
                .eq('id', noteId)
                .select('user_id')
                .single();

            if (response.error) {
                throw response.error;
            }

            return response.data;
        },
        onSuccess: (note) => invalidateClientNotes(note.user_id),
    });
};
