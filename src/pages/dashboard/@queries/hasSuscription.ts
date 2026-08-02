import { supabase } from "@src/services/supabase/client";
import { useGetAuthSession } from "@src/services/tanstack/auth/get";
import { queryKeys } from "@src/services/tanstack/keys";
import { useQuery } from "@tanstack/react-query";

export const useFetchHasSuscription = () => {
  const { data } = useGetAuthSession();
  const userId = data?.userId;

  const query = useQuery({
    queryKey: queryKeys({
      userId,
    }).auth.subscription,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("has_active_subscription");
      if (error) {
        console.error(error.message);
        throw new Error(error.message);
      }
      return !!data;
    },
    enabled: !!userId,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutoss
  });

  return query;
};
