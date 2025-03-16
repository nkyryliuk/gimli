import { create } from "zustand";
import axios from "axios";

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (googleResponse: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  getAuthState: () => {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
  };
}

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post("/api/auth/token/refresh/", {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem("access_token", access);
        axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        originalRequest.headers["Authorization"] = `Bearer ${access}`;

        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        delete axios.defaults.headers.common["Authorization"];
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Initialize axios headers if token exists
const token = localStorage.getItem("access_token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  login: async (googleResponse) => {
    try {
      if (!googleResponse?.access_token) {
        throw new Error("No credential provided in Google response");
      }

      const response = await axios.post(
        "/api/auth/google/",
        {
          id_token: googleResponse.access_token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { user: userData, tokens } = response.data;

      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${tokens.access}`;

      set({ user: userData, isAuthenticated: true, loading: false });
    } catch (error: any) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        googleResponse,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      delete axios.defaults.headers.common["Authorization"];
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        set({ user: null, isAuthenticated: false, loading: false });
        return;
      }

      // Set the authorization header for all requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get("/api/auth/user/");

      // Only update state if there's a change to avoid unnecessary re-renders
      set((state) => {
        // If user is already authenticated with the same user ID, don't update
        if (state.isAuthenticated && state.user?.id === response.data.id) {
          return { loading: false };
        }
        return { user: response.data, isAuthenticated: true, loading: false };
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      delete axios.defaults.headers.common["Authorization"];
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  getAuthState: () => {
    const { user, isAuthenticated, loading } = get();
    return { user, isAuthenticated, loading };
  },
}));
