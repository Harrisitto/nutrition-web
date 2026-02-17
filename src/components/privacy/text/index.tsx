import { useTranslation } from "react-i18next"

export const Title = () => {
    const { t } = useTranslation();

    return (
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{t("system:privacyPolicy.title")}</h1>
    )
}

export const Description = () => {
    const { t } = useTranslation();
    return (
        <p className="text-base md:text-lg text-gray-700 leading-relaxed">{t("system:privacyPolicy.description")}</p>
    )
}