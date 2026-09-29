import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HashRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store.ts";
import { queryClient } from "./services/tanstack/queryClient.ts";
import "./index.css";
import "./services/i18n/config";
import App from "./App.tsx";
import ErrorBoundary from "./pages/error/ErrorPage.tsx";
import { DisplayNotification } from "./components/global/Notification.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <DisplayNotification />
        <ErrorBoundary>
          <Router>
              <App />
              <ReactQueryDevtools initialIsOpen={true} />
          </Router>
        </ErrorBoundary>
      </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
