import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import InputComponent from "@src/components/input";
import { primaryButtonStyle } from "@src/components/styles";
import { useMutateNutritionistNote } from "@src/services/tanstack/data/notes";

// Nota del nutricionista sobre el cliente, ligada a esta consulta
export const AddNoteForm = ({ appointmentId }: { appointmentId: number }) => {
  const { t } = useTranslation();
  const [note, setNote] = useState("");
  const saveNote = useMutateNutritionistNote();
  const canAdd = note.trim() !== "" && !saveNote.isPending;

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdd) return;
    saveNote.mutate(
      { id: null, note: note.trim(), appointment_id: appointmentId },
      { onSuccess: () => setNote("") },
    );
  };

  return (
    <form onSubmit={onAdd} className="flex flex-col gap-3">
      <InputComponent.Text.MultiLine
        label={t("data:appointments.form.history.newNote")}
        placeholder={t("data:appointments.form.history.notePlaceholder")}
        rows={4}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      {saveNote.isError && (
        <p className="text-sm text-red-500" role="alert">
          {t("data:appointments.form.history.noteError")}
        </p>
      )}
      <button type="submit" disabled={!canAdd} className={`${primaryButtonStyle} self-end`}>
        <Plus size={16} />
        {t("data:appointments.form.history.addNote")}
      </button>
    </form>
  );
};
