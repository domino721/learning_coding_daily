import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";
import process from "node:process";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:5174",
    trace: "retain-on-failure",
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
        (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
    },
  },
  projects: [
    {
      name: "mobile-web",
      use: {
        ...devices["Pixel 7"],
        baseURL: "http://127.0.0.1:5175/learning_coding_daily/",
      },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
      testIgnore: "**/browser-migration.spec.ts",
    },
  ],
  webServer: [
    {
      command: "npm run build:web && node scripts/preview-web.mjs",
      url: "http://127.0.0.1:5175/learning_coding_daily/",
      reuseExistingServer: false,
    },
    {
      command: "bash scripts/e2e-api.sh",
      url: "http://127.0.0.1:8001/api/health",
      reuseExistingServer: false,
    },
    {
      command:
        "API_PROXY_TARGET=http://127.0.0.1:8001 npm run dev -- --port 5174",
      url: "http://127.0.0.1:5174",
      reuseExistingServer: false,
    },
  ],
});
