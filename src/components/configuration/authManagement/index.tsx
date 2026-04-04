import { ComponentsAuthManagement } from "@src/components/auth/managementIndex"
import { ConfigurationPages } from "../default/pages"
import { useTranslation } from "react-i18next"

export const ManageAuthState = () => {
    const { t } = useTranslation();

    return (
        <ConfigurationPages
            title={t("data:configuration.sections.authManagement.title")}
            description={t("data:configuration.sections.authManagement.description")}
        >
            <div className="rounded-2xl border border-nutrition-green/20 bg-gradient-to-br from-white to-white-green/70 p-5 shadow-md">
                <p className="text-sm text-text-muted">{t("data:configuration.sections.authManagement.comingSoon")}</p>
            </div>
            <ComponentsAuthManagement.Buttons.SignOut />
        </ConfigurationPages>
    )
}