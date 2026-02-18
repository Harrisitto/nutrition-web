import { HashRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/error/NotFoundPage";
import ProtectedRoute from "./components/global/ProtectedRoute";
import LogInPage from "./pages/auth/LogInPage";
import { PagePrivacyPolicy } from "./pages/privacyPolicy/page";
import SignInPage from "./pages/auth/SignUpPage";
import { APP_ROUTES } from "./hooks/navigation/routes";
import EmailVerificationPage from "./pages/auth/EmailVerification";

function App() {
  return (
    <Router>
      <main className="w-full min-h-screen bg-white-green text-black-green">
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
      </main>
    </Router>
  );
}

export default App;
