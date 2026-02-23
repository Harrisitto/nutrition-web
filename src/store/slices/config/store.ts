import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { dateNextMonday, dateNextSunday, saveDate } from '@src/helpers/dates'


export interface ConfigState {
    sidebarOpen: boolean
    selectedUserId: string | null
    selectedDateRange: [string, string],
    selectedDay: string | null
    selectedShortcutId: string
    shortcutGuess: string
    availableShortcuts: string[]
    shortcutGroups: Record<string, {
        name: string
        format: string
        list?: string[]
    }>
    shortcutConfig: {
        isVisible: boolean
        isFocused: boolean
        positionX: number
        positionY: number
    }
}

const initialState: ConfigState = {
    /**
     * USERS
     */
    selectedUserId: null,
    selectedDateRange: [
        saveDate(dateNextMonday()),
        saveDate(dateNextSunday()),
    ],
    selectedDay: null,
    /**
     * SIDEBAR
     */
    sidebarOpen: false,
    /**
     * SHORTCUT CONFIG
     */
    selectedShortcutId: "",
    shortcutGuess: "",
    availableShortcuts: [],
    shortcutGroups: {
        users: {
            name: "system:shortcuts.group.users.title",
            format: "usr-"
        },
    },
    shortcutConfig: {
        isVisible: true,
        isFocused: false,
        positionX: 0,
        positionY: 0,
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
        selectShortcut: (state, action: PayloadAction<[string, string]>) => {
            state.selectedShortcutId = action.payload[0];
            state.shortcutGuess = action.payload[1];
        },
        setAvailableShortcuts: (state, action: PayloadAction<string[]>) => {
            state.availableShortcuts = action.payload;
        },
        changeFormatForGroup: (state, action: PayloadAction<{ groupKey: string, newFormat: string }>) => {
            const { groupKey, newFormat} = action.payload;
            if (state.shortcutGroups[groupKey]) {
                state.shortcutGroups[groupKey].format = newFormat;
            }
        },
        setShortcutConfig: (state, action: PayloadAction<Partial<ConfigState['shortcutConfig']>>) => {
            state.shortcutConfig = {
                ...state.shortcutConfig,
                ...action.payload,
            };
        }

    },
})

export const { setSidebarOpen, setSelectedUserId, selectShortcut, setAvailableShortcuts, changeFormatForGroup, setShortcutConfig } = configSlice.actions
export default configSlice.reducer
