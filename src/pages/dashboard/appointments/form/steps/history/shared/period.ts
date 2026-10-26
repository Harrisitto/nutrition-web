import FromDate from "@src/helpers/dates";
import { regressionSlope } from "@src/helpers/statistics";

const DAY_MS = 24 * 60 * 60 * 1000;

// Fechas a medianoche local, ambas incluidas
export type Period = { start: FromDate; end: FromDate };

export type PeriodInput = { startDate: string; endDate: string };

// Semana (lunes a domingo) que contiene la fecha
export const weekPeriod = (date: FromDate): Period => ({
  start: new FromDate(date.thisMonday().save()),
  end: new FromDate(date.thisSunday().save()),
});

// Valor del RangeDate ("YYYY-MM-DD"): si falta una fecha se usa la otra, sin ninguna la semana
// actual, y si estan al reves se intercambian
export const toPeriod = ({ startDate, endDate }: PeriodInput): Period => {
  if (!startDate && !endDate) return weekPeriod(new FromDate());
  const start = new FromDate(startDate || endDate);
  const end = new FromDate(endDate || startDate);
  return start.save() <= end.save() ? { start, end } : { start: end, end: start };
};

// Round: con un cambio de hora en medio el dia dura 23 o 25 horas
const daysBetween = (from: FromDate, to: FromDate) =>
  Math.round((to.getTime() - from.getTime()) / DAY_MS);

/**
 * Cambio por semana de la recta de regresion de los valores por fecha ("YYYY-MM-DD").
 * Null sin al menos dos fechas distintas.
 */
export const weeklyTrend = (values: Iterable<[string, number]>, period: Period) => {
  const points = [...values].map(([date, y]) => ({
    x: daysBetween(period.start, new FromDate(date)),
    y,
  }));
  const slope = regressionSlope(points);
  return slope === null ? null : slope * 7;
};

export const isInPeriod = (date: FromDate, { start, end }: Period) => {
  const day = date.save();
  return day >= start.save() && day <= end.save();
};
