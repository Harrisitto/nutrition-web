import { useAppSelector } from "@src/store/store";
import { useState } from "react";
import ModalShell from "./portal";

const TextEditor = ({
  title,
  initialValue,
  placeholder,
  onSave,
  onClose,
  validate,
}: {
  title: string;
  initialValue: string;
  placeholder: string;
  onSave: (value: string) => void;
  onClose: () => void;
  // Devuelve el mensaje de error o null si el valor es válido
  validate?: (value: string) => string | null;
}) => {
  const saveKey = useAppSelector(
    (state) => state.config.keyboardCommands.tableNavigation.saveData,
  );
  const closeKey = useAppSelector(
    (state) => state.config.keyboardCommands.tableNavigation.exitCell,
  );
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    const trimmed = value.trim();
    const validationError = validate?.(trimmed) ?? null;
    if (validationError) {
      setError(validationError);
      return;
    }
    onSave(trimmed);
    onClose();
  };

  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="space-y-3">
        <textarea
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === saveKey && !e.shiftKey) {
              e.preventDefault();
              save();
              return;
            }
            if (e.key === closeKey) {
              e.preventDefault();
              onClose();
            }
          }}
          placeholder={placeholder}
          className="min-h-28 w-full resize-y rounded-lg border border-nutrition-green/30 px-3 py-2 text-sm text-dark-green outline-none focus:border-dark-green"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-nutrition-green/30 px-3 py-2 text-xs font-semibold text-dark-green"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-md bg-dark-green px-3 py-2 text-xs font-semibold text-white"
          >
            Save
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default TextEditor;
