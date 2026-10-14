import type { ChartPoint } from "./chartData";
import {
  BLUE,
  INGREDIENT_CLIP_ID,
  INGREDIENT_IMAGE_SIZE,
  INGREDIENT_LANE_HEIGHT,
  MAX_IMAGES_PER_KM,
} from "./constants";

export const IngredientDot = ({
  cx,
  cy,
  payload,
}: {
  cx?: number;
  cy?: number;
  payload?: ChartPoint;
}) => {
  // Solo se pinta punto donde hay ingredientes; el resto de la línea va sin marcas
  if (!payload?.ingredients?.length || cx === undefined || cy === undefined) {
    return null;
  }
  // Por encima del recorrido, unido a él por un trazo (más largo en el segundo
  // carril). Si hay varias tomas en el mismo km, las imágenes se solapan en fila
  const size = INGREDIENT_IMAGE_SIZE;
  const stem = 9 + (payload.lane ?? 0) * INGREDIENT_LANE_HEIGHT;
  const images = (payload.images ?? []).slice(0, MAX_IMAGES_PER_KM);
  const step = size * 0.6;
  const firstX = cx - ((images.length - 1) * step) / 2;
  const centerY = cy - stem - size / 2;

  return (
    <g>
      <line x1={cx} y1={cy} x2={cx} y2={cy - stem} stroke={BLUE} strokeWidth={1.5} />
      {images.map((image, index) => {
        const x = firstX + index * step;
        return (
          <g key={index}>
            <circle cx={x} cy={centerY} r={size / 2 + 1.5} fill="white" stroke={BLUE} strokeWidth={1} />
            {image ? (
              <image
                href={image}
                x={x - size / 2}
                y={centerY - size / 2}
                width={size}
                height={size}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#${INGREDIENT_CLIP_ID})`}
              />
            ) : (
              <circle cx={x} cy={centerY} r={5} fill={BLUE} />
            )}
          </g>
        );
      })}
    </g>
  );
};
