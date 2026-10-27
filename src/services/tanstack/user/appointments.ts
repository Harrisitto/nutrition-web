import { supabase } from "../../supabase/client";
import { queryKeys } from "../keys";
import { useAppSelector } from "../../../store/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../queryClient";

// Consulta con sus puntos: los del nutricionista (con su tematica) y los temas del cliente
const APPOINTMENT_WITH_POINTS =
  '*, appointment_points(*, client_themes(theme_name)), user_appointment_points(*)';

// Estados de una consulta: programada -> en curso (Empezar consulta) -> tratada (Terminar consulta)
export type AppointmentStatus = "scheduled" | "in_progress" | "done";

// Puntos del nutricionista (appointment_points) o temas del cliente (user_appointment_points)
export type PointKind = "nutri" | "client";

const pointTable = (kind: PointKind): 'appointment_points' | 'user_appointment_points' =>
  kind === "nutri" ? 'appointment_points' : 'user_appointment_points';

export const useFetchClientAppointmentPoints = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useQuery({
    queryKey: queryKeys({ userId: clientId }).user.appointments.pendingClientPoints,
    queryFn: async () => {
        if (!clientId) {
            throw new Error("Client ID is not defined");
        }   

        const response = await supabase.from('user_appointment_points')
        .select('*')
        .eq('user_id', clientId)
        .is('treated_at', null);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data;
    },
  });
};

export const useFetchTreatedClientAppointmentPoints = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useQuery({
    queryKey: queryKeys({ userId: clientId }).user.appointments.treatedClientPoints,
    queryFn: async () => {
        if (!clientId) {
            throw new Error("Client ID is not defined");
        }
        const response = await supabase.from('user_appointment_points')
        .select('*')
        .eq('user_id', clientId)
        .not('treated_at', 'is', null);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data;
    },
  });
};

export const useFetchClientPendingAppointments = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useQuery({
    queryKey: queryKeys({ userId: clientId }).user.appointments.pending,
    queryFn: async () => {
        if (!clientId) {
            throw new Error("Client ID is not defined");
        }

        const response = await supabase.from('nutri_appointments')
        .select(APPOINTMENT_WITH_POINTS)
        .eq('user_id', clientId)
        // Las empezadas siguen pendientes hasta terminarlas
        .in('status', ['scheduled', 'in_progress'] satisfies AppointmentStatus[])
        // Por dias que faltan: primero las atrasadas, despues las proximas y al final las sin fecha
        .order('scheduled_on', { ascending: true, nullsFirst: false })
        .order('start_time', { ascending: true, nullsFirst: false })
        .order('position', { referencedTable: 'appointment_points' })
        .order('position', { referencedTable: 'user_appointment_points' });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data;
    },
  });
};

export const useFetchClientTreatedAppointments = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useQuery({
    queryKey: queryKeys({ userId: clientId }).user.appointments.treated,
    queryFn: async () => {
        if (!clientId) {
            throw new Error("Client ID is not defined");
        }

        const response = await supabase.from('nutri_appointments')
        .select(APPOINTMENT_WITH_POINTS)
        .eq('user_id', clientId)
        .eq('status', 'done');

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data;
    },
  });
};

// Tematicas asignadas al cliente con los puntos de su plantilla y los theme_point_id que ya
// estan en alguna de sus consultas (para no ofrecerlos otra vez), y su progreso
const fetchClientThemesWithPoints = async (clientId: string | null) => {
  if (!clientId) {
    throw new Error("Client ID is not defined");
  }

  const response = await supabase.from('client_themes')
    .select('id, theme_name, start_date, nutri_appointment_themes(appointment_theme_points(id, point, in_days)), appointment_points(theme_point_id, treated_at)')
    .eq('user_id', clientId)
    .order('start_date', { ascending: false });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data.map((theme) => {
    const templatePoints = theme.nutri_appointment_themes?.appointment_theme_points ?? [];
    const used = new Set(theme.appointment_points.map((point) => point.theme_point_id));
    // En el orden de la plantilla: por dia y, el mismo dia, por orden de creacion
    const availablePoints = templatePoints
      .filter((point) => !used.has(point.id))
      .sort((a, b) => a.in_days - b.in_days || a.id - b.id);
    // Sobre los puntos de la plantilla: quitar uno sin tratar de una consulta no la adelanta
    const total = templatePoints.length;
    const treated = theme.appointment_points.filter((point) => point.treated_at !== null).length;
    return {
      id: theme.id,
      theme_name: theme.theme_name,
      start_date: theme.start_date,
      availablePoints,
      // El que toca tratar despues: el primero pendiente de la plantilla
      nextPointId: availablePoints[0]?.id ?? null,
      // Terminada: no quedan puntos de la plantilla por añadir y todos los añadidos estan tratados
      isFinished:
        availablePoints.length === 0 &&
        theme.appointment_points.every((point) => point.treated_at !== null),
      total,
      treated,
      progress: total === 0 ? 0 : treated / total,
    };
  });
};

