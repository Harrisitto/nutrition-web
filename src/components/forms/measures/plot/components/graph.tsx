import { useFetchUserMeasuresForDateRange } from "@src/services/tanstack/user/measures";
import { usePlotContext } from "../plotContext";

export const Graph = () => {
  const { dateRange } = usePlotContext();
  const data = useFetchUserMeasuresForDateRange({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  return <div>{JSON.stringify(data)}</div>;
};
