import { useAppSelector } from "@src/store/store";
import { useState } from "react";
import ModalShell from "./@portal";

const TextEditor = ({
  title,
  initialValue,
  placeholder,
  onSave,
  onClose,
}: {
  title: string;
  initialValue: string;
  placeholder: string;
  onSave: (value: string) => void;
  onClose: () => void;
}) => {
  const saveKey = useAppSelector(
    (state) => state.config.keyboardCommands.tableNavigation.saveData,
  );
  const closeKey = useAppSelector(
    (state) => state.config.keyboardCommands.tableNavigation.exitCell,
  );
  const [value, setValue] = useState(initialValue);

  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="space-y-3">
        <textarea
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === saveKey && !e.shiftKey) {
              e.preventDefault();
              onSave(value.trim());
              onClose();
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
            onClick={() => {
              onSave(value.trim());
              onClose();
            }}
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
