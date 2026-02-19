import { Context, useContextFormForgotPassword, useFormForgotPassword } from "./form";

export const Provider = ({ children }: { children: React.ReactNode }) => {
    const form = useFormForgotPassword();
    return (
        <Context.Provider value={form}>
            {children}
        </Context.Provider>
    )
}

export const FieldsEmail = () => {
    const { formStateEmail } = useContextFormForgotPassword();
    return formStateEmail.Fields;
}

export const FieldsNewPassword = () => {
    const { formStateNewPassword } = useContextFormForgotPassword();
    return formStateNewPassword.Fields;
}