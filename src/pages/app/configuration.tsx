import IdxConfiguration from "@src/components/configuration";
import { useTranslation } from "react-i18next";

const ConfigurationContent = () => {
    const { t } = useTranslation();
    const { selectedSection } = IdxConfiguration.Default.useContext();

    return (
        <>
            <IdxConfiguration.Default.Header
                sections={[
                    {
                        key: "inviteClient",
                        label: t("data:configuration.sections.invitations.title"),
                    },
                    {
                        key: "invitedClients",
                        label: t("data:configuration.sections.invitations.invitedTitle"),
                    },
                    {
                        key: "keyboard",
                        label: t("data:configuration.sections.keyboard.tableCommands"),
                    },
                    {
                        key: "authManagement",
                        label: t("data:configuration.sections.authManagement.title"),
                    },
                ]}
            />

            {selectedSection === "inviteClient" ? <IdxConfiguration.Invitations.InviteClient /> : null}
            {selectedSection === "invitedClients" ? <IdxConfiguration.Invitations.InvitedClients /> : null}
            {selectedSection === "keyboard" ? <IdxConfiguration.Keyboard.TableCommands /> : null}
            {selectedSection === "authManagement" ? <IdxConfiguration.AuthManagement.ManageAuthState /> : null}
        </>
    );
};

const PageNutritionistConfiguration = () => {

    return (
        <div className="p-6">
            <IdxConfiguration.Default.Provider>
                <ConfigurationContent />
            </IdxConfiguration.Default.Provider>
        </div>
    )
}

export default PageNutritionistConfiguration;