# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ac1-cart-review\tc1.1-tc1.4-cart-review.spec.ts >> AC1: Cart Review - View cart items with details and totals >> TC1.1: View cart with multiple items and verify item details
- Location: tests\ac1-cart-review\tc1.1-tc1.4-cart-review.spec.ts:23:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Sauce Labs Bolt T-Shirt')
Expected: visible
Error: strict mode violation: locator('text=Sauce Labs Bolt T-Shirt') resolved to 2 elements:
    1) <div class="inventory_item_name" data-test="inventory-item-name">Sauce Labs Bolt T-Shirt</div> aka locator('[data-test="item-1-title-link"]')
    2) <div class="inventory_item_desc" data-test="inventory-item-desc">Get your testing superhero on with the Sauce Labs…</div> aka getByText('Get your testing superhero on')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Sauce Labs Bolt T-Shirt')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - button "Open Menu" [ref=e8] [cursor=pointer]
          - img "Open Menu" [ref=e9]
        - generic [ref=e11]: Swag Labs
        - generic [ref=e14]: "3"
      - generic [ref=e16]: Your Cart
    - generic [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e20]: QTY
        - generic [ref=e21]: Description
        - generic [ref=e22]:
          - generic [ref=e23]: "1"
          - generic [ref=e24]:
            - link "Sauce Labs Backpack" [ref=e25] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e26]: Sauce Labs Backpack
            - generic [ref=e27]: carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.
            - generic [ref=e28]:
              - generic [ref=e29]: $29.99
              - button "Remove" [ref=e30] [cursor=pointer]
        - generic [ref=e31]:
          - generic [ref=e32]: "1"
          - generic [ref=e33]:
            - link "Sauce Labs Bike Light" [ref=e34] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e35]: Sauce Labs Bike Light
            - generic [ref=e36]: A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.
            - generic [ref=e37]:
              - generic [ref=e38]: $9.99
              - button "Remove" [ref=e39] [cursor=pointer]
        - generic [ref=e40]:
          - generic [ref=e41]: "1"
          - generic [ref=e42]:
            - link "Sauce Labs Bolt T-Shirt" [ref=e43] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e44]: Sauce Labs Bolt T-Shirt
            - generic [ref=e45]: Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.
            - generic [ref=e46]:
              - generic [ref=e47]: $15.99
              - button "Remove" [ref=e48] [cursor=pointer]
      - generic [ref=e49]:
        - button "Go back Continue Shopping" [ref=e50] [cursor=pointer]:
          - img "Go back" [ref=e51]
          - text: Continue Shopping
        - button "Checkout" [ref=e52] [cursor=pointer]
  - contentinfo [ref=e53]:
    - list [ref=e54]:
      - listitem [ref=e55]:
        - link "Twitter" [ref=e56] [cursor=pointer]:
          - /url: https://twitter.com/saucelabs
      - listitem [ref=e57]:
        - link "Facebook" [ref=e58] [cursor=pointer]:
          - /url: https://www.facebook.com/saucelabs
      - listitem [ref=e59]:
        - link "LinkedIn" [ref=e60] [cursor=pointer]:
          - /url: https://www.linkedin.com/company/sauce-labs/
    - generic [ref=e61]: © 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy
