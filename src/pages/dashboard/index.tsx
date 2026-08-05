import AppDashboard from "./@components/sideBar";
import { AnimationLoading } from "@src/components/global/Animations";
import { fromDate, loadDate } from "@src/helpers/dates";
import { useGetAuthInfo } from "@src/services/tanstack/auth/get";
import { useFetchNutritionistUsers } from "@src/services/tanstack/user/profile";
import { useAppSelector } from "@src/store/store";
import { IdxSetUpProfile } from "@src/components/auth/setUpProfileIndex";
import { useFetchHasSuscription } from "./@queries/hasSuscription";
import { ManageAuthState } from "./configuration/authManagement";
import PageInviteClient from "./configuration/inviteClient";
import { Route, Routes } from "react-router-dom";
import { APP_ROUTES, getTrailingRoute } from "@src/hooks/navigation/routes";
import { lazy, useMemo } from "react";

const PageFormPreset = lazy(() => import("./presetForm/index"));
const PageFormMeasure = lazy(() => import("./measuresForm/index"));
const PageConfiguration = lazy(() => import("./configuration/index"));
const PaymentRequiredPage = lazy(() => import("./paymentCheckout/index"));
const PagePlaningForm = lazy(() => import("./planingForm/index"));

export default function PageDashboard() {
  const d = useAppSelector((state) => state.config.selectedDay);
  const date = loadDate(d ?? "");

  const thisDateMonday = date
    ? fromDate(date).thisMonday()
    : fromDate().nextMonday();

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
    return (
      <IdxSetUpProfile.Provider>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg ">
            <IdxSetUpProfile.Text.Title />
            <IdxSetUpProfile.Text.Message />
            <IdxSetUpProfile.Fields />
            <IdxSetUpProfile.Actions.ConfirmSetup />
          </div>
        </div>
      </IdxSetUpProfile.Provider>
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

  if (!hasSuscriptionQuery.data) {
    return <PaymentRequiredPage />;
  }

  return (
    <AppDashboard>
      <div className="p-4">
        <Routes>
          <Route
            path={"/"}
            element={<PagePlaningForm thisDateMonday={thisDateMonday} />}
          />
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
