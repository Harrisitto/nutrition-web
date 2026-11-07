import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import FromDate from "@src/helpers/dates";

export interface ConfigState {
  sidebarOpen: boolean;
  selectedUserId: string | null;
  selectedDay: string;
  keyboardCommands: {
    tableNavigation: {
      selectCell: string;
      saveData: string;
      exitCell: string;
      moveUp: string;
      moveDown: string;
      moveLeft: string;
      moveRight: string;
    };
    selectOptions: {
      optionUp: string;
      optionDown: string;
      confirmOption: string;
      cancelOption: string;
    };
    commentsEditor: {
      closeEditor: string;
    };
  };
  showMealsInTable: [number, {
    isVisible: boolean;
    order: number;
  }][];
  showRowsInTable: Record<TableRowKey, boolean>;
  autoAdjustMeals: {
    onTrainingKcalChange: boolean;
    onTrainingCarbsChange: boolean;
  }
}

/**
 * Filas fijas de la tabla de planificación que se pueden ocultar desde la
 * configuración, agrupadas por la sección (cabecera) bajo la que aparecen.
 * Las comidas tienen su propia configuración en `showMealsInTable`.
 */
export const TABLE_ROW_SECTIONS = {
  tools: ["presets", "autoGenerate"],
  training: ["trainingKcal", "trainingHc", "races"],
  energyBalance: ["intakeKcal", "burntKcal", "energyBalance"],
  dailyMacros: ["carbsPerKg", "proteinPerKg", "fatPerKg"],
  comments: ["comments", "events", "links", "documents"],
} as const;

export type TableRowSection = keyof typeof TABLE_ROW_SECTIONS;
export type TableRowKey = (typeof TABLE_ROW_SECTIONS)[TableRowSection][number];

export const defaultRowsVisibility = Object.fromEntries(
  Object.values(TABLE_ROW_SECTIONS)
    .flat()
    .map((row) => [row, true]),
) as Record<TableRowKey, boolean>;

/**
 * Mezcla la visibilidad guardada sobre los valores por defecto: las filas
 * añadidas después de que el usuario guardara aparecen visibles y las que ya
 * no existen se descartan.
 */
export const mergeRowsVisibility = (
  saved: unknown,
): Record<TableRowKey, boolean> => {
  const savedRows = (saved ?? {}) as Partial<Record<string, unknown>>;
  const merged = { ...defaultRowsVisibility };
  for (const row of Object.keys(merged) as TableRowKey[]) {
    const value = savedRows[row];
    if (typeof value === "boolean") merged[row] = value;
  }
  return merged;
};

type KeyboardCommandsState = ConfigState["keyboardCommands"];
type KeyboardCategory = keyof KeyboardCommandsState;
type SetKeyboardCommandPayload = {
  [C in KeyboardCategory]: {
    category: C;
    command: keyof KeyboardCommandsState[C];
    key: string;
  };
}[KeyboardCategory];

export const defaultKeyboardCommands = {
  tableNavigation: {
    selectCell: "Enter",
    saveData: "Enter",
    exitCell: "Escape",
    moveUp: "ArrowUp",
    moveDown: "ArrowDown",
    moveLeft: "ArrowLeft",
    moveRight: "ArrowRight",
  },
  selectOptions: {
    optionUp: "ArrowUp",
    optionDown: "ArrowDown",
    confirmOption: "Enter",
    cancelOption: "Escape",
  },
  commentsEditor: {
    closeEditor: "Escape",
  }
} as const;

/**
 * Merges persisted shortcuts over the defaults, command by command: commands
 * added to the defaults after the user saved keep their default key, and
 * commands that no longer exist are dropped.
 */
export const mergeKeyboardCommands = (
  saved: unknown,
): KeyboardCommandsState => {
  const savedCommands = (saved ?? {}) as Partial<
    Record<KeyboardCategory, Record<string, unknown>>
  >;

  const merged = {} as Record<string, Record<string, string>>;
  for (const [category, commands] of Object.entries(defaultKeyboardCommands)) {
    const savedCategory = savedCommands[category as KeyboardCategory] ?? {};
    merged[category] = {};
    for (const [command, defaultKey] of Object.entries(commands)) {
      const savedKey = savedCategory[command];
      merged[category][command] =
        typeof savedKey === "string" && savedKey ? savedKey : defaultKey;
    }
  }
  return merged as KeyboardCommandsState;
};

const initialState: ConfigState = {
  /**
   * USERS
   */
  selectedUserId: null,
  selectedDay: new FromDate().incrementDay(7).save(), // Fecha inicial: lunes de la semana siguiente
  /**
   * SIDEBAR
   */
  sidebarOpen: false,
  keyboardCommands: {
    ...defaultKeyboardCommands,
  },
  showMealsInTable: [],
  autoAdjustMeals: {
    onTrainingKcalChange: false,
    onTrainingCarbsChange: false,
  },
  showRowsInTable: { ...defaultRowsVisibility },
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setSelectedUserId: (state, action: PayloadAction<string | null>) => {
      state.selectedUserId = action.payload;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setSelectedDay: (state, action: PayloadAction<string>) => {
      state.selectedDay = action.payload;
    },
    setKeyboardCommand: (
      state,
      action: PayloadAction<SetKeyboardCommandPayload>,
    ) => {
      const { category, command, key } = action.payload;
      switch (category) {
        case "tableNavigation":
          state.keyboardCommands.tableNavigation[command] = key;
          break;
        case "selectOptions":
          state.keyboardCommands.selectOptions[command] = key;
          break;
        case "commentsEditor":
          state.keyboardCommands.commentsEditor[command] = key;
          break;
      }
    },
    setDefaultKeyboardCommands: (state) => {
      state.keyboardCommands = {
        ...defaultKeyboardCommands,
      };
    },
    setMealDisplay: (
      state,
      action: PayloadAction<{
        mealId: number;
        isVisible: boolean;
        order: number;
      }>,
    ) => {
      const { mealId, isVisible, order } = action.payload;
      const existingIndex = state.showMealsInTable.findIndex(
        ([id]) => id === mealId,
      );

      if (existingIndex !== -1) {
        // Update existing entry
        state.showMealsInTable[existingIndex] = [mealId, { isVisible, order }];
      } else {
        // Add new entry
        state.showMealsInTable.push([mealId, { isVisible, order }]);
      }
    },
    setAutoAdjustMeals: (
      state,
      action: PayloadAction<{
        onTrainingKcalChange?: boolean;
        onTrainingCarbsChange?: boolean;
      }>,
    ) => {
      const { onTrainingKcalChange, onTrainingCarbsChange } = action.payload;
      if (onTrainingKcalChange !== undefined) {
        state.autoAdjustMeals.onTrainingKcalChange = onTrainingKcalChange;
      }
      if (onTrainingCarbsChange !== undefined) {
        state.autoAdjustMeals.onTrainingCarbsChange = onTrainingCarbsChange;
      }
    },
    setRowVisibility: (
      state,
      action: PayloadAction<{ row: TableRowKey; isVisible: boolean }>,
    ) => {
      const { row, isVisible } = action.payload;
      state.showRowsInTable[row] = isVisible;
    },
  },
});

export const {
  setSidebarOpen,
  setSelectedUserId,
  setSelectedDay,
  setKeyboardCommand,
  setDefaultKeyboardCommands,
  setMealDisplay,
  setAutoAdjustMeals,
  setRowVisibility,
} = configSlice.actions;
export default configSlice.reducer;
