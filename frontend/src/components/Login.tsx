import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { DragonLogo } from "./ui/dragon-logo";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }

    const initializeGoogleSignIn = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button")!,
        {
          theme: "filled_black",
          size: "large",
          type: "standard",
          shape: "pill",
          width: 280,
          text: "continue_with",
        }
      );
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = initializeGoogleSignIn;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isAuthenticated, navigate]);

  const handleCredentialResponse = async (response: any) => {
    try {
      if (!response.credential) {
        throw new Error("No credential received from Google");
      }

      await login({
        access_token: response.credential,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="w-full max-w-[400px] mx-auto p-8">
        <div className="flex flex-col items-center space-y-16">
          {/* Logo */}
          <DragonLogo className="w-96 h-96" size={200} />

          {/* Title and description */}
          <div className="space-y-3 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-red-500">
              D&D Lore Manager
            </h1>
            <p className="text-sm text-gray-400">
              Your gateway to epic adventures
            </p>
          </div>

          {/* Sign in button */}
          <div
            id="google-signin-button"
            className="flex justify-center pt-4"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
