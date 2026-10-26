import { useTranslation } from "react-i18next";
import { Flag, StickyNote } from "lucide-react";
import FromDate from "@src/helpers/dates";
import { useDaysOfWeek } from "@src/hooks/helpers/language";
import { formatTime, type CalendarAppointment, type CalendarNote } from "./calendarDays";

// Consultas que caben en una celda; el resto se resume en "+N"
const MAX_CHIPS = 2;

export const MonthGrid = ({
  month,
  days,
  appointmentsByDay,
  notesByDay,
  selectedDay,
  onSelectDay,
}: {
  // "YYYY-MM": los dias de otros meses se atenuan
  month: string;
  days: FromDate[];
  appointmentsByDay: Map<string, CalendarAppointment[]>;
  notesByDay: Map<string, CalendarNote[]>;
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
        const notes = notesByDay.get(key) ?? [];
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
              {notes.length > 0 && <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />}
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
              {notes.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
                  <StickyNote size={12} />
                  {t("data:calendar.notesCount", { count: notes.length })}
                  {/* Alguna alta o urgente: el detalle del dia dice cual */}
                  {notes.some((note) => note.priority > 0) && (
                    <Flag
                      size={12}
                      className="text-red-600"
                      aria-label={t("data:calendar.priorityNotes")}
                    />
                  )}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
