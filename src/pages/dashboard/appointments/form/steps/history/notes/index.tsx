import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { Circle, CircleCheck, StickyNote } from "lucide-react";
import FromDate from "@src/helpers/dates";
import {
  useFetchNutritionistNotesForDateRange,
  useFetchPendingNutritionistNotes,
  useSearchNutritionistNote,
} from "@src/services/tanstack/data/notes";
import {
  HistorySearch,
  SummaryList,
  type HistoryItem,
  type HistoryPageProps,
} from "../shared/components";
import { AddNoteForm } from "../../../../../@components/notes/addNoteForm";
import { NoteItem } from "../../../../../@components/notes/noteItem";
import { emptyTextStyle } from "../../../../../races/components/formStyles";

type Note = NonNullable<ReturnType<typeof useFetchNutritionistNotesForDateRange>["data"]>[number];

// Las notas van sin acento; las tareas pendientes, en ambar; las completadas, en verde,
// atenuadas y tachadas
const toItems = (notes: Note[], t: TFunction): HistoryItem[] =>
  notes.map((note) => {
    const base = { key: String(note.id), date: new FromDate(note.created_at) };

    if (note.status === null) {
      return {
        ...base,
        tag: t("data:notes.typeNote"),
        icon: <StickyNote size={14} className="shrink-0 text-text-muted" aria-hidden />,
        text: note.note,
      };
    }

    if (note.status === "done") {
      return {
        ...base,
        tag: t("data:notes.statusDone"),
        icon: <CircleCheck size={14} className="shrink-0 text-nutrition-green" aria-hidden />,
        className: "border-l-4 border-l-nutrition-green opacity-75",
        text: <span className="text-text-muted line-through">{note.note}</span>,
      };
    }

    return {
      ...base,
      tag: t("data:notes.statusPending"),
      icon: <Circle size={14} className="shrink-0 text-amber-500" aria-hidden />,
      className: "border-l-4 border-l-amber-400",
      text: note.note,
    };
  });

export const HistoryNotes = ({
  period,
  onSelectWeek,
  appointmentId,
}: HistoryPageProps & { appointmentId: number }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const notesQuery = useFetchNutritionistNotesForDateRange({
    startDate: period.start,
    endDate: period.end,
  });
  const searchQuery = useSearchNutritionistNote({ search });
  const pendingQuery = useFetchPendingNutritionistNotes();

  return (
    <div className="flex flex-col gap-5">
      <AddNoteForm appointmentId={appointmentId} />

      {/* Todas las tareas sin completar, no solo las del periodo: se completan desde aqui */}
      <section className="flex flex-col gap-3">
        <h3 className="font-semibold text-text-title">
          {t("data:appointments.form.history.pendingTasks")}
        </h3>
        {pendingQuery.isError && (
          <p className="text-sm text-red-500" role="alert">
            {t("data:appointments.form.errors.load")}
          </p>
        )}
        {pendingQuery.isSuccess &&
          (pendingQuery.data.length === 0 ? (
            <p className={emptyTextStyle}>{t("data:appointments.form.history.noPendingTasks")}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {pendingQuery.data.map((note) => (
                <li key={note.id}>
                  <NoteItem note={note} />
                </li>
              ))}
            </ul>
          ))}
      </section>

      <HistorySearch
        placeholder={t("data:appointments.form.history.searchNotes")}
        search={search}
        onSearch={setSearch}
        results={searchQuery.data && toItems(searchQuery.data, t)}
        isError={searchQuery.isError}
        period={period}
        onSelectWeek={onSelectWeek}
      />

      <section className="flex flex-col gap-3">
        <h3 className="font-semibold text-text-title">
          {t("data:appointments.form.history.summary")}
        </h3>
        {notesQuery.isError && (
          <p className="text-sm text-red-500" role="alert">
            {t("data:appointments.form.errors.load")}
          </p>
        )}
        {notesQuery.isSuccess && (
          <SummaryList
            items={toItems(notesQuery.data, t)}
            emptyText={t("data:appointments.form.history.noNotes")}
          />
        )}
      </section>
    </div>
  );
};
