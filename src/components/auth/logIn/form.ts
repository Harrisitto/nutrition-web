import useForm from "@src/hooks/form";
import { ValidateEmail, ValidateMinLength, ValidateStringRequired } from "@src/hooks/form/service/validate";
import type { InputState } from "@src/hooks/form/types";

const idEmail = 'email';
const idPassword = 'password';
const idConfirmPassword = 'confirmPassword';

export const fieldIds = {
    email: idEmail,
    password: idPassword,
    confirmPassword: idConfirmPassword,
}

const config = [
    {
        id: idEmail,
        type: 'text',
        currentValue: '',
        validation: [ValidateEmail, ValidateStringRequired],
        inputProps: {
            label: 'auth:form.email',
            type: 'email',
        }
    } as InputState<'text'>,
    {
        id: idPassword,
        type: 'text',
        currentValue: '',
        validation: [(value) => ValidateMinLength(value as string, 6), ValidateStringRequired],
        inputProps: {
            label: 'auth:form.password',
            type: 'password'
        }
    } as InputState<'text'>,
    {
        id: idConfirmPassword,
        type: 'text',
        validation: [(value) => ValidateMinLength(value as string, 6), ValidateStringRequired],
        inputProps: {
            label: 'auth:form.confirmPassword',
            type: 'password'
        },
        currentValue: '',
        controllers: [
            {
                subscribedIds: [idPassword, idConfirmPassword],
                update: (password: InputState<'text'>, confirm: InputState<'text'>): InputState<'text'>[] => {

                    if (password.currentValue !== confirm.currentValue) {
                        confirm.errorMsg = 'auth:form.passwordsDoNotMatch';
                        return [confirm];
                    }

                    confirm.errorMsg = undefined;
                    return [confirm];
                }
            }
        ]
    } as InputState<'text'>,
]

export const useFormLogIn = () => {
    const formState = useForm({
        config,
    });
    return {
        ...formState
    }
}

export type FormLogInType = ReturnType<typeof useFormLogIn>;