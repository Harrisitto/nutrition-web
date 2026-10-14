import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useRaceIngredientCatalog } from "@src/services/tanstack/data/raceIngredients";
import { useFetchRaceLandmarkOptions } from "@src/services/tanstack/data/raceLandmarks";
import { useRaceDraft } from "../../context/raceDraftContext";
import { buildChartData, landmarkLanes } from "./chartData";
import { IngredientDot } from "./ingredientDot";
import { LandmarkLabel } from "./landmarkLabel";
import { ChartTooltip } from "./chartTooltip";
import { BLUE, GREEN, GRID, INGREDIENT_CLIP_ID, INK } from "./constants";

export const RaceChart = () => {
  const { t } = useTranslation();
  const { draft } = useRaceDraft();
  // Con los ingredientes borrados del catálogo: siguen en la carrera
  const { byId: catalog } = useRaceIngredientCatalog();
  const { data: landmarkOptions } = useFetchRaceLandmarkOptions();
  const landmarkOptionsById = useMemo(
    () => new Map(landmarkOptions?.map((option) => [option.id, option])),
    [landmarkOptions],
  );

  const chart = useMemo(
    () =>
      buildChartData({
        steps: draft.steps,
        ingredients: draft.ingredients,
        distanceKm: draft.distanceKm,
        catalog,
      }),
    [draft.steps, draft.ingredients, draft.distanceKm, catalog],
  );

  const labelLanes = useMemo(
    () => (chart ? landmarkLanes(draft.landmarks, chart.maxKm) : []),
    [chart, draft.landmarks],
  );

  if (!chart) {
    return (
      <div className="rounded-2xl border border-nutrition-green/20 bg-white-green/30 px-3 py-8 text-center text-sm text-text-muted">
        {t("data:races.chart.empty")}
      </div>
    );
  }

  // Margen bajo el perfil para los puntos de interés y sobre él para las
  // tomas, mayor cuando hay un segundo carril
  const lowerMargin = labelLanes.some((lane) => lane > 0) ? 0.75 : 0.45;
  const upperMargin = chart.data.some((point) => (point.lane ?? 0) > 0) ? 0.35 : 0.15;

  return (
    <figure className="flex flex-col gap-2 rounded-2xl border border-nutrition-green/20 bg-white-green/30 p-3">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chart.data} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
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
              tick={{ fill: INK, fontSize: 11 }}
              tickFormatter={(km: number) => `${km} km`}
              axisLine={{ stroke: GRID }}
              tickLine={false}
            />
            <YAxis
              domain={([min, max]: readonly number[]) => {
                const range = Math.max(max - min, 100);
                return [min - range * lowerMargin, max + range * upperMargin];
              }}
              tick={{ fill: INK, fontSize: 11 }}
              tickFormatter={(altitude: number) => `${Math.round(altitude)} m`}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip content={ChartTooltip} />
            {draft.landmarks.map((landmark, index) => {
              const option = landmarkOptionsById.get(landmark.landmark_id);
              return (
                <ReferenceLine
                  key={index}
                  x={landmark.km}
                  stroke={BLUE}
                  strokeDasharray="4 4"
                  strokeOpacity={0.6}
                  label={
                    <LandmarkLabel
                      iconUrl={option?.url}
                      name={landmark.name || option?.name || ""}
                      lane={labelLanes[index] ?? 0}
                    />
                  }
                />
              );
            })}
            <Area
              type="linear"
              dataKey="altitude"
              stroke={GREEN}
              strokeWidth={2}
              fill={GREEN}
              fillOpacity={0.15}
              dot={IngredientDot}
              activeDot={{ r: 4, fill: GREEN, stroke: "white", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <figcaption className="flex flex-wrap gap-4 px-2 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: GREEN }} />
          {t("data:races.chart.altitude")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 border-l-2 border-dashed" style={{ borderColor: BLUE }} />
          {t("data:races.chart.landmarks")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border bg-white" style={{ borderColor: BLUE }} />
          {t("data:races.chart.ingredients")}
        </span>
      </figcaption>
    </figure>
  );
};
