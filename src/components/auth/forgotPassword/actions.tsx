import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { fieldIds, useContextFormForgotPassword } from "./form";
import { useNotification } from "@src/store/slices/notification/hook";
import { supabase } from "@src/services/supabase/client";
import { composeRedirectUrl } from "@src/helpers/auth";

export const NavigateLogIn = () => {
  const { navigateTo } = useAppNavigation();
  const { t } = useTranslation();

  const handleRedirect = useCallback(() => {
    navigateTo(APP_ROUTES.LOGIN);
  }, [navigateTo]);

  return (
    <button
      type="button"
      className="text-sm text-nutrition-green hover:underline focus:outline-none"
      onClick={handleRedirect}
    >
      {t("auth:forgotPassword.navigateToLogIn")}
    </button>
  );
};

export const SubmitEmail = () => {
  const { t } = useTranslation();
  const { add, addFormSubmitError } = useNotification();
  const {
    formStateEmail: { form },
  } = useContextFormForgotPassword();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validateForm()) {
      addFormSubmitError();
      return;
    }
    const formState = form.getState();
    const email = formState.email as string;
    if (!email) {
      addFormSubmitError();
      return;
    }
    try {
      console.log("Attempting to send password reset email to:", email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: composeRedirectUrl(APP_ROUTES.FORGOT_PASSWORD),
      });
      if (error) throw error;
      add({
        type: "success",
        message: "auth:forgotPassword.resetEmailSent",
      });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      addFormSubmitError();
      return;
    }
  }, [add, addFormSubmitError, form]);

  return (
    <button
      type="submit"
      className="w-full bg-nutrition-green text-white-green py-2 rounded-md hover:bg-dark-green transition-colors shadow-md"
      onClick={handleSubmit}
    >
      {t("system:messages.submit")}
    </button>
  );
};

export const SubmitPassword = ({ token }: { token: string }) => {
  const { t } = useTranslation();
  const { add, addFormSubmitError } = useNotification();
  const {
    formStateNewPassword: { form },
  } = useContextFormForgotPassword();
  const { navigateTo } = useAppNavigation();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validateForm()) {
      addFormSubmitError();
      return;
    }
    const formState = form.getState();
    const password = formState[fieldIds.newPassword];
    if (!password || typeof password !== "string") {
      addFormSubmitError();
      return;
    }

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: "",
        token,
        type: "recovery",
      });
      if (verifyError) throw verifyError;
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      if (updateError) throw updateError;
      add({
        type: "success",
        message: "auth:forgotPassword.resetSuccess",
      });
      navigateTo(APP_ROUTES.LOGIN, { replace: true });
    } catch (error) {
      console.error("Error resetting password:", error);
      addFormSubmitError();
      return;
    }
  }, [add, addFormSubmitError, form, navigateTo, token]);

  return (
    <button
      type="submit"
      className="w-full bg-nutrition-green text-white-green py-2 rounded-md hover:bg-dark-green transition-colors shadow-md"
      onClick={handleSubmit}
    >
      {t("system:messages.submit")}
    </button>
  );
};
