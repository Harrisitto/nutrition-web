import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES, type AppRoute } from "@src/hooks/navigation/routes";
import { useAppSelector } from "@src/store/store";
import {
  SettingsIcon,
  InfoIcon,
  HouseIcon,
  type LucideIcon,
} from "lucide-react";

// 1. Componente Reutilizable Base
interface SidebarNavItemProps {
  to: AppRoute;
  labelKey: string;
  icon: LucideIcon;
  exact?: boolean;
}

const SidebarNavItem = ({
  to,
  labelKey,
  icon: Icon,
  exact = false,
}: SidebarNavItemProps) => {
  const { t } = useTranslation();
  const { navigateTo } = useAppNavigation();
  const { pathname } = useLocation();
  const sidebarOpen = useAppSelector((state) => state.config.sidebarOpen);

  const label = t(labelKey);

  // Limpiamos el wildcard para la comparación de la ruta activa
  const cleanRoute = to.replace("/*", "");
  const isActive = exact
    ? pathname === cleanRoute
    : pathname.startsWith(cleanRoute);

  return (
    <button
      onClick={() => navigateTo(to)}
      title={!sidebarOpen ? label : undefined}
      className={`
        group relative flex items-center transition-all duration-300 ease-out rounded-lg cursor-pointer overflow-hidden
        hover:scale-105 active:scale-98 my-1
        ${
          isActive
            ? "bg-gradient-to-r from-nutrition-green to-nutrition-blue text-white shadow-md border border-white/20 font-semibold"
            : "bg-fade-dark-green text-gray-300 hover:text-white hover:bg-white/10 border border-white/5 shadow-sm"
        }
        ${sidebarOpen ? "w-full px-3 py-2 justify-start gap-3" : "w-full p-2 justify-center"}
      `}
    >
      <Icon
        className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
          isActive ? "scale-110" : "group-hover:scale-110"
        }`}
      />
      {sidebarOpen && (
        <span className="text-sm truncate leading-none">{label}</span>
      )}
    </button>
  );
};

// 2. Componentes de Navegación Simplificados
export const NavigateDashboard = () => (
  <SidebarNavItem
    to={APP_ROUTES.DASHBOARD}
    labelKey="data:dashboardTable.navigation.dashboard"
    icon={HouseIcon}
    exact
  />
);

export const NavigateConfiguration = () => (
  <SidebarNavItem
    to={APP_ROUTES.CONFIG}
    labelKey="data:dashboardTable.navigation.config"
    icon={SettingsIcon}
  />
);

export const NavigateHomePage = () => (
  <SidebarNavItem
    to={APP_ROUTES.INFO}
    labelKey="data:dashboardTable.navigation.info"
    icon={InfoIcon}
  />
);
