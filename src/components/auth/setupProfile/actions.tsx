import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { fieldIds, useFormSetupContext } from "./form";
import { useAuthId } from "@src/store/slices/auth/hook";
import { useInsertUserInfo } from "@src/services/tanstack/user/info";

export const ConfirmSetup = () => {
  const { t } = useTranslation();
  const userId = useAuthId();
  const { setupForm } = useFormSetupContext();
  const { mutateAsync: insertInfo, isPending: isPendindInfo } =
    useInsertUserInfo();

  const handleConfirm = useCallback(() => {
    const form = setupForm.form;
    if (!form.validateForm()) return;
    const state = form.getState();
    if (!state[fieldIds.name]) return;
      insertInfo({
        nutri_id: userId,
        name: state[fieldIds.name] as string,
      });
  }, [insertInfo, setupForm.form, userId]);

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
