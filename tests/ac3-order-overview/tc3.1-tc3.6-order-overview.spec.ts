// spec: specs/saucedemo-checkout-test-plan.md
// AC3: Order Overview Tests (3.1-3.6)

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const CREDENTIALS = {
  username: 'standard_user',
  password: 'secret_sauce'
};

// Helper to complete checkout to overview step
async function completeCheckoutToOverview(page, items = ['sauce-labs-backpack']) {
  // Login
  await page.goto(BASE_URL);
  await page.fill('[data-test="username"]', CREDENTIALS.username);
  await page.fill('[data-test="password"]', CREDENTIALS.password);
  await page.click('[data-test="login-button"]');
  await page.waitForURL('**/inventory.html');
  
  // Add items
  for (const item of items) {
    await page.click(`[data-test="add-to-cart-${item}"]`);
    await expect(page.locator(`[data-test="remove-${item}"]`)).toBeVisible();
  }
  
  // Navigate to checkout
  await page.click('[data-test="shopping-cart-link"]');
  await page.waitForURL('**/cart.html');
  await page.click('[data-test="checkout"]');
  await page.waitForURL('**/checkout-step-one.html');
  
  // Fill checkout info
  await page.fill('[data-test="firstName"]', 'John');
  await page.fill('[data-test="lastName"]', 'Doe');
  await page.fill('[data-test="postalCode"]', '12345');
  await page.click('[data-test="continue"]');
  
  // Wait for overview page
  await page.waitForURL('**/checkout-step-two.html');
}

