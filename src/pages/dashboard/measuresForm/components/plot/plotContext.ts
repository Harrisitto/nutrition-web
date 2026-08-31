import type { useFetchAllMeasures, useFetchUserMeasuresForDateRange } from "@src/services/tanstack/user/measures";
import { createContext, useContext } from "react";
import type FromDate from "../../../../../helpers/dates";

export type DateRange = {
  startDate: FromDate;
  endDate: FromDate;
};

type M = NonNullable<ReturnType<typeof useFetchUserMeasuresForDateRange>["data"]>[number];
type AM = NonNullable<ReturnType<typeof useFetchAllMeasures>["data"]>[number];

export type MesureInfo = {
  visible: boolean;
  colorClass: string;
  data: AM;
};

export type PlotContextType = {
  minDate: Date;
  maxDate: Date;
  dateRange: DateRange;
  focusedDateRange: DateRange;
  measureInfo: Record<number, MesureInfo>;
  focusedMeasures: M[];
  setDateRange: (value: DateRange) => void;
  setFocusedDateRange: (value: DateRange) => void;
  setMeasureVisible: (visibility: { id: number; visible: boolean }[]) => void;
};

export const PlotContext = createContext<PlotContextType | undefined>(undefined);

export const usePlotContext = () => {
  const context = useContext(PlotContext);
  if (!context) {
    throw new Error("usePlotContext must be used within a PlotProvider");
  }
  return context;
};
