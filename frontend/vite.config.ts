import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: [
      "all",
      "2d179262-6166-446b-92ae-820914941f6d-00-3hb58x1k7qbp8.pike.replit.dev",
    ],
  },
});
