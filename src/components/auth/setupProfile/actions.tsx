import { TanstackUser } from "@src/services/tanstack";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const ConfirmSetup = () => {
  const { t } = useTranslation();
  const { mutateAsync, isPending } =
    TanstackUser.Insert.useProfile();

  const handleConfirm = useCallback(() => {
    mutateAsync()
  }, [mutateAsync]);

  return (
    <button
      onClick={handleConfirm}
      disabled={isPending}
      className="px-4 py-2 bg-nutrition-green text-white rounded hover:bg-dark-green disabled:bg-gray-blue-300 transition-colors"
    >
      {t("auth:setupProfile.confirmButton")}
    </button>
  );
};
