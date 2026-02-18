import { Suspense, lazy } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/global/ProtectedRoute";
import { APP_ROUTES } from "./hooks/navigation/routes";

const LogInPage = lazy(() => import("./pages/auth/LogInPage"));
const SignInPage = lazy(() => import("./pages/auth/SignUpPage"));
const EmailVerificationPage = lazy(
  () => import("./pages/auth/EmailVerification")
);
const PagePrivacyPolicy = lazy(() =>
  import("./pages/privacyPolicy/page").then((m) => ({
    default: m.PagePrivacyPolicy
  }))
);
const NotFoundPage = lazy(() => import("./pages/error/NotFoundPage"));

function App() {
  return (
    <Router>
      <main className="w-full min-h-screen bg-white-green text-black-green">
        <Suspense fallback={<div className="p-6">Loading...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path={APP_ROUTES.HOME} element={<LogInPage />} />
            <Route
              path={APP_ROUTES.PRIVACY_POLICY}
              element={<PagePrivacyPolicy />}
            />
            <Route path={APP_ROUTES.LOGIN} element={<LogInPage />} />
            <Route path={APP_ROUTES.SIGN_UP} element={<SignInPage />} />
            <Route
              path={APP_ROUTES.EMAIL_VERIFICATION}
              element={<EmailVerificationPage />}
            />

            <Route
              path={APP_ROUTES.DASHBOARD}
              element={
                <ProtectedRoute redirectTo={APP_ROUTES.LOGIN}>
                  <></>
                </ProtectedRoute>
              }
            />

            {/* 404 - Catch all unmatched routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
