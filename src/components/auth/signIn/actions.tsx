import { useContextFormSignIn } from "./provider";
import { useNotification } from "@src/store/slices/notification/hook";
import { useTranslation } from "react-i18next";
import { fieldIds } from "./form";
import { useAuth } from "@src/store/slices/auth/hook";
import useAppNavigation from "@src/hooks/navigation";
import { useCallback } from "react";
import { APP_ROUTES } from "@src/hooks/navigation/routes";

export const SubmitForm = () => {
    const { t } = useTranslation();
    const { form } = useContextFormSignIn();
    const { addInvalidForm, add } = useNotification();
    const { signUp } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.validateForm()) {
            addInvalidForm();
            return;
        }
        const formState = form.getState();
        const email = formState[fieldIds.email] as string;
        const password = formState[fieldIds.password] as string;
        if (!email || !password) {
            addInvalidForm();
            return;
        }
        signUp(email, password);
        add({
            type: 'info',
            message: 'auth:verifyEmail.message',
            duration: 10000,
        })
    }

    return (
        <button 
            type="submit" 
            className="w-full bg-nutrition-green text-white-green py-2 rounded-md hover:bg-dark-green transition-colors shadow-md"
            onClick={handleSubmit}
        >
            {t("system:messages.submit")}
        </button>
    )
}

export const RedirectLogIn = () => {
    const { t } = useTranslation();
    const { navigateTo } = useAppNavigation();

    const handleRedirect = useCallback(() => {
        navigateTo(APP_ROUTES.LOGIN);
    }, [navigateTo]);

    return (
        <button
            type="button"
            className="text-sm text-nutrition-green hover:underline focus:outline-none"
            onClick={handleRedirect}
        >
            {t("auth:logIn.navigateToLogIn")}
        </button>
    )

}

export const RedirectForgotPassword = () => {

    const { t } = useTranslation();
    const { navigateTo } = useAppNavigation();

    const handleRedirect = useCallback(() => {
        navigateTo(APP_ROUTES.FORGOT_PASSWORD);
    }, [navigateTo]);

    return (
        <button
            type="button"
            className="text-sm text-nutrition-green hover:underline focus:outline-none"
            onClick={handleRedirect}
        >
            {t("auth:forgotPassword.navigateToForgotPassword")}
        </button>
    )

}