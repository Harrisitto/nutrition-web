import { useMemo, useState } from "react";
import type { ConfigurationSectionKey } from "./context";
import { ConfigurationContext } from "./context";

export const ConfigurationProvider = ({
  children,
  defaultSection = "inviteClient",
}: {
  children: React.ReactNode;
  defaultSection?: ConfigurationSectionKey;
}) => {
  const [selectedSection, setSelectedSection] = useState<ConfigurationSectionKey>(defaultSection);

  const value = useMemo(
    () => ({
      selectedSection,
      setSelectedSection,
    }),
    [selectedSection],
  );

  return <ConfigurationContext.Provider value={value}>{children}</ConfigurationContext.Provider>;
};
