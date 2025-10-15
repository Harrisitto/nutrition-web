import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const useSearchParams = <T>() => {
    const location = useLocation();
    const params = useMemo(() => {
        // Parse the URL hash
        const hash = location.hash.substring(1); // Remove the '#' at the start
        return new URLSearchParams(hash);
    }, [location])

    return params as T;
}

export default useSearchParams;