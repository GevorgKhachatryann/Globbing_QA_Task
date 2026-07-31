import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true, suiteTitle: true }],
  ],

use: {
  baseURL: process.env.BASE_URL ?? 'https://am.globbing.com',
  headless: !!process.env.CI,
  launchOptions: {
    slowMo: 1000,           
  },

  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  actionTimeout: 10_000,
  navigationTimeout: 15_000,
},

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Uncomment for real cross-browser coverage once the suite is stable:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
