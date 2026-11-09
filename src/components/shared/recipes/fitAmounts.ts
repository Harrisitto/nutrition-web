import { MACRO_KEYS, Macros } from "@src/helpers/macros";
import {
  ingredientPortions,
  mealIngredientMacros,
  type CustomIngredient,
} from "@src/services/tanstack/data/ingredients";

/*
 * Ajusta las cantidades de unos alimentos para que sus macros encajen en un objetivo (un recipe_type).
 *
 * Mínimos cuadrados con cantidades positivas, resuelto por descenso por coordenadas: se optimiza un
 * alimento cada vez (con los demás fijos el óptimo es exacto, es una parábola) y se repite hasta que
 * nada cambia. Minimiza:
 *
 *   Σ_macro ((total − objetivo) / margen)²  +  λ · Σ_alimento (raciones − raciones actuales)²
 *
 * - Cada macro se mide en "márgenes" (Macros.tolerance): 5 g de grasa sobre 20 g pesan más que 5 g
 *   de hc sobre 100 g, igual que en la regla de encaje.
 * - El segundo término, pequeño, desempata cuando hay más alimentos que macros (infinitas
 *   soluciones): se elige la más parecida a la receta actual, en raciones de cada alimento.
 * - Ninguna cantidad baja de un paso de redondeo: la receta no admite cantidades 0.
 */

const SWEEPS = 300;
const PROXIMITY_WEIGHT = 0.01;

/** Paso de redondeo: unidades enteras (g, ml) si la ración es grande, décimas si es pequeña */
const roundingStep = (ingredient: CustomIngredient) =>
  ingredient.amount >= 10 ? 1 : ingredient.amount > 0 ? 0.1 : 0.25;

const roundTo = (value: number, step: number) =>
  Number((Math.round(value / step) * step).toFixed(2));

export type FitResult = {
  amounts: number[];
  macros: Macros;
  fits: boolean;
};

export const fitAmountsToMacros = (
  rows: { ingredient: CustomIngredient; amount: number | null }[],
  target: Macros,
): FitResult => {
  // Macros por unidad de cantidad de cada alimento (lo que aporta subir su cantidad en 1)
  const perUnit = rows.map(({ ingredient }) => mealIngredientMacros(ingredient, 1));
  // Unidades que son una ración: el término de proximidad se mide en raciones
  const unitsPerPortion = rows.map(({ ingredient }) => 1 / ingredientPortions(ingredient, 1));
  const minAmount = rows.map(({ ingredient }) => roundingStep(ingredient));
  const initial = rows.map(({ ingredient, amount }, i) =>
    Math.max(amount ?? (ingredient.amount || 1), minAmount[i]),
  );
  const weight = MACRO_KEYS.map((key) => 1 / Macros.tolerance(target[key]) ** 2);

  const amounts = [...initial];
  // residual[k] = total del macro k − objetivo
  const residual = MACRO_KEYS.map(
    (key) => rows.reduce((acc, _, i) => acc + perUnit[i][key] * amounts[i], 0) - target[key],
  );

  for (let sweep = 0; sweep < SWEEPS; sweep++) {
    let maxChange = 0;
    rows.forEach((_, i) => {
      const proximity = PROXIMITY_WEIGHT / unitsPerPortion[i] ** 2;
      let gradient = proximity * (amounts[i] - initial[i]);
      let curvature = proximity;
      MACRO_KEYS.forEach((key, k) => {
        gradient += weight[k] * perUnit[i][key] * residual[k];
        curvature += weight[k] * perUnit[i][key] ** 2;
      });

      const next = Math.max(amounts[i] - gradient / curvature, minAmount[i]);
      const delta = next - amounts[i];
      if (delta === 0) return;
      MACRO_KEYS.forEach((key, k) => {
        residual[k] += perUnit[i][key] * delta;
      });
      amounts[i] = next;
      maxChange = Math.max(maxChange, Math.abs(delta) / unitsPerPortion[i]);
    });
    // Menos de una milésima de ración en toda la pasada: ya no se mueve
    if (maxChange < 1e-3) break;
  }

  const rounded = amounts.map((amount, i) => roundTo(amount, minAmount[i]));
  const macros = Macros.sum(
    rows.map(({ ingredient }, i) => mealIngredientMacros(ingredient, rounded[i])),
  );
  return { amounts: rounded, macros, fits: macros.fits(target) };
};
