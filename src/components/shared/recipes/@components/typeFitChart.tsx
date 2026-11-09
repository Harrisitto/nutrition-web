import { useTranslation } from "react-i18next";
import { CheckCircle2, Wand2, XCircle } from "lucide-react";
import { MACRO_KEYS, Macros, type MacroKey } from "@src/helpers/macros";
import { MACRO_COLORS } from "./macrosChart";

const round = (value: number) => Math.round(value * 10) / 10;

const LABEL_KEYS: Record<MacroKey, string> = {
  hc: "data:macronutrients.carbs",
  prot: "data:macronutrients.protein",
  fat: "data:macronutrients.fats",
};

const signed = (value: number) => `${value > 0 ? "+" : value < 0 ? "−" : "±"}${Math.abs(round(value))}`;

/**
 * Un macro: la franja sombreada es el margen en el que encaja (objetivo ±tolerancia), la marca
 * vertical el objetivo y la barra lo que aporta la receta (verde dentro de la franja, roja fuera)
 */
const MacroFitRow = ({
  macro,
  recipe,
  target,
}: {
  macro: MacroKey;
  recipe: number;
  target: number;
}) => {
  const { t } = useTranslation();
  const tolerance = Macros.tolerance(target);
  const diff = recipe - target;
  const fits = Math.abs(diff) <= tolerance;
  // Escala común a la franja y a la barra, con aire a la derecha para que nada toque el borde
  const domain = Math.max(target + tolerance, recipe) * 1.15 || 1;
  const pct = (value: number) => `${Math.min(Math.max(value / domain, 0), 1) * 100}%`;

  return (
    <li>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="truncate font-semibold" style={{ color: MACRO_COLORS[macro] }}>
          {t(LABEL_KEYS[macro])}
        </span>
        <span className="shrink-0 text-text-muted">
          <span className="font-semibold text-dark-green">{round(recipe)}</span> / {round(target)} g
          <span
            className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
              fits ? "bg-nutrition-green/15 text-nutrition-green" : "bg-nutrition-red/10 text-nutrition-red"
            }`}
          >
            {signed(diff)} g
          </span>
        </span>
      </div>
      <div
        className="relative mt-1 h-3 w-full rounded-full bg-gray-blue-100"
        title={t("data:customRecipes.form.type.chart.range", {
          min: round(Math.max(target - tolerance, 0)),
          max: round(target + tolerance),
        })}
      >
        {/* Margen en el que encaja */}
        <div
          className="absolute inset-y-0 rounded-full bg-nutrition-green/20"
          style={{
            left: pct(target - tolerance),
            width: `calc(${pct(target + tolerance)} - ${pct(target - tolerance)})`,
          }}
        />
        {/* Receta */}
        <div
          className={`absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full transition-all ${
            fits ? "bg-nutrition-green" : "bg-nutrition-red"
          }`}
          style={{ width: pct(recipe) }}
        />
        {/* Objetivo del tipo */}
        <div
          className="absolute inset-y-[-2px] w-0.5 -translate-x-1/2 rounded-full bg-dark-green"
          style={{ left: pct(target) }}
        />
      </div>
    </li>
  );
};

/**
 * Compara las macros de la receta con las del tipo elegido: si todas caen en su margen, la receta
 * se puede guardar (y planificar) con ese tipo
 */
export const RecipeTypeFitChart = ({
  recipe,
  target,
  typeName,
  onAutoAdjust,
  adjustFailed = false,
}: {
  recipe: Macros;
  target: Macros;
  typeName: string | null;
  /** Ajusta las cantidades de los alimentos para encajar; sin él no hay botón */
  onAutoAdjust?: () => void;
  /** El último ajuste no ha conseguido encajar: se explica qué macro falla */
  adjustFailed?: boolean;
}) => {
  const { t } = useTranslation();
  const fits = recipe.fits(target);

  // Macro más lejos de su margen (en márgenes), para decir qué cambiar si el ajuste no basta
  const worst = MACRO_KEYS.reduce((acc, key) =>
    Math.abs(recipe[key] - target[key]) / Macros.tolerance(target[key]) >
    Math.abs(recipe[acc] - target[acc]) / Macros.tolerance(target[acc])
      ? key
      : acc,
  );
  const worstName = t(LABEL_KEYS[worst]).toLowerCase();

  return (
    <section
      className={`rounded-xl border p-3 transition-colors ${
        fits ? "border-nutrition-green/40 bg-nutrition-green/5" : "border-nutrition-red/30 bg-nutrition-red/5"
      }`}
    >
      <header className="mb-2.5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          {fits ? (
            <CheckCircle2 size={18} className="shrink-0 text-nutrition-green" />
          ) : (
            <XCircle size={18} className="shrink-0 text-nutrition-red" />
          )}
          <span className={`truncate text-sm font-semibold ${fits ? "text-nutrition-green" : "text-nutrition-red"}`}>
            {fits
              ? t("data:customRecipes.form.type.chart.fits", { type: typeName ?? "" })
              : t("data:customRecipes.form.type.chart.notFits", { type: typeName ?? "" })}
          </span>
        </div>
        <span className="shrink-0 text-xs text-text-muted">
          <span className="font-semibold text-dark-green">{Math.round(recipe.kcal)}</span> /{" "}
          {Math.round(target.kcal)} {t("data:macronutrients.kcal")}
        </span>
      </header>

      <ul className="space-y-2.5">
        {MACRO_KEYS.map((key) => (
          <MacroFitRow key={key} macro={key} recipe={recipe[key]} target={target[key]} />
        ))}
      </ul>

      {adjustFailed && !fits && (
        <p className="mt-2.5 text-xs font-medium text-nutrition-red">
          {recipe[worst] < target[worst]
            ? t("data:customRecipes.form.type.chart.adjustMissing", { macro: worstName })
            : t("data:customRecipes.form.type.chart.adjustExcess", { macro: worstName })}
        </p>
      )}

      <footer className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-3 text-[11px] text-text-muted">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-4 rounded-full bg-nutrition-green/20" />
            {t("data:customRecipes.form.type.chart.legendRange")}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-0.5 rounded-full bg-dark-green" />
            {t("data:customRecipes.form.type.chart.legendTarget")}
          </span>
        </p>
        {onAutoAdjust && !fits && (
          <button
            type="button"
            onClick={onAutoAdjust}
            className="inline-flex items-center gap-1.5 rounded-lg bg-nutrition-green px-3 py-1.5 text-xs font-semibold text-white-green transition hover:opacity-90"
          >
            <Wand2 size={14} aria-hidden />
            {t("data:customRecipes.form.type.chart.adjust")}
          </button>
        )}
      </footer>
    </section>
  );
};
