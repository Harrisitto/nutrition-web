import { useMemo } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { BLUE, PURPLE } from "../chart/constants";
import { PosterHeader } from "./posterHeader";
import { PosterProfile } from "./posterProfile";
import { StopBox } from "./stopBox";
import { posterLayout, type PlacedLandmark, type PosterLayout } from "./layout";
import type { RacePosterData } from "./posterData";
import { posterI18n } from "./posterI18n";
import {
  CONNECTOR_DOT_RADIUS,
  CONNECTOR_WIDTH,
  LANDMARK_LINE,
  PADDING_TOP,
  PADDING_X,
  PILL_FONT_SIZE,
  PILL_HEIGHT,
  PILL_ICON,
  PILL_ICON_GAP,
  PILL_PADDING_X,
  PLOT_HEIGHT,
  PLOT_LEFT,
  PLOT_RIGHT,
  POSTER_BACKGROUND,
  POSTER_WIDTH,
  SPAN_BAR_HEIGHT,
  X_AXIS_HEIGHT,
} from "./constants";

// Punto de interés debajo del eje de km: icono y nombre sobre un fondo gris azulado suave
const LandmarkPill = ({ landmark }: { landmark: PlacedLandmark }) => (
  <div
    className="absolute flex items-center rounded-full bg-gray-blue-100 font-semibold text-gray-blue-700"
    style={{
      left: landmark.x,
      top: landmark.y,
      width: landmark.width,
      height: PILL_HEIGHT,
      paddingInline: PILL_PADDING_X,
      gap: PILL_ICON_GAP,
      fontSize: PILL_FONT_SIZE,
    }}
  >
    {landmark.iconUrl && (
      <img src={landmark.iconUrl} alt="" style={{ width: PILL_ICON, height: PILL_ICON }} />
    )}
    <span className="whitespace-nowrap">{landmark.name}</span>
  </div>
);

/**
 * Lo que se dibuja encima del perfil: las barras de las tomas con "durante" bajo el eje, la
 * línea discontinua de cada punto de interés y la línea de cada caja de tomas hasta su punto
 * del perfil, que acaba en un anillo del mismo azul que el km de la caja. Va por debajo de las
 * cajas y las pastillas.
 */
const Overlay = ({ layout }: { layout: PosterLayout }) => (
  <svg className="absolute left-0 top-0" width={POSTER_WIDTH} height={layout.height}>
    {layout.spanBars.map((bar, index) => (
      <rect
        key={`span-${index}`}
        x={bar.x}
        y={bar.y}
        width={bar.width}
        height={SPAN_BAR_HEIGHT}
        rx={SPAN_BAR_HEIGHT / 2}
        fill={PURPLE}
        fillOpacity={0.85}
      />
    ))}
    {/* Se corta en la fila de marcas del eje de km para no tacharlas: solo sigue por debajo
        si la pastilla está en una fila inferior */}
    {layout.landmarks.map((landmark, index) => (
      <g
        key={`landmark-${index}`}
        stroke={LANDMARK_LINE}
        strokeWidth={2}
        strokeDasharray="2 6"
        strokeLinecap="round"
      >
        <line x1={landmark.lineX} y1={layout.plotTop} x2={landmark.lineX} y2={layout.kmLabelsTop} />
        <line
          x1={landmark.lineX}
          y1={layout.kmLabelsTop + X_AXIS_HEIGHT}
          x2={landmark.lineX}
          y2={landmark.y}
        />
      </g>
    ))}
    {layout.stops.map((stop, index) => (
      <g key={`stop-${index}`}>
        <line
          x1={stop.lineX}
          y1={stop.y + stop.height}
          x2={stop.lineX}
          y2={stop.pointY}
          stroke={BLUE}
          strokeWidth={CONNECTOR_WIDTH}
        />
        <circle
          cx={stop.lineX}
          cy={stop.pointY}
          r={CONNECTOR_DOT_RADIUS}
          fill="white"
          stroke={BLUE}
          strokeWidth={CONNECTOR_WIDTH + 0.5}
        />
      </g>
    ))}
  </svg>
);

type PosterProps = { data: RacePosterData };

const PosterCanvas = ({ data }: PosterProps) => {
  const { t } = useTranslation();
  const layout = useMemo(() => posterLayout(data), [data]);

  return (
    <div
      className="relative overflow-hidden font-sans"
      style={{ width: POSTER_WIDTH, height: layout.height, background: POSTER_BACKGROUND }}
    >
      <div className="absolute" style={{ left: PADDING_X, right: PADDING_X, top: PADDING_TOP }}>
        <PosterHeader data={data} />
      </div>

      {data.profile.length > 0 ? (
        <PosterProfile data={data} layout={layout} />
      ) : (
        <p
          className="absolute flex items-center justify-center text-[28px] text-text-muted"
          style={{
            left: PLOT_LEFT,
            top: layout.plotTop,
            width: PLOT_RIGHT - PLOT_LEFT,
            height: PLOT_HEIGHT,
          }}
        >
          {t("data:races.chart.empty")}
        </p>
      )}

      <Overlay layout={layout} />

      {layout.stops.map((stop, index) => (
        <StopBox key={index} stop={stop} cardSize={layout.cardSize} />
      ))}
      {layout.landmarks.map((landmark, index) => (
        <LandmarkPill key={index} landmark={landmark} />
      ))}
    </div>
  );
};

/**
 * Imagen de la carrera para el corredor, a tamaño real (1920 de ancho, 1080 o más de alto):
 * cabecera con los totales, perfil de altitud, una caja por km con tomas unida a su punto del
 * perfil y los puntos de interés debajo, todo en el idioma del corredor (`data.language`). Solo
 * depende de `data` (sin contextos de la página ni consultas) para poder pintarla fuera de ella
 * y pasarla a png (ver posterImage.tsx).
 */
export const RacePoster = ({ data }: PosterProps) => (
  <I18nextProvider i18n={posterI18n(data.language)}>
    <PosterCanvas data={data} />
  </I18nextProvider>
);
