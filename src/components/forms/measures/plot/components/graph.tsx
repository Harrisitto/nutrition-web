import { usePlotContext } from "../plotContext";
import { useMemo } from "react";
import { getChartColorFromClass } from "../../../../../hooks/helpers/colorMapping";
import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Graph = () => {
  const { t } = useTranslation();
  const { focusedMeasures, measureInfo } = usePlotContext();

  const visibleMeasureIds = useMemo(
    () =>
      Object.entries(measureInfo)
        .filter(([, info]) => info.visible)
        .map(([id]) => Number(id)),
    [measureInfo],
  );

  const chartData = useMemo(() => {
    if (focusedMeasures.length === 0 || visibleMeasureIds.length === 0) return [];

    const byDate = new Map<string, Record<string, string | number>>();

    for (const point of focusedMeasures) {
      const row = byDate.get(point.date) ?? { date: point.date };
      row[`m_${point.measure_id}`] = point.value;
      byDate.set(point.date, row);
    }

    return Array.from(byDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, row]) => row);
  }, [focusedMeasures, visibleMeasureIds]);

  const yDomain = useMemo<[number, number] | undefined>(() => {
    const values: number[] = [];

    for (const row of chartData) {
      for (const measureId of visibleMeasureIds) {
        const value = row[`m_${measureId}` as keyof typeof row];
        if (typeof value === "number" && Number.isFinite(value)) {
          values.push(value);
        }
      }
    }

    if (values.length === 0) return undefined;

    const min = Math.min(...values);
    const max = Math.max(...values);

    if (min === max) {
      const padding = Math.max(1, Math.abs(min) * 0.05);
      return [min - padding, max + padding];
    }

    const range = max - min;
    const padding = range * 0.08;
    return [min - padding, max + padding];
  }, [chartData, visibleMeasureIds]);

  if (visibleMeasureIds.length === 0) {
    return (
      <div className="h-80 w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-500">
        {t("forms:measures.management.noVisibleMeasuresSelected")}
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-80 w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-500">
        {t("forms:measures.management.noDataInFocusRange")}
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 rounded-lg border border-slate-200 bg-white p-3">
      <ResponsiveContainer width="100%" aspect={2.2} minWidth={0} minHeight={280}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#475569", fontSize: 12 }}
            tickFormatter={(value: string) => new Date(`${value}T00:00:00`).toLocaleDateString()}
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 12 }}
            domain={yDomain}
            tickFormatter={(value) =>
              typeof value === "number"
                ? value.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                : String(value)
            }
          />
          <Tooltip
            labelFormatter={(label) => new Date(`${label as string}T00:00:00`).toLocaleDateString()}
            formatter={(value, name) => {
              const measureId = Number(String(name).replace("m_", ""));
              const measureName =
                measureInfo[measureId]?.data.name ??
                t("forms:measures.management.measureFallback", { id: measureId });

              return [value ?? "-", measureName];
            }}
          />

          {visibleMeasureIds.map((measureId) => (
            <Line
              key={`m_${measureId}`}
              type="monotone"
              dataKey={`m_${measureId}`}
              stroke={getChartColorFromClass(measureInfo[measureId]?.colorClass)}
              strokeWidth={2}
              dot={(props) => {
                if (typeof props.value !== "number" || !Number.isFinite(props.value)) {
                  return null;
                }

                return (
                  <g>
                    <circle cx={props.cx} cy={props.cy} r={10} fill="transparent" />
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={(typeof props.r === "number" ? props.r : 3) + 1}
                      fill={props.fill ?? "#ffffff"}
                      stroke={props.stroke}
                      strokeWidth={props.strokeWidth ?? 2}
                    />
                  </g>
                );
              }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
