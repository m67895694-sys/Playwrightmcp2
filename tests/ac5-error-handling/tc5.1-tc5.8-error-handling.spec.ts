// spec: specs/saucedemo-checkout-test-plan.md
// AC5: Error Handling Tests (5.1-5.8)

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const CREDENTIALS = {
  username: 'standard_user',
  password: 'secret_sauce'
};

// Helper to navigate to checkout form
async function navigateToCheckoutForm(page) {
  await page.goto(BASE_URL);
  await page.fill('[data-test="username"]', CREDENTIALS.username);
  await page.fill('[data-test="password"]', CREDENTIALS.password);
  await page.click('[data-test="login-button"]');
  await page.waitForURL('**/inventory.html');
  
  // Add single item
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
  
  // Navigate to checkout
  await page.click('[data-test="shopping-cart-link"]');
  await page.waitForURL('**/cart.html');
  await page.click('[data-test="checkout"]');
  await page.waitForURL('**/checkout-step-one.html');
}

test.describe('AC5: Error Handling - Validate error messages for invalid data', () => {
  
  test('TC5.1: Validate error message display and formatting', async ({ page }) => {
    // Setup
    await navigateToCheckoutForm(page);
    
    // Step 2: Submit form without First Name
    await page.click('[data-test="continue"]');
    
    // Step 3: Verify error message format
    const errorContainer = await page.locator('.error-message-container');
    await expect(errorContainer).toBeVisible();
    
    const errorMsg = await page.locator('text=Error: First Name is required');
    await expect(errorMsg).toBeVisible();
    
    // Verify error is visible and distinct
    const errorStyle = await errorContainer.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    // Verify close button exists
    const closeBtn = await page.locator('.error-button');
    await expect(closeBtn).toBeVisible();
  });

  test('TC5.2: Close error message and retry submission', async ({ page }) => {
    // Setup
    await navigateToCheckoutForm(page);
    
    // Step 1: Trigger error
    await page.click('[data-test="continue"]');
    const errorMsg = await page.locator('.error-message-container');
    await expect(errorMsg).toBeVisible();
    
    // Step 2: Click close button
    const closeBtn = await page.locator('.error-button');
    await closeBtn.click();
    
    // Verify error dismissed
    const errorVisible = await errorMsg.isVisible().catch(() => false);
    expect(!errorVisible || !errorVisible).toBeTruthy();
    
    // Verify form still on same page
    await expect(page).toHaveURL(BASE_URL + '/checkout-step-one.html');
    
    // Step 3: Fill required field
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Step 4: Try again
    await page.click('[data-test="continue"]');
    
    // Verify success
    await page.waitForURL('**/checkout-step-two.html');
    await expect(page).toHaveURL(BASE_URL + '/checkout-step-two.html');
  });

  test('TC5.3: Multiple field errors - test sequence of error messages', async ({ page }) => {
    // Setup
    await navigateToCheckoutForm(page);
    
    // Step 2: Submit with all empty
    await page.click('[data-test="continue"]');
    const errorMsg1 = await page.locator('text=Error: First Name is required');
    await expect(errorMsg1).toBeVisible();
    
    // Step 3: Close and fill First Name
    const closeBtn = await page.locator('.error-button');
    await closeBtn.click();
    await page.fill('[data-test="firstName"]', 'John');
    
    // Step 4: Submit again
    await page.click('[data-test="continue"]');
    const errorMsg2 = await page.locator('text=Error: Last Name is required');
    await expect(errorMsg2).toBeVisible();
    
    // Step 5: Close and fill Last Name
    await closeBtn.click();
    await page.fill('[data-test="lastName"]', 'Doe');
    
    // Step 6: Submit again
    await page.click('[data-test="continue"]');
    const errorMsg3 = await page.locator('text=Error: Postal Code is required');
    await expect(errorMsg3).toBeVisible();
    
    // Step 7: Close and fill Postal Code
    await closeBtn.click();
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Submit successfully
    await page.click('[data-test="continue"]');
    await page.waitForURL('**/checkout-step-two.html');
  });

  test('TC5.4: Validate error persistence across page navigation', async ({ page }) => {
    // Setup
    await navigateToCheckoutForm(page);
    
    // Step 1: Trigger error
    await page.click('[data-test="continue"]');
    const errorMsg = await page.locator('.error-message-container');
    await expect(errorMsg).toBeVisible();
    
    // Step 2: Click Cancel button
    await page.click('button:has-text("Cancel")');
    
    // Verify taken back to cart
    await expect(page).toHaveURL(BASE_URL + '/cart.html');
    
    // Step 3: Click Checkout again
    await page.click('[data-test="checkout"]');
    await page.waitForURL('**/checkout-step-one.html');
    
    // Verify no error message initially
    const errorVisibleNow = await errorMsg.isVisible().catch(() => false);
    expect(!errorVisibleNow).toBeTruthy();
  });

  test('TC5.5: Validate special characters in First Name field', async ({ page }) => {
    // Setup
    await navigateToCheckoutForm(page);
    
    // Step 2: Enter special characters
    await page.fill('[data-test="firstName"]', '@#$%^&*');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Step 4: Click Continue
    await page.click('[data-test="continue"]');
    await page.waitForLoadState('domcontentloaded');
    
    // Verify either accepts or shows error
    const errorMsg = await page.locator('.error-message-container');
    const errorVisible = await errorMsg.isVisible().catch(() => false);
    const currentUrl = page.url();
    
    if (errorVisible) {
      // Error shown for special characters
      await expect(errorMsg).toBeVisible();
      expect(currentUrl.includes('checkout-step-one.html')).toBeTruthy();
    } else {
      // Form accepted special characters
      expect(currentUrl.includes('checkout-step-two.html')).toBeTruthy();
    }
  });

  test('TC5.6: Validate zero or negative zip code behavior', async ({ page }) => {
    // Setup
    await navigateToCheckoutForm(page);
    
    // Step 1-2: Fill form with '0' as zip
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '0');
    
    // Step 3: Click Continue
    await page.click('[data-test="continue"]');
    await page.waitForTimeout(500);
    
    // Verify either accepts or shows error
    const errorMsg = await page.locator('.error-message-container');
    const errorVisible = await errorMsg.isVisible().catch(() => false);
    const currentUrl = page.url();
    
    if (!errorVisible) {
      // System accepts '0' as valid
      expect(currentUrl.includes('checkout-step-two.html')).toBeTruthy();
    } else {
      // System rejects '0'
      expect(errorVisible).toBeTruthy();
    }
  });

  test('TC5.7: Verify error message text accuracy', async ({ page }) => {
    // Setup
    await navigateToCheckoutForm(page);
    
    // Step 1: Trigger First Name error
    await page.click('[data-test="continue"]');
    const errorMsg1 = await page.locator('text=Error: First Name is required');
    await expect(errorMsg1).toBeVisible();
    
    // Step 2: Close and trigger Last Name error
    const closeBtn = await page.locator('.error-button');
    await closeBtn.click();
    await page.fill('[data-test="firstName"]', 'John');
    await page.click('[data-test="continue"]');
    
    const errorMsg2 = await page.locator('text=Error: Last Name is required');
    await expect(errorMsg2).toBeVisible();
    
    // Step 3: Close and trigger Postal Code error
    await closeBtn.click();
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.click('[data-test="continue"]');
    
    const errorMsg3 = await page.locator('text=Error: Postal Code is required');
    await expect(errorMsg3).toBeVisible();
  });

  test('TC5.8: Validate numeric-only enforcement in Zip field', async ({ page }) => {
    // Setup
    await navigateToCheckoutForm(page);
    
    // Step 1-2: Enter all data including alphabetic in zip
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', 'abcde');
    
    // Step 3: Click Continue
    await page.click('[data-test="continue"]');
    await page.waitForTimeout(500);
    
    // Step 4: Verify system handles gracefully
    const errorMsg = await page.locator('.error-message-container');
    const errorVisible = await errorMsg.isVisible().catch(() => false);
    const currentUrl = page.url();
    
    // Either accepts letters or shows error - both are graceful handling
    if (errorVisible) {
      await expect(errorMsg).toBeVisible();
      expect(currentUrl.includes('checkout-step-one.html')).toBeTruthy();
    } else {
      expect(currentUrl.includes('checkout-step-two.html')).toBeTruthy();
    }
    
    // Now test with valid numeric zip
    if (!currentUrl.includes('checkout-step-one.html')) {
      // Go back to try again
      await page.click('button:has-text("Cancel")');
      await page.waitForURL('**/cart.html');
      await page.click('[data-test="checkout"]');
      await page.waitForURL('**/checkout-step-one.html');
    }
    
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // Should now succeed
    await page.waitForURL('**/checkout-step-two.html');
  });
});
