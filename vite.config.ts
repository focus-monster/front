import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export const API_URL = "https://focusmonster.me:8088";
export const GEMINI_URL = "http://focusmonster.me:8090";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: API_URL,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: true,
        changeOrigin: true,
      },
      "/gemini": {
        target: GEMINI_URL,
        rewrite: (path) => path.replace(/^\/gemini/, ""),
        secure: true,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
