import { useState, useCallback } from "react";
import { supabase } from "@src/services/supabase/client";
import { APP_ROUTES } from "@src/hooks/navigation/routes";

export const useRedirectToCheckout = () => {
  const [loading, setLoading] = useState(false);

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

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Error iniciando el pago:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, handleCheckout };
};
