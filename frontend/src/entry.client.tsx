import { type ReactNode, StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import { HydratedRouter } from "react-router/dom";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import axios from "axios";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";
axios.defaults.withCredentials = true;

import { useAuthStore } from "./stores/useAuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const authStore = useAuthStore.getState();
authStore.checkAuth();

const ClientOnlyPostHogProvider = ({ children }: { children: ReactNode }) => {
  const isClient = typeof window !== "undefined";

  useEffect(() => {
    if (isClient) {
      posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
        api_host:
          import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
        capture_pageview: false,
        loaded: (posthog) => {
          posthog.capture("$pageview");
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const unsubscribe = useAuthStore.subscribe((state) => {
      if (state.isAuthenticated && state.user) {
        posthog.identify(String(state.user.id), {
          email: state.user.email,
          name: state.user.first_name
            ? `${state.user.first_name} ${state.user.last_name || ""}`
            : state.user.email,
          first_name: state.user.first_name,
          last_name: state.user.last_name,
        });

        posthog.people.set({
          email: state.user.email,
          name: state.user.first_name
            ? `${state.user.first_name} ${state.user.last_name || ""}`
            : state.user.email,
        });
      } else if (!state.isAuthenticated) {
        posthog.reset();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isClient) return children;

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
};

ReactDOM.hydrateRoot(
  document,
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ClientOnlyPostHogProvider>
        <QueryClientProvider client={queryClient}>
          <HydratedRouter />
        </QueryClientProvider>
      </ClientOnlyPostHogProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
