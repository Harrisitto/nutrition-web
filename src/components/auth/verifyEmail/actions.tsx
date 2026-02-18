import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import { supabase } from "@src/services/supabase/client";
import { useAuth } from "@src/store/slices/auth/hook";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const NavigateToDashboard = () => {
  const { t } = useTranslation();
  const { ROUTES, navigateTo } = useAppNavigation();
  const handleClick = useCallback(() => {
    navigateTo(ROUTES.DASHBOARD);
  }, [navigateTo, ROUTES]);

  return (
    <p
      className="mx-auto mt-3 inline-flex items-center justify-center rounded-full border border-nutrition-green/30 px-4 py-2 text-sm font-semibold text-nutrition-green transition-colors hover:border-nutrition-green hover:bg-nutrition-green hover:text-white-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nutrition-green/60 cursor-pointer"
      onClick={handleClick}
    >
      {t("auth:verifyEmail.navigateToDashboard")}
    </p>
  );
};

export const ResendEmail = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const handleClick = useCallback(async () => {
    if (!user?.email) return;
    await supabase.auth.resend({
      type: "signup",
      email: user.email,
      options: {
        emailRedirectTo: `${window.location.origin}/#/${APP_ROUTES.EMAIL_VERIFICATION}`,
      },
    });
  }, [user?.email]);

  if (!user?.email) return null;
  return (
    <p
      className="mx-auto mt-3 inline-flex items-center justify-center rounded-full border border-nutrition-green/30 px-4 py-2 text-sm font-semibold text-nutrition-green transition-colors hover:border-nutrition-green hover:bg-nutrition-green hover:text-white-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nutrition-green/60 cursor-pointer"
      onClick={handleClick}
    >
      {t("auth:verifyEmail.resendEmail")}
    </p>
  );
};
