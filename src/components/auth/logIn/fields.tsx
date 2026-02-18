import { useFormLogIn } from "./form";
import { Context, useContextFormLogIn } from "./provider";

export const Provider = ({ children }: { children: React.ReactNode }) => {
    const form = useFormLogIn();
    return (
        <Context.Provider value={form}>
            {children}
        </Context.Provider>
    )
}

export const Fields = () => {
    const { Fields } = useContextFormLogIn();
    return Fields;
}