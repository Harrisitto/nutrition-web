// Imagen de la carrera: 1920 de ancho y, como mínimo, 1080 de alto (Full HD, 16:9). Si las
// cajas de tomas no caben, crece en alto. Todas las medidas en px.
export const POSTER_WIDTH = 1920;
export const MIN_POSTER_HEIGHT = 1080;
export const PADDING_X = 64;
export const PADDING_TOP = 48;
export const PADDING_BOTTOM = 36;

// Escala tipográfica: cada nivel se distingue claramente del siguiente
export const TITLE_FONT_SIZE = 48;
export const EYEBROW_FONT_SIZE = 16;
export const STAT_FONT_SIZE = 30;
export const SUBTITLE_FONT_SIZE = 24;
export const LABEL_FONT_SIZE = 20;
export const AXIS_FONT_SIZE = 18;

// Colores que solo usa la imagen (los de marca están en chart/constants.ts)
export const AXIS_INK = "rgba(43, 54, 24, 0.55)";
export const SOFT_GRID = "rgba(43, 54, 24, 0.1)";
export const LANDMARK_LINE = "#8fa3b8"; // gray-blue-400
// Relleno del perfil, de arriba abajo: verde de marca al 26% y al 8% sobre el fondo, pero
// opaco para que las franjas de "durante" solo tiñan el cielo y no ensucien la montaña
export const AREA_TOP = "#cad1bd";
export const AREA_BOTTOM = "#ebeee5";
// Fondo: un toque del azul del título arriba a la derecha que se funde en un blanco cálido
export const POSTER_BACKGROUND = [
  "radial-gradient(1100px 520px at 88% -8%, rgba(48, 85, 107, 0.12), transparent 70%)",
  "linear-gradient(180deg, #f1f4ef 0%, #f8f9f6 45%, #fcfcfa 100%)",
].join(", ");

// Cabecera: nombre, distancia, desnivel y fecha a la izquierda; totales a la derecha
export const HEADER_HEIGHT = 128;

// Perfil de altitud: el área de dibujo va de PLOT_LEFT a PLOT_RIGHT y mide PLOT_HEIGHT de alto
export const Y_AXIS_WIDTH = 92;
export const X_AXIS_HEIGHT = 40;
export const PLOT_RIGHT_PADDING = 32;
export const PLOT_HEIGHT = 300;
export const PLOT_LEFT = PADDING_X + Y_AXIS_WIDTH;
export const PLOT_RIGHT = POSTER_WIDTH - PADDING_X - PLOT_RIGHT_PADDING;

// Tomas con "durante": una barra por toma en carriles justo debajo del eje de km
export const SPAN_TRACK_TOP = 10;
export const SPAN_BAR_HEIGHT = 6;
export const SPAN_BAR_GAP = 4;

// Cajas de los km con tomas, encima del perfil: cabecera con el km y las tarjetas en fila
export const BOX_PADDING = 12;
export const BOX_HEADER_HEIGHT = 36;
export const BOX_LABEL_FONT_SIZE = 24;
export const BOX_GAP = 16; // entre cajas, en horizontal y entre filas
export const STOPS_PLOT_GAP = 20; // entre la fila de cajas más baja y el perfil
export const CARD_GAP = 10;
// Lado de las tarjetas, de mayor a menor: se usa el más grande con el que caben todas las cajas
// (la imagen ocupa casi toda la tarjeta: el nombre y las unidades van encima)
export const CARD_SIZES = [104, 92, 82, 72, 64];
// Si ni con las más pequeñas caben, la imagen crece en alto: entonces no compensa encogerlas
export const GROWN_CARD_SIZE = 82;

// Líneas de cada caja a su punto del perfil
export const CONNECTOR_WIDTH = 3;
export const CONNECTOR_DOT_RADIUS = 8;

// Puntos de interés: pastilla con icono y nombre debajo del eje de km
export const PILL_HEIGHT = 44;
export const PILL_ICON = 26;
export const PILL_PADDING_X = 16;
export const PILL_ICON_GAP = 10;
export const PILL_FONT_SIZE = LABEL_FONT_SIZE;
export const PILL_GAP = 12;
