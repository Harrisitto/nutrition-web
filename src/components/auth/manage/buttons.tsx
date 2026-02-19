import { useAuth } from "@src/store/slices/auth/hook";
import { useTranslation } from "react-i18next";

export const SignOut = () => {

    const { t } = useTranslation();
    const { signOut } = useAuth();

    return (
        <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={signOut}
        >
            {t("auth:management.signOut")}
        </button>
    );
}