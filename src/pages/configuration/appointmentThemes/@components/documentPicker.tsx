import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, X } from "lucide-react";
import { iconButtonStyle, primaryButtonStyle } from "@src/components/styles";
import { useFetchMyDocuments, useUploadDocument } from "@src/services/tanstack/data/documents";
import { fieldIds, useNewDocumentForm } from "@src/pages/configuration/documents/form";

// Valor de la opción que abre la subida de un documento nuevo (los ids son uuid: no chocan)
const NEW_DOCUMENT = "__new__";

const selectStyle =
  "w-full rounded-md border border-gray-blue-300 bg-gray-blue-50 px-3 py-2 text-gray-blue-700 focus:border-gray-blue-500 focus:outline-none focus:ring-2 focus:ring-gray-blue-400";

// Documento de un punto: uno de los del nutricionista, ninguno ("") o uno nuevo, que se sube aquí
// mismo (como en Mis documentos) y queda elegido
export const DocumentPicker = ({
  value,
  onChange,
}: {
  value: string; // id del documento, "" = sin documento
  onChange: (documentId: string) => void;
}) => {
  const { t } = useTranslation();
  const documentsQuery = useFetchMyDocuments();
  const [isAdding, setIsAdding] = useState(false);
  // Nombre del recién subido: hasta que llega el refetch de la lista no está entre las opciones
  const [created, setCreated] = useState<{ id: string; name: string } | null>(null);

  const documents = documentsQuery.data ?? [];
  const options = documents.map((document) => ({ value: document.id, label: document.name }));
  if (created && !documents.some((document) => document.id === created.id)) {
    options.unshift({ value: created.id, label: created.name });
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-2">
        <span className="text-sm text-gray-blue-600">
          {t("data:configuration.sections.appointmentThemes.forms.point.document")}
        </span>
        <select
          value={isAdding ? NEW_DOCUMENT : value}
          disabled={documentsQuery.isLoading}
          onChange={(e) => {
            if (e.target.value === NEW_DOCUMENT) {
              setIsAdding(true);
              return;
            }
            setIsAdding(false);
            onChange(e.target.value);
          }}
          className={selectStyle}
        >
          <option value="">{t("data:configuration.sections.appointmentThemes.forms.point.noDocument")}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          <option value={NEW_DOCUMENT}>{t("data:configuration.sections.appointmentThemes.forms.point.newDocument")}</option>
        </select>
      </label>

      {documentsQuery.isError && (
        <p className="text-sm text-red-500">
          {t("data:configuration.sections.documents.loadError")}
        </p>
      )}

      {isAdding && (
        <NewDocumentPanel
          onCancel={() => setIsAdding(false)}
          onCreated={(id, name) => {
            setCreated({ id, name });
            setIsAdding(false);
            onChange(id);
          }}
        />
      )}
    </div>
  );
};

// Subida de un documento nuevo con el formulario de Mis documentos (fichero y nombre). Es un <div>
// y no un <form>: va dentro del formulario del punto y los <form> no se anidan
const NewDocumentPanel = ({
  onCancel,
  onCreated,
}: {
  onCancel: () => void;
  onCreated: (id: string, name: string) => void;
}) => {
  const { t } = useTranslation();
  const documentForm = useNewDocumentForm();
  const uploadDocument = useUploadDocument();

  const onUpload = () => {
    // Los valores viven en la instancia de Form: se leen al pulsar
    if (!documentForm.form.validateForm()) return;
    const state = documentForm.form.getState();
    const name = (state[fieldIds.name] as string).trim();
    uploadDocument.mutate(
      { file: state[fieldIds.file] as File, name },
      { onSuccess: (id) => onCreated(id, name) },
    );
  };

  return (
    <div
      className="flex flex-col rounded-md border border-fade-green bg-white-green/30 p-3"
      // Enter en el nombre enviaría el formulario del punto (sin el documento): sube el documento
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
          e.preventDefault();
          onUpload();
        }
      }}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-semibold text-text-title">
          {t("data:configuration.sections.documents.addTitle")}
        </span>
        <button
          type="button"
          title={t("data:configuration.sections.documents.cancel")}
          aria-label={t("data:configuration.sections.documents.cancel")}
          onClick={onCancel}
          className={iconButtonStyle}
        >
          <X size={16} />
        </button>
      </div>
      {documentForm.Fields}
      {uploadDocument.isError && (
        <p className="text-sm text-red-500">
          {t("data:configuration.sections.documents.saveError")}
        </p>
      )}
      <button
        type="button"
        onClick={onUpload}
        disabled={uploadDocument.isPending}
        className={`${primaryButtonStyle} mt-2`}
      >
        <Upload size={16} />
        {uploadDocument.isPending
          ? t("data:configuration.sections.documents.uploading")
          : t("data:configuration.sections.appointmentThemes.forms.point.uploadAndSelect")}
      </button>
    </div>
  );
};
