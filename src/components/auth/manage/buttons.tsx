import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../store/store";
import { signOut } from "../../../store/slices/auth/store";
import useAppNavigation from "../../../hooks/navigation";
import { APP_ROUTES } from "../../../hooks/navigation/routes";

export const SignOut = () => {

    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { navigateTo } = useAppNavigation();
    return (
        <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
                dispatch(signOut());
                navigateTo(APP_ROUTES.HOME);

            }}
        >
            {t("auth:management.signOut")}
        </button>
    );
}