/**
 * Posición de cada elemento de la imagen de la carrera. Son funciones puras: dado
 * RacePosterData, dicen dónde va el perfil, cada caja de tomas y cada punto de interés.
 */
import {
  altitudeAt,
  type ChartLandmark,
  type ChartPoint,
  type ChartSpan,
} from "../chart/chartData";
import type { PosterIntake, RacePosterData } from "./posterData";
import {
  BOX_GAP,
  BOX_HEADER_HEIGHT,
  BOX_LABEL_FONT_SIZE,
  BOX_PADDING,
  CARD_GAP,
  CARD_SIZES,
  GROWN_CARD_SIZE,
  HEADER_HEIGHT,
  PADDING_BOTTOM,
  PADDING_TOP,
  MIN_POSTER_HEIGHT,
  PADDING_X,
  PILL_FONT_SIZE,
  PILL_GAP,
  PILL_HEIGHT,
  PILL_ICON,
  PILL_ICON_GAP,
  PILL_PADDING_X,
  PLOT_HEIGHT,
  PLOT_LEFT,
  PLOT_RIGHT,
  POSTER_WIDTH,
  SPAN_BAR_GAP,
  SPAN_BAR_HEIGHT,
  SPAN_TRACK_TOP,
  STOPS_PLOT_GAP,
  X_AXIS_HEIGHT,
} from "./constants";

// ---------------------------------------------------------------------------
// Ejes
// ---------------------------------------------------------------------------

/** Intervalo "redondo" (1, 2 o 5 por potencia de 10) para dividir `range` en unas `parts`. */
const niceStep = (range: number, parts: number) => {
  const target = range / parts;
  const magnitude = 10 ** Math.floor(Math.log10(target));
  return [1, 2, 5, 10].map((m) => m * magnitude).find((step) => step >= target)!;
};

const ticksBetween = (min: number, max: number, step: number) => {
  const ticks: number[] = [];
  for (let value = min; value <= max + step / 1000; value += step) ticks.push(value);
  return ticks;
};

/** Eje de altitud con límites redondos y unas 4 divisiones. */
const altitudeAxis = (profile: ChartPoint[]) => {
  if (!profile.length) return { min: 0, max: 100, ticks: [0, 50, 100] };
  const altitudes = profile.map((point) => point.altitude);
  const low = Math.min(...altitudes);
  const high = Math.max(...altitudes);
  const step = niceStep(Math.max(high - low, 10), 4);
  const min = Math.floor(low / step) * step;
  const max = Math.max(Math.ceil(high / step) * step, min + step);
  return { min, max, ticks: ticksBetween(min, max, step) };
};

/** Marcas del eje de km: unas 6 redondas y la meta (si no queda pegada a la última). */
export const kmTicks = (maxKm: number) => {
  const step = niceStep(maxKm, 6);
  const ticks = ticksBetween(0, maxKm, step).filter((km) => maxKm - km > step / 3);
  return [...ticks, maxKm];
};

// ---------------------------------------------------------------------------
// Filas sin solapes
// ---------------------------------------------------------------------------

type RowItem = { center: number; width: number };
type RowPlacement = { x: number; level: number };

/**
 * Coloca cajas en filas sin que se solapen, en el orden recibido (de menor a mayor km). Cada
 * una va centrada sobre su km en la primera fila donde cabe; puede desplazarse a la derecha
 * mientras su km quede dentro de la caja (a `inset` px del borde), sin salirse de [minX, maxX].
 */
const placeInRows = (
  items: RowItem[],
  { minX, maxX, gap, inset }: { minX: number; maxX: number; gap: number; inset: number },
): RowPlacement[] => {
  const rowEnds: number[] = [];
  return items.map(({ center, width }) => {
    const ideal = Math.min(Math.max(center - width / 2, minX), maxX - width);
    const maxShift = Math.max(width / 2 - inset, 0);
    for (let level = 0; ; level++) {
      const x = Math.max(ideal, (rowEnds[level] ?? -Infinity) + gap);
      if (x - ideal <= maxShift && x + width <= maxX) {
        rowEnds[level] = x + width;
        return { x, level };
      }
    }
  });
};

const levelCount = (levels: number[]) => levels.reduce((max, level) => Math.max(max, level + 1), 0);

const rowCount = (placements: RowPlacement[]) => levelCount(placements.map(({ level }) => level));

// ---------------------------------------------------------------------------
// Tomas con "durante"
// ---------------------------------------------------------------------------

// Tramo de km [from, to] del recorrido
type KmRange = { from: number; to: number };

/** Tramo de cada toma con "durante", recortado a la meta y ordenado por km. */
const spanRanges = (spans: ChartSpan[], maxKm: number): KmRange[] =>
  spans
    .map((span) => ({ from: span.km, to: Math.min(span.km + span.kmSpan, maxKm) }))
    .filter((range) => range.to > range.from)
    .sort((a, b) => a.from - b.from);

