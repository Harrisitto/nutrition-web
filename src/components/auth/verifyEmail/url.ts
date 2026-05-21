import { supabase } from "@src/services/supabase/client";
import { setSession } from "@src/store/slices/auth/store";
import { useAppDispatch } from "@src/store/store";
import { useEffect, useMemo, useState } from "react";

const parseVerificationTokenFromURL = (url: string) => {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);

    // Hash can include a route and/or params: "#/verify-email?isAppVerified=true"
    // or "#/verify-email#access_token=..." or both in one hash.
    const rawHash = urlObj.hash.startsWith("#")
      ? urlObj.hash.slice(1)
      : urlObj.hash;
    const hashSegments = rawHash.split("#").filter(Boolean);

    hashSegments.forEach((segment) => {
      const segmentQuery = segment.includes("?")
        ? (segment.split("?").pop() ?? "")
        : segment;
      const hashParams = new URLSearchParams(
        segmentQuery.startsWith("?") ? segmentQuery.slice(1) : segmentQuery,
      );

      hashParams.forEach((value, key) => {
        params.set(key, value);
      });
    });

    return params;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};

const getBooleanParam = (
  token: URLSearchParams | null,
  key: string,
  fallback: boolean,
) => {
  if (!token) return fallback;
  const value = token.get(key);
  if (value === null) return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

const getStringParam = (
  token: URLSearchParams | null,
  key: string,
  fallback: string,
) => {
  if (!token) return fallback;
  const value = token.get(key);
  return value === null ? fallback : value;
};

//https://ezfood.fit/#/verify-email
// ?shouldRedirectToApp=false
// &isNutritionistAccount=true#
// &access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6InRCMFFBVmFJVFRCaDgxREoiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2lpdnNqdXRsdGVjZWhubmhtam9rLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI2OWFiMmNmMy0yMTJmLTRkYzctODFiZS1jYWU1OTJhOGUyZDkiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzc5Mzg3MTM5LCJpYXQiOjE3NzkzODM1MzksImVtYWlsIjoiam9zZXB0b21hc2p1YW5AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6Impvc2VwdG9tYXNqdWFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjY5YWIyY2YzLTIxMmYtNGRjNy04MWJlLWNhZTU5MmE4ZTJkOSJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im90cCIsInRpbWVzdGFtcCI6MTc3OTM4MzUzOX1dLCJzZXNzaW9uX2lkIjoiN2NiZTQ5MDYtYzk3Ni00MjQyLThmZTgtMTNhODY0NWYzODM0IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.0uYih7qCV5WlbpEDfgWPvMFHub8ECyvuUwDAEPHiJ7o
// &expires_at=1779387139
// &expires_in=3600
// &refresh_token=xomwziufncav
// &sb=
// &token_type=bearer&type=signup

export const useVerificationToken = () => {
  const token = useMemo(
    () => parseVerificationTokenFromURL(window.location.href),
    [],
  );
  const shouldRedirectToApp = useMemo(
    () => getBooleanParam(token, "shouldRedirectToApp", true),
    [token],
  );
  const isNutritionistAccount = useMemo(
    () => getBooleanParam(token, "isNutritionistAccount", false),
    [token],
  );
  const redirectToApp = useMemo(
    () => getStringParam(token, "redirectToApp", ""),
    [token],
  );
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      if (!token) {
        setIsValid(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error: verifyError } = await supabase.auth.setSession({
          access_token: token.get("access_token") ?? "",
          refresh_token: token.get("refresh_token") ?? "",
        });

        if (verifyError) {
          setIsValid(false);
          setLoading(false);
        } else if (data.user && data.session) {
          setIsValid(true);
          dispatch(setSession(data));
          setLoading(false);
        } else {
          setIsValid(false);
          setLoading(false);
        }
      } catch {
        setIsValid(false);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, dispatch]);

  return {
    token,
    isValid,
    loading,
    shouldRedirectToApp,
    isNutritionistAccount,
    redirectToApp,
  };
};
