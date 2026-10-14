// Vista previa sencilla mientras se edita: la imagen buena para el corredor la genera display-gpx
export const GREEN = "#455e19";
export const BLUE = "#30556b";
export const GRID = "rgba(47, 59, 26, 0.2)";
export const INK = "#2b3618";

export const INGREDIENT_CLIP_ID = "race-chart-ingredient-clip";
export const INGREDIENT_IMAGE_SIZE = 18;
// Como mucho se dibujan 3 imágenes por km; el resto se ve en el tooltip
export const MAX_IMAGES_PER_KM = 3;

// Separación mínima, en fracción del recorrido, para que dos etiquetas de
// puntos de interés o dos grupos de imágenes no se solapen; si no la hay, el
// segundo pasa a otro carril a otra altura
export const LANDMARK_LABEL_GAP = 0.08;
export const INGREDIENT_GAP = 0.04;
export const MAX_LANES = 2;
// Altura de cada carril, en px: imagen de toma o icono + nombre del punto de interés
export const INGREDIENT_LANE_HEIGHT = 26;
export const LANDMARK_LANE_HEIGHT = 38;
