import { useMemo } from "react";

const parseVerificationTokenFromURL = (url: string) => {
    try {
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);

        // Hash can include a route and/or params: "#/verify-email?isAppVerified=true"
        // or "#/verify-email#access_token=..."
        const rawHash = urlObj.hash.startsWith("#") ? urlObj.hash.slice(1) : urlObj.hash;
        const hashPart = rawHash.includes("#") ? rawHash.split("#").pop() ?? "" : rawHash;
        const hashQuery = hashPart.includes("?") ? hashPart.split("?").pop() ?? "" : hashPart;
        const hashParams = new URLSearchParams(hashQuery.startsWith("?") ? hashQuery.slice(1) : hashQuery);

        hashParams.forEach((value, key) => {
            params.set(key, value);
        });

        if (!params.has("token")) {
            return null;
        }

        return params;
    } catch (error) {
        console.error("Invalid URL:", error);
        return null;
    }
}

const findMobileVerified = (token: URLSearchParams | null) => {
    if (!token) return false;
    const isAppVerified = token.get("isAppVerified");
    return isAppVerified === "true";
}

export const useVerificationToken = () => {
    const token = useMemo(() => parseVerificationTokenFromURL(window.location.href), []);
    const isAppVerified = useMemo(() => findMobileVerified(token), [token]);



    return { token, isAppVerified };
}