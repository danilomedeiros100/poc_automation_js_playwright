const { BasePage } = require('./BasePage');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.inventoryList = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.pageTitle = page.locator('.title');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async getItemCount() {
    return this.inventoryItems.count();
  }

  async addFirstItemToCart() {
    await this.inventoryItems.first().locator('button').click();
  }

  async getCartCount() {
    return this.cartBadge.textContent();
  }

  async logout() {
    await this.burgerMenu.click();
    await this.logoutLink.click();
  }
}

module.exports = { InventoryPage };
