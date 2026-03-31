import useAppNavigation from "@src/hooks/navigation"
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import { ForkKnifeCrossedIcon } from "lucide-react"
import { useCallback } from "react";

export const NavigateUserPreset = () => {
    const navigate = useAppNavigation();

    const handleClick = useCallback(() => {
        navigate.navigateTo(APP_ROUTES.FORM_PRESET);
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-full" onClick={handleClick}>
            <ForkKnifeCrossedIcon className="text-nutrition-green" size={48} />
        </div>
    )
}

export const NavigateMeasures = () => {
    const navigate = useAppNavigation();

    const handleClick = useCallback(() => {
        navigate.navigateTo(APP_ROUTES.FORM_MEASURE);
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-full" onClick={handleClick}>
            <ForkKnifeCrossedIcon className="text-nutrition-green" size={48} />
        </div>
    )
}