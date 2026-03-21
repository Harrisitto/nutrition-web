import { Context, fieldIds, useContextFormPreset, useFormPreset } from "./hook"

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

export const FieldMeal = () => {
    const formPreset = useContextFormPreset();
    if (!formPreset) return null;
    return formPreset.Fields.filter((field) => fieldIds.meal.isId(field.key ?? ''));
}

export const FieldTrainingHc = () => {
    const formPreset = useContextFormPreset();
    if (!formPreset) return null;
    return formPreset.Fields.filter((field) => fieldIds.trainingHc.isId(field.key ?? ''));
}

export const FieldText = () => {
    const formPreset = useContextFormPreset();
    if (!formPreset) return null;
    return formPreset.Fields.filter((field) => {
        const key = field.key ?? '';
        return key === fieldIds.name || key === fieldIds.comment;
    });
}