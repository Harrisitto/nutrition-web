// Colores del perfil, compartidos por la vista previa del editor y la imagen de la carrera
export const GREEN = "#455e19";
export const BLUE = "#30556b";
export const PURPLE = "#6b2f55";
export const GRID = "rgba(47, 59, 26, 0.2)";
export const INK = "#2b3618";

export const INGREDIENT_CLIP_ID = "race-chart-ingredient-clip";
// Como mucho se dibujan 3 imágenes por km; el resto se ve en el tooltip
export const MAX_IMAGES_PER_KM = 3;

// Separación mínima, en fracción del recorrido, para que dos etiquetas de
// puntos de interés o dos grupos de imágenes no se solapen; si no la hay, el
// segundo pasa a otro carril a otra altura
export const LANDMARK_LABEL_GAP = 0.08;
export const INGREDIENT_GAP = 0.04;
export const MAX_LANES = 2;

// Tamaños (px) de lo que se dibuja en el perfil: la imagen de la carrera es mucho más grande
// que la vista previa del editor
export type ChartSizes = {
  fontSize: number;
  strokeWidth: number;
  yAxisWidth: number;
  marginTop: number;
  ingredientImage: number;
  // Altura de cada carril: imagen de toma o icono + nombre del punto de interés
  ingredientLaneHeight: number;
  landmarkIcon: number;
  landmarkFontSize: number;
  landmarkLaneHeight: number;
};

export const EDITOR_CHART_SIZES: ChartSizes = {
  fontSize: 11,
  strokeWidth: 2,
  yAxisWidth: 52,
  marginTop: 20,
  ingredientImage: 18,
  ingredientLaneHeight: 26,
  landmarkIcon: 18,
  landmarkFontSize: 10,
  landmarkLaneHeight: 38,
};

