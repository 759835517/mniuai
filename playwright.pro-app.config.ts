import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./apps/pro-app/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3005",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          executablePath:
            "C:/Users/young/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe",
        },
      },
    },
  ],
  webServer: {
    command: "pnpm --filter @mniuai/pro-app dev",
    url: "http://localhost:3005",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
