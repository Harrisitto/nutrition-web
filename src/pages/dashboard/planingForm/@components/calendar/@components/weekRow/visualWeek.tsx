import { useCallback, useMemo } from "react";
import { useFetchPlanning } from "@src/services/tanstack/user/planing";
import { setSelectedDay } from "@src/store/slices/config/store";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import DayCell from "./day";
import FromDate from "@src/helpers/dates";

interface WeekRowVisualProps {
  days: Date[];
  isDragging?: boolean;
  isOver?: boolean;
}

export const WeekRowVisual = ({
  days,
  isDragging,
  isOver,
}: WeekRowVisualProps) => {
  const dispatch = useAppDispatch();
  const selectedDayStr = useAppSelector((state) => state.config.selectedDay);

  const planningQuery = useFetchPlanning({
    forDate: new FromDate(days[0]),
  });

  // Mapa de datos de planificación O(1) incluyendo flags y el título del evento
  const planningMap = useMemo(() => {
    const map = new Map<
      string,
      {
        flags: { hasEvent: boolean; hasPlaning: boolean; hasTraining: boolean };
        eventTitle?: string;
      }
    >();

    if (planningQuery.data?.length) {
      planningQuery.data.forEach((dayData) => {
        map.set(dayData.date, {
          flags: {
            hasEvent: !!dayData.event,
            hasPlaning: !!dayData.user_planing_meal?.length,
            hasTraining:
              !!dayData.training_hc?.length || !!dayData.training_kcal,
          },
          // Si event es un string o un objeto con propiedad title/name, adáptalo según tu API (ej: dayData.event?.title || dayData.event)
          eventTitle: dayData.event,
        });
      });
    }

    return map;
  }, [planningQuery.data]);

  // SET DE FECHAS SELECCIONADAS
  const selectedWeekSet = useMemo(() => {
    const set = new Set<string>();
    const baseDate = selectedDayStr
      ? new FromDate(selectedDayStr)
      : new FromDate().incrementDay(7).thisMonday();
    const monday = new FromDate(baseDate).thisMonday();

    for (let i = 0; i < 7; i++) {
      set.add(monday.incrementDay(i).save());
    }

    return set;
  }, [selectedDayStr]);

  const handleSelectDay = useCallback(
    (day: Date) => {
      dispatch(setSelectedDay(new FromDate(day).save()));
    },
    [dispatch],
  );

  const todayStr = useMemo(() => new FromDate().save(), []);

  return (
    <div
      className={`flex flex-row items-center justify-between rounded-xl transition-all ${
        isDragging
          ? "opacity-30 border-2 border-dashed border-nutrition-green"
          : ""
      } ${
        isOver
          ? "bg-nutrition-green/30 ring-2 ring-nutrition-green scale-[1.02]"
          : ""
      }`}
    >
      {days.map((day, index) => {
        const dateKey = new FromDate(day).save();
        const isToday = dateKey === todayStr;
        const isSelectedWeek = selectedWeekSet.has(dateKey);
        const dayPlanning = planningMap.get(dateKey);

        return (
          <DayCell
            key={dateKey || index}
            day={day}
            isToday={isToday}
            isSelectedWeek={isSelectedWeek}
            isFirstDay={index === 0}
            isLastDay={index === days.length - 1}
            dayFlags={dayPlanning?.flags}
            eventTitle={dayPlanning?.eventTitle}
            onSelect={handleSelectDay}
          />
        );
      })}
    </div>
  );
};
