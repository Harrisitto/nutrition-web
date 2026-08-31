import AppDashboard from "./@components/sideBar";
import { AnimationLoading } from "@src/components/global/Animations";
import { useGetAuthInfo } from "@src/services/tanstack/auth/get";
import { useFetchNutritionistUsers } from "@src/services/tanstack/user/profile";
import { useFetchHasSuscription } from "./@queries/hasSuscription";
import { ManageAuthState } from "../configuration/authManagement";
import PageInviteClient from "../configuration/inviteClient";
import { Route, Routes } from "react-router-dom";
import { APP_ROUTES, getTrailingRoute } from "@src/hooks/navigation/routes";
import { lazy, useMemo } from "react";

const PageFormPreset = lazy(() => import("./presetForm/index"));
const PageFormMeasure = lazy(() => import("./measuresForm/index"));
const PageConfiguration = lazy(() => import("../configuration/index"));
const PagePlaningForm = lazy(() => import("./planingForm/index"));

const ScreenNoClients = lazy(
  () => import("./@components/noClientsScreen/index"),
);

const ScreenPaymentRequired = lazy(
  () => import("./@components/paymentScreen/index"),
);

export default function PageDashboard() {
  const allClients = useFetchNutritionistUsers();
  const nutriInfoQuery = useGetAuthInfo();
  const hasSuscriptionQuery = useFetchHasSuscription();

  const isLoading = useMemo(
    () =>
      nutriInfoQuery.isLoading ||
      allClients.isLoading ||
      hasSuscriptionQuery.isLoading,
    [
      nutriInfoQuery.isLoading,
      allClients.isLoading,
      hasSuscriptionQuery.isLoading,
    ],
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <AnimationLoading size={240} />
      </div>
    );
  }

  if (!nutriInfoQuery.data) {
    return <ScreenNoClients />;
  }

  if (allClients.data?.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <ManageAuthState />
        <PageInviteClient />
      </div>
    );
  }

  if (!hasSuscriptionQuery.data) {
    return <ScreenPaymentRequired />;
  }

  return (
    <AppDashboard>
      <div className="p-4">
        <Routes>
          <Route path={"/"} element={<PagePlaningForm />} />
          <Route
            path={getTrailingRoute(APP_ROUTES.FORM_PRESET)}
            element={<PageFormPreset />}
          />
          <Route
            path={getTrailingRoute(APP_ROUTES.FORM_MEASURE)}
            element={<PageFormMeasure />}
          />
          <Route
            path={getTrailingRoute(APP_ROUTES.CONFIG_WILD)}
            element={<PageConfiguration />}
          />
        </Routes>
      </div>
    </AppDashboard>
  );
}
