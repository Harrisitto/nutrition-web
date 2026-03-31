import { useContextMeasuresForm, useMeasuresForm } from "./hook"
import { Context } from "./hook";

export const Provider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const value = useMeasuresForm();

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
}

export const Fields = () => {
    const { Fields } = useContextMeasuresForm();
    return Fields;
}