import useForm from "@src/hooks/form";
import { ValidateEmail, ValidateMaxLength, ValidateStringRequired } from "@src/hooks/form/service/validate";
import type { InputState } from "@src/hooks/form/types";

const idEmail = 'email';
const idToken = 'token';

export const fieldIds = {
    email: idEmail,
    token: idToken
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
        id: idToken,
        type: 'text',
        currentValue: '',
        validation: [(text: string) => ValidateMaxLength(text, 6)],
        inputProps: {
          label: 'auth:form.token',
          type: 'text',
          className: '',
          maxLength: 6,
          
        },
        isHidden: true
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
