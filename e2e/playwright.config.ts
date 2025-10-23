
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        headless: false,
      },
    },
  ],
  use: {
    baseURL: 'http://localhost:30080',
    headless: true,
  },
});

