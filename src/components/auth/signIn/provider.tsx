import { createContext, useContext } from "react";
import type { FormLogInType } from "./form";

export const Context = createContext<null | FormLogInType>(null);

export const useContextFormSignIn = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error('useContextFormLogIn must be used within a ProviderFormSignIn');
    }
    return context;
}

