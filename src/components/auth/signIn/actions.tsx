import { useContextFormSignIn } from "./provider";
import { useNotification } from "@src/store/slices/notification/hook";
import { useTranslation } from "react-i18next";
import { fieldIds } from "./form";
import useAppNavigation from "@src/hooks/navigation";
import { useCallback, useState } from "react";
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import { supabase } from "@src/services/supabase/client";
import { useAppDispatch } from "@src/store/store";
import { signIn } from "@src/store/slices/auth/store";

export const SubmitForm = () => {
  const { t } = useTranslation();
  const { form } = useContextFormSignIn();
  const { addInvalidForm, add, addMutationError } = useNotification();
  const [isPendingOtp, setIsPendingOtp] = useState(false);
  const dispatch = useAppDispatch();

  const revealTokenStep = () => {
    const tokenField = form.getField(fieldIds.token);
    tokenField?.changeState?.({ isHidden: false });
    setIsPendingOtp(true);
  };

  const handleSubmit = async () => {
    if (!form.validateForm()) {
      addInvalidForm();
      return;
    }

    const formState = form.getState();
    const email = formState[fieldIds.email] as string;

    if (!email) {
      addInvalidForm();
      return;
    }

    add({
      type: "info",
      duration: 1000,
    });

    revealTokenStep();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          isNutritionist: true,
          isClient: false,
        },
      },
    });

    if (error) {
      addMutationError();
      const tokenField = form.getField(fieldIds.token);
      tokenField?.changeState?.({ isHidden: true });
      setIsPendingOtp(false);
      return;
    }

    add({
      type: "info",
      message: "auth:signUp.otpDisclaimer",
      duration: 10000,
    });

    setIsPendingOtp(true);
  };

  const handleAlreadyHaveToken = () => {
    const formState = form.getState();
    const email = formState[fieldIds.email] as string;

    if (!email) {
      addInvalidForm();
      return;
    }

    revealTokenStep();
  };

  const handleOtp = () => {
    const formState = form.getState();
    const token = formState[fieldIds.token] as string;
    const email = formState[fieldIds.email] as string;

    if (!token || !email) {
      addInvalidForm();
      return;
    }

    dispatch(signIn({ token, email }));
  };

  if (isPendingOtp) {
    return (
      <button
        type="button"
        className="w-full bg-nutrition-green text-white-green py-2 rounded-md hover:bg-dark-green transition-colors shadow-md"
        onClick={handleOtp}
      >
        {t("system:messages.validate")}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="submit"
        className="w-full bg-nutrition-green text-white-green py-2 rounded-md hover:bg-dark-green transition-colors shadow-md"
        onClick={handleSubmit}
      >
        {t("system:messages.submit")}
      </button>
      <button
        type="button"
        className="w-full rounded-md border border-nutrition-green/30 bg-white px-4 py-2 text-sm font-medium text-nutrition-green transition-colors hover:bg-nutrition-green/5"
        onClick={handleAlreadyHaveToken}
      >
        {t("auth:signUp.alreadyHaveToken")}
      </button>
    </div>
  );
};

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
  );
};

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
  );
};

export const VerifyNutritionistAccount = ({
  confirmNutritionist,
}: {
  confirmNutritionist: () => void;
}) => {
  const { t } = useTranslation();
  const notification = useNotification();
  const fallbackUrl = "https://play.google.com/store/apps/details?id=com.joseptomas.nutritionapp&pcampaignid=web_share";

  return (
    <div className="mt-6">
      <button
        onClick={confirmNutritionist}
        className="w-full bg-nutrition-green text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
      >
        {t("auth:signUp.iAmNutritionist")}
      </button>
      <button
        onClick={() => {
          notification.add({
            type: "info",
            message: "auth:signUp.downloadApp",
            duration: 2000,
          });
          setTimeout(() => {
            window.location.href = fallbackUrl;
          }, 2000);
        }}
        className="w-full mt-4 bg-nutrition-blue text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
      >
        {t("auth:signUp.iAmClient")}
      </button>
    </div>
  );
};