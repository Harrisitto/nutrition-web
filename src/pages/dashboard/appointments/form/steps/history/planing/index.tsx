import { useState } from "react";
import { useTranslation } from "react-i18next";
import FromDate from "@src/helpers/dates";
import {
  useFetchPlanningForDateRange,
  useFetchTrainingKcalForDateRange,
  useSearchPlanning,
} from "@src/services/tanstack/user/planing";
import { useFetchMealsKcalForDateRange } from "@src/services/tanstack/user/meals";
import { useFetchRacesKcalForDateRange } from "@src/services/tanstack/user/races";
import { useFetchBmr } from "@src/services/tanstack/user/info";
import { dayBalanceWithoutMeals } from "@src/helpers/nutrition";
import { emptyTextStyle } from "../../../../../races/components/formStyles";
import {
  BalanceStat,
  HistorySearch,
  SummaryList,
  type HistoryItem,
  type HistoryPageProps,
} from "../shared/components";
import { weeklyTrend, type Period } from "../shared/period";
import { KcalChart } from "./kcalChart";

type PlanningDay = NonNullable<ReturnType<typeof useFetchPlanningForDateRange>["data"]>[number];

// Una entrada por evento o comentario no vacío; con matching, solo los que contienen el texto
const toItems = (
  days: PlanningDay[],
  field: "event" | "comment",
  tag?: string,
  matching?: string,
): HistoryItem[] =>
  days
    .filter((day) => {
      const text = day[field]?.trim();
      return !!text && (!matching || text.toLowerCase().includes(matching));
    })
    .map((day) => ({
      key: `${field}-${day.date}`,
      date: new FromDate(day.date),
      tag,
      text: day[field],
    }));

// Media diaria y tendencia semanal de unas kcal por fecha, contando solo los días planificados:
// un día sin nada planificado no es un día sin comer
const kcalStat = (kcal: Map<string, number>, plannedDays: string[], period: Period) => {
  const series = plannedDays.map((day): [string, number] => [day, kcal.get(day) ?? 0]);
  const total = series.reduce((sum, [, value]) => sum + value, 0);
  return {
    value: series.length ? total / series.length : 0,
    trend: weeklyTrend(series, period),
  };
};

export const HistoryPlaning = ({ period, onSelectWeek }: HistoryPageProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const range = { startDate: period.start, endDate: period.end };

  const planningQuery = useFetchPlanningForDateRange(range);
  const mealsKcalQuery = useFetchMealsKcalForDateRange(range);
  const trainingKcalQuery = useFetchTrainingKcalForDateRange(range);
  const racesKcalQuery = useFetchRacesKcalForDateRange(range);
  const bmrQuery = useFetchBmr(range);
  const searchQuery = useSearchPlanning({ search });

  const days = planningQuery.data ?? [];
  const matching = search.trim().toLowerCase();
  const eventLabel = t("data:appointments.form.history.event");
  const commentLabel = t("data:appointments.form.history.comment");
  const results = searchQuery.data && [
    ...toItems(searchQuery.data, "event", eventLabel, matching),
    ...toItems(searchQuery.data, "comment", commentLabel, matching),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const mealsKcal = mealsKcalQuery.data ?? new Map<string, number>();
  const trainingKcal = trainingKcalQuery.data ?? new Map<string, number>();
  const racesKcal = racesKcalQuery.data ?? new Map<string, number>();
  const totalKcal = new Map<string, number>();
  [mealsKcal, trainingKcal, racesKcal].forEach((kcal) =>
    kcal.forEach((value, day) => totalKcal.set(day, (totalKcal.get(day) ?? 0) + value)),
  );
  // Días con comidas, fila de planificación o carrera
  const plannedDays = [...totalKcal.keys()].sort();
  const kcalUnit = t("data:appointments.form.history.kcalPerDay");
  const isKcalError = mealsKcalQuery.isError || trainingKcalQuery.isError || racesKcalQuery.isError;

  // Balance de cada día planificado con la misma cuenta que la fila de balance energético de la
  // planificación (comidas + entrenamiento neto + carreras − BMR). Sin BMR no se puede calcular
  const bmr = typeof bmrQuery.data === "number" ? bmrQuery.data : null;
  const planningByDate = new Map(days.map((day) => [day.date, day]));
  const balancePerWeek =
    bmr === null || plannedDays.length === 0
      ? null
      : (plannedDays.reduce(
          (sum, day) =>
            sum +
            (mealsKcal.get(day) ?? 0) +
            dayBalanceWithoutMeals({
              planning: planningByDate.get(day),
              raceKcal: racesKcal.get(day) ?? 0,
              bmr,
            }),
          0,
        ) /
          plannedDays.length) *
        7;


  return (
    <div className="flex flex-col gap-5">
      <HistorySearch
        placeholder={t("data:appointments.form.history.searchPlaning")}
        search={search}
        onSearch={setSearch}
        results={results}
        isError={searchQuery.isError}
        period={period}
        onSelectWeek={onSelectWeek}
      />

      <section className="flex flex-col gap-3">
        <h3 className="font-semibold text-text-title">
          {t("data:appointments.form.history.summary")}
        </h3>
        {(planningQuery.isError || isKcalError || bmrQuery.isError) && (
          <p className="text-sm text-red-500" role="alert">
            {t("data:appointments.form.errors.load")}
          </p>
        )}
        {planningQuery.isSuccess && plannedDays.length === 0 ? (
          <p className={emptyTextStyle}>{t("data:appointments.form.history.noPlanning")}</p>
        ) : (
          <>
            <p className="text-xs text-text-muted">
              {t("data:appointments.form.history.plannedDays", { count: plannedDays.length })}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {balancePerWeek !== null && (
                <BalanceStat
                  label={t("data:appointments.form.history.balance")}
                  kcalPerWeek={balancePerWeek}
                  unit={t("data:appointments.form.history.kcalPerWeek")}
                />
              )}
              <KcalChart
                sources={{
                  mealsKcal: kcalStat(mealsKcal, plannedDays, period),
                  trainingKcal: kcalStat(trainingKcal, plannedDays, period),
                  racesKcal: kcalStat(racesKcal, plannedDays, period),
                }}
                total={kcalStat(totalKcal, plannedDays, period)}
                bmr={bmr}
                unit={kcalUnit}
              />
            </div>
          </>
        )}
        <SummaryList
          title={t("data:appointments.form.history.events")}
          items={toItems(days, "event")}
          emptyText={t("data:appointments.form.history.noEvents")}
        />
        <SummaryList
          title={t("data:appointments.form.history.comments")}
          items={toItems(days, "comment")}
          emptyText={t("data:appointments.form.history.noComments")}
        />
      </section>
    </div>
  );
};
