import { useTranslation } from "react-i18next";
import { Header } from "./@components/header";
import { Routes, Route } from "react-router-dom";
import { APP_ROUTES, getTrailingRoute } from "@src/hooks/navigation/routes";
import { Recipes } from "./recipes";
import { TableCommands } from "./keyboard";
import { ManageAuthState } from "./authManagement";
import useAppNavigation from "@src/hooks/navigation";
import { lazy } from "react";
import ConfigRaceIngredients from "./raceIngredients";

const PageInviteClient = lazy(() => import("./inviteClient/index"));
const PageAppointmentThemes = lazy(() => import("./appointmentThemes/index"));
const PageUserPreset = lazy(() => import("../dashboard/preset/index"));

const PageNutritionistConfiguration = () => {
  const { t } = useTranslation();
  const { navigateTo } = useAppNavigation();

  return (
    <div className="p-6">
      <Header
        sections={[
          {
            route: APP_ROUTES.INVITE_CLIENT,
            label: t("data:configuration.sections.invitations.title"),
            onClick: () => navigateTo(APP_ROUTES.INVITE_CLIENT),
          },
          {
            route: APP_ROUTES.RECIPES_CONFIG,
            label: t("data:configuration.sections.recipes.title"),
            onClick: () => navigateTo(APP_ROUTES.RECIPES_CONFIG),
          },
          {
            route: APP_ROUTES.KEYBOARD,
            label: t("data:configuration.sections.keyboard.tableCommands"),
            onClick: () => navigateTo(APP_ROUTES.KEYBOARD),
          },
          {
            route: APP_ROUTES.AUTH_MANAGEMENT,
            label: t("data:configuration.sections.authManagement.title"),
            onClick: () => navigateTo(APP_ROUTES.AUTH_MANAGEMENT),
          },
          {
            route: APP_ROUTES.RACE_INGREDIENTS,
            label: t("data:configuration.sections.raceIngredients.title"),
            onClick: () => navigateTo(APP_ROUTES.RACE_INGREDIENTS),
          },
          {
            route: APP_ROUTES.APPOINTMENT_THEMES,
            label: t("data:configuration.sections.appointmentThemes.title"),
            onClick: () => navigateTo(APP_ROUTES.APPOINTMENT_THEMES),
          },
          {
            route: APP_ROUTES.GLOBAL_USER_PRESETS,
            label: t("data:configuration.sections.globalUserPresets.title"),
            onClick: () => navigateTo(APP_ROUTES.GLOBAL_USER_PRESETS),
          },
        ]}
      />
      <Routes>
        <Route
          path={getTrailingRoute(APP_ROUTES.CONFIG)}
          element={<PageInviteClient />}
        />
        <Route
          path={getTrailingRoute(APP_ROUTES.INVITE_CLIENT)}
          element={<PageInviteClient />}
        />
        <Route
          path={getTrailingRoute(APP_ROUTES.RECIPES_CONFIG)}
          element={<Recipes />}
        />
        <Route
          path={getTrailingRoute(APP_ROUTES.KEYBOARD)}
          element={<TableCommands />}
        />
        <Route
          path={getTrailingRoute(APP_ROUTES.AUTH_MANAGEMENT)}
          element={<ManageAuthState />}
        />
        <Route
          path={getTrailingRoute(APP_ROUTES.RACE_INGREDIENTS)}
          element={<ConfigRaceIngredients />}
        />
        <Route
          path={getTrailingRoute(APP_ROUTES.APPOINTMENT_THEMES)}
          element={<PageAppointmentThemes />}
        />
        <Route
          path={getTrailingRoute(APP_ROUTES.GLOBAL_USER_PRESETS)}
          element={<PageUserPreset global />}
        />
      </Routes>
    </div>
  );
};

export default PageNutritionistConfiguration;
