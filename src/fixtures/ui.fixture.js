const { test: base, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { HomePage } = require('../pages/HomePage');
const { env } = require('../utils/env');

const test = base.extend({
  loginPage: async ({ page }, use) => {
    await page.goto(env.baseUrl);
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
});

module.exports = { test, expect };
