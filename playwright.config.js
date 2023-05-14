/** @type {import('@playwright/test').PlaywrightTestConfig} */

const port = 3000;
const config = {
  testDir: 'tests/acceptance',
  testMatch: '*.js',
  webServer: {
    port,
    command: `yarn build:app && yarn preview --port ${port}`
  }
};

export default config;
