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

const ScreenCancelPayment = lazy(() => import("./cancelPayment/index"));

export default function PageDashboard() {
  const allClients = useFetchNutritionistUsers();
  const nutriInfoQuery = useGetAuthInfo();
  const hasSuscriptionQuery = useFetchHasSuscription();

  const isLoading = useMemo(
    () =>
      nutriInfoQuery.isPending ||
      // `useFetchNutritionistUsers` declares `placeholderData: []`, which makes
      // the query report success with an empty list while the first fetch is
      // still in flight -- `isLoading` is false there, so gating on it showed
      // the "no clients" screen to every nutritionist on every load.
      allClients.isPending ||
      allClients.isPlaceholderData ||
      // Disabled queries are pending-but-idle, so `isLoading` is false and
      // `data` undefined: gating on it flashed the paywall before the session
      // resolved.
      hasSuscriptionQuery.isPending,
    [
      nutriInfoQuery.isPending,
      allClients.isPending,
      allClients.isPlaceholderData,
      hasSuscriptionQuery.isPending,
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

  // The paywall comes before the "no clients yet" screen: gating on the client
  // count first let anyone with zero clients use the invite flow for free.
  if (!hasSuscriptionQuery.data) {
    // Stripe's cancel_url points inside the dashboard, so it has to resolve
    // while the paywall is up -- otherwise cancelling checkout lands on a
    // blank page.
    return (
      <Routes>
        <Route
          path={getTrailingRoute(APP_ROUTES.CANCEL_PAYMENT)}
          element={<ScreenCancelPayment />}
        />
        <Route path="*" element={<ScreenPaymentRequired />} />
      </Routes>
    );
  }

  if (allClients.data?.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <ManageAuthState />
        <PageInviteClient />
      </div>
    );
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