/**
 * Tramos cubiertos por al menos una toma con "durante". Se pintan unidos en el perfil para
 * que, aunque se solapen muchas, la franja tenga siempre la misma intensidad.
 */
const mergeRanges = (ranges: KmRange[]) => {
  const merged: KmRange[] = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range.from <= last.to) last.to = Math.max(last.to, range.to);
    else merged.push({ ...range });
  }
  return merged;
};

/** Carril de cada toma con "durante": el primero en el que no se solapa con la anterior. */
const spanLanes = (spans: KmRange[]) => {
  const laneEnds: number[] = [];
  return spans.map(({ from, to }) => {
    let lane = laneEnds.findIndex((end) => end < from);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = to;
    return lane;
  });
};

// ---------------------------------------------------------------------------
// Medida del texto
// ---------------------------------------------------------------------------

let measureContext: CanvasRenderingContext2D | null = null;
// La fuente de la página no cambia: se lee una vez
let bodyFontFamily: string | null = null;

/** Ancho en px de un texto con la fuente de la página. */
const textWidth = (text: string, fontSize: number, fontWeight = 600) => {
  measureContext ??= document.createElement("canvas").getContext("2d");
  if (!measureContext) return text.length * fontSize * 0.6;
  bodyFontFamily ??= getComputedStyle(document.body).fontFamily;
  measureContext.font = `${fontWeight} ${fontSize}px ${bodyFontFamily}`;
  return measureContext.measureText(text).width;
};

// ---------------------------------------------------------------------------
// Layout completo
// ---------------------------------------------------------------------------

// Tomas de un mismo km: van juntas en una caja
type IntakeStop = { km: number; intakes: PosterIntake[] };

export type PlacedStop = IntakeStop & {
  x: number;
  y: number;
  width: number;
  height: number;
  // Punto del perfil al que se une la caja con una línea
  lineX: number;
  pointY: number;
};

export type PlacedLandmark = ChartLandmark & { x: number; y: number; width: number; lineX: number };

// Barra de una toma con "durante" debajo del eje de km
type SpanBar = { x: number; y: number; width: number };

export type PosterLayout = {
  height: number;
  maxKm: number;
  plotTop: number;
  plotBottom: number;
  axis: ReturnType<typeof altitudeAxis>;
  spanZones: KmRange[];
  // Alto de los carriles de las barras de "durante": desplaza hacia abajo las marcas del eje
  spanTrackHeight: number;
  // Donde empiezan las marcas del eje de km (debajo de las barras de "durante")
  kmLabelsTop: number;
  spanBars: SpanBar[];
  cardSize: number;
  stops: PlacedStop[];
  landmarks: PlacedLandmark[];
};

const groupByKm = (intakes: PosterIntake[]): IntakeStop[] => {
  const stops: IntakeStop[] = [];
  for (const intake of intakes) {
    const last = stops[stops.length - 1];
    if (last?.km === intake.km) last.intakes.push(intake);
    else stops.push({ km: intake.km, intakes: [intake] });
  }
  return stops;
};

/** Ancho del km de la cabecera de la caja: no depende del tamaño de las tarjetas. */
const boxLabelWidth = (stop: IntakeStop) =>
  Math.ceil(textWidth(`${Number(stop.km.toFixed(2))} km`, BOX_LABEL_FONT_SIZE, 700));

/** Ancho de la caja: el de sus tarjetas, pero sin que el km de la cabecera se corte. */
const boxWidth = (stop: IntakeStop, cardSize: number, labelWidth: number) => {
  const cardsWidth = stop.intakes.length * cardSize + (stop.intakes.length - 1) * CARD_GAP;
  return 2 * BOX_PADDING + Math.max(cardsWidth, labelWidth);
};

const boxHeight = (cardSize: number) => 2 * BOX_PADDING + BOX_HEADER_HEIGHT + cardSize;

const pillWidth = (landmark: ChartLandmark) =>
  2 * PILL_PADDING_X +
  (landmark.iconUrl ? PILL_ICON + PILL_ICON_GAP : 0) +
  textWidth(landmark.name, PILL_FONT_SIZE);

/**
 * De abajo arriba: pastillas de los puntos de interés, eje de km con las barras de "durante",
 * perfil y, en el espacio que queda hasta la cabecera, las cajas de tomas con las tarjetas
 * más grandes que quepan en 1080 px de alto. Si no caben ni con las más pequeñas, la imagen
 * crece lo que haga falta.
 */
