import { useTranslation } from "react-i18next";
import { Header } from "./@components/header";
import { Routes, Route } from "react-router-dom";
import { APP_ROUTES, getTrailingRoute } from "@src/hooks/navigation/routes";
import { Recipes } from "./recipes";
import { TableCommands } from "./keyboard";
import { ManageAuthState } from "./authManagement";
import useAppNavigation from "@src/hooks/navigation";
import { lazy } from "react";

const PageInviteClient = lazy(() => import("./inviteClient/index"));

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
      </Routes>
    </div>
  );
};

export default PageNutritionistConfiguration;
