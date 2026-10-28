import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarClock, Check, Pencil, Trash2, X } from "lucide-react";
import FromDate from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { deleteButtonStyle, primaryButtonStyle } from "@src/components/styles";
import type { Tables } from "@src/services/supabase/types";
import {
  useCompleteNutritionistNote,
  useDeleteNutritionistNote,
  useMutateNutritionistNote,
  type NoteFields,
} from "@src/services/tanstack/data/notes";
import {
  listItemStyle,
  pointTagStyle,
  secondaryButtonStyle,
} from "../../races/components/formStyles";
import { NoteFieldsInputs } from "./noteFields";
import { PriorityTag } from "./priorityTag";

type Note = Tables<"client_notes"> & { client?: { name: string } | null };

// Lo guardado de la nota, tal como lo edita el formulario
const toFields = (note: Note): NoteFields => ({
  note: note.note,
  priority: note.priority,
  scheduled_date: note.scheduled_date,
  status: note.status === null ? "note" : "task",
});

const iconButtonStyle =
  "shrink-0 rounded-md p-1.5 text-text-muted transition hover:bg-white-green hover:text-text-title disabled:opacity-50";

// Nota con su prioridad y fecha programada; se puede editar o eliminar (con confirmacion).
// Si es una tarea, el tick la marca como completada (o la vuelve a dejar pendiente)
export const NoteItem = ({ note }: { note: Note }) => {
  const { t } = useTranslation();
  const language = useLanguageCode();
  const [mode, setMode] = useState<"view" | "edit" | "confirmDelete">("view");
  const [fields, setFields] = useState<NoteFields>(() => toFields(note));
  const saveNote = useMutateNutritionistNote();
  const deleteNote = useDeleteNutritionistNote();
  const completeNote = useCompleteNutritionistNote();
  const isTask = note.status !== null;
  const isDone = note.status === "done";

  const startEdit = () => {
    // Parte siempre de lo guardado, no de una edicion cancelada
    setFields(toFields(note));
    setMode("edit");
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (fields.note.trim() === "") return;
    saveNote.mutate(
      { ...fields, id: note.id, note: fields.note.trim(), done: isDone },
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
        {isTask && (
          <button
            type="button"
            role="checkbox"
            aria-checked={isDone}
            className={`flex size-5 shrink-0 items-center justify-center rounded border transition disabled:opacity-50 ${
              isDone
                ? "border-nutrition-green bg-nutrition-green text-white hover:opacity-90"
                : "border-gray-blue-300 bg-gray-blue-50 text-transparent hover:border-nutrition-green hover:text-nutrition-green"
            }`}
            disabled={completeNote.isPending}
            onClick={() => completeNote.mutate({ id: note.id, done: !isDone })}
            aria-label={t(isDone ? "data:notes.markPending" : "data:notes.markDone")}
            title={t(isDone ? "data:notes.markPending" : "data:notes.markDone")}
          >
            <Check size={14} strokeWidth={3} />
          </button>
        )}
        {note.client && <span className={pointTagStyle}>{note.client.name}</span>}
        <PriorityTag priority={note.priority} />
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
      <p
        className={`whitespace-pre-line text-sm ${isDone ? "text-text-muted line-through" : "text-text-title"}`}
      >
        {note.note}
      </p>
      {completeNote.isError && (
        <p className="text-sm text-red-500" role="alert">
          {t("data:notes.statusError")}
        </p>
      )}
      {deleteNote.isError && (
        <p className="text-sm text-red-500" role="alert">
          {t("data:notes.deleteError")}
        </p>
      )}
    </div>
  );
};
