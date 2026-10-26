import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { primaryButtonStyle } from "@src/components/styles";
import {
  useMutateNutritionistNote,
  type NoteFields,
} from "@src/services/tanstack/data/notes";
import { useAppSelector } from "@src/store/store";
import { NoteFieldsInputs } from "./noteFields";

type AddNoteFormProps = {
  // null: nota del cliente sin consulta (desde el dashboard)
  appointmentId: number | null;
};

const EMPTY_NOTE: NoteFields = { note: "", priority: 0, scheduled_date: null };

const NoteForm = ({ appointmentId }: AddNoteFormProps) => {
  const { t } = useTranslation();
  const [fields, setFields] = useState<NoteFields>(EMPTY_NOTE);
  const saveNote = useMutateNutritionistNote();
  const canAdd = fields.note.trim() !== "" && !saveNote.isPending;

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdd) return;
    saveNote.mutate(
      { ...fields, id: null, note: fields.note.trim(), appointment_id: appointmentId },
      { onSuccess: () => setFields(EMPTY_NOTE) },
    );
  };

  return (
    <form onSubmit={onAdd} className="flex flex-col gap-3">
      <NoteFieldsInputs label={t("data:notes.new")} value={fields} onChange={setFields} />
      {saveNote.isError && (
        <p className="text-sm text-red-500" role="alert">
          {t("data:notes.error")}
        </p>
      )}
      <button type="submit" disabled={!canAdd} className={`${primaryButtonStyle} self-end`}>
        <Plus size={16} />
        {t("data:notes.add")}
      </button>
    </form>
  );
};

// Nota del nutricionista sobre el cliente seleccionado, ligada o no a una consulta. Al cambiar de
// cliente se vacía: lo escrito para uno no se puede guardar en otro
export const AddNoteForm = (props: AddNoteFormProps) => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);
  return <NoteForm key={clientId ?? ""} {...props} />;
};
