import { supabase } from "@src/services/supabase/client";
import { useGetAuthSession } from "@src/services/tanstack/auth/get";
import { queryKeys } from "@src/services/tanstack/keys";
import { useQuery } from "@tanstack/react-query";

// Stripe confirms the checkout by webhook, and the sync engine only then writes
// the row that `has_active_subscription` reads. Coming back from the payment
// gateway the answer is therefore still `false` for a few seconds, so poll for
// a bounded while instead of leaving a paying user staring at the paywall.
const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 20;

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
    refetchInterval: (query) =>
      query.state.data === false && query.state.dataUpdateCount < MAX_POLLS
        ? POLL_INTERVAL_MS
        : false,
    staleTime: 1000 * 60 * 5, // 5 minutoss
  });

  return query;
};
