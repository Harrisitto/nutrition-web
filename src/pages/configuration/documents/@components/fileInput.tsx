import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { fileInputStyle } from "@src/components/styles";
import { formatFileSize } from "@src/helpers/files";
import {
  DOCUMENT_ALLOWED_MIME_TYPES,
  DOCUMENT_MAX_SIZE_BYTES,
} from "@src/services/tanstack/data/documents";

interface Props {
  file: File | null;
  onChange: (file: File | null) => void;
}

const isAllowedType = (type: string) =>
  (DOCUMENT_ALLOWED_MIME_TYPES as readonly string[]).includes(type);

/**
 * Selector del fichero. Comprueba en el cliente el tipo y el tamaño (los mismos límites que el
 * bucket) para no intentar una subida que el servidor rechazaría
 */
export const DocumentFileInput = ({ file, onChange }: Props) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Al subir el documento el padre pone file a null: vacía también el <input>
  useEffect(() => {
    if (!file && inputRef.current) inputRef.current.value = "";
  }, [file]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setError(null);

    if (selected && !isAllowedType(selected.type)) {
      setError(t("data:configuration.sections.documents.invalidType"));
      e.target.value = "";
      onChange(null);
      return;
    }
    if (selected && selected.size > DOCUMENT_MAX_SIZE_BYTES) {
      setError(
        t("data:configuration.sections.documents.tooLarge", {
          max: formatFileSize(DOCUMENT_MAX_SIZE_BYTES),
        }),
      );
      e.target.value = "";
      onChange(null);
      return;
    }
    onChange(selected);
  };

  return (
    <div className="mb-3 flex flex-col gap-1">
      <label className="text-sm font-medium text-text-body">
        {t("data:configuration.sections.documents.file")}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept={DOCUMENT_ALLOWED_MIME_TYPES.join(",")}
        onChange={handleChange}
        className={fileInputStyle}
      />
      <p className="text-xs text-text-muted">
        {t("data:configuration.sections.documents.allowedTypes", {
          max: formatFileSize(DOCUMENT_MAX_SIZE_BYTES),
        })}
      </p>
      {file && (
        <p className="text-xs text-text-muted">
          {file.name} · {formatFileSize(file.size)}
        </p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
