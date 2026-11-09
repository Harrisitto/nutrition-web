import { useTranslation } from "react-i18next";
import type { Macros } from "@src/helpers/macros";

// Mismos colores que el resumen de macros del preset (dashboard/preset/.../macrosResume.tsx)
export const MACRO_COLORS = { hc: "#455e19", prot: "#30556b", fat: "#6b2f55" } as const;

const round = (value: number) => Math.round(value * 10) / 10;

/**
 * Gramos de hc, proteína y grasa en barras horizontales, con las kcal totales al lado.
 * El nombre va encima de cada barra y no en un eje: así cabe cualquier traducción
 * ("Carbohidratos") sin recortarse ni comerse el ancho de las barras.
 */
export const RecipeMacrosChart = ({
  macros,
  typeName,
}: {
  macros: Macros;
  /** Tipo de comida (recipe_type) que el cliente ha puesto a la receta; sin tipo no se muestra */
  typeName?: string | null;
}) => {
  const { t } = useTranslation();

  const data = [
    { key: "hc", name: t("data:macronutrients.carbs"), value: round(macros.hc) },
    { key: "prot", name: t("data:macronutrients.protein"), value: round(macros.prot) },
    { key: "fat", name: t("data:macronutrients.fats"), value: round(macros.fat) },
  ] as const;

  // Las barras se escalan respecto al macro mayor, como en un gráfico de barras
  const max = Math.max(...data.map((el) => el.value));

  return (
    <div className="flex items-stretch gap-3">
      <ul className="min-w-0 flex-1 space-y-1.5">
        {data.map((entry) => (
          <li key={entry.key}>
            <div className="flex items-baseline justify-between gap-2 text-[11px] leading-tight">
              <span className="truncate font-semibold" style={{ color: MACRO_COLORS[entry.key] }}>
                {entry.name}
              </span>
              <span className="shrink-0 font-semibold text-dark-green">{entry.value} g</span>
            </div>
            <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-nutrition-green/10">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${max > 0 ? (entry.value / max) * 100 : 0}%`,
                  backgroundColor: MACRO_COLORS[entry.key],
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      {typeName && (
        <div
          className="flex w-24 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border border-nutrition-green/25 bg-white px-2 py-2 text-center shadow-sm"
          title={typeName}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
            {t("data:customRecipes.list.type")}
          </span>
          <span className="line-clamp-2 text-xs font-semibold leading-tight text-dark-green">
            {typeName}
          </span>
        </div>
      )}
      <div className="flex w-20 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border border-nutrition-green/25 bg-gradient-to-br from-white-green to-nutrition-green/15 px-2 py-2 shadow-sm">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
          {t("data:customRecipes.list.total")}
        </span>
        <span className="text-xl font-bold leading-none text-dark-green">
          {Math.round(macros.kcal)}
        </span>
        <span className="text-[11px] font-medium text-nutrition-green">
          {t("data:macronutrients.kcal")}
        </span>
      </div>
    </div>
  );
};
