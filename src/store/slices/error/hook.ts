import { useAppDispatch, useAppSelector } from "@src/store/store";
import { addRouteToStack, clearError, setError } from "./store";
import type { ErrorPayload } from "./store";

export const throwError = (data: Partial<ErrorPayload>): never => {
    const errorMessage = JSON.stringify({
        message: data.message ?? null,
        action: data.action ?? null,
        component: data.component ?? null,
        severity: data.severity ?? 'medium',
        code: data.code,
    });
    throw new Error(errorMessage);
}

const parseError = (errorStr: string) => {
    return JSON.parse(errorStr) as ErrorPayload;
}


export function useError() {
    const errorData = useAppSelector((state) => state.error);
    const dispatch = useAppDispatch();

    const pushRouteToStack = (route: string | null) => {
        dispatch(addRouteToStack(route));
    }

    const createError = (errorData: Partial<ErrorPayload>) => {
        dispatch(setError(errorData));
    }

    const clear = () => {
        dispatch(clearError());
    }

    const catchError = (fn?: (...args: unknown[]) => void) => {
        try {
            if (fn) fn();
            return true;
        } catch (error) {
            if (!(error instanceof Error)) return;
            const data = parseError(error.message);
            if(data) {
                createError(data);
            }
            return false;
        }
    }

    return {
        ...errorData,
        pushRouteToStack,
        createError,
        catchError,
        clear,
    }
}