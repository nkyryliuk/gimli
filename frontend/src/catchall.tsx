import { Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore";

export default function CatchAll() {
  const { isAuthenticated } = useAuthStore();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but route doesn't exist, redirect to dashboard
  return <Navigate to="/dashboard" replace />;
}
