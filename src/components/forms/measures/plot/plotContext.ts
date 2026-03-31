import { createContext, useContext } from "react";

type DateRange = {
  startDate: Date;
  endDate: Date;
};

export type PlotContextType = {
  minDate: Date;
  maxDate: Date;
  dateRange: DateRange;
  focusedDateRange: DateRange;
  setDateRange: (value: DateRange) => void;
  setFocusedDateRange: (value: DateRange) => void;
};

export const PlotContext = createContext<PlotContextType | undefined>(undefined);

export const usePlotContext = () => {
  const context = useContext(PlotContext);
  if (!context) {
    throw new Error("usePlotContext must be used within a PlotProvider");
  }
  return context;
};
