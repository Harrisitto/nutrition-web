import { useAppSelector, useAppDispatch } from "..";
import { addRouteToStack, setError } from "../../../store/slices/error";
import type { ErrorPayload } from "../../../store/slices/error";

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


export function useErrorHandling() {
    const errorData = useAppSelector((state) => state.error);
    const dispatch = useAppDispatch();

    const pushRouteToStack = (route: string | null) => {
        dispatch(addRouteToStack(route));
    }

    const createError = (errorData: Partial<ErrorPayload>) => {
        dispatch(setError(errorData));
    }

    const catchError = (fn?: (...args: unknown[]) => void) => {
        try {
            if (fn) fn();
        } catch (error) {
            if (!(error instanceof Error)) return;
            const data = parseError(error.message);
            if(data) {
                createError(data);
            }
        }
    }

    return {
        ...errorData,
        pushRouteToStack,
        createError,
        catchError,
    }
}