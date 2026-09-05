import { useState, useCallback } from "react";
import { supabase } from "@src/services/supabase/client";
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import { useNotification } from "@src/store/slices/notification/hook";

export const useRedirectToCheckout = () => {
  const [loading, setLoading] = useState(false);
  const { addMutationError } = useNotification();

  const handleCheckout = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-stripe-checkout",
        {
          body: {
            successUrl: `${window.location.origin}/#${APP_ROUTES.DASHBOARD}`,
            cancelUrl: `${window.location.origin}/#${APP_ROUTES.CANCEL_PAYMENT}`,
          },
        },
      );

      if (error) throw error;
      // A 2xx with no url means the function decided there was nothing to pay
      // for; anything else is a failure the user has to know about, otherwise
      // the button just goes quiet.
      if (!data?.url) throw new Error("Stripe checkout returned no url");

      window.location.href = data.url;
    } catch (err) {
      console.error("Error iniciando el pago:", err);
      addMutationError();
      setLoading(false);
    }
  }, [addMutationError]);

  return { loading, handleCheckout };
};
