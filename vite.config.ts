import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

const API_URL = "http://localhost:8081"

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
})
