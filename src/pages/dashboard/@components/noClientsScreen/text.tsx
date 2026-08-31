import { useTranslation } from "react-i18next"

export const Title = () => {
    const { t } = useTranslation()

    return (
        <h1 className="text-2xl font-bold mb-4">
            {t("auth:setupProfile.title")}
        </h1>
    )
}

export const Message = () => {
    const { t } = useTranslation()

    return (
        <p className="text-gray-700 mb-6">
            {t("auth:setupProfile.message")}
        </p>
    )
}