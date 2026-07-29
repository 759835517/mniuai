import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3004",
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
    command: "pnpm dev -p 3004",
    url: "http://localhost:3004",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
