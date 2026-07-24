import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { fieldIds, useFormSetupContext } from "./form";
import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import { useGetAuthSession } from "@src/services/tanstack/auth/get";
import { useInsertAuthInfo } from "@src/services/tanstack/auth/mutate";

export const ConfirmSetup = () => {
  const { t } = useTranslation();
  const { data } = useGetAuthSession();
  const userId = data?.userId;
  const { setupForm } = useFormSetupContext();
  const {
    mutateAsync: insertInfo,
    isPending: isPendindInfo,
  } = useInsertAuthInfo();
  const { navigateTo } = useAppNavigation();

  const handleConfirm = useCallback(() => {
    const form = setupForm.form;
    if (!form.validateForm()) return;
    const state = form.getState();
    if (!state[fieldIds.name]) return;
    if (!userId) {
      console.error('nutri id not provided')
      return
    };
    insertInfo(
      {
        nutri_id: userId,
        name: state[fieldIds.name] as string,
      },
      {
        onSuccess: () => {
          navigateTo(APP_ROUTES.DASHBOARD, { replace: true });
        },
      },
    );
  }, [insertInfo, setupForm.form, userId, navigateTo]);

  return (
    <button
      onClick={handleConfirm}
      disabled={isPendindInfo}
      className="px-4 py-2 bg-nutrition-green text-white rounded hover:bg-dark-green disabled:bg-gray-blue-300 transition-colors"
      type="submit"
    >
      {t("auth:setupProfile.confirmButton")}
    </button>
  );
};
