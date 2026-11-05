import { useTranslation } from "react-i18next";
import { Header } from "./@components/header";
import { Routes, Route } from "react-router-dom";
import { APP_ROUTES, getTrailingRoute } from "@src/hooks/navigation/routes";
import useAppNavigation from "@src/hooks/navigation";
import { lazy } from "react";

const PageInviteClient = lazy(() => import("./inviteClient/index"));
const PageAppointmentThemes = lazy(() => import("./appointmentThemes/index"));
const PageUserPreset = lazy(() => import("../dashboard/preset/index"));
const PageMyVideos = lazy(() => import("./myVideos/index"));
const PageRaceIngredients = lazy(() => import("./raceIngredients/index"));
const PageDocuments = lazy(() => import("./documents/index"));
const PageRecipes = lazy(() =>
  import("./recipes/index").then((m) => ({ default: m.Recipes })),
);
const PageTableCommands = lazy(() =>
  import("./keyboard/index").then((m) => ({ default: m.TableCommands })),
);
const PageManageAuthState = lazy(() =>
  import("./authManagement/index").then((m) => ({
    default: m.ManageAuthState,
  })),
);

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
          {
            route: APP_ROUTES.MY_VIDEOS,
            label: t("data:configuration.sections.myVideos.title"),
            onClick: () => navigateTo(APP_ROUTES.MY_VIDEOS),
          },
          {
            route: APP_ROUTES.DOCUMENTS,
            label: t("data:configuration.sections.documents.title"),
            onClick: () => navigateTo(APP_ROUTES.DOCUMENTS),
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
          element={<PageRecipes />}
        />
        <Route
          path={getTrailingRoute(APP_ROUTES.KEYBOARD)}
          element={<PageTableCommands />}
        />
        <Route
          path={getTrailingRoute(APP_ROUTES.AUTH_MANAGEMENT)}
          element={<PageManageAuthState />}
        />
        <Route
          path={getTrailingRoute(APP_ROUTES.RACE_INGREDIENTS)}
          element={<PageRaceIngredients />}
        />
        <Route
          path={getTrailingRoute(APP_ROUTES.APPOINTMENT_THEMES)}
          element={<PageAppointmentThemes />}
        />
        <Route
          path={getTrailingRoute(APP_ROUTES.GLOBAL_USER_PRESETS)}
          element={<PageUserPreset global />}
        />
        <Route
          path={getTrailingRoute(APP_ROUTES.MY_VIDEOS)}
          element={<PageMyVideos />}
        />
        <Route
          path={getTrailingRoute(APP_ROUTES.DOCUMENTS)}
          element={<PageDocuments />}
        />
      </Routes>
    </div>
  );
};

export default PageNutritionistConfiguration;
