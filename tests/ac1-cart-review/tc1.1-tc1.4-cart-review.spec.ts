// spec: specs/saucedemo-checkout-test-plan.md
// AC1: Cart Review Tests (1-4)

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const CREDENTIALS = {
  username: 'standard_user',
  password: 'secret_sauce'
};

// Helper function to login
async function login(page) {
  await page.goto(BASE_URL);
  await page.fill('[data-test="username"]', CREDENTIALS.username);
  await page.fill('[data-test="password"]', CREDENTIALS.password);
  await page.click('[data-test="login-button"]');
  await page.waitForURL('**/inventory.html');
}

test.describe('AC1: Cart Review - View cart items with details and totals', () => {
  
  test('TC1.1: View cart with multiple items and verify item details', async ({ page }) => {
    // Step 1: Login and land on inventory page
    await login(page);
    const userLoggedIn = await page.locator('[data-test="inventory-list"]');
    await expect(userLoggedIn).toBeVisible();
    
    // Step 2: Add 3 different items to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
    await page.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
    await expect(page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]')).toBeVisible();
    
    // Verify cart badge shows count of 3 items
    const cartBadge = await page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toContainText('3');
    
    // Step 3: Click on shopping cart icon
    await page.click('[data-test="shopping-cart-link"]');
    
    // Step 4: Verify cart page elements
    await expect(page).toHaveURL(BASE_URL + '/cart.html');
    
    // Verify all 3 items are displayed
    const cartItems = await page.locator('[data-test="inventory-item"]');
    await expect(cartItems).toHaveCount(3);
    
    // Verify item details - Backpack
    const backpackName = await page.locator('[data-test="inventory-item-name"]:has-text("Sauce Labs Backpack")');
    await expect(backpackName).toBeVisible();
    let backpackPrice = await page.locator('[data-test="inventory-item-price"]:has-text("$29.99")');
    await expect(backpackPrice).toBeVisible();
    
    // Verify item details - Bike Light
    const bikeLightName = await page.locator('[data-test="inventory-item-name"]:has-text("Sauce Labs Bike Light")');
    await expect(bikeLightName).toBeVisible();
    let bikeLightPrice = await page.locator('[data-test="inventory-item-price"]:has-text("$9.99")');
    await expect(bikeLightPrice).toBeVisible();
    
    // Verify item details - T-Shirt
    const tshirtName = await page.locator('[data-test="inventory-item-name"]:has-text("Sauce Labs Bolt T-Shirt")');
    await expect(tshirtName).toBeVisible();
    let tshirtPrice = await page.locator('[data-test="inventory-item-price"]:has-text("$15.99")');
    await expect(tshirtPrice).toBeVisible();
    
    // Step 5: Verify navigation buttons
    const continueShoppingBtn = await page.locator('button:has-text("Continue Shopping")');
    await expect(continueShoppingBtn).toBeVisible();
    const checkoutBtn = await page.locator('[data-test="checkout"]');
    await expect(checkoutBtn).toBeVisible();
  });

  test('TC1.2: Verify cart totals calculation', async ({ page }) => {
    // Step 1: Login and add items
    await login(page);
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await page.click('[data-test="add-to-cart-sauce-labs-onesie"]');
    await expect(page.locator('[data-test="remove-sauce-labs-onesie"]')).toBeVisible();
    
    // Step 2: Navigate to cart page
    await page.click('[data-test="shopping-cart-link"]');
    await page.waitForURL('**/cart.html');
    
    // Verify cart shows 2 items
    const cartItems = await page.locator('[data-test="inventory-item"]');
    await expect(cartItems).toHaveCount(2);
    
    // Step 3: Review layout
    const qtyColumn = await page.locator('.cart_quantity_label');
    await expect(qtyColumn).toBeVisible();
    const descColumn = await page.locator('.cart_desc_label');
    await expect(descColumn).toBeVisible();
    
    // Each item displays price
    const prices = await page.locator('[data-test="inventory-item-price"]');
    const priceCount = await prices.count();
    expect(priceCount).toBeGreaterThanOrEqual(2);
    
    // Step 4: Verify totals by proceeding to checkout overview
    await page.click('[data-test="checkout"]');
    
    // Enter checkout information
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // Verify checkout step two
    await page.waitForURL('**/checkout-step-two.html');
    
    // Verify subtotal: $29.99 + $7.99 = $37.98
    const subtotal = await page.locator('.summary_subtotal_label');
    await expect(subtotal).toContainText('$37.98');
    
    // Verify tax is shown
    const tax = await page.locator('.summary_tax_label');
    await expect(tax).toBeVisible();
    
    // Verify total is shown
    const total = await page.locator('.summary_total_label');
    await expect(total).toBeVisible();
  });

  test('TC1.3: View cart with single item', async ({ page }) => {
    // Step 1: Login and add single item
    await login(page);
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
    
    // Verify cart badge shows 1
    const cartBadge = await page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toContainText('1');
    
    // Step 2: Navigate to cart page
    await page.click('[data-test="shopping-cart-link"]');
    await page.waitForURL('**/cart.html');
    
    // Verify single item displayed with QTY: 1
    const cartItems = await page.locator('[data-test="inventory-item"]');
    await expect(cartItems).toHaveCount(1);
    
    // Verify product name
    const productName = await page.locator('[data-test="inventory-item-name"]:has-text("Sauce Labs Bike Light")');
    await expect(productName).toBeVisible();
    
    // Verify price
    const price = await page.locator('[data-test="inventory-item-price"]');
    await expect(price).toContainText('$9.99');
    
    // Step 3: Verify cart buttons
    const continueShoppingBtn = await page.locator('button:has-text("Continue Shopping")');
    await expect(continueShoppingBtn).toBeVisible();
    const checkoutBtn = await page.locator('[data-test="checkout"]');
    await expect(checkoutBtn).toBeVisible();
  });

  test('TC1.4: Continue Shopping returns to inventory', async ({ page }) => {
    // Step 1: Login, add items, navigate to cart
    await login(page);
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
    
    await page.click('[data-test="shopping-cart-link"]');
    await page.waitForURL('**/cart.html');
    
    // Verify cart badge shows 2
    const cartBadge = await page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toContainText('2');
    
    // Step 2: Click Continue Shopping button
    await page.click('button:has-text("Continue Shopping")');
    
    // Step 3: Verify redirect to inventory
    await expect(page).toHaveURL(BASE_URL + '/inventory.html');
    
    // Verify cart items are preserved
    await expect(cartBadge).toContainText('2');
  });
});
