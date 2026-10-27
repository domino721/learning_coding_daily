import { defineConfig } from "vite";
import process from "node:process";
import { execSync } from "node:child_process";

function buildId() {
  const day = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Seoul",
  });
  try {
    return `${day} ${execSync("git rev-parse --short HEAD").toString().trim()}`;
  } catch {
    return day;
  }
}
export default defineConfig(({ mode }) => ({
  base: mode === "web" ? "./" : "/",
  define: { __BUILD_ID__: JSON.stringify(buildId()) },
  build: {
    rollupOptions: { input: { app: "index.html", design: "design.html" } },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: { "/api": process.env.API_PROXY_TARGET || "http://127.0.0.1:8000" },
  },
}));
