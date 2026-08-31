import useForm from "@src/hooks/form";
import { ValidateStringRequired } from "@src/hooks/form/service/validate";
import type { InputState } from "@src/hooks/form/types";
import { createContext, useContext } from "react";

export const idName = "name"

export const fieldIds = {
    name: idName,
}

const config = [{
    id: idName,
    name: "name",
    type: "text",
    currentValue: "",
    validation: [
        ValidateStringRequired
    ],
    inputProps: {
        label: "auth:setupProfile.inputName",
        placeholder: "...",
    },
} as InputState<'text'>]

const useFormSetup = () => {
    return useForm({config });
}

const useFormSetupContext = () => {
    const formData = useContext(Context);
    if (!formData) {
        throw new Error("useFormSetupContext must be used within a FormSetupProvider");
    }
    return {
        setupForm: formData,
    };
}


const Context = createContext<ReturnType<typeof useFormSetup> | null>(null);


export {
    useFormSetup,
    useFormSetupContext,
    Context,
}