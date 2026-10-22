import useForm from "@src/hooks/form";
import { ValidateMaxLength, ValidateStringRequired } from "@src/hooks/form/service/validate";
import type { InputState } from "@src/hooks/form/types";

export const fieldIds = {
  name: "name",
} as const;

// Static config: useForm recreates the Form instance whenever config changes
const config = [
  {
    id: fieldIds.name,
    type: "text",
    currentValue: "",
    validation: [
      (value) => ValidateStringRequired(value as string),
      (value) => ValidateMaxLength(value as string, 80),
    ],
    inputProps: {
      label: "forms:appointmentThemes.fields.name", // text inputs translate their label
      placeholder: "...",
    },
  } as InputState<"text">,
];

export const useNewAppointmentForm = () => {
  return useForm({ config });
};
