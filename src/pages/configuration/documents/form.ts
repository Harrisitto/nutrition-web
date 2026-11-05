import useForm from "@src/hooks/form";
import {
  ValidateMaxLength,
  ValidateStringRequired,
} from "@src/hooks/form/service/validate";
import type { InputState } from "@src/hooks/form/types";

// Mismo límite que el CHECK nutritionist_documents_name_check
export const DOCUMENT_NAME_MAX_LENGTH = 255;

export const fieldIds = {
  name: "name",
} as const;

// Solo el nombre: el tipo y el tamaño salen del fichero subido (el formulario no tiene input de
// fichero, ese va aparte en @components/fileInput.tsx).
// Static config: useForm recreates the Form instance whenever config changes
const config = [
  {
    id: fieldIds.name,
    type: "text",
    currentValue: "",
    validation: [
      (value) => ValidateStringRequired(value as string),
      (value) => ValidateMaxLength((value as string).trim(), DOCUMENT_NAME_MAX_LENGTH),
    ],
    inputProps: {
      label: "forms:documents.fields.name",
      placeholder: "...",
    },
  } as InputState<"text">,
] as InputState<"text">[];

export const useNewDocumentForm = () => {
  return useForm({ config });
};
