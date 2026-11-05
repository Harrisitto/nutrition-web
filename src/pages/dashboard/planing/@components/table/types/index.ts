import type FromDate from "@src/helpers/dates";

export const ALL_IDS = {
  INPUT_PRESET: "preset",
  INPUT_AUTO_GENERATE: "autoGenerate",
  INPUT_MEAL: "meal",
  HEADER_TRAINING: "headerTraining",
  INPUT_TRAINING_HC: "trainingHc",
  INPUT_TRAINING_KCAL: "trainingKcal",
  INPUT_RACES: "races",
  HEADER_ENERGY_BALANCE: "headerEnergyBalance",
  DISPLAY_ENERGY_BALANCE: "displayEnergyBalance",
  HEADER_DAILY_MACROS: "headerDailyMacros",
  DISPLAY_CARBS_PER_KG: "displayCarbsPerKg",
  DISPLAY_PROTEIN_PER_KG: "displayProteinPerKg",
  DISPLAY_FAT_PER_KG: "displayFatPerKg",
  HEADER_COMMENTS: "headerComments",
  INPUT_COMMENTS: "inputComments",
  INPUT_EVENTS: "inputEvents",
  INPUT_CUSTOM_URL: "inputCustomUrl",
  INPUT_DOCUMENT: "inputDocument",
} as const;

export type AllIdsValues = (typeof ALL_IDS)[keyof typeof ALL_IDS];

/**
 * BASE CLASS FOR CREATING SIMPLE INPUTS AND TEXTS
 */
export class RowInfo {
  private id: AllIdsValues;
  isEditable?: "numeric" | "text" | "meals" | "presets" | "action" | "document";
  isFullWidth: boolean = false;
  label: string = "";
  resume?: string;
  map: Map<string, string | number> = new Map();
  // Filas "action" que no abren editor: al abrir la celda se ejecuta esto (p. ej. navegar)
  onAction?: (date: FromDate) => void;

  constructor(props: {
    id: keyof typeof ALL_IDS;
    isEditable?: "numeric" | "text" | "meals" | "presets" | "action" | "document";
    isFullWidth?: boolean;
    resume?: string;
    map?: Map<string, string | number>;
  }) {
    const { id, isEditable, isFullWidth = false, resume, map } = props;
    this.id = ALL_IDS[id];
    this.isEditable = isEditable;
    this.isFullWidth = isFullWidth;
    this.resume = resume;
    if (map) this.map = map;
  }

  addLabel(label: string) {
    this.label = label;
    return this;
  }

  addResume(resume: string) {
    this.resume = resume;
    return this;
  }

  addMap(data: Map<string, string | number> | [string, string | number][]) {
    this.map = data instanceof Map ? data : new Map(data);
    return this;
  }

  addAction(onAction: (date: FromDate) => void) {
    this.onAction = onAction;
    return this;
  }

  getRowId() {
    return this.id;
  }

  getCellId(date: string) {
    return `${this.id}.${date}`;
  }
}

/**
 * CLASS USED WHEN PROGRAMMATIC ROW CREATION FOR MEALS IS NEEDED
 */
export class MealRowInfo extends RowInfo {
  mealId: number;
  // Fecha ("YYYY-MM-DD") -> kcal del tipo de comida de ese dia
  private kcalByDate: Map<string, number>;
  // Fecha ("YYYY-MM-DD") -> nombre de la receta fija de ese dia
  private fixedRecipes: Map<string, string>;
  // Fecha ("YYYY-MM-DD") -> comentario del nutricionista sobre la receta
  private recipeComments: Map<string, string>;

  constructor(
    mealId: number,
    kcalByDate: Map<string, number>,
    fixedRecipes = new Map<string, string>(),
    recipeComments = new Map<string, string>(),
  ) {
    super({
      id: "INPUT_MEAL",
      isEditable: "meals",
      isFullWidth: false,
    });
    this.mealId = mealId;
    this.kcalByDate = kcalByDate;
    this.fixedRecipes = fixedRecipes;
    this.recipeComments = recipeComments;
  }

  getKcal(date: string) {
    return this.kcalByDate.get(date) ?? 0;
  }

  /** Nombre de la receta fija, o undefined si ese dia no hay */
  getFixedRecipe(date: string) {
    return this.fixedRecipes.get(date);
  }

  /** Comentario sobre la receta, o undefined si ese dia no hay */
  getRecipeComment(date: string) {
    return this.recipeComments.get(date);
  }

  override getCellId(date: string) {
    return `${this.getRowId()}.${date}.${this.mealId}`;
  }
}

/**
 * CLASS USED WHEN PROGRAMMATIC ROW CREATION FOR TRAINING HC IS NEEDED
 */
export class TrainingHcRowInfo extends RowInfo {
  trainingHour: number;
  // La fila representa UNA hora de entrenamiento a lo largo de las 7 fechas de
  // la semana, mientras que `training_hc` es un array por fecha. Por eso hace
  // falta el array completo de cada día y no un único `number[]`: sin la fecha
  // no se puede saber sobre qué array hay que escribir.
  private trainingByDate: Map<string, number[]>;

  constructor(
    trainingHour: number,
    trainingByDate: Map<string, number[]> = new Map(),
  ) {
    super({
      id: "INPUT_TRAINING_HC",
      isEditable: "numeric",
      isFullWidth: false,
    });
    this.trainingHour = trainingHour;
    this.trainingByDate = trainingByDate;
  }

  override getCellId(date: string) {
    return `${this.getRowId()}.${date}.${this.trainingHour}`;
  }

  getUpdatedArray(date: string, newValue: number) {
    const updatedArray = [...(this.trainingByDate.get(date) ?? [])];
    // Rellena los huecos intermedios para no generar un array disperso
    while (updatedArray.length <= this.trainingHour) updatedArray.push(0);
    updatedArray[this.trainingHour] = newValue;
    // Recorta los ceros finales para que la tabla no acumule filas vacías
    while (updatedArray.length > 0 && !updatedArray[updatedArray.length - 1]) {
      updatedArray.pop();
    }
    return updatedArray.map((val) => (isNaN(val) ? 0 : val));
  }
}
