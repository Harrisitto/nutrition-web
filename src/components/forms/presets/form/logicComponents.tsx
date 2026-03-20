import { Context, useContextFormPreset, useFormPreset } from "./hook"

export const Provider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const value = useFormPreset();

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}

export const FieldByMealId = ({
    mealId,
}: {
    mealId: number;
}) => {
    const formPreset = useContextFormPreset();
    return formPreset?.Fields.find((field) => field.key === mealId.toString()) ?? null;
}

export const RenderFields = () => {
    const formPreset = useContextFormPreset();
    if (!formPreset) return null;
    return formPreset.Fields
}