import { useState } from "react";
import { useTranslation } from "react-i18next";
import FromDate from "@src/helpers/dates";
import {
  useFetchNutritionistNotesForDateRange,
  useSearchNutritionistNote,
} from "@src/services/tanstack/data/notes";
import {
  HistorySearch,
  SummaryList,
  type HistoryItem,
  type HistoryPageProps,
} from "../shared/components";
import { AddNoteForm } from "../../../../../@components/notes/addNoteForm";

type Note = NonNullable<ReturnType<typeof useFetchNutritionistNotesForDateRange>["data"]>[number];

const toItems = (notes: Note[]): HistoryItem[] =>
  notes.map((note) => ({
    key: String(note.id),
    date: new FromDate(note.created_at),
    text: note.note,
  }));

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

  return (
    <div className="flex flex-col gap-5">
      <AddNoteForm appointmentId={appointmentId} />

      <HistorySearch
        placeholder={t("data:appointments.form.history.searchNotes")}
        search={search}
        onSearch={setSearch}
        results={searchQuery.data && toItems(searchQuery.data)}
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
            items={toItems(notesQuery.data)}
            emptyText={t("data:appointments.form.history.noNotes")}
          />
        )}
      </section>
    </div>
  );
};
