import { useTranslation } from "react-i18next";
import { useSignOut } from "@src/services/tanstack/auth/mutate";
import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES } from "@src/hooks/navigation/routes";

export const SignOut = () => {

  const { t } = useTranslation();
  const { mutate } = useSignOut();
  const { navigateTo } = useAppNavigation()
    return (
        <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          mutate(undefined, {
            onSuccess: () => {
              navigateTo(APP_ROUTES.HOME);
            }
          });
        }}
        >
            {t("auth:management.signOut")}
        </button>
    );
}

export const DeleteAccount = () => {
 // const { t } = useTranslation();
  //const { mutate } = useDeleteAccount();
  //
  return null;

}
