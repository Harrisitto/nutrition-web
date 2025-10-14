import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { APP_ROUTES } from '../../hooks/navigation/routes';

export interface ErrorState {
    hasError: boolean;
    message: string | null;
    action: string | null;
    routeStack: string[];
    component: string | null;
    timestamp: number | null;
    severity: 'low' | 'medium' | 'high' | 'critical';
    code?: string | number;
}

export type ErrorPayload = {
    message: string | null;
    action: string | null;
    component?: string | null;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    code?: string | number;
};

// Initial state
const initialState: ErrorState = {
    hasError: false,
    message: null,
    action: null,
    routeStack: [],
    component: null,
    timestamp: null,
    severity: 'medium',
    code: undefined,
}

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<Partial<ErrorPayload>>) => {
            Object.assign(state, {...initialState, ...action.payload});
            state.hasError = true
            state.timestamp = Date.now()

        },
        clearError: (state) => {
            Object.assign(state, initialState);
        },
        addRouteToStack: (state, action: PayloadAction<string | null>) => {
            if (state.routeStack.length >= 5) {
                state.routeStack.shift();
            }
            if (action.payload === null) {
                const route = state.routeStack[state.routeStack.length - 2] || APP_ROUTES.NOT_FOUND;
                state.routeStack.push(route);
                return;
            }
            state.routeStack.push(action.payload);
        }

    },
})

// Export actions
export const {
    setError,
    clearError,
    addRouteToStack
} = errorSlice.actions

export default errorSlice.reducer

