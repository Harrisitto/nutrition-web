import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { formatFileSize, fileNameWithoutExtension } from "@src/helpers/files";
import useForm from "@src/hooks/form";
import {
  ValidateFileMaxSize,
  ValidateFileRequired,
  ValidateFileType,
  ValidateMaxLength,
  ValidateStringRequired,
} from "@src/hooks/form/service/validate";
import type { InputState } from "@src/hooks/form/types";
import {
  DOCUMENT_ALLOWED_MIME_TYPES,
  DOCUMENT_MAX_SIZE_BYTES,
} from "@src/services/tanstack/data/documents";

// Mismo límite que el CHECK nutritionist_documents_name_check
export const DOCUMENT_NAME_MAX_LENGTH = 255;

export const fieldIds = {
  file: "file",
  name: "name",
} as const;

// El tipo y el tamaño se comprueban en el cliente con los mismos límites que el bucket, para no
// intentar una subida que el servidor rechazaría
const createFileField = (hint: string) =>
  ({
    id: fieldIds.file,
    type: "file",
    currentValue: null,
    validation: [
      (value) => ValidateFileRequired(value as File | null),
      (value) => ValidateFileType(value as File | null, DOCUMENT_ALLOWED_MIME_TYPES),
      (value) => ValidateFileMaxSize(value as File | null, DOCUMENT_MAX_SIZE_BYTES),
    ],
    inputProps: {
      label: "data:configuration.sections.documents.file",
      accept: DOCUMENT_ALLOWED_MIME_TYPES.join(","),
      hint, // ya traducido: lleva el tamaño máximo como parámetro
    },
    controllers: [
      {
        subscribedIds: [fieldIds.file, fieldIds.name],
        update: (fileField, nameField) => {
          const file = fileField.currentValue as File | null;
          const name = nameField.currentValue as string;
          // Propone el nombre del fichero si el nutricionista aún no ha escrito uno
          if (!file || name.trim()) return [];
          // updateField no valida: limpia el "obligatorio" que pudiera tener el nombre
          return [{ ...nameField, currentValue: fileNameWithoutExtension(file.name), errorMsg: "" }];
        },
      },
    ],
  }) as InputState<"file">;

const createNameField = () =>
  ({
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
  }) as InputState<"text">;

// useForm recrea la instancia de Form cuando cambia config: memo con t como única dependencia
const useConfig = () => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      [
        createFileField(
          t("data:configuration.sections.documents.allowedTypes", {
            max: formatFileSize(DOCUMENT_MAX_SIZE_BYTES),
          }),
        ),
        createNameField(),
      ] as InputState<"file" | "text">[],
    [t],
  );
};

export const useNewDocumentForm = () => {
  const config = useConfig();
  return useForm({ config });
};
