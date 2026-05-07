import { TableCommands } from "./keyboard";
import * as Invitations from "./inviteClient";
import { ManageAuthState } from "./authManagement";
import { ConfigurationHeader } from "./default/header";
import { ConfigurationProvider } from "./default/provider";
import { useConfigurationContext } from "./default/context";
import { Recipes } from "./recipes";

const IdxConfiguration = {
    Default: {
        Header: ConfigurationHeader,
        Provider: ConfigurationProvider,
        useContext: useConfigurationContext,
    },
    Keyboard: {
        TableCommands,
    },
    Invitations,
    AuthManagement: {
        ManageAuthState,
    },
    Recipes
}

export default IdxConfiguration;