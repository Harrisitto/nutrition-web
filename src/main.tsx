import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { store } from "./store/index.ts";
import { queryClient } from "./hooks/query/queryClient.ts";
import AuthProvider from "./components/auth/AuthProvider";
import "./index.css";
import App from "./App.tsx";
import ErrorBoundary from "./pages/error/ErrorPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <AuthProvider>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
