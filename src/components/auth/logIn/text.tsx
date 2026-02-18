import { useTranslation } from "react-i18next"

export const Title = () => {
    const { t } = useTranslation();
    return (
        <h2 className="text-2xl font-bold mb-6 text-center text-text-title">
            {t("auth:logIn.title")}
        </h2>
    )
}