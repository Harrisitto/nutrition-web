import { useState } from "react";
import ModalShell from "./@portal";
import { useAppSelector } from "@src/store/store";

const getRoundedNumber = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
};

const NumericEditor = ({
  title,
  initialValue,
  onSave,
  onClose,
}: {
  title: string;
  initialValue: number;
  onSave: (value: number) => void;
  onClose: () => void;
}) => {
  const saveKey = useAppSelector(
    (state) => state.config.keyboardCommands.tableNavigation.saveData,
  );
  const closeKey = useAppSelector(
    (state) => state.config.keyboardCommands.tableNavigation.exitCell,
  );
  const [value, setValue] = useState<number>(getRoundedNumber(initialValue));

  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="space-y-3">
        <input
          autoFocus
          type="number"
          min={0}
          value={value > 0 ? value : ""}
          placeholder="0"
          onChange={(e) => setValue(getRoundedNumber(Number(e.target.value)))}
          onKeyDown={(e) => {
            if (e.key === saveKey) {
              e.preventDefault();
              onSave(getRoundedNumber(value));
              onClose();
              return;
            }
            if (e.key === closeKey) {
              e.preventDefault();
              onClose();
            }
          }}
          className="w-full rounded-lg border border-nutrition-green/30 px-3 py-2 text-sm text-dark-green outline-none focus:border-dark-green"
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
              onSave(getRoundedNumber(value));
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

export default NumericEditor;
