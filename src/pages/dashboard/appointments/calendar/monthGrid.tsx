import { useTranslation } from "react-i18next";
import { Flag, StickyNote } from "lucide-react";
import FromDate from "@src/helpers/dates";
import { useDaysOfWeek } from "@src/hooks/helpers/language";
import { priorityClassName } from "../../@components/notes/priority";
import { formatTime, type CalendarAppointment, type CalendarNote } from "./calendarDays";

// Consultas y notas programadas que caben en una celda; el resto se resume en "+N"
const MAX_CHIPS = 2;
const MAX_NOTE_CHIPS = 2;

// Punto de la celda en movil: el color de la nota programada mas prioritaria
const noteDotClassName = (priority: number) => {
  if (priority >= 8) return "bg-red-500";
  if (priority >= 5) return "bg-amber-500";
  return "bg-text-muted";
};

export const MonthGrid = ({
  month,
  days,
  appointmentsByDay,
  scheduledNotesByDay,
  writtenNotesByDay,
  selectedDay,
  onSelectDay,
}: {
  // "YYYY-MM": los dias de otros meses se atenuan
  month: string;
  days: FromDate[];
  appointmentsByDay: Map<string, CalendarAppointment[]>;
  // Ordenadas de mayor a menor prioridad (como vienen de la query)
  scheduledNotesByDay: Map<string, CalendarNote[]>;
  writtenNotesByDay: Map<string, CalendarNote[]>;
  selectedDay: string;
  onSelectDay: (day: string) => void;
}) => {
  const { t } = useTranslation();
  const daysOfWeek = useDaysOfWeek();
  const today = new FromDate().save();

  return (
    <div className="grid grid-cols-7 gap-1">
      {daysOfWeek.map((name) => (
        <span key={name} className="pb-1 text-center text-xs font-semibold text-text-muted">
          {name.slice(0, 3)}
        </span>
      ))}

      {days.map((day) => {
        const key = day.save();
        const appointments = appointmentsByDay.get(key) ?? [];
        const scheduledNotes = scheduledNotesByDay.get(key) ?? [];
        const writtenNotes = writtenNotesByDay.get(key) ?? [];
        const isSelected = key === selectedDay;
        const isOtherMonth = day.saveMonth() !== month;
        const isToday = key === today;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelectDay(key)}
            aria-pressed={isSelected}
            className={`flex min-h-14 flex-col gap-1 overflow-hidden rounded-lg border p-1 text-left transition-colors sm:min-h-24 sm:p-1.5 ${
              isSelected
                ? "border-nutrition-green bg-white-green"
                : "border-nutrition-green/15 bg-white hover:border-nutrition-green/50"
            } ${isOtherMonth ? "opacity-50" : ""}`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                isToday ? "bg-nutrition-green text-white" : "text-text-title"
              }`}
            >
              {day.getDate()}
            </span>

            {/* En movil solo puntos: no caben los nombres */}
            <span className="flex flex-wrap gap-0.5 sm:hidden">
              {appointments.map((appointment) => (
                <span key={appointment.id} className="h-1.5 w-1.5 rounded-full bg-nutrition-green" />
              ))}
              {scheduledNotes.length > 0 && (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${noteDotClassName(scheduledNotes[0].priority)}`}
                />
              )}
            </span>

            <span className="hidden flex-col gap-0.5 sm:flex">
              {appointments.slice(0, MAX_CHIPS).map((appointment) => (
                <span
                  key={appointment.id}
                  className={`truncate rounded px-1 py-0.5 text-[11px] font-medium ${
                    appointment.status === "in_progress"
                      ? "bg-nutrition-blue/15 text-text-title"
                      : "bg-nutrition-green/15 text-dark-green"
                  }`}
                >
                  {[formatTime(appointment.start_time), appointment.client?.name]
                    .filter(Boolean)
                    .join(" ")}
                </span>
              ))}
              {appointments.length > MAX_CHIPS && (
                <span className="text-[11px] text-text-muted">
                  {t("data:calendar.more", { count: appointments.length - MAX_CHIPS })}
                </span>
              )}
              {scheduledNotes.slice(0, MAX_NOTE_CHIPS).map((note) => (
                <span
                  key={note.id}
                  className={`inline-flex min-w-0 items-center gap-1 rounded px-1 py-0.5 text-[11px] font-medium ${priorityClassName(note.priority)}`}
                  title={note.note}
                >
                  {note.priority > 0 ? (
                    <>
                      <Flag size={10} className="shrink-0" aria-hidden />
                      <span className="shrink-0 font-bold tabular-nums">{note.priority}</span>
                    </>
                  ) : (
                    <StickyNote size={10} className="shrink-0" aria-hidden />
                  )}
                  <span className="truncate">{note.client?.name}</span>
                </span>
              ))}
              {scheduledNotes.length > MAX_NOTE_CHIPS && (
                <span className="text-[11px] text-text-muted">
                  {t("data:calendar.more", { count: scheduledNotes.length - MAX_NOTE_CHIPS })}
                </span>
              )}
              {/* Las escritas sin fecha no se resaltan: solo cuantas hay */}
              {writtenNotes.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
                  <StickyNote size={12} />
                  {t("data:calendar.notesCount", { count: writtenNotes.length })}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
