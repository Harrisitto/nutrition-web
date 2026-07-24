import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import { ActivityIcon, CogIcon, ForkKnifeCrossedIcon } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { HomeIcon } from "lucide-react";

type NavigateButtonProps = {
    label: string;
    onClick: () => void;
    icon: React.ReactNode;
};

const NavigateButton = ({ label, onClick, icon }: NavigateButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex h-full w-full items-center justify-center gap-2 rounded-lg border border-nutrition-green/25 bg-white px-3 py-2 text-sm font-medium text-nutrition-green transition-all duration-200 hover:-translate-y-0.5 hover:border-nutrition-green/45 hover:bg-white-green/70 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nutrition-green/50 active:translate-y-0"
        >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-nutrition-green/12 text-nutrition-green transition-colors duration-200 group-hover:bg-nutrition-green/20">
                {icon}
            </span>
            <span>{label}</span>
        </button>
    );
};

export const NavigateUserPreset = () => {
    const navigate = useAppNavigation();
    const { t } = useTranslation();

    const handleClick = useCallback(() => {
        navigate.navigateTo(APP_ROUTES.FORM_PRESET);
    }, [navigate]);

    return (
        <NavigateButton
            onClick={handleClick}
            label={t("data:dashboardTable.navigation.presets")}
            icon={<ForkKnifeCrossedIcon className="h-3.5 w-3.5" />}
        />
    );
};

export const NavigateMeasures = () => {
    const navigate = useAppNavigation();
    const { t } = useTranslation();

    const handleClick = useCallback(() => {
        navigate.navigateTo(APP_ROUTES.FORM_MEASURE);
    }, [navigate]);

    return (
        <NavigateButton
            onClick={handleClick}
            label={t("data:dashboardTable.navigation.measures")}
            icon={<ActivityIcon className="h-3.5 w-3.5" />}
        />
    );
};

export const NavigateConfig = () => {
    const navigate = useAppNavigation();
    const { t } = useTranslation();

    const handleClick = useCallback(() => {
        navigate.navigateTo(APP_ROUTES.CONFIG);
    }, [navigate]);

    return (
        <NavigateButton
            onClick={handleClick}
            label={t("data:dashboardTable.navigation.config")}
            icon={<CogIcon className="h-3.5 w-3.5" />}
        />
    );
};

export const NavigateInfo = () => {
    const navigate = useAppNavigation();
    const { t } = useTranslation();

    const handleClick = useCallback(() => {
        navigate.navigateTo(APP_ROUTES.INFO);
    }, [navigate]);

    return (
        <NavigateButton
            onClick={handleClick}
            label={t("data:dashboardTable.navigation.info")}
            icon={<HomeIcon className="h-3.5 w-3.5" />}
        />
    );
};
