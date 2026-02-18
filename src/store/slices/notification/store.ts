import { createSlice } from "@reduxjs/toolkit";

export interface Notification {
    id: string;
    type: "success" | "error" | "info";
    message?: string;
    duration?: number; // Duration in milliseconds
}

export interface NotificationState {
    notifications: Notification[];
}


const initialState: NotificationState = {
    notifications: []
}

const NotificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        add: (state: typeof initialState, action: { payload: Notification }) => {
            if (state.notifications.some(n => n.id === action.payload.id)) {
                return; // Avoid adding duplicate notifications
            }
            state.notifications.push(action.payload);
        },
        remove: (state: typeof initialState, action: { payload: { id: string } }) => {
            state.notifications = state.notifications.filter(n => n.id !== action.payload.id);
        },
        clear: (state: typeof initialState) => {
            state.notifications = [];
        }
    }
});

export const { add, remove, clear } = NotificationSlice.actions;
export default NotificationSlice.reducer;
