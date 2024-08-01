import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const API_URL = "http://localhost:8080";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 4173,
  },
  server: {
    proxy: {
      "/api": {
        target: API_URL,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
