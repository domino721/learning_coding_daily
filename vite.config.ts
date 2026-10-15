import { defineConfig } from "vite";
import process from "node:process";
export default defineConfig(({ mode }) => ({
  base: mode === "web" ? "./" : "/",
  server: {
    port: 5173,
    strictPort: true,
    proxy: { "/api": process.env.API_PROXY_TARGET || "http://127.0.0.1:8000" },
  },
}));
