import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/global/ProtectedRoute";
import { APP_ROUTES } from "./hooks/navigation/routes";
import { InitialAnimation } from "./components/global/Animations";

const SignInPage = lazy(() => import("./pages/auth/SignUpPage"));
const PageAppDashboard = lazy(() => import("./pages/dashboard"));
const PagePrivacyPolicy = lazy(() => import("./pages/privacyPolicy"));
const PageReferences = lazy(() => import("./pages/references"));
const NotFoundPage = lazy(() => import("./pages/error/NotFoundPage"));
const PageInfo = lazy(() => import("./pages/info/info"));

function App() {
  return (
    <main className="w-full min-h-screen bg-white-green text-black-green">
      <Suspense
        fallback={
          <div className="w-full flex min-h-screen justify-center items-center border-red-500">
            <InitialAnimation duration={2500} />
          </div>
        }
      >
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
          {/* Protected routes */}
          <Route
            path={APP_ROUTES.DASHBOARD_WILD}
            element={
              <ProtectedRoute selectedUserRequired={true}>
                <PageAppDashboard />
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
