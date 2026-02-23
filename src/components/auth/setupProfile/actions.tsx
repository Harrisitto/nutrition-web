import { TanstackUser } from "@src/services/tanstack";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { fieldIds, useFormSetupContext } from "./form";
import { useAuthId } from "@src/store/slices/auth/hook";

export const ConfirmSetup = () => {
  const { t } = useTranslation();
  const userId = useAuthId();
  const { setupForm } = useFormSetupContext();
  const { mutateAsync: insertProfile, isPending: isPendingProfile } =
    TanstackUser.Insert.useProfile();
  const { mutateAsync: insertInfo, isPending: isPendindInfo } =
    TanstackUser.Insert.useInfo();

  const handleConfirm = useCallback(() => {
    const form = setupForm.form;
    if (!form.validateForm()) return;
    const state = form.getState();
    if (!state[fieldIds.name]) return;
    insertProfile().then(() => {
      insertInfo({
      user_id: userId,
      name: state[fieldIds.name] as string,
    });
    });
  }, [insertInfo, insertProfile]);

  return (
    <button
      onClick={handleConfirm}
      disabled={isPendingProfile || isPendindInfo}
      className="px-4 py-2 bg-nutrition-green text-white rounded hover:bg-dark-green disabled:bg-gray-blue-300 transition-colors"
      type="submit"
    >
      {t("auth:setupProfile.confirmButton")}
    </button>
  );
};