export const useFetchClientThemesWithPoints = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useQuery({
    queryKey: queryKeys({ userId: clientId }).user.appointments.themesWithPoints,
    queryFn: () => fetchClientThemesWithPoints(clientId),
  });
};

// Las limit tematicas mas recientes: comparte la cache con useFetchClientThemesWithPoints
export const useFetchClientThemesProgress = ({ limit }: { limit: number }) => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useQuery({
    queryKey: queryKeys({ userId: clientId }).user.appointments.themesWithPoints,
    queryFn: () => fetchClientThemesWithPoints(clientId),
    select: (themes) => themes.slice(0, limit),
  });
};

// appointmentId null = consulta nueva: no hay nada que cargar
export const useFetchSingleAppointment = (appointmentId: number | null) => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useQuery({
    queryKey: queryKeys({ userId: clientId }).user.appointments.single(appointmentId),
    enabled: appointmentId !== null,
    queryFn: async () => {
        if (!clientId) {
          throw new Error("Client ID is not defined");
        }

        const response = await supabase.from('nutri_appointments')
          .select(APPOINTMENT_WITH_POINTS)
          .eq('user_id', clientId)
          .eq('id', appointmentId!)
          .order('position', { referencedTable: 'appointment_points' })
          .order('position', { referencedTable: 'user_appointment_points' })
          .single();

        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.data;
    },
  });
};

// La consulta sin fecha del cliente, si la tiene: solo puede haber una sin contar las
// canceladas (nutri_appointments_one_per_day). null si no hay
export const useFetchUndatedAppointment = ({ enabled }: { enabled: boolean }) => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useQuery({
    queryKey: queryKeys({ userId: clientId }).user.appointments.undated,
    enabled,
    queryFn: async () => {
        if (!clientId) {
          throw new Error("Client ID is not defined");
        }

        const response = await supabase.from('nutri_appointments')
          .select('id')
          .eq('user_id', clientId)
          .is('scheduled_on', null)
          .neq('status', 'cancelled')
          .maybeSingle();

        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.data;
    },
  });
};

// Puntos pendientes de programar: los sin tratar de la consulta sin fecha (del nutricionista y
// del cliente) y los temas del cliente sin consulta. kind indica la tabla de cada uno
export const useFetchPendingPoints = ({ enabled }: { enabled: boolean }) => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useQuery({
    queryKey: queryKeys({ userId: clientId }).user.appointments.pendingPoints,
    enabled,
    queryFn: async () => {
        if (!clientId) {
          throw new Error("Client ID is not defined");
        }

        const [undated, unassigned] = await Promise.all([
          supabase.from('nutri_appointments')
            .select('appointment_points(id, point, position, treated_at, client_themes(theme_name)), user_appointment_points(id, point, position, treated_at)')
            .eq('user_id', clientId)
            .is('scheduled_on', null)
            .neq('status', 'cancelled')
            .is('appointment_points.treated_at', null)
            .is('user_appointment_points.treated_at', null)
            .order('position', { referencedTable: 'appointment_points' })
            .order('position', { referencedTable: 'user_appointment_points' })
            .maybeSingle(),
          supabase.from('user_appointment_points')
            .select('id, point, position, treated_at')
            .eq('user_id', clientId)
            .is('appointment_id', null)
            .is('treated_at', null)
            .order('created_at', { ascending: true }),
        ]);

        if (undated.error) {
          throw new Error(undated.error.message);
        }
        if (unassigned.error) {
          throw new Error(unassigned.error.message);
        }

        return [
          ...(undated.data?.appointment_points ?? [])
            .map((point) => ({
              kind: "nutri" as const,
              id: point.id,
              point: point.point,
              themeName: point.client_themes?.theme_name ?? null,
            })),
          ...[...(undated.data?.user_appointment_points ?? []), ...unassigned.data]
            .map((point) => ({
              kind: "client" as const,
              id: point.id,
              point: point.point,
              themeName: null,
            })),
        ];
    },
  });
};

// Tambien el calendario del nutricionista, que muestra las consultas de todos sus clientes
const invalidateClientAppointments = (clientId: string | null) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys({ userId: clientId }).user.appointments.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys().nutritionist.calendarBase }),
  ]);

