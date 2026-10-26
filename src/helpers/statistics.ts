export type Point = { x: number; y: number };

/**
 * Pendiente de la recta de mínimos cuadrados (cambio de y por unidad de x).
 * Null con menos de dos x distintas: no hay recta que ajustar.
 */
export const regressionSlope = (points: Point[]): number | null => {
  if (points.length < 2) return null;
  const meanX = points.reduce((acc, { x }) => acc + x, 0) / points.length;
  const meanY = points.reduce((acc, { y }) => acc + y, 0) / points.length;
  let covariance = 0;
  let varianceX = 0;
  points.forEach(({ x, y }) => {
    covariance += (x - meanX) * (y - meanY);
    varianceX += (x - meanX) ** 2;
  });
  return varianceX === 0 ? null : covariance / varianceX;
};
