import {
  useDeleteAppointmentPointFromAppointment,
  useFetchClientThemesWithPoints,
  useFetchPendingPoints,
  useFetchSingleAppointment,
  useInsertAppointmentPointToAppointment,
  useMovePointToAppointment,
  useSetPointTreated,
  type PointKind,
} from "../../../../services/tanstack/user/appointments";

type NewPoint = {
  point: string;
  // Solo en los puntos de una tematica asignada
  client_theme_id?: number;
  theme_point_id?: number;
};

type PendingPoint = { kind: PointKind; id: number };

const nextPositionOf = (points: { position: number }[]) =>
  points.reduce((max, point) => Math.max(max, point.position + 1), 0);

// Puntos de una consulta ya guardada (paso 2) y las acciones para añadir, traer y quitar
export const useFormAppointmentPoints = (appointmentId: number) => {
  const appointmentQuery = useFetchSingleAppointment(appointmentId);
  // Los pendientes solo se traen a consultas con fecha: la sin fecha es donde estan
  const isDated = !!appointmentQuery.data?.scheduled_on;
  const pendingQuery = useFetchPendingPoints({ enabled: isDated });
  const themesQuery = useFetchClientThemesWithPoints();
  const insertPoint = useInsertAppointmentPointToAppointment();
  const movePoint = useMovePointToAppointment();
  const deletePoint = useDeleteAppointmentPointFromAppointment();
  const setTreated = useSetPointTreated();

  const points = appointmentQuery.data?.appointment_points ?? [];
  const clientPoints = appointmentQuery.data?.user_appointment_points ?? [];

  // Los puntos nuevos o traidos van al final de la consulta
  const addPoint = (newPoint: NewPoint, onSuccess?: () => void) =>
    insertPoint.mutate(
      { appointment_id: appointmentId, position: nextPositionOf(points), ...newPoint },
      { onSuccess },
    );

  const bringPendingPoint = ({ kind, id }: PendingPoint, onSuccess?: () => void) =>
    movePoint.mutate(
      {
        kind,
        id,
        appointment_id: appointmentId,
        position: nextPositionOf(kind === "nutri" ? points : clientPoints),
      },
      { onSuccess },
    );

  return {
    points,
    clientPoints,
    themes: themesQuery.data ?? [],
    isDated,
    pendingPoints: pendingQuery.data ?? [],
    addPoint,
    bringPendingPoint,
    removePoint: deletePoint.mutate,
    setPointTreated: setTreated.mutate,
    isSettingTreated: setTreated.isPending,
    isAdding: insertPoint.isPending || movePoint.isPending,
    isRemoving: deletePoint.isPending,
    isLoading: appointmentQuery.isLoading || themesQuery.isLoading,
    isLoadError: appointmentQuery.isError || themesQuery.isError,
    error: insertPoint.error ?? movePoint.error ?? deletePoint.error ?? setTreated.error,
  };
};

export type Points = ReturnType<typeof useFormAppointmentPoints>;
