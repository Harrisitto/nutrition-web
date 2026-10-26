import { useTranslation } from "react-i18next";
import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import { useFormatNumber } from "../shared/format";

type KcalSource = "mealsKcal" | "trainingKcal" | "racesKcal";

// Paleta categórica validada (azul, naranja, aqua) en orden fijo: cada fuente tiene siempre su
// color, aunque otra valga 0. El aqua no llega a 3:1 con el fondo: la leyenda lleva los valores
const KCAL_SOURCES: { key: KcalSource; color: string }[] = [
  { key: "mealsKcal", color: "#2a78d6" },
  { key: "trainingKcal", color: "#eb6834" },
  { key: "racesKcal", color: "#1baf7a" },
];

// Media diaria y tendencia semanal (null sin regresión posible)
export type KcalStat = { value: number; trend: number | null };

// Proporción de las kcal ingeridas por fuente, con el total de título y el BMR de pie
export const KcalChart = ({
  sources,
  total,
  bmr,
  unit,
}: {
  sources: Record<KcalSource, KcalStat>;
  total: KcalStat;
  bmr: number | null;
  unit: string;
}) => {
  const { t } = useTranslation();
  const formatNumber = useFormatNumber();
  const formatKcal = (kcal: number) => formatNumber(Math.round(kcal));
  const formatTrend = (trend: number) =>
    t("data:appointments.form.history.perWeek", {
      value: `${trend > 0 ? "+" : ""}${formatKcal(trend)} ${unit}`,
    });
  const percent = (kcal: number) => (total.value > 0 ? Math.round((kcal / total.value) * 100) : 0);

  const slices = KCAL_SOURCES.map(({ key, color }) => ({
    key,
    name: t(`data:appointments.form.history.${key}`),
    value: sources[key].value,
    trend: sources[key].trend,
    fill: color,
  }));

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-nutrition-green/20 bg-white px-3 py-3 sm:col-span-2">
      <header>
        <p className="text-xs text-text-muted">{t("data:appointments.form.history.totalKcal")}</p>
        <p className="text-lg font-semibold text-text-title">
          {formatKcal(total.value)} {unit}
        </p>
        {total.trend !== null && (
          <p className="text-xs text-text-muted">{formatTrend(total.trend)}</p>
        )}
      </header>

      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative h-40 w-40 shrink-0">
          {total.value > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  // Sin las fuentes a 0: un sector vacío solo deja un hueco
                  data={slices.filter((slice) => slice.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={44}
                  outerRadius={72}
                  stroke="#ffffff"
                  strokeWidth={2}
                  shape={(props) => <Sector {...props} fill={props.payload?.fill} />}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const kcal = Number(value ?? 0);
                    return [`${formatKcal(kcal)} ${unit} (${percent(kcal)}%)`, String(name ?? "")];
                  }}
                  contentStyle={{
                    borderRadius: "0.5rem",
                    border: "1px solid rgba(47, 59, 26, 0.2)",
                    backgroundColor: "#eaeee5",
                    color: "#14190b",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full rounded-full border border-nutrition-green/20 bg-white-green/40" />
          )}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-text-title">{formatKcal(total.value)}</span>
            <span className="text-[10px] text-text-muted">{unit}</span>
          </div>
        </div>

        {/* Leyenda con los valores: identifica cada sector sin depender solo del color */}
        <ul className="flex w-full flex-col gap-2">
          {slices.map((slice) => (
            <li key={slice.key} className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-1 h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: slice.fill }}
              />
              <div className="flex flex-col">
                <span className="text-sm text-text-title">
                  {slice.name}:{" "}
                  <span className="font-semibold">
                    {formatKcal(slice.value)} {unit}
                  </span>{" "}
                  <span className="text-text-muted">({percent(slice.value)}%)</span>
                </span>
                {slice.trend !== null && (
                  <span className="text-xs text-text-muted">{formatTrend(slice.trend)}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <footer className="border-t border-nutrition-green/20 pt-2 text-xs text-text-muted">
        {bmr === null
          ? t("data:appointments.form.history.noBmr")
          : t("data:appointments.form.history.bmr", { value: `${formatKcal(bmr)} ${unit}` })}
      </footer>
    </div>
  );
};
