import { useTranslation } from "react-i18next"

export const Title = () => {
    const { t } = useTranslation();
    
    return (
        <h1 className="text-2xl font-bold text-center mb-4">
            {t("forms:measures.title")}
        </h1>
    )
}

export const Description = () => {
    const { t } = useTranslation();

    return (
        <p className="text-center text-gray-blue-600 mb-8">
            {t("forms:measures.description")}
        </p>
    )
}