import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HashRouter as Router } from "react-router-dom";
import store from "./store/store.ts";
import { queryClient } from "./services/tanstack/queryClient.ts";
import AuthProvider from "./components/global/AuthProvider.tsx";
import "./index.css";
import "./services/i18n/config";
import App from "./App.tsx";
import ErrorBoundary from "./pages/error/ErrorPage.tsx";
import { DisplayNotification } from "./components/global/Notification.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <DisplayNotification />
        <ErrorBoundary>
          <Router>
            <AuthProvider>
              <App />
              <ReactQueryDevtools initialIsOpen={true} />
            </AuthProvider>
          </Router>
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
