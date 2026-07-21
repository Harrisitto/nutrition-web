import { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/global/ProtectedRoute";
import { APP_ROUTES } from "./hooks/navigation/routes";
import { useConfigSelectedUserId } from "./store/slices/config/hook";
import { useLanguageCode } from "./hooks/helpers/language";
import { fetchPlanningWeek } from "./services/tanstack/user/planing";
import { queryClient } from "./services/tanstack/queryClient";
import { fromDate, saveDate } from "./helpers/dates";
import { queryKeys } from "./services/tanstack/keys";

const SignInPage = lazy(() => import("./pages/auth/SignUpPage"));
const PageAppDashboard = lazy(() => import("./pages/app/dashboard"));
const PageUserPreset = lazy(() => import("./pages/forms/preset"));
const PagePrivacyPolicy = lazy(() => import("./pages/privacyPolicy/page"));
const PageReferences = lazy(() => import("./pages/references/page"));
const NotFoundPage = lazy(() => import("./pages/error/NotFoundPage"));
const SetupProfile = lazy(() => import("./pages/auth/SetupProfile"));
const PageMeasures = lazy(() => import("./pages/forms/measures"));
const PageNutritionistConfiguration = lazy(() => import("./pages/app/configuration"));

function App() {
  const selectedUserId = useConfigSelectedUserId();
  const languageCode = useLanguageCode();

  // Prefetch current week plus nearby weeks for smoother dashboard navigation.
  useEffect(() => {
    if (!selectedUserId) return;
    const today = fromDate(new Date());
    const thisMonday = fromDate(today.thisMonday());
    const thisSunday = fromDate(today.thisSunday());
    const dateRanges = [
      { start: thisMonday.incrementDay(0), end: thisSunday.incrementDay(0) }, // Current week
      { start: thisMonday.incrementDay(-7), end: thisSunday.incrementDay(-7) }, // Previous week
      { start: thisMonday.incrementDay(7), end: thisSunday.incrementDay(7) }, // Next week
      { start: thisMonday.incrementDay(-14), end: thisSunday.incrementDay(-14) }, // Two weeks ago
      { start: thisMonday.incrementDay(14), end: thisSunday.incrementDay(14) }, // Two weeks ahead
      { start: thisMonday.incrementDay(21), end: thisSunday.incrementDay(21) }, // Three weeks ahead
      { start: thisMonday.incrementDay(28), end: thisSunday.incrementDay(28) }, // Four weeks ahead
    ];

    void Promise.all(
      dateRanges.map(({ start, end }) =>
        queryClient.prefetchQuery({
          queryKey: queryKeys({ userId: selectedUserId }).user.planing(
            saveDate(start),
            saveDate(end),
          ),
          queryFn: () =>
            fetchPlanningWeek({
              userId: selectedUserId,
              languageCode,
              dateRange: {
                start: saveDate(start),
                end: saveDate(end),
              },
            }),
        }),
      ),
    );
  }, [selectedUserId, languageCode]);

  return (
    <main className="w-full min-h-screen bg-white-green text-black-green">
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path={APP_ROUTES.HOME} element={<SignInPage />} />
          <Route path={APP_ROUTES.SIGN_UP} element={<SignInPage />} />
          <Route path={APP_ROUTES.REFERENCES} element={<PageReferences />} />
          <Route
            path={APP_ROUTES.PRIVACY_POLICY}
            element={<PagePrivacyPolicy />}
          />
          <Route
            path={APP_ROUTES.COMPLETE_PROFILE}
            element={<SetupProfile />} // NOT A PROTECTED ROUTE
          />
          {/* Protected routes */}
          <Route
            path={APP_ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <PageAppDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={APP_ROUTES.FORM_PRESET}
            element={
              <ProtectedRoute
                selectedUserRequired={true} // This page requires a user to be selected in the config
              >
                <PageUserPreset />
              </ProtectedRoute>
            }
          />

          <Route
            path={APP_ROUTES.FORM_MEASURE}
            element={
              <ProtectedRoute
                selectedUserRequired={true} // This page requires a user to be selected in the config
              >
                <PageMeasures />
              </ProtectedRoute>
            }
          />

          <Route
            path={APP_ROUTES.CONFIG}
            element={
              <ProtectedRoute>
                <PageNutritionistConfiguration />
              </ProtectedRoute>
            }
          />

          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </main>
  );
}

export default App;
