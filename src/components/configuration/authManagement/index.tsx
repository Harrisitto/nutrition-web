import { ComponentsAuthManagement } from "@src/components/auth/managementIndex";
import { ConfigurationPages } from "../default/pages";
import { useTranslation } from "react-i18next";

export const ManageAuthState = () => {
  const { t } = useTranslation();

  return (
    <ConfigurationPages
      title={t("data:configuration.sections.authManagement.title")}
      description={t("data:configuration.sections.authManagement.description")}
    >
      <div className="max-w-4xl space-y-8 py-4 animate-fade-in">

          <ComponentsAuthManagement.Text.TitleRegion />

          <div className="mt-6">
            <ComponentsAuthManagement.Language.Select />
          </div>

        {/* Sección 2: Gestión de Cuenta / Sesión */}

          <ComponentsAuthManagement.Text.TitleUser />

          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-text-muted text-sm md:text-base max-w-md">
              {t("data:configuration.sections.authManagement.signOutWarning")}
            </p>

            <div className="w-full sm:w-auto">
              <ComponentsAuthManagement.Buttons.SignOut />
            </div>
          </div>
        </div>
    </ConfigurationPages>
  );
};
