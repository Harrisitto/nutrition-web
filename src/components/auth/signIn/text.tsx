import { useTranslation } from "react-i18next"

export const Title = () => {
    const { t } = useTranslation();
    return (
        <h2 className="text-2xl font-bold mb-6 text-center text-text-title">
            {t("auth:signUp.title")}
        </h2>
    )
}

export const Disclaimer = () => {
    const { t } = useTranslation();
    return (
        <p className="text-sm text-gray-600 mt-4 text-center">
            {t("auth:signUp.disclaimer")}
        </p>
    )
}
