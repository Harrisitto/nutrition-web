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
            <ComponentsAuthManagement.Buttons.SignOut />
        </ConfigurationPages>
    )
}