// id null = consulta nueva. Devuelve la consulta guardada
export const useSaveAppointment = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useMutation({
    mutationFn: async ({
      id,
      description,
      scheduled_on,
      start_time,
      video_url,
    }: {
      id: number | null;
      // null = sin nombre: la lista muestra uno por defecto
      description: string | null;
      scheduled_on: string | null;
      // "HH:MM" o null (sin hora)
      start_time: string | null;
      // Solo https:// (CHECK de la tabla)
      video_url: string | null;
    }) => {
        if (!clientId) {
          throw new Error("Client ID is not defined");
        }

        const response = id === null
          ? await supabase.from('nutri_appointments')
              .insert({ user_id: clientId, description, scheduled_on, start_time, video_url })
              .select()
              .single()
          : await supabase.from('nutri_appointments')
              .update({ description, scheduled_on, start_time, video_url })
              .eq('id', id)
              .select()
              .single();

        if (response.error) {
          throw response.error;
        }

        return response.data;
    },
    onSuccess: () => invalidateClientAppointments(clientId),
  });
};

export const useSetAppointmentStatus = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: AppointmentStatus }) => {
        const response = await supabase.from('nutri_appointments')
          .update({ status })
          .eq('id', id)
          .select()
          .single();

        if (response.error) {
          throw response.error;
        }

        return response.data;
    },
    onSuccess: () => invalidateClientAppointments(clientId),
  });
};

// .single(): si RLS no deja borrarla no hay fila y da error en vez de no hacer nada
export const useDeleteAppointment = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useMutation({
    mutationFn: async (appointmentId: number) => {
        const response = await supabase.from('nutri_appointments')
          .delete()
          .eq('id', appointmentId)
          .select()
          .single();

        if (response.error) {
          throw response.error;
        }

        return response.data;
    },
    onSuccess: () => invalidateClientAppointments(clientId),
  });
};

// Punto del nutricionista en una consulta: personalizado (sin client_theme_id) o de una
// tematica asignada (con client_theme_id y theme_point_id)
export const useInsertAppointmentPointToAppointment = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useMutation({
    mutationFn: async (newPoint: {
      appointment_id: number;
      point: string;
      position: number;
      client_theme_id?: number;
      theme_point_id?: number;
    }) => {
        const response = await supabase.from('appointment_points')
          .insert(newPoint)
          .select()
          .single();

        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.data;
    },
    onSuccess: () => invalidateClientAppointments(clientId),
  });
};

// Solo puntos sin tratar: los tratados no se borran (22023)
export const useDeleteAppointmentPointFromAppointment = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useMutation({
    mutationFn: async (pointId: number) => {
        const response = await supabase.from('appointment_points')
          .delete()
          .eq('id', pointId)
          .select()
          .single();

        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.data;
    },
    onSuccess: () => invalidateClientAppointments(clientId),
  });
};

// Lleva un punto a otra consulta del mismo cliente (al final). Solo sin tratar: los tratados no
// se mueven (22023)
export const useMovePointToAppointment = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useMutation({
    mutationFn: async ({
      kind,
      id,
      appointment_id,
      position,
    }: {
      kind: PointKind;
      id: number;
      appointment_id: number;
      position: number;
    }) => {
        const response = await supabase
          .from(pointTable(kind))
          .update({ appointment_id, position })
          .eq('id', id)
          .select('id')
          .single();

        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.data;
    },
    onSuccess: () => invalidateClientAppointments(clientId),
  });
};

// Marca o desmarca un punto como tratado. kind indica la tabla: puntos del nutricionista o temas
// del cliente (treated_at solo lo pone el nutricionista)
export const useSetPointTreated = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useMutation({
    mutationFn: async ({
      kind,
      id,
      treated,
    }: {
      kind: PointKind;
      id: number;
      treated: boolean;
    }) => {
        const response = await supabase
          .from(pointTable(kind))
          .update({ treated_at: treated ? new Date().toISOString() : null })
          .eq('id', id)
          .select('id')
          .single();

        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.data;
    },
    onSuccess: () => invalidateClientAppointments(clientId),
  });
};

// Asigna una tematica al cliente desde una fecha: crea las consultas que falten y copia sus puntos
// (assign_appointment_theme). Devuelve el id de client_themes
export const useAssignAppointmentTheme = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useMutation({
    mutationFn: async ({ theme_id, start_date }: { theme_id: number; start_date: string }) => {
        if (!clientId) {
          throw new Error("Client ID is not defined");
        }

        const response = await supabase.rpc('assign_appointment_theme', {
          p_user_id: clientId,
          p_theme_id: theme_id,
          p_start_date: start_date,
        });

        if (response.error) {
          throw response.error;
        }

        return response.data;
    },
    onSuccess: () => invalidateClientAppointments(clientId),
  });
};
