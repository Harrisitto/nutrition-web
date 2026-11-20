import { useAppDispatch, useAppSelector } from "@src/store/store"
import { add, remove, type Notification } from "./store";
import { useCallback } from "react";
import { isNoSubscriptionError } from "@src/services/supabase/errors";

const useAddNotification = () => {
    const dispatch = useAppDispatch();
    return useCallback((notification: Omit<Notification, "id">) => {
        const debounceId = Math.round(Date.now() / 1000);
        const id = `${debounceId}-${notification.type}`;
        const duration = notification.duration || 3000; // Default duration 3 seconds
        dispatch(add({ ...notification, id, duration }));
        const timeOutId = setTimeout(() => {
            dispatch(remove({ id }));
            clearTimeout(timeOutId);
        }, duration);
    }, [dispatch]);

}

export const useNotificationErrorQuery = () => {
    const add = useAddNotification();
    return () => add({
        type: "error",
    });
}


export const useNotification = () => {
    const dispatch = useAppDispatch();
    const notification = useAppSelector((state) => state.notification);

    const addNotification = useCallback((notification: Omit<Notification, "id">) => {
        const debounceId = Math.round(Date.now() / 1000);
        const id = `${debounceId}-${notification.type}`;
        const duration = notification.duration || 3000; // Default duration 3 seconds
        dispatch(add({ ...notification, id, duration }));
        const timeOutId = setTimeout(() => {
            dispatch(remove({ id }));
            clearTimeout(timeOutId);
        }, duration);
    }, [dispatch]);

    const addFormSubmitSucess = useCallback(() => {
        addNotification({
            type: "success",
            message: "system:messages.success",
        });
    }, [addNotification]);

    const addFormSubmitError = useCallback(() => {
        addNotification({
            type: "error",
            message: "system:messages.error",
        });
    }, [addNotification]);

    const addInvalidForm = useCallback(() => {
        addNotification({
            type: "error",
            message: "system:messages.invalidForm",
        });
    }, [addNotification]);

    const addErrorIcon = useCallback(() => {
        addNotification({
            type: "error",
        });
    }, [addNotification]);

    const addSuccessIcon = useCallback(() => {
        addNotification({
            type: "success",
        });
    }, [addNotification]);

    // Con el error de la mutacion, el de sin suscripcion (55000) tiene su propio mensaje
    const addMutationError = useCallback((error?: unknown) => {
        addNotification({
            type: "error",
            message: isNoSubscriptionError(error) ? "system:messages.noSubscription" : "system:messages.mutationError",
        });
    }, [addNotification]);


    return {
        ...notification,
        add: addNotification,
        addFormSubmitSucess,
        addFormSubmitError,
        addInvalidForm,
        addErrorIcon,
        addSuccessIcon,
        addMutationError,
    }
}
