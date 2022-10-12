/** @type {import('@playwright/test').PlaywrightTestConfig} */

const port = 3000;
const config = {
  webServer: {
    port,
    command: `yarn build:app && yarn preview --port ${port}`
  }
};

export default config;
