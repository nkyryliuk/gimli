import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import { HydratedRouter } from "react-router/dom";

import axios from "axios";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";
axios.defaults.withCredentials = true;

// Initialize auth check on app load
import { useAuthStore } from "./stores/useAuthStore";
useAuthStore.getState().checkAuth();

// Since we're using React Router v7 with a Layout that returns <html>,
// we need to use hydrateRoot with document

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <HydratedRouter />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
