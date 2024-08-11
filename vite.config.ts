import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { readFileSync } from "fs";

export const API_URL = "https://focusmonster.me:8080";
export const GEMINI_URL = "http://focusmonster.me:8090";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 80,
    https: {
      key: readFileSync(path.resolve(__dirname, "key.pem")),
      cert: readFileSync(path.resolve(__dirname, "cert.pem")),
    },
  },
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
    https: {
      key: readFileSync(path.resolve(__dirname, "key.pem")),
      cert: readFileSync(path.resolve(__dirname, "cert.pem")),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
