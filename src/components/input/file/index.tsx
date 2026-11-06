import { useEffect, useRef } from "react";
import { fileInputStyle } from "@src/components/styles";
import { formatFileSize } from "@src/helpers/files";

export interface FileInputProps {
  label?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string; // atributo accept del <input>, p.ej. "application/pdf,image/*"
  hint?: string;   // texto ya traducido bajo el input (tipos permitidos, tamaño máximo...)
}

/**
 * Selector de un único fichero. Es controlado a medias: el navegador no deja escribir
 * en un <input type="file">, así que solo se puede vaciar cuando value pasa a null.
 */
export const FileInput = ({ label, value, onChange, accept, hint }: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Tras un reset del formulario (value = null) vacía también el <input> nativo
  useEffect(() => {
    if (!value && inputRef.current) inputRef.current.value = "";
  }, [value]);

  return (
    <label className="flex flex-col gap-2">
      {label && <span className="text-sm text-gray-blue-600">{label}</span>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className={fileInputStyle}
      />
      {hint && <span className="text-xs text-text-muted">{hint}</span>}
      {value && (
        <span className="text-xs text-text-muted">
          {value.name} · {formatFileSize(value.size)}
        </span>
      )}
    </label>
  );
};
