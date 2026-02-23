import { Context, useFormSetup, useFormSetupContext } from "./form";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const formData = useFormSetup();

  return <Context.Provider value={formData}>{children}</Context.Provider>;
};

export const Fields = () => {
    const { setupForm } = useFormSetupContext();
    return setupForm.Fields

}
