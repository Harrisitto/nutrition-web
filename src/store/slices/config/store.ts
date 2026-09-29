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
}

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
  },
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
  },
});

export const {
  setSidebarOpen,
  setSelectedUserId,
  setSelectedDay,
  setKeyboardCommand,
  setDefaultKeyboardCommands,
  setMealDisplay,
} = configSlice.actions;
export default configSlice.reducer;
