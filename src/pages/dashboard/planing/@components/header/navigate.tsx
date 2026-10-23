import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES, type AppRoute } from "@src/hooks/navigation/routes";
import { ActivityIcon, Calendar, ForkKnifeCrossedIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

type NavigateButtonProps = {
  route: AppRoute;
  labelKey: string;
  icon: React.ReactNode;
};

const NavigateButton = ({ route, labelKey, icon }: NavigateButtonProps) => {
  const { navigateTo } = useAppNavigation();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => navigateTo(route)}
      className="group flex flex-1 items-center justify-center gap-2 rounded-lg border border-nutrition-green/25 bg-white px-3 py-2 text-sm font-medium text-nutrition-green transition-all duration-200 hover:-translate-y-0.5 hover:border-nutrition-green/45 hover:bg-white-green/70 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nutrition-green/50 active:translate-y-0"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-nutrition-green/12 text-nutrition-green transition-colors duration-200 group-hover:bg-nutrition-green/20">
        {icon}
      </span>
      <span>{t(labelKey)}</span>
    </button>
  );
};

export const NavigateUserPreset = () => (
  <NavigateButton
    route={APP_ROUTES.FORM_PRESET}
    labelKey="data:dashboardTable.navigation.presets"
    icon={<ForkKnifeCrossedIcon className="h-3.5 w-3.5" />}
  />
);

export const NavigateMeasures = () => (
  <NavigateButton
    route={APP_ROUTES.FORM_MEASURE}
    labelKey="data:dashboardTable.navigation.measures"
    icon={<ActivityIcon className="h-3.5 w-3.5" />}
  />
);

export const NavigateAppointments = () => (
  <NavigateButton
    route={APP_ROUTES.APPOINTMENTS}
    labelKey="data:dashboardTable.navigation.appointments"
    icon={<Calendar className="h-3.5 w-3.5" />}
  />
);
