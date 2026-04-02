import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PlotContext } from "./plotContext";
import { useFetchAllMeasures, useFetchUserMeasuresForDateRange } from "@src/services/tanstack/user/measures";
import type { DateRange, MesureInfo } from "./plotContext";
import { getDeterministicMeasureColorClass } from "../../../../hooks/helpers/colorMapping";

export const PlotProvider = ({ children }: { children: ReactNode }) => {
  const maxDate = useMemo(() => new Date(), []);
  const minDate = useMemo(() => {
    const date = new Date(maxDate);
    date.setMonth(maxDate.getMonth() - 3);
    return date;
  }, [maxDate]);

  const allMeasuresQuery = useFetchAllMeasures();

 

  const [focusedDateRange, setFocusedDateRange] = useState<DateRange>({
    startDate: minDate,
    endDate: maxDate,
  });

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: minDate,
    endDate: maxDate,
  });

  const measuresInRange =  useFetchUserMeasuresForDateRange(dateRange);

  const [measureInfo, setMeasureInfo] = useState<
    Record<number, MesureInfo>
  >({});

  const setMeasureVisible = useCallback((visibility: { id: number; visible: boolean }[]) => {
    setMeasureInfo((prev) => {
      const updated = { ...prev };
      visibility.forEach(({ id, visible }) => {
        updated[id] = {
          ...prev[id],
          visible,
        };
      });
      return updated;
    });
  }, []);

  const focusedMeasures = useMemo(() => {
    if (!measuresInRange.data) return [];

    const start = new Date(
      focusedDateRange.startDate.getFullYear(),
      focusedDateRange.startDate.getMonth(),
      focusedDateRange.startDate.getDate(),
    ).getTime();

    const end = new Date(
      focusedDateRange.endDate.getFullYear(),
      focusedDateRange.endDate.getMonth(),
      focusedDateRange.endDate.getDate(),
      23,
      59,
      59,
      999,
    ).getTime();
    
    return measuresInRange.data.filter((measure) => {
      const info = measureInfo[measure.measure_id];
      if (!info) return false;
      const time = new Date(`${measure.date}T00:00:00`).getTime();
      if (time < start || time > end) return false;
      return info?.visible;
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T00:00:00`).getTime();
      const dateB = new Date(`${b.date}T00:00:00`).getTime();
      return dateA - dateB;
    });
  }, [focusedDateRange.endDate, focusedDateRange.startDate, measureInfo, measuresInRange.data]);


  useEffect(() => {
    if (!allMeasuresQuery.data) return;
    setMeasureInfo((prev) =>
      allMeasuresQuery.data.reduce(
        (acc, measure) => {
          acc[measure.id] = {
            visible: prev[measure.id]?.visible ?? true,
            colorClass: prev[measure.id]?.colorClass ?? getDeterministicMeasureColorClass(measure.id),
            data: measure,
          };
          return acc;
        },
        {} as Record<number, MesureInfo>,
      ),
    );
  }, [allMeasuresQuery.data]);

  const value = useMemo(
    () => ({
      minDate,
      maxDate,
      dateRange,
      focusedDateRange,
      measureInfo,
      focusedMeasures,
      setDateRange,
      setFocusedDateRange,
      setMeasureVisible,
    }),
    [dateRange, focusedDateRange, focusedMeasures, maxDate, measureInfo, minDate, setMeasureVisible],
  );

  return <PlotContext.Provider value={value}>{children}</PlotContext.Provider>;
};
