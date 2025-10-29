const { defineConfig, devices } = require('@playwright/test');
const isCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: isCI ? 'list' : 'html',
  use: {
    trace: 'on-first-retry',
    baseURL: 'chrome-extension://',
    headless: isCI ? true : false
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Do not attempt to start a dev server in CI; tests here target a Chrome extension
  // and require a specialized setup that isn't available in GitHub-hosted runners.
  webServer: isCI ? undefined : {
    command: 'npm run test:watch',
    port: 9222,
    reuseExistingServer: !process.env.CI,
  },

  // Temporarily skip E2E in CI until extension test harness is added
  testIgnore: isCI ? ['**/*.spec.js'] : [],
});

