import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  CartesianGrid,
  DefaultZIndexes,
  ReferenceArea,
  XAxis,
  YAxis,
} from "recharts";
import { GREEN, PURPLE } from "../chart/constants";
import { formatNumber } from "./format";
import { kmTicks, type PosterLayout } from "./layout";
import type { RacePosterData } from "./posterData";
import {
  AREA_BOTTOM,
  AREA_TOP,
  AXIS_FONT_SIZE,
  AXIS_INK,
  PADDING_X,
  PLOT_HEIGHT,
  PLOT_RIGHT,
  PLOT_RIGHT_PADDING,
  SOFT_GRID,
  X_AXIS_HEIGHT,
  Y_AXIS_WIDTH,
} from "./constants";

const AREA_GRADIENT_ID = "race-poster-area";

/**
 * Perfil de altitud con las franjas de las tomas con "durante". Los ejes y márgenes son fijos
 * para que el área de dibujo coincida con la de posterLayout: así las líneas de las cajas y de
 * los puntos de interés caen en su km. Las unidades solo van en la última marca de cada eje.
 */
export const PosterProfile = ({
  data,
  layout,
}: {
  data: RacePosterData;
  layout: PosterLayout;
}) => {
  const { i18n } = useTranslation();
  const tick = { fill: AXIS_INK, fontSize: AXIS_FONT_SIZE };
  const formatKm = (km: number) =>
    `${formatNumber(km, i18n.language)}${km === layout.maxKm ? " km" : ""}`;
  const formatAltitude = (altitude: number) =>
    `${formatNumber(altitude, i18n.language)}${altitude === layout.axis.max ? " m" : ""}`;

  return (
    <div className="absolute" style={{ left: PADDING_X, top: layout.plotTop }}>
      <AreaChart
        width={PLOT_RIGHT + PLOT_RIGHT_PADDING - PADDING_X}
        height={PLOT_HEIGHT + layout.spanTrackHeight + X_AXIS_HEIGHT}
        data={data.profile}
        margin={{ top: 0, right: PLOT_RIGHT_PADDING, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={AREA_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={AREA_TOP} />
            <stop offset="100%" stopColor={AREA_BOTTOM} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={SOFT_GRID} vertical={false} />
        {/* Las barras de "durante" ocupan los primeros px del eje: las marcas van debajo */}
        <XAxis
          dataKey="km"
          type="number"
          domain={[0, layout.maxKm]}
          ticks={kmTicks(layout.maxKm)}
          tickFormatter={formatKm}
          tick={{ ...tick, dy: layout.spanTrackHeight }}
          height={layout.spanTrackHeight + X_AXIS_HEIGHT}
          axisLine={{ stroke: AXIS_INK, strokeWidth: 1.5 }}
          tickLine={false}
        />
        <YAxis
          domain={[layout.axis.min, layout.axis.max]}
          ticks={layout.axis.ticks}
          tickFormatter={formatAltitude}
          tick={tick}
          width={Y_AXIS_WIDTH}
          axisLine={false}
          tickLine={false}
        />
        {/* Por debajo del área opaca (Recharts las pone al mismo nivel): solo tiñe el cielo */}
        {layout.spanZones.map((zone, index) => (
          <ReferenceArea
            key={index}
            x1={zone.from}
            x2={zone.to}
            fill={PURPLE}
            fillOpacity={0.08}
            ifOverflow="hidden"
            zIndex={DefaultZIndexes.area - 1}
          />
        ))}
        <Area
          type="linear"
          dataKey="altitude"
          stroke={GREEN}
          strokeWidth={3.5}
          strokeLinejoin="round"
          fill={`url(#${AREA_GRADIENT_ID})`}
          fillOpacity={1}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </div>
  );
};
