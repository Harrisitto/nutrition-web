import useForm from "@src/hooks/form";
import { ValidateEmail, ValidateMinLength, ValidateStringRequired } from "@src/hooks/form/service/validate";
import type { InputState } from "@src/hooks/form/types";

const idEmail = 'email';
const idPassword = 'password';

export const fieldIds = {
    email: idEmail,
    password: idPassword,
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