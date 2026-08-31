import { supabase } from "@src/services/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { useAppSelector } from "@src/store/store";
import FromDate from "@src/helpers/dates";

export const useFetchBmr = ({
  startDate,
  endDate,
}: {
  startDate?: FromDate;
  endDate?: FromDate;
} = {}) => {
  const selectedDate = useAppSelector((state) => state.config.selectedDay);
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const start = startDate
    ? startDate.save()
    : new FromDate(selectedDate).thisMonday().save();
  const end = endDate
    ? endDate.save()
    : new FromDate(selectedDate).thisSunday().save();

  const query = useQuery({
    queryKey: queryKeys({
      userId,
    }).user.basalMetabolicRate(new FromDate(start), new FromDate(end)),
    queryFn: async () => {
      if (!userId) throw new Error("No authenticated user found");
      const { data, error } = await supabase.rpc("get_bmr", {
        user_uuid: userId,
        start_date: start,
        end_date: end,
      });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
  return query;
};

export const useFetchUserWeightForDateRange = ({
  startDate,
  endDate,
}: {
  startDate?: FromDate;
  endDate?: FromDate;
} = {}) => {
  const savedDate = useAppSelector((state) => state.config.selectedDay);
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const start = startDate
    ? startDate.save()
    : new FromDate(savedDate).thisMonday().save();
  const end = endDate
    ? endDate.save()
    : new FromDate(savedDate).thisSunday().save();

  const query = useQuery({
    queryKey: queryKeys({
      userId,
    }).user.weightForDateRange(new FromDate(start), new FromDate(end)),
    queryFn: async () => {
      if (!userId) throw new Error("No authenticated user found");
      const { data, error } = await supabase.rpc("get_weight", {
        user_uuid: userId,
        start_date: start,
        end_date: end,
      });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
  return query;
};
