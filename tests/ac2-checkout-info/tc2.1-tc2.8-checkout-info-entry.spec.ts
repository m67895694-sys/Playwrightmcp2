// spec: specs/saucedemo-checkout-test-plan.md
// AC2: Checkout Info Entry Tests (2.1-2.8)

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const CREDENTIALS = {
  username: 'standard_user',
  password: 'secret_sauce'
};

// Helper to login and add items
async function loginAndAddItems(page, itemCount = 1) {
  await page.goto(BASE_URL);
  await page.fill('[data-test="username"]', CREDENTIALS.username);
  await page.fill('[data-test="password"]', CREDENTIALS.password);
  await page.click('[data-test="login-button"]');
  await page.waitForURL('**/inventory.html');
  
  if (itemCount >= 1) {
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
  }
}

// Helper to navigate to checkout
async function navigateToCheckout(page) {
  await page.click('[data-test="shopping-cart-link"]');
  await page.waitForURL('**/cart.html');
  await page.click('[data-test="checkout"]');
  await page.waitForURL('**/checkout-step-one.html');
}

test.describe('AC2: Checkout Info Entry - Enter First Name, Last Name, Zip/Postal Code', () => {
  
  test('TC2.1: Successfully enter valid checkout information', async ({ page }) => {
    // Setup: Login and add items
    await loginAndAddItems(page);
    
    // Step 1: Proceed to checkout step one
    await navigateToCheckout(page);
    
    // Verify checkout page
    await expect(page).toHaveURL(BASE_URL + '/checkout-step-one.html');
    const pageTitle = await page.locator('text=Checkout: Your Information');
    await expect(pageTitle).toBeVisible();
    
    // Step 2: Verify all required fields are present
    const firstNameField = await page.locator('[data-test="firstName"]');
    await expect(firstNameField).toBeVisible();
    const lastNameField = await page.locator('[data-test="lastName"]');
    await expect(lastNameField).toBeVisible();
    const postalCodeField = await page.locator('[data-test="postalCode"]');
    await expect(postalCodeField).toBeVisible();
    
    // Step 3: Enter valid information
    await firstNameField.fill('John');
    await lastNameField.fill('Doe');
    await postalCodeField.fill('12345');
    
    // Verify values are displayed
    await expect(firstNameField).toHaveValue('John');
    await expect(lastNameField).toHaveValue('Doe');
    await expect(postalCodeField).toHaveValue('12345');
    
    // Step 4: Click Continue button
    await page.click('[data-test="continue"]');
    
    // Verify navigation to checkout step two
    await page.waitForURL('**/checkout-step-two.html');
    const stepTwoTitle = await page.locator('text=Checkout: Overview');
    await expect(stepTwoTitle).toBeVisible();
  });

  test('TC2.2: Validate error message when First Name is empty', async ({ page }) => {
    // Setup
    await loginAndAddItems(page);
    await navigateToCheckout(page);
    
    // Step 2: Leave First Name empty, fill others
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Step 3: Click Continue without First Name
    await page.click('[data-test="continue"]');
    
    // Verify error message
    const errorMsg = await page.locator('.error-message-container');
    await expect(errorMsg).toBeVisible();
    const errorText = await page.locator('text=Error: First Name is required');
    await expect(errorText).toBeVisible();
    
    // Step 4: Verify close button
    const closeBtn = await page.locator('.error-button');
    await expect(closeBtn).toBeVisible();
  });

  test('TC2.3: Validate error message when Last Name is empty', async ({ page }) => {
    // Setup
    await loginAndAddItems(page);
    await navigateToCheckout(page);
    
    // Step 2: Leave Last Name empty
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Step 3: Click Continue
    await page.click('[data-test="continue"]');
    
    // Verify error message for Last Name
    const errorMsg = await page.locator('.error-message-container');
    await expect(errorMsg).toBeVisible();
    const errorText = await page.locator('text=Error: Last Name is required');
    await expect(errorText).toBeVisible();
    
    // Verify still on checkout step one
    await expect(page).toHaveURL(BASE_URL + '/checkout-step-one.html');
  });

  test('TC2.4: Validate error message when Zip/Postal Code is empty', async ({ page }) => {
    // Setup
    await loginAndAddItems(page);
    await navigateToCheckout(page);
    
    // Step 2: Leave Postal Code empty
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    
    // Step 3: Click Continue
    await page.click('[data-test="continue"]');
    
    // Verify error message
    const errorMsg = await page.locator('.error-message-container');
    await expect(errorMsg).toBeVisible();
    const errorText = await page.locator('text=Error: Postal Code is required');
    await expect(errorText).toBeVisible();
    
    // Verify no form submission
    await expect(page).toHaveURL(BASE_URL + '/checkout-step-one.html');
  });

  test('TC2.5: Validate error when all fields are empty', async ({ page }) => {
    // Setup
    await loginAndAddItems(page);
    await navigateToCheckout(page);
    
    // Step 2: Click Continue with all empty fields
    await page.click('[data-test="continue"]');
    
    // Verify error appears for first field
    const errorMsg = await page.locator('.error-message-container');
    await expect(errorMsg).toBeVisible();
    const errorText = await page.locator('text=Error: First Name is required');
    await expect(errorText).toBeVisible();
    
    // Verify no submission
    await expect(page).toHaveURL(BASE_URL + '/checkout-step-one.html');
  });

  test('TC2.6: Validate alphanumeric and special characters in First Name', async ({ page }) => {
    // Setup
    await loginAndAddItems(page);
    await navigateToCheckout(page);
    
    // Step 2: Enter special characters
    await page.fill('[data-test="firstName"]', 'John-@#$%');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Step 3: Click Continue
    await page.click('[data-test="continue"]');
    await page.waitForTimeout(500);
    
    // Verify either accepts and proceeds OR shows error
    const currentUrl = page.url();
    const errorMsg = await page.locator('.error-message-container');
    const errorVisible = await errorMsg.isVisible().catch(() => false);
    
    if (!errorVisible) {
      // Form accepted special characters
      await expect(page).toHaveURL(BASE_URL + '/checkout-step-two.html');
    } else {
      // Error shown for special characters
      await expect(errorMsg).toBeVisible();
    }
  });

  test('TC2.7: Validate very long zip code entries (>10 digits)', async ({ page }) => {
    // Setup
    await loginAndAddItems(page);
    await navigateToCheckout(page);
    
    // Step 2: Enter long zip code
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '123456789012345');
    
    // Step 3: Click Continue
    await page.click('[data-test="continue"]');
    await page.waitForTimeout(500);
    
    // Verify system handles gracefully - either accepts or validates
    const errorMsg = await page.locator('.error-message-container');
    const errorVisible = await errorMsg.isVisible().catch(() => false);
    
    if (!errorVisible) {
      await expect(page).toHaveURL(BASE_URL + '/checkout-step-two.html');
    } else {
      await expect(errorMsg).toBeVisible();
    }
  });

  test('TC2.8: Verify field focus and tab navigation', async ({ page }) => {
    // Setup
    await loginAndAddItems(page);
    await navigateToCheckout(page);
    
    // Step 2: Click on First Name field
    const firstNameField = await page.locator('[data-test="firstName"]');
    await firstNameField.focus();
    await expect(firstNameField).toBeFocused();
    
    // Step 3: Press Tab to move to Last Name
    await page.keyboard.press('Tab');
    const lastNameField = await page.locator('[data-test="lastName"]');
    await expect(lastNameField).toBeFocused();
    
    // Step 4: Press Tab to move to Postal Code
    await page.keyboard.press('Tab');
    const postalCodeField = await page.locator('[data-test="postalCode"]');
    await expect(postalCodeField).toBeFocused();
    
    // Step 5: Press Tab to move to Continue button or next focusable element
    await page.keyboard.press('Tab');
    const continueBtn = await page.locator('[data-test="continue"]');
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-test'));
    expect(focused).toMatch(/continue|cancel/);
  });
});
