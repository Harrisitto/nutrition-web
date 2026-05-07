import { createContext, useContext } from "react";

export type ConfigurationSectionKey = "inviteClient" | "recipesConfig" | "keyboard" | "authManagement";

export type ConfigurationContextValue = {
  selectedSection: ConfigurationSectionKey;
  setSelectedSection: (section: ConfigurationSectionKey) => void;
};

export const ConfigurationContext = createContext<ConfigurationContextValue | null>(null);

export const useConfigurationContext = () => {
  const context = useContext(ConfigurationContext);

  if (!context) {
    throw new Error("useConfigurationContext must be used inside ConfigurationProvider");
  }

  return context;
};
