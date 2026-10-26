export const KCAL_PER_HC_GRAM = 4;

export const hcToKcal = (hc: number) => hc * KCAL_PER_HC_GRAM;

/**
 * HC de una carrera: Σ amount × hc_amount de cada toma. Los ingredientes con
 * borrado lógico siguen contando: forman parte del plan.
 */
export const raceHc = <T extends { amount: number }>(
  intakes: T[],
  hcAmountOf: (intake: T) => number | null | undefined,
) =>
  intakes.reduce(
    (acc, intake) => acc + intake.amount * (hcAmountOf(intake) ?? 0),
    0,
  );

type TrainingDay = {
  training_hc?: (number | null)[] | null;
  training_kcal?: number | null;
};

/**
 * Kcal ingeridas durante el entrenamiento de un día: 4 × HC de cada hora.
 */
export const trainingIntakeKcal = (day?: TrainingDay) =>
  hcToKcal(
    (day?.training_hc ?? []).reduce<number>((acc, hc) => acc + (hc || 0), 0),
  );

/**
 * Kcal netas del entrenamiento de un día: HC tomados durante el entrenamiento
 * menos el gasto del entrenamiento.
 */
export const trainingNetKcal = (day?: TrainingDay) =>
  trainingIntakeKcal(day) - (day?.training_kcal || 0);

/**
 * Balance energético de un día sin contar las comidas: entrenamiento neto +
 * kcal tomadas en carreras − metabolismo basal. La fila de balance energético
 * le suma las comidas y el autogenerado busca las comidas que lo dejan en 0.
 */
export const dayBalanceWithoutMeals = ({
  planning,
  raceKcal,
  bmr,
}: {
  planning?: TrainingDay;
  raceKcal: number;
  bmr: number;
}) => trainingNetKcal(planning) + raceKcal - bmr;

/**
 * Suma las kcal de cada fila por su fecha ("YYYY-MM-DD"). Las filas sin fecha no cuentan.
 */
export const kcalByDate = <T extends { date: string | null }>(
  rows: T[],
  kcalOf: (row: T) => number,
) => {
  const totals = new Map<string, number>();
  rows.forEach((row) => {
    if (!row.date) return;
    totals.set(row.date, (totals.get(row.date) ?? 0) + kcalOf(row));
  });
  return totals;
};
