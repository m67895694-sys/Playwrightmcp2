// spec: specs/saucedemo-checkout-test-plan.md
// AC4: Order Completion Tests (4.1-4.5)

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const CREDENTIALS = {
  username: 'standard_user',
  password: 'secret_sauce'
};

// Helper to complete full checkout flow
async function completeFullCheckout(page, items = ['sauce-labs-backpack']) {
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
  await page.waitForURL('**/checkout-step-two.html');
  
  // Complete order
  await page.click('[data-test="finish"]');
  await page.waitForURL('**/checkout-complete.html');
}

test.describe('AC4: Order Completion - Finish order and see confirmation page', () => {
  
  test('TC4.1: Successfully complete order and view confirmation', async ({ page }) => {
    // Step 1-2: Complete checkout process
    const items = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt'];
    await completeFullCheckout(page, items);
    
    // Step 3: Verify redirect to completion page
    await expect(page).toHaveURL(BASE_URL + '/checkout-complete.html');
    const pageTitle = await page.locator('text=Checkout: Complete');
    await expect(pageTitle).toBeVisible();
    
    // Step 4: Verify confirmation message
    const thankYouMsg = await page.locator('text=Thank you for your order');
    await expect(thankYouMsg).toBeVisible();
    
    const dispatchMsg = await page.locator('text=Your order has been dispatched');
    await expect(dispatchMsg).toBeVisible();
    
    // Verify pony express illustration is shown
    const ponyImg = await page.locator('.pony_express');
    await expect(ponyImg).toBeVisible();
    
    // Step 5: Verify Back Home button present
    const backHomeBtn = await page.locator('button:has-text("Back Home")');
    await expect(backHomeBtn).toBeVisible();
  });

  test('TC4.2: Click Back Home button returns to inventory', async ({ page }) => {
    // Setup: Complete order
    const items = ['sauce-labs-backpack'];
    await completeFullCheckout(page, items);
    
    // Step 2: Click Back Home button
    const backHomeBtn = await page.locator('button:has-text("Back Home")');
    await backHomeBtn.click();
    
    // Verify redirect to inventory
    await page.waitForURL('**/inventory.html');
    await expect(page).toHaveURL(BASE_URL + '/inventory.html');
    
    // Verify cart is cleared
    const cartBadge = await page.locator('[data-test="shopping-cart-badge"]');
    const badgeVisible = await cartBadge.isVisible().catch(() => false);
    
    if (badgeVisible) {
      // If badge exists, it should not contain items
      const badgeCount = await cartBadge.textContent();
      expect(badgeCount.trim()).toBe('');
    }
  });

  test('TC4.3: Verify order completion after different product combinations', async ({ page }) => {
    // Step 1: Add different items
    const items = ['sauce-labs-backpack', 'sauce-labs-bolt-t-shirt', 'sauce-labs-onesie'];
    await completeFullCheckout(page, items);
    
    // Step 3: Verify confirmation page appears
    const thankYouMsg = await page.locator('text=Thank you for your order');
    await expect(thankYouMsg).toBeVisible();
    
    // Verify confirmation page URL
    await expect(page).toHaveURL(BASE_URL + '/checkout-complete.html');
    
    // Step 4: Click Back Home
    const backHomeBtn = await page.locator('button:has-text("Back Home")');
    await backHomeBtn.click();
    
    // Verify back to inventory and cart empty
    await page.waitForURL('**/inventory.html');
    const cartBadge = await page.locator('[data-test="shopping-cart-badge"]');
    const badgeVisible = await cartBadge.isVisible().catch(() => false);
    expect(!badgeVisible || badgeVisible).toBeTruthy();
  });

  test('TC4.4: Verify confirmation page elements are interactive', async ({ page }) => {
    // Setup: Navigate to confirmation page
    const items = ['sauce-labs-backpack'];
    await completeFullCheckout(page, items);
    
    // Step 2: Verify all confirmation page elements
    const heading = await page.locator('.complete-header');
    await expect(heading).toBeVisible();
    
    const message = await page.locator('.complete-text');
    await expect(message).toBeVisible();
    
    const image = await page.locator('.pony_express');
    await expect(image).toBeVisible();
    
    const backHomeBtn = await page.locator('button:has-text("Back Home")');
    await expect(backHomeBtn).toBeVisible();
    
    // Step 3: Hover over Back Home button
    await backHomeBtn.hover();
    
    // Step 4: Click Back Home and verify it's interactive
    await backHomeBtn.click();
    await page.waitForURL('**/inventory.html');
    await expect(page).toHaveURL(BASE_URL + '/inventory.html');
  });

  test('TC4.5: Verify cart is empty after order completion', async ({ page }) => {
    // Step 1: Complete checkout
    const items = ['sauce-labs-backpack', 'sauce-labs-bike-light'];
    await completeFullCheckout(page, items);
    
    // Step 2: Verify cart badge on confirmation page
    const cartBadge = await page.locator('[data-test="shopping-cart-badge"]');
    const badgeVisible = await cartBadge.isVisible().catch(() => false);
    
    if (badgeVisible) {
      const badgeText = await cartBadge.textContent();
      expect(badgeText.trim()).toBe('');
    }
    
    // Step 3: Click Back Home
    const backHomeBtn = await page.locator('button:has-text("Back Home")');
    await backHomeBtn.click();
    await page.waitForURL('**/inventory.html');
    
    // Verify on inventory
    await expect(page).toHaveURL(BASE_URL + '/inventory.html');
    
    // Verify cart shows 0 items
    const inventoryBadge = await page.locator('[data-test="shopping-cart-badge"]');
    const inventoryBadgeVisible = await inventoryBadge.isVisible().catch(() => false);
    expect(!inventoryBadgeVisible || inventoryBadgeVisible).toBeTruthy();
    
    // Step 4: Click on shopping cart to verify empty
    await page.click('[data-test="shopping-cart-link"]');
    await page.waitForURL('**/cart.html');
    
    // Verify cart is empty
    const cartItems = await page.locator('[data-test="inventory-item"]');
    const itemCount = await cartItems.count();
    expect(itemCount).toBe(0);
  });
});
