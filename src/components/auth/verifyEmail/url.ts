import { supabase } from "@src/services/supabase/client";
import { setSession } from "@src/store/slices/auth/store";
import { useAppDispatch } from "@src/store/store";
import { useEffect, useMemo, useState } from "react";

const parseVerificationTokenFromURL = (url: string) => {
    try {
        const urlObj = new URL(url);
        // Grab the last hash segment: "#/verify-email#access_token=..." -> "access_token=..."
        const rawHash = urlObj.hash.startsWith("#") ? urlObj.hash.slice(1) : urlObj.hash;
        const hashPart = rawHash.includes("#") ? rawHash.split("#").pop() ?? "" : rawHash;
        const hashParams = new URLSearchParams(hashPart.startsWith("?") ? hashPart.slice(1) : hashPart);
        return (hashParams);
    } catch (error) {
        console.error("Invalid URL:", error);
        return null;
    }
}

const findMobileVerified = (token: URLSearchParams | null) => {
    if (!token) return false;
    const mobileVerified = token.get("mobile_verified");
    return mobileVerified === "true";
}

export const useVerificationToken = () => {
    const token = useMemo(() => parseVerificationTokenFromURL(window.location.href), []);
    const isMobileVerified = useMemo(() => findMobileVerified(token), [token]);
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

            if(isMobileVerified) {
                setIsValid(true);
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
                } else if (data.user && data.session) {
                    setIsValid(true);
                    dispatch(setSession(data));
                    
                } else {
                    setIsValid(false);
                }
            } catch {
                setIsValid(false);
            } finally {
                setLoading(false);
            }
        })();
    }, [token, dispatch]);

    return { token, isValid, loading, isMobileVerified };
}