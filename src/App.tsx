import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/global/ProtectedRoute";
import { APP_ROUTES } from "./hooks/navigation/routes";
import { usePrefetchPlaning } from "./services/tanstack/user/planing";

const SignInPage = lazy(() => import("./pages/auth/SignUpPage"));
const PageAppDashboard = lazy(() => import("./pages/app/dashboard"));
const PageUserPreset = lazy(() => import("./pages/forms/preset"));
const PagePrivacyPolicy = lazy(() => import("./pages/privacyPolicy/page"));
const PageReferences = lazy(() => import("./pages/references/page"));
const NotFoundPage = lazy(() => import("./pages/error/NotFoundPage"));
const SetupProfile = lazy(() => import("./pages/auth/SetupProfile"));
const PageMeasures = lazy(() => import("./pages/forms/measures"));
const PageNutritionistConfiguration = lazy(() => import("./pages/app/configuration"));
const PageInfo = lazy(() => import("./pages/app/info"));

function App() {
  usePrefetchPlaning();


  return (
    <main className="w-full min-h-screen bg-white-green text-black-green">
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path={APP_ROUTES.HOME} element={<PageInfo />} />
          <Route path={APP_ROUTES.INFO} element={<PageInfo />} />
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
