import FromDate from "@src/helpers/dates";
import { useFetchUserWeightForDateRange } from "@src/services/tanstack/user/info";
import type { useFetchPresets } from "@src/services/tanstack/user/preset";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart as RechartsBarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLORS = ["#455e19", "#30556b", "#6b2f55"];

const MacrosBarChart = ({
  presetMacros,
  t,
}: {
  presetMacros: {
    carbs: number;
    fat: number;
    protein: number;
  };
  t: (key: string, options?: Record<string, unknown>) => string;
}) => {
  const chartData = [
    { name: t("forms:preset.fields.carbs"), value: presetMacros.carbs },
    { name: t("forms:preset.fields.fat"), value: presetMacros.fat },
    { name: t("forms:preset.fields.protein"), value: presetMacros.protein },
  ];

  const totalMacros = chartData.reduce((sum, item) => sum + item.value, 0);

  if (totalMacros <= 0) {
    return (
      <div className="h-28 w-44 rounded-md border border-nutrition-green/20 bg-white-green/40" />
    );
  }

  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -10, bottom: 6 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#2f3b1a" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#2f3b1a" }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Bar>
          <Tooltip
            formatter={(value, name) => {
              const numeric = Number(value ?? 0);
              const pct =
                totalMacros > 0 ? Math.round((numeric / totalMacros) * 100) : 0;
              return [
                `${numeric} g (${pct}%)`,
                String(name ?? t("forms:preset.fields.macro")),
              ];
            }}
            contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid rgba(47, 59, 26, 0.2)",
              backgroundColor: "#eaeee5",
              color: "#14190b",
              fontSize: "12px",
            }}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MacrosResume = ({
  preset,
}: {
  preset: NonNullable<ReturnType<typeof useFetchPresets>["data"]>[number];
}) => {
  const { t } = useTranslation();

  const formatMetric = (value: number) =>
    Number.isFinite(value) ? value.toFixed(2) : "0.00";
  const formatTotal = (value: number) => Math.round(value * 10) / 10;

  const dates = useMemo(() => {
    const today = new FromDate();
    return {
      startDate: today.thisMonday(),
      endDate: today.thisSunday(),
    };
  }, []);

  const userWeight = useFetchUserWeightForDateRange(dates);

  const presetMacros = useMemo(() => {
    const data = preset.user_preset_meal.reduce(
      (acc, meal) => {
        acc.carbs += meal.type_id.hc;
        acc.fat += meal.type_id.fat;
        acc.protein += meal.type_id.prot;
        return acc;
      },
      { carbs: 0, fat: 0, protein: 0 },
    );

    if (!userWeight.data || userWeight.data < 0)
      return {
        ...data,
        carbsPerKg: 0,
        fatPerKg: 0,
        proteinPerKg: 0,
      };

    return {
      ...data,
      carbsPerKg: data.carbs / userWeight.data,
      fatPerKg: data.fat / userWeight.data,
      proteinPerKg: data.protein / userWeight.data,
    };
  }, [preset.user_preset_meal, userWeight.data]);

  return (
    <section className="mt-3 rounded-xl border border-nutrition-green/30 bg-gradient-to-br from-nutrition-green/15 via-nutrition-green/10 to-white-green/60 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-dark-green">
          {t("forms:preset.fields.macrosDistribution")}
        </h3>
        <p className="text-xs text-text-muted">
          {t("forms:preset.fields.calculatedWithWeekWeight")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <article className="rounded-lg border border-nutrition-green/20 bg-white-green/70 px-3 py-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t("forms:preset.fields.carbsPerKg")}
          </h4>
          <p className="mt-1 text-xl font-bold text-dark-green">
            {formatMetric(presetMacros.carbsPerKg)}
          </p>
          <p className="mt-1 text-xs text-text-subtitle">
            {t("forms:preset.fields.totalCarbs", {
              value: formatTotal(presetMacros.carbs),
            })}
          </p>
        </article>

        <article className="rounded-lg border border-nutrition-green/20 bg-white-green/70 px-3 py-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t("forms:preset.fields.fatsPerKg")}
          </h4>
          <p className="mt-1 text-xl font-bold text-dark-green">
            {formatMetric(presetMacros.fatPerKg)}
          </p>
          <p className="mt-1 text-xs text-text-subtitle">
            {t("forms:preset.fields.totalFat", {
              value: formatTotal(presetMacros.fat),
            })}
          </p>
        </article>

        <article className="rounded-lg border border-nutrition-green/20 bg-white-green/70 px-3 py-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t("forms:preset.fields.proteinPerKg")}
          </h4>
          <p className="mt-1 text-xl font-bold text-dark-green">
            {formatMetric(presetMacros.proteinPerKg)}
          </p>
          <p className="mt-1 text-xs text-text-subtitle">
            {t("forms:preset.fields.totalProtein", {
              value: formatTotal(presetMacros.protein),
            })}
          </p>
        </article>

        <article className="rounded-lg border border-nutrition-green/20 bg-white-green/70 px-2 py-2">
          <MacrosBarChart presetMacros={presetMacros} t={t} />
        </article>
      </div>
    </section>
  );
};
