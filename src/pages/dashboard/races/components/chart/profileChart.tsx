import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  landmarkLanes,
  type ChartData,
  type ChartLandmark,
  type ChartSpan,
} from "./chartData";
import { IngredientDot } from "./ingredientDot";
import { LandmarkLabel } from "./landmarkLabel";
import { ChartTooltip } from "./chartTooltip";
import { BLUE, GREEN, GRID, INGREDIENT_CLIP_ID, INK, PURPLE, type ChartSizes } from "./constants";

/**
 * Perfil de altitud con las tomas (imágenes sobre el recorrido), los puntos de interés (líneas
 * con icono y nombre) y las tomas con "durante" (franjas púrpura). Lo usan la vista previa
 * del editor, dentro de un ResponsiveContainer, y la imagen de la carrera, con width y height.
 */
export const ProfileChart = ({
  chart,
  landmarks,
  spans,
  sizes,
  width,
  height,
  showTooltip = false,
}: {
  chart: ChartData;
  landmarks: ChartLandmark[];
  spans: ChartSpan[];
  sizes: ChartSizes;
  width?: number;
  height?: number;
  showTooltip?: boolean;
}) => {
  const labelLanes = useMemo(
    () => landmarkLanes(landmarks, chart.maxKm),
    [landmarks, chart.maxKm],
  );

  // Margen bajo el perfil para los puntos de interés y sobre él para las
  // tomas, mayor cuando hay un segundo carril
  const lowerMargin = labelLanes.some((lane) => lane > 0) ? 0.75 : 0.45;
  const upperMargin = chart.data.some((point) => (point.lane ?? 0) > 0) ? 0.35 : 0.15;
  const tick = { fill: INK, fontSize: sizes.fontSize };
  // Bajo el perfil queda margen para las etiquetas: sin marcas de altitud por debajo del mínimo
  const minAltitude = Math.min(...chart.data.map((point) => point.altitude));

  return (
    <AreaChart
      width={width}
      height={height}
      data={chart.data}
      margin={{ top: sizes.marginTop, right: sizes.fontSize, left: 0, bottom: 0 }}
    >
      <defs>
        {/* Recorte circular para las imágenes de ingredientes (relativo a cada imagen) */}
        <clipPath id={INGREDIENT_CLIP_ID} clipPathUnits="objectBoundingBox">
          <circle cx={0.5} cy={0.5} r={0.5} />
        </clipPath>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
      <XAxis
        dataKey="km"
        type="number"
        domain={[0, chart.maxKm]}
        tick={tick}
        tickFormatter={(km: number) => `${Number(km.toFixed(1))} km`}
        axisLine={{ stroke: GRID }}
        tickLine={false}
      />
      <YAxis
        domain={([min, max]: readonly number[]) => {
          const range = Math.max(max - min, 100);
          return [min - range * lowerMargin, max + range * upperMargin];
        }}
        tick={tick}
        tickFormatter={(altitude: number) =>
          altitude < minAltitude ? "" : `${Math.round(altitude)} m`
        }
        axisLine={false}
        tickLine={false}
        width={sizes.yAxisWidth}
      />
      {showTooltip && <Tooltip content={ChartTooltip} />}
      {spans.map((span, index) => (
        <ReferenceArea
          key={`span-${index}`}
          x1={span.km}
          x2={span.km + span.kmSpan}
          fill={PURPLE}
          fillOpacity={0.12}
          stroke={PURPLE}
          strokeOpacity={0.4}
          ifOverflow="hidden"
        />
      ))}
      {landmarks.map((landmark, index) => (
        <ReferenceLine
          key={`landmark-${index}`}
          x={landmark.km}
          stroke={BLUE}
          strokeWidth={sizes.strokeWidth / 2}
          strokeDasharray="4 4"
          strokeOpacity={0.6}
          label={
            <LandmarkLabel
              iconUrl={landmark.iconUrl}
              name={landmark.name}
              lane={labelLanes[index] ?? 0}
              sizes={sizes}
            />
          }
        />
      ))}
      <Area
        type="linear"
        dataKey="altitude"
        stroke={GREEN}
        strokeWidth={sizes.strokeWidth}
        fill={GREEN}
        fillOpacity={0.15}
        dot={<IngredientDot sizes={sizes} />}
        activeDot={{ r: sizes.strokeWidth * 2, fill: GREEN, stroke: "white", strokeWidth: 2 }}
        isAnimationActive={false}
      />
    </AreaChart>
  );
};
