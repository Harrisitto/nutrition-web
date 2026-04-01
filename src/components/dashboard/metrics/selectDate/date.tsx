import { fromDate, loadDate, saveDate } from "@src/helpers/dates";
import { useFetchPlanning } from "@src/services/tanstack/user/planing";
import { useConfigSelectedDay, useConfigSelectedUserId } from "@src/store/slices/config/hook";
import { setSelectedDay } from "@src/store/slices/config/store";
import { useAppDispatch } from "@src/store/store";
import {
  DayButton,
  DayPicker,
  type DayButtonProps,
  type Modifiers,
} from "react-day-picker";
import "react-day-picker/style.css";
import { useCallback, useMemo } from "react";
import { queryClient } from "@src/services/tanstack/queryClient";
import { queryKeys } from "@src/services/tanstack/keys";
import { useTranslation } from "react-i18next";

const getWeekDays = (date: Date) => {
  const monday = fromDate(date).thisMonday();
  return Array.from({ length: 7 }, (_, i) => fromDate(monday).incrementDay(i));
};

const hasPlanningData = (day: {
  event?: string | null;
  comment?: string | null;
  training_hc?: number[] | null;
  training_kcal?: number | null;
  user_planing_meal?: unknown[] | null;
}) => {
  return {
    hasEvent: !!day.event,
    hasPlaning: !!day.user_planing_meal?.length,
    hasTraining: !!day.training_hc?.length || !!day.training_kcal,
  };
};

type PlanningDay = NonNullable<ReturnType<typeof useFetchPlanning>["data"]>[number];

const CalendarDayButton = (props: DayButtonProps) => {
  const modifiers = props.modifiers as Modifiers & {
    hasEvent?: boolean;
    hasPlaning?: boolean;
    hasTraining?: boolean;
  };

  return (
    <div className="relative">
      <DayButton {...props} />
      {(modifiers.hasEvent || modifiers.hasPlaning || modifiers.hasTraining) && (
        <span className="pointer-events-none absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1">
          {modifiers.hasEvent && (
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          )}
          {modifiers.hasPlaning && (
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          )}
          {modifiers.hasTraining && (
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
          )}
        </span>
      )}
    </div>
  );
};

export const SelectDateHeader = () => {
  const currentDate = useConfigSelectedDay() ?? fromDate().nextMonday();
  const currentYear = new Date().getFullYear();
  const userId = useConfigSelectedUserId();
  const dispatch = useAppDispatch();
  const planningQuery = useFetchPlanning();
  const { t } = useTranslation();

  const selectedWeekDays = useMemo(
    () => getWeekDays(currentDate),
    [currentDate],
  );

  const queryData = queryClient.getQueriesData<PlanningDay[]>({
    queryKey: queryKeys({ userId }).user.planingBase,
  });

  const eventDays = useMemo(() => {
    const mergedByDate = new Map<
      string,
      {
        date: Date;
        hasEvent: boolean;
        hasPlaning: boolean;
        hasTraining: boolean;
      }
    >();

    queryData.forEach(([, weekData]) => {
        if (!weekData?.length) return;
        weekData.forEach((day) => {
          const dayKey = day.date;
          const dayDate = loadDate(dayKey);
          const flags = hasPlanningData(day);
          const existing = mergedByDate.get(dayKey);

          if (!existing) {
            mergedByDate.set(dayKey, {
              date: dayDate,
              ...flags,
            });
            return;
          }

          mergedByDate.set(dayKey, {
            ...existing,
            hasEvent: existing.hasEvent || flags.hasEvent,
            hasPlaning: existing.hasPlaning || flags.hasPlaning,
            hasTraining: existing.hasTraining || flags.hasTraining,
          });
        });
      });

    return Array.from(mergedByDate.values());
  }, [queryData, planningQuery.dataUpdatedAt]);

  const dayModifiers = useMemo(() => {
    const hasEvent: Date[] = [];
    const hasPlaning: Date[] = [];
    const hasTraining: Date[] = [];

    eventDays.forEach((day) => {
      if (day.hasEvent) hasEvent.push(day.date);
      if (day.hasPlaning) hasPlaning.push(day.date);
      if (day.hasTraining) hasTraining.push(day.date);
    });

    return {
      hasEvent,
      hasPlaning,
      hasTraining
    };
  }, [eventDays]);

  const selectWeekForDay = useCallback(
    (day: Date) => {
      dispatch(setSelectedDay(saveDate(fromDate(day).thisMonday())));
    },
    [dispatch],
  );

  return (
      <div className="mt-3 w-fit max-w-full flex-none overflow-x-auto rounded-xl border border-nutrition-green/20 bg-white p-2">
        <DayPicker
          components={{
            DayButton: CalendarDayButton,
          }}
          captionLayout="dropdown-years"
          startMonth={new Date(currentYear - 10, 0)}
          endMonth={new Date(currentYear + 10, 11)}
          reverseYears
          mode="single"
          ISOWeek
          selected={currentDate}
          showOutsideDays
          onDayClick={selectWeekForDay}
          modifiers={{
            selectedWeek: selectedWeekDays,
            hasEvent: dayModifiers.hasEvent,
            hasPlaning: dayModifiers.hasPlaning,
            hasTraining: dayModifiers.hasTraining,
          }}
          modifiersClassNames={{
            selected:
              "bg-transparent text-inherit font-normal rounded-none hover:bg-light-green/40",
            selectedWeek:
              "bg-nutrition-green/25 text-dark-green font-semibold",
          }}
          className="w-fit"
          classNames={{
            day: "h-10 w-10 p-0 text-sm transition-colors hover:bg-light-green/40",
            day_selected: "bg-transparent text-inherit hover:bg-light-green/40",
            day_today: "ring-1 ring-nutrition-green/45",
            weekday: "text-xs font-semibold text-dark-green/70",
            caption_label: "text-sm font-semibold text-dark-green",
            nav_button:
              "h-8 w-8 rounded-md border border-nutrition-green/20 bg-white text-dark-green hover:bg-light-green/40",
            month: "space-y-3",
          }}
        />
        <div className="mt-2 flex flex-wrap items-center gap-4 px-2 text-xs text-dark-green/75">
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-nutrition-green/35" />
            {t("data:dashboardTable.calendar.selectedWeek")}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            {t("data:dashboardTable.calendar.event")}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-cyan-500" />
            {t("data:dashboardTable.calendar.planing")}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            {t("data:dashboardTable.calendar.training")}
          </span>
        </div>
      </div>
  );
};
