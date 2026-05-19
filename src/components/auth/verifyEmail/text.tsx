import { useTranslation } from "react-i18next"

export const Title = () => {
    const { t } = useTranslation();
    return (
        <h2 className="text-2xl font-bold mb-6 text-center text-text-title">
            {t("auth:verifyEmail.title")}
        </h2>
    )
}

export const Sucess = () => {
    const { t } = useTranslation();
    return (
        <p className="text-center text-text-secondary">
            {t("auth:verifyEmail.success")}
        </p>
    )
}

export const Error = () => {
    const { t } = useTranslation();
    return (
        <p className="text-center text-red-500">
            {t("auth:verifyEmail.error")}
        </p>
    )
}

export const MobileVerified = () => {
    const { t } = useTranslation();
    return (
        <p className="text-center text-green-500">
            {t("auth:verifyEmail.mobileVerified")}
        </p>
    )
}
