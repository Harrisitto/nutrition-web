export const ALL_IDS = {
  INPUT_PRESET: "preset",
  INPUT_MEAL: "meal",
  HEADER_TRAINING: "headerTraining",
  INPUT_TRAINING_HC: "trainingHc",
  INPUT_TRAINING_KCAL: "trainingKcal",
  HEADER_ENERGY_BALANCE: "headerEnergyBalance",
  DISPLAY_ENERGY_BALANCE: "displayEnergyBalance",
  HEADER_DAILY_MACROS: "headerDailyMacros",
  DISPLAY_CARBS_PER_KG: "displayCarbsPerKg",
  DISPLAY_PROTEIN_PER_KG: "displayProteinPerKg",
  DISPLAY_FAT_PER_KG: "displayFatPerKg",
  HEADER_COMMENTS: "headerComments",
  INPUT_COMMENTS: "inputComments",
  INPUT_EVENTS: "inputEvents",
} as const;

export type AllIdsValues = (typeof ALL_IDS)[keyof typeof ALL_IDS];

/**
 * BASE CLASS FOR CREATING SIMPLE INPUTS AND TEXTS
 */
export class RowInfo {
  private id: AllIdsValues;
  isEditable?: "numeric" | "text" | "meals" | "presets";
  isFullWidth: boolean = false;
  label: string = "";
  resume?: string;
  map: Map<string, string | number> = new Map();

  constructor(props: {
    id: keyof typeof ALL_IDS;
    isEditable?: "numeric" | "text" | "meals" | "presets";
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
  kcal: number;

  constructor(mealId: number, kcal: number) {
    super({
      id: "INPUT_MEAL",
      isEditable: "meals",
      isFullWidth: false,
    });
    this.mealId = mealId;
    this.kcal = kcal;
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

  constructor(trainingHour: number) {
    super({
      id: "INPUT_TRAINING_HC",
      isEditable: "numeric",
      isFullWidth: false,
    });
    this.trainingHour = trainingHour;
  }

  override getCellId(date: string) {
    return `${this.getRowId()}.${date}.${this.trainingHour}`;
  }
}