export const posterLayout = (data: RacePosterData): PosterLayout => {
  const lastKm = (points: { km: number }[]) => points[points.length - 1]?.km ?? 0;
  const maxKm = Math.max(data.distanceKm ?? 0, lastKm(data.profile), lastKm(data.intakes), 1);
  const xOf = (km: number) => PLOT_LEFT + (km / maxKm) * (PLOT_RIGHT - PLOT_LEFT);
  const rowLimits = { minX: PADDING_X, maxX: POSTER_WIDTH - PADDING_X };

  // Puntos de interés
  const sortedLandmarks = [...data.landmarks].sort((a, b) => a.km - b.km);
  const pillWidths = sortedLandmarks.map(pillWidth);
  const pillRows = placeInRows(
    sortedLandmarks.map((landmark, i) => ({ center: xOf(landmark.km), width: pillWidths[i] })),
    { ...rowLimits, gap: PILL_GAP, inset: PILL_HEIGHT / 2 },
  );
  const pillsHeight = rowCount(pillRows) * (PILL_HEIGHT + PILL_GAP);

  // Tomas con "durante"
  const spans = spanRanges(data.spans, maxKm);
  const lanes = spanLanes(spans);
  const laneCount = levelCount(lanes);
  const spanTrackHeight = laneCount
    ? SPAN_TRACK_TOP + laneCount * SPAN_BAR_HEIGHT + (laneCount - 1) * SPAN_BAR_GAP
    : 0;

  // Cajas de tomas: entre la cabecera y el perfil, con las tarjetas más grandes que quepan
  const stops = groupByKm(data.intakes);
  const labelWidths = stops.map(boxLabelWidth);
  const placeStops = (cardSize: number) =>
    placeInRows(
      stops.map((stop, i) => ({
        center: xOf(stop.km),
        width: boxWidth(stop, cardSize, labelWidths[i]),
      })),
      { ...rowLimits, gap: BOX_GAP, inset: BOX_PADDING },
    );
  const stopsHeight = (cardSize: number) => {
    const rows = rowCount(placeStops(cardSize));
    return rows * boxHeight(cardSize) + Math.max(rows - 1, 0) * BOX_GAP;
  };

  const headerHeight = PADDING_TOP + HEADER_HEIGHT + BOX_GAP;
  const profileHeight =
    STOPS_PLOT_GAP + PLOT_HEIGHT + spanTrackHeight + X_AXIS_HEIGHT + pillsHeight + PADDING_BOTTOM;
  const availableHeight = MIN_POSTER_HEIGHT - headerHeight - profileHeight;
  const cardSize =
    CARD_SIZES.find((size) => stopsHeight(size) <= availableHeight) ?? GROWN_CARD_SIZE;
  const height = headerHeight + Math.max(availableHeight, stopsHeight(cardSize)) + profileHeight;

  // Perfil
  const plotBottom = height - PADDING_BOTTOM - pillsHeight - X_AXIS_HEIGHT - spanTrackHeight;
  const plotTop = plotBottom - PLOT_HEIGHT;
  const kmLabelsTop = plotBottom + spanTrackHeight;
  const axis = altitudeAxis(data.profile);
  const yOf = (altitude: number) =>
    plotBottom - ((altitude - axis.min) / (axis.max - axis.min)) * PLOT_HEIGHT;

  const landmarks = sortedLandmarks.map((landmark, i) => ({
    ...landmark,
    x: pillRows[i].x,
    y: kmLabelsTop + X_AXIS_HEIGHT + pillRows[i].level * (PILL_HEIGHT + PILL_GAP),
    width: pillWidths[i],
    lineX: xOf(landmark.km),
  }));

  const spanBars = spans.map((span, i) => ({
    x: xOf(span.from),
    y: plotBottom + SPAN_TRACK_TOP + lanes[i] * (SPAN_BAR_HEIGHT + SPAN_BAR_GAP),
    width: xOf(span.to) - xOf(span.from),
  }));

  // La fila 0 de cajas justo encima del perfil y las demás por encima
  const stopsBottom = plotTop - STOPS_PLOT_GAP;
  const stopHeight = boxHeight(cardSize);
  const placedStops = placeStops(cardSize).map(({ x, level }, i) => ({
    ...stops[i],
    x,
    y: stopsBottom - (level + 1) * stopHeight - level * BOX_GAP,
    width: boxWidth(stops[i], cardSize, labelWidths[i]),
    height: stopHeight,
    lineX: xOf(stops[i].km),
    pointY: data.profile.length ? yOf(altitudeAt(data.profile, stops[i].km)) : plotBottom,
  }));

  return {
    height,
    maxKm,
    plotTop,
    plotBottom,
    axis,
    spanZones: mergeRanges(spans),
    spanTrackHeight,
    kmLabelsTop,
    spanBars,
    cardSize,
    stops: placedStops,
    landmarks,
  };
};
