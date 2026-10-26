import FromDate from "@src/helpers/dates";
import type {
  useFetchCalendarAppointments,
  useFetchCalendarNotes,
} from "@src/services/tanstack/user/calendar";

export type CalendarNote = NonNullable<ReturnType<typeof useFetchCalendarNotes>["data"]>[number];
export type CalendarAppointment = NonNullable<
  ReturnType<typeof useFetchCalendarAppointments>["data"]
>[number];

// Mes "YYYY-MM" desplazado delta meses. Desde el dia 1: setMonth no se salta meses cortos
export const shiftMonth = (month: string, delta: number) => {
  const date = new FromDate(`${month}-01`);
  date.setMonth(date.getMonth() + delta);
  return date.saveMonth();
};

// Dias de la cuadricula del mes ("YYYY-MM"): del lunes de su primera semana al domingo de la ultima
export const monthGrid = (month: string) => {
  const first = new FromDate(`${month}-01`);
  const last = new FromDate(first);
  last.setMonth(last.getMonth() + 1, 0);
  const start = first.thisMonday();
  const end = last.thisSunday();

  const days: FromDate[] = [];
  for (let day = start; day.save() <= end.save(); day = day.incrementDay(1)) {
    days.push(day);
  }
  return { days, start, end };
};

// Agrupa por dia ("YYYY-MM-DD") manteniendo el orden de la query
export const groupByDay = <T,>(rows: T[], dayOf: (row: T) => string | null) => {
  const groups = new Map<string, T[]>();
  rows.forEach((row) => {
    const day = dayOf(row);
    if (!day) return;
    groups.set(day, [...(groups.get(day) ?? []), row]);
  });
  return groups;
};

// start_time es time ("HH:MM:SS"): se muestra sin segundos
export const formatTime = (time: string | null) => time?.slice(0, 5) ?? null;
