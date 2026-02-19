import { useTranslation } from "react-i18next";

export const Title = () => {
    const { t } = useTranslation();
    return (
        <h2 className="text-2xl font-bold mb-4">
            {t('auth:forgotPassword.title')}
        </h2>
    )
}

export const MessageEmail = () => {
    const { t } = useTranslation();
    return (
        <p className="mb-6">
            {t('auth:forgotPassword.messageEmail')}
        </p>
    )
}

export const MessageNewPassword = () => {
    const { t } = useTranslation();
    return (
        <p className="mb-6">
            {t('auth:forgotPassword.messageNewPassword')}
        </p>
    )
}