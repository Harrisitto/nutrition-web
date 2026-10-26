import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase/client";
import { queryKeys } from "../keys";
import { useGetAuthSession } from "../auth/get";
import FromDate from "@src/helpers/dates";
import type { AppointmentStatus } from "./appointments";

// Calendario del nutricionista: lo de todos sus clientes, no solo el seleccionado

// Notas del rango (ambas fechas incluidas) con el nombre del cliente: las programadas por su
// scheduled_date y las demas por el dia en que se crearon
export const useFetchCalendarNotes = ({
  startDate,
  endDate,
}: {
  startDate: FromDate;
  endDate: FromDate;
}) => {
  const { data: session } = useGetAuthSession();
  const nutriId = session?.userId;
  // created_at es timestamptz: de medianoche local del primer dia a la del dia siguiente al ultimo
  const start = new FromDate(startDate.save());
  const afterEnd = new FromDate(endDate.save()).incrementDay(1);

  return useQuery({
    queryKey: queryKeys({ userId: nutriId }).nutritionist.calendarNotes(
      startDate.save(),
      endDate.save(),
    ),
    queryFn: async () => {
      if (!nutriId) {
        throw new Error("Nutritionist ID is not defined");
      }

      const response = await supabase.from('client_notes')
        .select('*, client: all_users(name)')
        .eq('nutri_id', nutriId)
        // Entre comillas: los instantes ISO llevan ":" y "." que el filtro or() no admite sueltos
        .or(
          `and(scheduled_date.gte.${startDate.save()},scheduled_date.lte.${endDate.save()}),` +
            `and(scheduled_date.is.null,created_at.gte."${start.toISOString()}",created_at.lt."${afterEnd.toISOString()}")`,
        )
        .order('priority', { ascending: false })
        .order('created_at');

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    enabled: !!nutriId,
  });
};

// Consultas pendientes (programadas o en curso) con fecha en el rango, con el nombre del cliente.
// Las sin fecha no tienen dia en el calendario
export const useFetchCalendarAppointments = ({
  startDate,
  endDate,
}: {
  startDate: FromDate;
  endDate: FromDate;
}) => {
  const { data: session } = useGetAuthSession();
  const nutriId = session?.userId;
  const start = startDate.save();
  const end = endDate.save();

  return useQuery({
    queryKey: queryKeys({ userId: nutriId }).nutritionist.calendarAppointments(start, end),
    queryFn: async () => {
      if (!nutriId) {
        throw new Error("Nutritionist ID is not defined");
      }

      const response = await supabase.from('nutri_appointments')
        .select('*, client: all_users(name)')
        .eq('nutri_id', nutriId)
        .in('status', ['scheduled', 'in_progress'] satisfies AppointmentStatus[])
        .gte('scheduled_on', start)
        .lte('scheduled_on', end)
        .order('scheduled_on')
        .order('start_time', { ascending: true, nullsFirst: false });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    enabled: !!nutriId,
  });
};