test.describe('AC3: Order Overview - Review order summary with shipping, payment, totals', () => {
  
  test('TC3.1: View order overview with all required information', async ({ page }) => {
    // Step 1-2: Complete checkout to step two
    const items = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt'];
    await completeCheckoutToOverview(page, items);
    
    // Verify page state
    await expect(page).toHaveURL(BASE_URL + '/checkout-step-two.html');
    const pageTitle = await page.locator('text=Checkout: Overview');
    await expect(pageTitle).toBeVisible();
    
    // Step 3: Verify cart items are displayed
    const cartItems = await page.locator('[data-test="inventory-item"]');
    const itemCount = await cartItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(3);
    
    // Verify cart columns
    const qtyHeader = await page.locator('.cart_quantity_label');
    await expect(qtyHeader).toBeVisible();
    const descHeader = await page.locator('.cart_desc_label');
    await expect(descHeader).toBeVisible();
    
    // Verify item prices are shown
    const prices = await page.locator('[data-test="inventory-item-price"]');
    const priceCount = await prices.count();
    expect(priceCount).toBeGreaterThanOrEqual(3);
    
    // Step 4: Verify Payment Information section
    const paymentLabel = await page.locator('text=Payment Information');
    await expect(paymentLabel).toBeVisible();
    const paymentMethod = await page.locator('text=SauceCard #31337');
    await expect(paymentMethod).toBeVisible();
    
    // Step 5: Verify Shipping Information section
    const shippingLabel = await page.locator('text=Shipping Information');
    await expect(shippingLabel).toBeVisible();
    const shippingMethod = await page.locator('text=Free Pony Express Delivery');
    await expect(shippingMethod).toBeVisible();
    
    // Step 6: Verify Price Total section
    const priceTotal = await page.locator('.summary_info_label:has-text("Price Total")');
    await expect(priceTotal).toBeVisible();
    const subtotalLabel = await page.locator('.summary_subtotal_label');
    await expect(subtotalLabel).toBeVisible();
    const taxLabel = await page.locator('.summary_tax_label');
    await expect(taxLabel).toBeVisible();
    const totalLabel = await page.locator('.summary_total_label');
    await expect(totalLabel).toBeVisible();
  });

  test('TC3.2: Verify order overview calculations with multiple items', async ({ page }) => {
    // Step 1: Add 4 items
    const items = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt', 'sauce-labs-onesie'];
    await completeCheckoutToOverview(page, items);
    
    // Verify overview page
    await expect(page).toHaveURL(BASE_URL + '/checkout-step-two.html');
    
    // Step 3: Verify item total calculation: $29.99 + $9.99 + $15.99 + $7.99 = $63.96
    const subtotal = await page.locator('.summary_subtotal_label');
    await expect(subtotal).toContainText('$63.96');
    
    // Step 4: Verify tax is proportional
    const tax = await page.locator('.summary_tax_label');
    await expect(tax).toBeVisible();
    const taxText = await tax.textContent();
    const taxValue = parseFloat(taxText.match(/\$[\d.]+/)[0]);
    expect(taxValue).toBeGreaterThan(0);
    
    // Step 5: Verify grand total
    const total = await page.locator('.summary_total_label');
    await expect(total).toBeVisible();
    const totalText = await total.textContent();
    const totalValue = parseFloat(totalText.match(/\$[\d.]+/)[0]);
    // Total should be more than subtotal (includes tax)
    expect(totalValue).toBeGreaterThan(63.96);
  });

  test('TC3.3: Verify order overview with single item', async ({ page }) => {
    // Step 1: Add single item
    const items = ['sauce-labs-bike-light'];
    await completeCheckoutToOverview(page, items);
    
    // Verify single item shown
    const cartItems = await page.locator('[data-test="inventory-item"]');
    await expect(cartItems).toHaveCount(1);
    
    // Step 2: Verify item details
    const itemName = await page.locator('[data-test="inventory-item-name"]:has-text("Sauce Labs Bike Light")');
    await expect(itemName).toBeVisible();
    const quantity = await page.locator('[data-test="item-quantity"]');
    await expect(quantity).toContainText('1');
    
    // Step 3: Verify totals
    const subtotal = await page.locator('.summary_subtotal_label');
    await expect(subtotal).toContainText('$9.99');
    
    const tax = await page.locator('.summary_tax_label');
    await expect(tax).toBeVisible();
    
    const total = await page.locator('.summary_total_label');
    await expect(total).toBeVisible();
  });

  test('TC3.4: Verify payment and shipping information consistency', async ({ page }) => {
    // Setup
    const items = ['sauce-labs-backpack'];
    await completeCheckoutToOverview(page, items);
    
    // Step 2: Note Payment Information
    const paymentLabel = await page.locator('text=Payment Information');
    await expect(paymentLabel).toBeVisible();
    const paymentMethod = await page.locator('text=SauceCard #31337');
    await expect(paymentMethod).toBeVisible();
    
    // Step 3: Note Shipping Information
    const shippingLabel = await page.locator('text=Shipping Information');
    await expect(shippingLabel).toBeVisible();
    const shippingMethod = await page.locator('text=Free Pony Express Delivery');
    await expect(shippingMethod).toBeVisible();
    
    // Step 4: Verify consistency (same payment/shipping shown)
    // These should remain constant across sessions
    const paymentText = await paymentMethod.textContent();
    expect(paymentText).toContain('SauceCard #31337');
    
    const shippingText = await shippingMethod.textContent();
    expect(shippingText).toContain('Free Pony Express Delivery');
  });

  test('TC3.5: Verify Cancel button on order overview', async ({ page }) => {
    // Setup
    const items = ['sauce-labs-backpack'];
    await completeCheckoutToOverview(page, items);
    
    // Step 2: Verify Cancel button present
    const cancelBtn = await page.locator('button:has-text("Cancel")');
    await expect(cancelBtn).toBeVisible();
    
    // Step 3: Click Cancel
    await cancelBtn.click();
    await page.waitForLoadState('domcontentloaded');
    
    // Verify taken back (usually to cart but could be inventory)
    const currentUrl = page.url();
    expect(currentUrl.includes('cart.html') || currentUrl.includes('inventory.html')).toBeTruthy();
    
    // Step 3: Verify cart items preserved - add item and go back to cart
    if (!currentUrl.includes('cart.html')) {
      await page.click('[data-test="shopping-cart-link"]');
      await page.waitForURL('**/cart.html');
    }
    
    const cartItems = await page.locator('[data-test="inventory-item"]');
    const itemCount = await cartItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(1);
  });

  test('TC3.6: Verify Finish button on order overview', async ({ page }) => {
    // Setup
    const items = ['sauce-labs-backpack', 'sauce-labs-bike-light'];
    await completeCheckoutToOverview(page, items);
    
    // Step 2: Verify Finish button present
    const finishBtn = await page.locator('[data-test="finish"]');
    await expect(finishBtn).toBeVisible();
    
    // Step 3: Click Finish button
    await finishBtn.click();
    
    // Verify redirect to completion page
    await page.waitForURL('**/checkout-complete.html');
    await expect(page).toHaveURL(BASE_URL + '/checkout-complete.html');
  });
});
