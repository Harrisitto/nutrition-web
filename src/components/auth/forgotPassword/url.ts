/*
URL: EXAMPLE:
https://iivsjutltecehnnhmjok.supabase.co/auth/v1/verify
?token=78ef192a94a1d766aee2cd436a64a1575ca51a0f06fb8778b5b0c32a&type=recovery
&redirect_to=https://harrisitto.github.io/nutrition-web/


https://iivsjutltecehnnhmjok.supabase.co/auth/v1/verify
?token=7b43c1ae6758a0df89a38f3e1b5b50eee62a1e71bd3ea88c43123b0b&type=recovery
&redirect_to=https://harrisitto.github.io/nutrition-web/
*/

import { useMemo } from "react";
import { useLocation } from "react-router-dom";

// Parse hash-based search params (if using HashRouter)
export const useRecoveryParams = () => {
  const location = useLocation();
  const params = useMemo(() => {
    const hash = location.hash.substring(1);
    return new URLSearchParams(hash);
  }, [location.hash]);

  return {
    token: params.get('token'),
    type: params.get('type'),
    redirectTo: params.get('redirect_to'),
  };
};

