import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { reactRouter } from "@react-router/dev/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRouter()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
