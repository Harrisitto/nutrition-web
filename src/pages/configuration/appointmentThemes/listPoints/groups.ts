import type { useFetchAppointmentThemeById } from "@src/services/tanstack/data/appointments";

export type ThemePoint = NonNullable<ReturnType<typeof useFetchAppointmentThemeById>["data"]>[number];

// Mismo límite que el CHECK appointment_theme_points_group_name_check
export const GROUP_NAME_MAX_LENGTH = 100;

// Puntos de una temática que caen el mismo día. Con más de uno forman un grupo con nombre
export type DayGroup = { inDays: number; groupName: string | null; points: ThemePoint[] };

// El nombre se guarda repetido en cada punto del día: vale el primero que lo tenga
const nameOf = (points: ThemePoint[]) => points.find((point) => point.group_name)?.group_name ?? null;

// Agrupa por in_days. Los puntos llegan ordenados por día, así que los grupos también
export const groupByDay = (points: ThemePoint[]): DayGroup[] => {
  const groups: DayGroup[] = [];
  points.forEach((point) => {
    const last = groups[groups.length - 1];
    if (last && last.inDays === point.in_days) last.points.push(point);
    else groups.push({ inDays: point.in_days, groupName: null, points: [point] });
  });
  return groups.map((group) => ({ ...group, groupName: nameOf(group.points) }));
};

// Grupo que hereda un punto que se añade o se mueve a inDays (sin contarse a sí mismo)
export const groupNameOfDay = (points: ThemePoint[], inDays: number, exceptId?: number) =>
  nameOf(points.filter((point) => point.in_days === inDays && point.id !== exceptId));
