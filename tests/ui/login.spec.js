const { test, expect } = require('../../src/fixtures/ui.fixture');
const { env } = require('../../src/utils/env');
const { users } = require('../../src/utils/data');

test.describe('Login UI @ui', () => {
  test('deve fazer login com sucesso @sanity @smoke', async ({ loginPage, homePage }) => {
    await loginPage.login(env.uiUser, env.uiPass);
    expect(await homePage.isLoaded()).toBe(true);
  });

  test('deve exibir erro com credenciais inválidas @regression', async ({ loginPage }) => {
    await loginPage.login(users.invalidUser.username, users.invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('deve bloquear usuário locked_out @regression', async ({ loginPage }) => {
    await loginPage.login(users.lockedUser.username, users.lockedUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });
});
