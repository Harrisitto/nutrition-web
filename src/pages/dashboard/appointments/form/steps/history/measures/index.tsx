import { useState } from "react";
import { useTranslation } from "react-i18next";
import FromDate from "@src/helpers/dates";
import {
  useFetchAllMeasures,
  useFetchUserMeasuresForDateRange,
  useSearchUserMeasures,
} from "@src/services/tanstack/user/measures";
import { emptyTextStyle } from "../../../../../races/components/formStyles";
import {
  HistorySearch,
  SummaryStat,
  type HistoryItem,
  type HistoryPageProps,
} from "../shared/components";
import { useFormatNumber } from "../shared/format";
import { weeklyTrend } from "../shared/period";

type UserMeasure = NonNullable<
  ReturnType<typeof useFetchUserMeasuresForDateRange>["data"]
>[number];

// Valores de cada medición por fecha, en orden ascendente como vienen de la query
const valuesByMeasure = (measures: UserMeasure[]) => {
  const values = new Map<number, [string, number][]>();
  measures.forEach(({ measure_id, date, value }) => {
    values.set(measure_id, [...(values.get(measure_id) ?? []), [date, value]]);
  });
  return values;
};

export const HistoryMeasures = ({ period, onSelectWeek }: HistoryPageProps) => {
  const { t } = useTranslation();
  const formatNumber = useFormatNumber();
  const [search, setSearch] = useState("");

  const allMeasuresQuery = useFetchAllMeasures();
  const measuresQuery = useFetchUserMeasuresForDateRange({
    startDate: period.start,
    endDate: period.end,
  });
  const searchQuery = useSearchUserMeasures({ search });

  const catalog = new Map(
    allMeasuresQuery.data?.map((measure) => [measure.id, measure]) ?? [],
  );
  const current = valuesByMeasure(measuresQuery.data ?? []);

  const results = searchQuery.data?.map((measure): HistoryItem => {
    const info = catalog.get(measure.measure_id);
    return {
      key: `${measure.measure_id}-${measure.date}`,
      date: new FromDate(measure.date),
      tag: String(info?.name ?? ""),
      text: `${formatNumber(measure.value)} ${info?.units ?? ""}`,
    };
  });

  return (
    <div className="flex flex-col gap-5">
      <HistorySearch
        placeholder={t("data:appointments.form.history.searchMeasures")}
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
        {measuresQuery.isError && (
          <p className="text-sm text-red-500" role="alert">
            {t("data:appointments.form.errors.load")}
          </p>
        )}
        {measuresQuery.isSuccess && current.size === 0 && (
          <p className={emptyTextStyle}>{t("data:appointments.form.history.noMeasures")}</p>
        )}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {/* Último valor del periodo y su tendencia semanal */}
          {[...current].map(([measureId, values]) => {
            const info = catalog.get(measureId);
            return (
              <SummaryStat
                key={measureId}
                label={String(info?.name ?? "")}
                value={values[values.length - 1][1]}
                trend={weeklyTrend(values, period)}
                unit={String(info?.units ?? "")}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};
