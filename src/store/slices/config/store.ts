import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { fromDate, saveDate } from '@src/helpers/dates'


export interface ConfigState {
    sidebarOpen: boolean
    selectedUserId: string | null
    selectedDateRange: [string, string],
    selectedDay: string | null
}

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
        }

    },
})

export const { setSidebarOpen, setSelectedUserId, setSelectedDay } = configSlice.actions
export default configSlice.reducer
