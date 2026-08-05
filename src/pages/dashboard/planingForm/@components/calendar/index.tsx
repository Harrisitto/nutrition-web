import { useState, useMemo } from "react";
import { fromDate } from "@src/helpers/dates";
import { useAppSelector } from "@src/store/store";
import { useTranslation } from "react-i18next";
import { useDaysOfWeek } from "@src/hooks/helpers/language";
import { SelectDateHeader } from "./@components/selectDate";
import { CalendarView } from "./@components/weekRow";

const RANGE_WEEKS = 6; // Número de semanas a mostrar en el calendario

export const SelectDateCalendar = () => {
  const { t } = useTranslation();
  const selectedDayStr = useAppSelector((state) => state.config.selectedDay);
  const weekdays = useDaysOfWeek();

  const selectedDate = useMemo(
    () => (selectedDayStr ? new Date(selectedDayStr) : fromDate().nextMonday()),
    [selectedDayStr],
  );

  const [viewDate, setViewDate] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );

  const calendarGrid = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    let dayOfWeek = firstDayOfMonth.getDay() - 1;
    if (dayOfWeek === -1) dayOfWeek = 6;

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const days: Date[][] = [];
    const current = new Date(startDate);

    let i = 0;
    let j = 0;

    while (i < RANGE_WEEKS) {
      while (j < 7) {
        days[i] = days[i] || [];
        days[i][j] = new Date(current);
        current.setDate(current.getDate() + 1);
        j++;
      }
      j = 0;
      i++;
    }

    return days;
  }, [viewDate]);

  return (
    <div className="mt-3 w-fit max-w-full flex-none rounded-2xl border border-nutrition-green/20 bg-white p-4 shadow-sm">
      {/* Header Navegación con Selects Interactivos */}
      <div className="mb-3 flex flex-col items-center justify-between px-1">
        <SelectDateHeader
          viewMonth={(num) => {
            setViewDate(
              (prev) => new Date(prev.getFullYear(), num, prev.getDay()),
            );
          }}
          viewYear={(num) => {
            setViewDate(
              (prev) => new Date(num, prev.getMonth(), prev.getDay()),
            );
          }}
        />
        {/* Días de la semana */}
        <div className="m-3 w-full" />
        <div className="mb-1 grid grid-cols-7 text-center">
          {weekdays.map((day) => (
            <span
              key={day}
              className="w-9 text-xs font-semibold text-dark-green/60"
            >
              {day.slice(0, 3)}
            </span>
          ))}
        </div>
        {/* Grid del Calendario */}
        <CalendarView weeksGrid={calendarGrid} />

        {/* Leyenda */}
        <div className="flex flex-wrap items-center gap-3 border-t border-nutrition-green/10 pt-3 text-xs text-dark-green/75">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-xs bg-nutrition-green/35" />
            {t("data:dashboardTable.calendar.selectedWeek")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            {t("data:dashboardTable.calendar.event")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
            {t("data:dashboardTable.calendar.planing")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            {t("data:dashboardTable.calendar.training")}
          </span>
        </div>
      </div>
    </div>
  );
};
