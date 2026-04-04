import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { fromDate, saveDate } from '@src/helpers/dates'


export interface ConfigState {
    sidebarOpen: boolean
    selectedUserId: string | null
    selectedDateRange: [string, string],
    selectedDay: string | null
    keyboardCommands: {
        tableNavigation: {
            selectCell: string
            saveData: string
            exitCell: string
            moveUp: string
            moveDown: string
            moveLeft: string
            moveRight: string
        }
        selectOptions: {
            optionUp: string
            optionDown: string
            confirmOption: string
            cancelOption: string
        }
        commentsEditor: {
            closeEditor: string
        }
    }
}

type KeyboardCommandsState = ConfigState["keyboardCommands"]
type KeyboardCategory = keyof KeyboardCommandsState
type SetKeyboardCommandPayload = {
    [C in KeyboardCategory]: {
        category: C
        command: keyof KeyboardCommandsState[C]
        key: string
    }
}[KeyboardCategory]

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

const initialState: ConfigState = {
    /**
     * USERS
     */
    selectedUserId: null,
    selectedDateRange: [
        saveDate(fromDate().nextMonday()),
        saveDate(fromDate().nextSunday()),
    ],
    selectedDay: null,
    /**
     * SIDEBAR
     */
    sidebarOpen: false,
    keyboardCommands: {
        ...defaultKeyboardCommands,
    }
}

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setSelectedUserId: (state, action: PayloadAction<string | null>) => {
            state.selectedUserId = action.payload
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload
        },
        setSelectedDay: (state, action: PayloadAction<string>) => {
            state.selectedDay = action.payload
        },
        setKeyboardCommand: (state, action: PayloadAction<SetKeyboardCommandPayload>) => {
            const { category, command, key } = action.payload
            switch (category) {
                case "tableNavigation":
                    state.keyboardCommands.tableNavigation[command] = key
                    break
                case "selectOptions":
                    state.keyboardCommands.selectOptions[command] = key
                    break
                case "commentsEditor":
                    state.keyboardCommands.commentsEditor[command] = key
                    break
            }
        },
        setDefaultKeyboardCommands: (state) => {
            state.keyboardCommands = {
                ...defaultKeyboardCommands,
            }
        }
            

    },
})

export const { setSidebarOpen, setSelectedUserId, setSelectedDay, setKeyboardCommand } = configSlice.actions
export default configSlice.reducer
