import { defineConfig } from "vite";
import process from "node:process";
export default defineConfig(({ mode }) => ({
  base: mode === "web" ? "./" : "/",
  build: {
    rollupOptions: { input: { app: "index.html", design: "design.html" } },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: { "/api": process.env.API_PROXY_TARGET || "http://127.0.0.1:8000" },
  },
}));
