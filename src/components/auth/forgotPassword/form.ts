import useForm from "@src/hooks/form";
import { ValidateEmail, ValidateMinLength, ValidateStringRequired } from "@src/hooks/form/service/validate";
import type { InputState } from "@src/hooks/form/types";
import { createContext, useContext } from "react";

const idEmail = 'email';
const idNewPassword = 'newPassword';
const idConfirmNewPassword = 'confirmNewPassword';


export const fieldIds = {
    email: idEmail,
    newPassword: idNewPassword,
    confirmNewPassword: idConfirmNewPassword,
}

const emailConfig = [{
    id: idEmail,
    type: 'text',
    currentValue: '',
    validation: [(value: string) => ValidateEmail(value), ValidateStringRequired],
    inputProps: {
        label: 'auth:form.email',
        type: 'email',
    }
} as InputState<'text'>]

const newPasswordConfig = [
    {
        id: idNewPassword,
        type: 'text',
        currentValue: '',
        validation: [ValidateStringRequired, (value: string) => ValidateMinLength(value, 6)],
        inputProps: {
            label: 'auth:form.newPassword',
            type: 'password',
        }
    } as InputState<'text'>,
    {
        id: idConfirmNewPassword,
        type: 'text',
        currentValue: '',
        validation: [ValidateStringRequired,(value: string) => ValidateMinLength(value, 6)],
        inputProps: {
            label: 'auth:form.confirmNewPassword',
            type: 'password',
        },
        controllers: [{
            subscribedIds: [idNewPassword, idConfirmNewPassword],
            update(newPasswordValue: InputState<'text'>, confirmNewPasswordValue: InputState<'text'>) {
                if (newPasswordValue.currentValue !== confirmNewPasswordValue.currentValue) {
                    confirmNewPasswordValue.errorMsg = 'auth:form.errors.passwordsDoNotMatch';
                    return [confirmNewPasswordValue];
                }
                confirmNewPasswordValue.errorMsg = undefined;
                return [confirmNewPasswordValue];
            },
        }]
    } as InputState<'text'>,
]

export const useFormForgotPassword = () => {
    const formStateEmail = useForm({
        config: emailConfig,
    });
    const formStateNewPassword = useForm({
        config: newPasswordConfig,
    });

    return {
        formStateEmail,
        formStateNewPassword,
    }
}

export type FormForgotPasswordType = ReturnType<typeof useFormForgotPassword>;

export const Context = createContext<FormForgotPasswordType | null>(null);

export const useContextFormForgotPassword = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error('useContextFormForgotPassword must be used within a FormForgotPasswordProvider');
    }
    return context;
}

