import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FromDate from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { cardStyle } from "@src/components/styles";
import {
  useFetchCalendarAppointments,
  useFetchCalendarNotes,
} from "@src/services/tanstack/user/calendar";
import { secondaryButtonStyle } from "../../races/components/formStyles";
import { groupByDay, monthGrid, shiftMonth } from "./calendarDays";
import { MonthGrid } from "./monthGrid";
import { DayDetail } from "./dayDetail";

// Calendario del nutricionista: consultas pendientes y notas de todos sus clientes
const PageAppointmentsCalendar = () => {
  const { t } = useTranslation();
  const language = useLanguageCode();
  // "YYYY-MM" del mes visible y "YYYY-MM-DD" del dia elegido
  const [month, setMonth] = useState(() => new FromDate().saveMonth());
  const [selectedDay, setSelectedDay] = useState(() => new FromDate().save());

  const { days, start, end } = monthGrid(month);
  const appointmentsQuery = useFetchCalendarAppointments({ startDate: start, endDate: end });
  const notesQuery = useFetchCalendarNotes({ startDate: start, endDate: end });

  const appointmentsByDay = groupByDay(appointmentsQuery.data ?? [], (row) => row.scheduled_on);
  // Las programadas van a su dia; las demas al dia (local) en que se crearon
  const notesByDay = groupByDay(
    notesQuery.data ?? [],
    (row) => row.scheduled_date ?? new FromDate(row.created_at).save(),
  );

  // Un dia de otro mes de la cuadricula lleva a ese mes
  const selectDay = (day: string) => {
    setSelectedDay(day);
    setMonth(day.slice(0, 7));
  };

  const goToToday = () => {
    const today = new FromDate();
    setMonth(today.saveMonth());
    setSelectedDay(today.save());
  };

  return (
    <div className="flex w-full flex-col gap-4 animate-fade-in">
      <header className="border-l-4 border-nutrition-green pl-4">
        <h1 className="text-2xl font-bold text-text-title md:text-3xl">
          {t("data:calendar.title")}
        </h1>
      </header>

      {(appointmentsQuery.isError || notesQuery.isError) && (
        <p className="text-sm text-red-500" role="alert">
          {t("data:calendar.errors.load")}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <section className={`${cardStyle} flex flex-col gap-3 p-3 sm:p-5`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold capitalize text-text-title">
              {new FromDate(`${month}-01`).toLocaleDateString(language, {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className={secondaryButtonStyle}
                onClick={() => setMonth(shiftMonth(month, -1))}
                aria-label={t("data:calendar.previousMonth")}
                title={t("data:calendar.previousMonth")}
              >
                <ChevronLeft size={16} />
              </button>
              <button type="button" className={secondaryButtonStyle} onClick={goToToday}>
                {t("data:calendar.today")}
              </button>
              <button
                type="button"
                className={secondaryButtonStyle}
                onClick={() => setMonth(shiftMonth(month, 1))}
                aria-label={t("data:calendar.nextMonth")}
                title={t("data:calendar.nextMonth")}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <MonthGrid
            month={month}
            days={days}
            appointmentsByDay={appointmentsByDay}
            notesByDay={notesByDay}
            selectedDay={selectedDay}
            onSelectDay={selectDay}
          />
        </section>

        <section className={`${cardStyle} p-3 sm:p-5`}>
          <DayDetail
            day={selectedDay}
            appointments={appointmentsByDay.get(selectedDay) ?? []}
            notes={notesByDay.get(selectedDay) ?? []}
          />
        </section>
      </div>
    </div>
  );
};

export default PageAppointmentsCalendar;
