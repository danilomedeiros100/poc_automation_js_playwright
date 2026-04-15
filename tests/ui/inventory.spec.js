const { test, expect } = require('../../src/fixtures/ui.fixture');
const { env } = require('../../src/utils/env');

test.describe('Inventory UI @ui', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.login(env.uiUser, env.uiPass);
  });

  test('deve exibir produtos na home após login @sanity @smoke', async ({ inventoryPage }) => {
    await expect(inventoryPage.inventoryList).toBeVisible();
    const count = await inventoryPage.getItemCount();
    expect(count).toBeGreaterThan(0);
  });

  test('deve exibir título "Products" na página de inventário @sanity', async ({ inventoryPage }) => {
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('deve adicionar produto ao carrinho @critical', async ({ inventoryPage }) => {
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toBeVisible();
    expect(await inventoryPage.getCartCount()).toBe('1');
  });

  test('deve exibir dropdown de ordenação @critical', async ({ inventoryPage }) => {
    await expect(inventoryPage.sortDropdown).toBeVisible();
  });

  test('deve fazer logout com sucesso @regression', async ({ inventoryPage, loginPage }) => {
    await inventoryPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