```

# Test source

```ts
  1   | // spec: specs/saucedemo-checkout-test-plan.md
  2   | // AC1: Cart Review Tests (1-4)
  3   | 
  4   | import { test, expect } from '@playwright/test';
  5   | 
  6   | const BASE_URL = 'https://www.saucedemo.com';
  7   | const CREDENTIALS = {
  8   |   username: 'standard_user',
  9   |   password: 'secret_sauce'
  10  | };
  11  | 
  12  | // Helper function to login
  13  | async function login(page) {
  14  |   await page.goto(BASE_URL);
  15  |   await page.fill('[data-test="username"]', CREDENTIALS.username);
  16  |   await page.fill('[data-test="password"]', CREDENTIALS.password);
  17  |   await page.click('[data-test="login-button"]');
  18  |   await page.waitForURL('**/inventory.html');
  19  | }
  20  | 
  21  | test.describe('AC1: Cart Review - View cart items with details and totals', () => {
  22  |   
  23  |   test('TC1.1: View cart with multiple items and verify item details', async ({ page }) => {
  24  |     // Step 1: Login and land on inventory page
  25  |     await login(page);
  26  |     const userLoggedIn = await page.locator('[data-test="inventory-list"]');
  27  |     await expect(userLoggedIn).toBeVisible();
  28  |     
  29  |     // Step 2: Add 3 different items to cart
  30  |     await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  31  |     await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
  32  |     await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
  33  |     await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
  34  |     await page.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
  35  |     await expect(page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]')).toBeVisible();
  36  |     
  37  |     // Verify cart badge shows count of 3 items
  38  |     const cartBadge = await page.locator('[data-test="shopping-cart-badge"]');
  39  |     await expect(cartBadge).toContainText('3');
  40  |     
  41  |     // Step 3: Click on shopping cart icon
  42  |     await page.click('[data-test="shopping-cart-link"]');
  43  |     
  44  |     // Step 4: Verify cart page elements
  45  |     await expect(page).toHaveURL(BASE_URL + '/cart.html');
  46  |     
  47  |     // Verify all 3 items are displayed
  48  |     const cartItems = await page.locator('[data-test="inventory-item"]');
  49  |     await expect(cartItems).toHaveCount(3);
  50  |     
  51  |     // Verify item details - Backpack
  52  |     const backpackName = await page.locator('text=Sauce Labs Backpack');
  53  |     await expect(backpackName).toBeVisible();
  54  |     let backpackPrice = await page.locator('[data-test="inventory-item-price"]:has-text("$29.99")');
  55  |     await expect(backpackPrice).toBeVisible();
  56  |     
  57  |     // Verify item details - Bike Light
  58  |     const bikeLightName = await page.locator('text=Sauce Labs Bike Light');
  59  |     await expect(bikeLightName).toBeVisible();
  60  |     let bikeLightPrice = await page.locator('[data-test="inventory-item-price"]:has-text("$9.99")');
  61  |     await expect(bikeLightPrice).toBeVisible();
  62  |     
  63  |     // Verify item details - T-Shirt
  64  |     const tshirtName = await page.locator('text=Sauce Labs Bolt T-Shirt');
> 65  |     await expect(tshirtName).toBeVisible();
      |                              ^ Error: expect(locator).toBeVisible() failed
  66  |     let tshirtPrice = await page.locator('[data-test="inventory-item-price"]:has-text("$15.99")');
  67  |     await expect(tshirtPrice).toBeVisible();
  68  |     
  69  |     // Step 5: Verify navigation buttons
  70  |     const continueShoppingBtn = await page.locator('button:has-text("Continue Shopping")');
  71  |     await expect(continueShoppingBtn).toBeVisible();
  72  |     const checkoutBtn = await page.locator('[data-test="checkout"]');
  73  |     await expect(checkoutBtn).toBeVisible();
  74  |   });
  75  | 
  76  |   test('TC1.2: Verify cart totals calculation', async ({ page }) => {
  77  |     // Step 1: Login and add items
  78  |     await login(page);
  79  |     await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  80  |     await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
  81  |     await page.click('[data-test="add-to-cart-sauce-labs-onesie"]');
  82  |     await expect(page.locator('[data-test="remove-sauce-labs-onesie"]')).toBeVisible();
  83  |     
  84  |     // Step 2: Navigate to cart page
  85  |     await page.click('[data-test="shopping-cart-link"]');
  86  |     await page.waitForURL('**/cart.html');
  87  |     
  88  |     // Verify cart shows 2 items
  89  |     const cartItems = await page.locator('[data-test="inventory-item"]');
  90  |     await expect(cartItems).toHaveCount(2);
  91  |     
  92  |     // Step 3: Review layout
  93  |     const qtyColumn = await page.locator('.cart_quantity_label');
  94  |     await expect(qtyColumn).toBeVisible();
  95  |     const descColumn = await page.locator('.cart_desc_label');
  96  |     await expect(descColumn).toBeVisible();
  97  |     
  98  |     // Each item displays price
  99  |     const prices = await page.locator('[data-test="inventory-item-price"]');
  100 |     const priceCount = await prices.count();
  101 |     expect(priceCount).toBeGreaterThanOrEqual(2);
  102 |     
  103 |     // Step 4: Verify totals by proceeding to checkout overview
  104 |     await page.click('[data-test="checkout"]');
  105 |     
  106 |     // Enter checkout information
  107 |     await page.fill('[data-test="firstName"]', 'John');
  108 |     await page.fill('[data-test="lastName"]', 'Doe');
  109 |     await page.fill('[data-test="postalCode"]', '12345');
  110 |     await page.click('[data-test="continue"]');
  111 |     
  112 |     // Verify checkout step two
  113 |     await page.waitForURL('**/checkout-step-two.html');
  114 |     
  115 |     // Verify subtotal: $29.99 + $7.99 = $37.98
  116 |     const subtotal = await page.locator('.summary_subtotal_label');
  117 |     await expect(subtotal).toContainText('$37.98');
  118 |     
  119 |     // Verify tax is shown
  120 |     const tax = await page.locator('.summary_tax_label');
  121 |     await expect(tax).toBeVisible();
  122 |     
  123 |     // Verify total is shown
  124 |     const total = await page.locator('.summary_total_label');
  125 |     await expect(total).toBeVisible();
  126 |   });
  127 | 
  128 |   test('TC1.3: View cart with single item', async ({ page }) => {
  129 |     // Step 1: Login and add single item
  130 |     await login(page);
  131 |     await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
  132 |     await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
  133 |     
  134 |     // Verify cart badge shows 1
  135 |     const cartBadge = await page.locator('[data-test="shopping-cart-badge"]');
  136 |     await expect(cartBadge).toContainText('1');
  137 |     
  138 |     // Step 2: Navigate to cart page
  139 |     await page.click('[data-test="shopping-cart-link"]');
  140 |     await page.waitForURL('**/cart.html');
  141 |     
  142 |     // Verify single item displayed with QTY: 1
  143 |     const cartItems = await page.locator('[data-test="inventory-item"]');
  144 |     await expect(cartItems).toHaveCount(1);
  145 |     
  146 |     // Verify product name
  147 |     const productName = await page.locator('text=Sauce Labs Bike Light');
  148 |     await expect(productName).toBeVisible();
  149 |     
  150 |     // Verify price
  151 |     const price = await page.locator('[data-test="inventory-item-price"]');
  152 |     await expect(price).toContainText('$9.99');
  153 |     
  154 |     // Step 3: Verify cart buttons
  155 |     const continueShoppingBtn = await page.locator('button:has-text("Continue Shopping")');
  156 |     await expect(continueShoppingBtn).toBeVisible();
  157 |     const checkoutBtn = await page.locator('[data-test="checkout"]');
  158 |     await expect(checkoutBtn).toBeVisible();
  159 |   });
  160 | 
  161 |   test('TC1.4: Continue Shopping returns to inventory', async ({ page }) => {
  162 |     // Step 1: Login, add items, navigate to cart
  163 |     await login(page);
  164 |     await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  165 |     await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
```