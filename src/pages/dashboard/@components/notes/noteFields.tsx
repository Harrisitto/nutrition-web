import { useTranslation } from "react-i18next";
import InputComponent from "@src/components/input";
import {
  NOTE_PRIORITIES,
  type NoteFields,
  type NotePriority,
} from "@src/services/tanstack/data/notes";
import { PRIORITY_STYLES } from "./priority";

// Texto, prioridad y fecha programada de una nota: lo comparten el alta y la edicion
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
  const options = NOTE_PRIORITIES.map((priority) => ({
    value: String(priority),
    label: t(`data:notes.priorities.${PRIORITY_STYLES[priority].key}`),
  }));

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
        <InputComponent.Select.One
          label={t("data:notes.priority")}
          options={options}
          value={String(value.priority)}
          onChange={(option) =>
            onChange({ ...value, priority: Number(option.value) as NotePriority })
          }
        />
        <InputComponent.Date.SingleDate
          label={t("data:notes.scheduledDate")}
          value={value.scheduled_date ?? ""}
          // Al borrar la fecha el input devuelve "": sin programar
          onChange={(date) => onChange({ ...value, scheduled_date: date || null })}
        />
      </div>
    </div>
  );
};
