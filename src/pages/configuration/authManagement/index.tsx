import { ConfigurationPages } from "@src/pages/configuration/@components/title";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotification } from "@src/store/slices/notification/hook";
import { supabase } from "@src/services/supabase/client";
import { TitleRegion, TitleUser } from "./components/text";
import { Select } from "./components/language";
import { SignOut } from "./components/buttons";

async function redirectToCustomerPortal() {
  const { data, error } = await supabase.functions.invoke(
    "create-stripe-portal",
    {
      body: { returnUrl: window.location.href }, // Vuelve a la página actual al salirl al salir
    },
  );

  if (error) throw error;
  // The function answers 404 when the user has no Stripe customer yet, which
  // surfaces here as a missing url rather than an error.
  if (!data?.url) throw new Error("Stripe portal returned no url");

  // Redirigir al usuario directamente a Stripe
  window.location.href = data.url;
}

export const ManageAuthState = () => {
  const { t } = useTranslation();
  const { addMutationError } = useNotification();
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  const handleOpenPortal = useCallback(async () => {
    setIsOpeningPortal(true);
    try {
      await redirectToCustomerPortal();
    } catch (err) {
      console.error("Error al abrir el portal de Stripe:", err);
      addMutationError();
      setIsOpeningPortal(false);
    }
  }, [addMutationError]);

  return (
    <ConfigurationPages
      title={t("data:configuration.sections.authManagement.title")}
      description={t("data:configuration.sections.authManagement.description")}
    >
      <div className="max-w-4xl space-y-8 py-4 animate-fade-in">
        <TitleRegion />

        <div className="mt-6">
          <Select />
        </div>

        {/* Sección 2: Gestión de Cuenta / Sesión */}

        <TitleUser />

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-text-muted text-sm md:text-base max-w-md">
            {t("data:configuration.sections.authManagement.signOutWarning")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <SignOut />
            <button
              onClick={handleOpenPortal}
              disabled={isOpeningPortal}
              className="disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:bg-slate-100 transition-all duration-150 shadow-sm w-full sm:w-auto cursor-pointer"
            >
              {t(
                "data:configuration.sections.authManagement.manageSubscription",
              )}
            </button>
          </div>
        </div>
      </div>
    </ConfigurationPages>
  );
};
