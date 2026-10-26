import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarClock, Check, Pencil, Trash2, X } from "lucide-react";
import FromDate from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { deleteButtonStyle, primaryButtonStyle } from "@src/components/styles";
import type { Tables } from "@src/services/supabase/types";
import {
  useDeleteNutritionistNote,
  useMutateNutritionistNote,
  type NoteFields,
  type NotePriority,
} from "@src/services/tanstack/data/notes";
import {
  listItemStyle,
  pointTagStyle,
  secondaryButtonStyle,
} from "../../races/components/formStyles";
import { NoteFieldsInputs } from "./noteFields";
import { PriorityTag } from "./priorityTag";

type Note = Tables<"client_notes"> & { client?: { name: string } | null };

const iconButtonStyle =
  "shrink-0 rounded-md p-1.5 text-text-muted transition hover:bg-white-green hover:text-text-title disabled:opacity-50";

// Nota con su prioridad y fecha programada; se puede editar o eliminar (con confirmacion)
export const NoteItem = ({ note }: { note: Note }) => {
  const { t } = useTranslation();
  const language = useLanguageCode();
  const [mode, setMode] = useState<"view" | "edit" | "confirmDelete">("view");
  const [fields, setFields] = useState<NoteFields>({
    note: note.note,
    priority: note.priority as NotePriority,
    scheduled_date: note.scheduled_date,
  });
  const saveNote = useMutateNutritionistNote();
  const deleteNote = useDeleteNutritionistNote();

  const startEdit = () => {
    // Parte siempre de lo guardado, no de una edicion cancelada
    setFields({
      note: note.note,
      priority: note.priority as NotePriority,
      scheduled_date: note.scheduled_date,
    });
    setMode("edit");
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (fields.note.trim() === "") return;
    saveNote.mutate(
      { ...fields, id: note.id, note: fields.note.trim() },
      { onSuccess: () => setMode("view") },
    );
  };

  if (mode === "edit") {
    return (
      <form onSubmit={onSave} className={`flex flex-col gap-3 ${listItemStyle()}`}>
        <NoteFieldsInputs value={fields} onChange={setFields} />
        {saveNote.isError && (
          <p className="text-sm text-red-500" role="alert">
            {t("data:notes.error")}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" className={secondaryButtonStyle} onClick={() => setMode("view")}>
            <X size={16} />
            {t("data:notes.cancel")}
          </button>
          <button
            type="submit"
            className={primaryButtonStyle}
            disabled={fields.note.trim() === "" || saveNote.isPending}
          >
            <Check size={16} />
            {t("data:notes.save")}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className={`flex flex-col gap-1 ${listItemStyle()}`}>
      <div className="flex flex-wrap items-center gap-2">
        {note.client && <span className={pointTagStyle}>{note.client.name}</span>}
        <PriorityTag priority={note.priority as NotePriority} />
        {note.scheduled_date ? (
          <span className="inline-flex items-center gap-1 text-xs text-text-muted">
            <CalendarClock size={12} />
            {t("data:notes.scheduledFor", {
              date: new FromDate(note.scheduled_date).toLocaleDateString(language, {
                day: "numeric",
                month: "short",
              }),
            })}
          </span>
        ) : (
          <span className="text-xs text-text-muted">
            {new FromDate(note.created_at).toLocaleTimeString(language, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}

        <div className="ml-auto flex items-center gap-1">
          {mode === "confirmDelete" ? (
            <>
              <span className="text-xs text-text-muted">{t("data:notes.confirmDelete")}</span>
              <button
                type="button"
                className={deleteButtonStyle}
                disabled={deleteNote.isPending}
                onClick={() => deleteNote.mutate(note.id)}
                aria-label={t("data:notes.delete")}
                title={t("data:notes.delete")}
              >
                <Check size={14} />
              </button>
              <button
                type="button"
                className={iconButtonStyle}
                onClick={() => setMode("view")}
                aria-label={t("data:notes.cancel")}
                title={t("data:notes.cancel")}
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={iconButtonStyle}
                onClick={startEdit}
                aria-label={t("data:notes.edit")}
                title={t("data:notes.edit")}
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                className={deleteButtonStyle}
                onClick={() => setMode("confirmDelete")}
                aria-label={t("data:notes.delete")}
                title={t("data:notes.delete")}
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
      <p className="whitespace-pre-line text-sm text-text-title">{note.note}</p>
      {deleteNote.isError && (
        <p className="text-sm text-red-500" role="alert">
          {t("data:notes.deleteError")}
        </p>
      )}
    </div>
  );
};
