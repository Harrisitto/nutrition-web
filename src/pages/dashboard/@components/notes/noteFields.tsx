import { useTranslation } from "react-i18next";
import InputComponent from "@src/components/input";
import type { NoteFields } from "@src/services/tanstack/data/notes";
import { PriorityInput } from "./priorityInput";

// Una tarea se puede marcar como completada; una nota no
const availableStates: { value: NoteFields["status"]; label: string }[] = [
  { value: "note", label: "data:notes.typeNote" },
  { value: "task", label: "data:notes.typeTask" },
];

// Texto, prioridad, fecha programada y tipo de una nota: lo comparten el alta y la edicion
export const NoteFieldsInputs = ({
  value,
  onChange,
  label,
}: {
  value: NoteFields;
  onChange: (value: NoteFields) => void;
  label?: string;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <InputComponent.Text.MultiLine
        label={label}
        placeholder={t("data:notes.placeholder")}
        rows={4}
        value={value.note}
        onChange={(e) => onChange({ ...value, note: e.target.value })}
      />
      <div className="flex flex-wrap items-end gap-3">
        <PriorityInput
          value={value.priority}
          onChange={(priority) => onChange({ ...value, priority })}
        />
        <InputComponent.Date.SingleDate
          label={t("data:notes.scheduledDate")}
          value={value.scheduled_date ?? ""}
          // Al borrar la fecha el input devuelve "": sin programar
          onChange={(date) => onChange({ ...value, scheduled_date: date || null })}
        />
        <InputComponent.Select.One
          label={t("data:notes.type")}
          options={availableStates.map((state) => ({ value: state.value, label: t(state.label) }))}
          value={value.status}
          onChange={(option) => onChange({ ...value, status: option.value as NoteFields["status"] })}
        />
      </div>
    </div>
  );
};
