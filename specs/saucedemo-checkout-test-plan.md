# SauceDemo Checkout Test Plan

## Application Overview

SauceDemo is a web-based e-commerce application that allows users to browse products, manage shopping carts, and complete checkout. This test plan covers comprehensive testing of the checkout process including cart review, customer information entry, order overview, and order completion. The plan includes positive (happy path) scenarios and negative scenarios including validation, error handling, edge cases, and navigation tests.

## Test Scenarios

### 1. AC1: Cart Review - View cart items with details and totals

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC1.1: View cart with multiple items and verify item details

**File:** `tests/ac1-cart-review/tc1.1-view-cart-items.spec.ts`

**Steps:**
  1. Log in with valid credentials (username: standard_user, password: secret_sauce)
    - expect: User is successfully logged in and lands on the inventory page
  2. Add 3 different items to the cart: Sauce Labs Backpack ($29.99), Sauce Labs Bike Light ($9.99), and Sauce Labs Bolt T-Shirt ($15.99)
    - expect: Each item is added to the cart
    - expect: Cart badge shows count of 3 items
  3. Click on the shopping cart icon in the header
    - expect: User navigates to the cart page
    - expect: Page URL is https://www.saucedemo.com/cart.html
  4. Verify cart display with columns: QTY, Description
    - expect: Cart page displays all 3 items
    - expect: Each item shows quantity (1), product name, description, and price
    - expect: Sauce Labs Backpack is displayed with price $29.99
    - expect: Sauce Labs Bike Light is displayed with price $9.99
    - expect: Sauce Labs Bolt T-Shirt is displayed with price $15.99
  5. Verify navigation buttons are present
    - expect: 'Continue Shopping' button (Go back) is visible
    - expect: 'Checkout' button is visible and clickable

#### 1.2. TC1.2: Verify cart totals calculation

**File:** `tests/ac1-cart-review/tc1.2-verify-cart-totals.spec.ts`

**Steps:**
  1. Log in and add Sauce Labs Backpack ($29.99) and Sauce Labs Onesie ($7.99) to the cart
    - expect: Both items are added to the cart
  2. Navigate to the cart page
    - expect: Cart page is displayed with 2 items
  3. Review and note the cart layout
    - expect: Cart shows item quantity column
    - expect: Cart shows description column with product details
    - expect: Each item displays its price
  4. Verify subtotal, tax, and total on the checkout overview page by proceeding to checkout
    - expect: Item subtotal is calculated correctly: $37.98
    - expect: Tax is calculated appropriately
    - expect: Total includes subtotal + tax

#### 1.3. TC1.3: View cart with single item

**File:** `tests/ac1-cart-review/tc1.3-view-cart-single-item.spec.ts`

**Steps:**
  1. Log in and add only Sauce Labs Bike Light ($9.99) to the cart
    - expect: Item is added to the cart
    - expect: Cart badge shows 1
  2. Navigate to the cart page
    - expect: Cart page displays the single item with QTY: 1
    - expect: Product name and description are visible
    - expect: Price $9.99 is displayed
  3. Verify cart buttons are available
    - expect: 'Continue Shopping' button is present
    - expect: 'Checkout' button is present

#### 1.4. TC1.4: Continue Shopping returns to inventory

**File:** `tests/ac1-cart-review/tc1.4-continue-shopping.spec.ts`

**Steps:**
  1. Log in, add items to cart, and navigate to cart page
    - expect: Cart page is displayed
  2. Click on 'Continue Shopping' button
    - expect: User is redirected to the inventory page
    - expect: Page URL is https://www.saucedemo.com/inventory.html
    - expect: Cart badge still shows the number of items in cart

### 2. AC2: Checkout Info Entry - Enter First Name, Last Name, Zip/Postal Code (all mandatory), validation on empty fields

**Seed:** `tests/seed.spec.ts`

#### 2.1. TC2.1: Successfully enter valid checkout information

**File:** `tests/ac2-checkout-info-entry/tc2.1-valid-info-entry.spec.ts`

**Steps:**
  1. Log in, add items to cart, and proceed to checkout step one
    - expect: Checkout information page is displayed
    - expect: Page URL is https://www.saucedemo.com/checkout-step-one.html
    - expect: Page title shows 'Checkout: Your Information'
  2. Verify all required fields are present: First Name, Last Name, and Zip/Postal Code
    - expect: First Name input field is visible and has label 'First Name'
    - expect: Last Name input field is visible and has label 'Last Name'
    - expect: Zip/Postal Code input field is visible and has label 'Zip/Postal Code'
  3. Enter valid information: First Name: 'John', Last Name: 'Doe', Zip/Postal Code: '12345'
    - expect: All fields accept the input
    - expect: Values are displayed in the respective fields
  4. Click the 'Continue' button
    - expect: Form is submitted without errors
    - expect: User navigates to checkout step two (order overview)
    - expect: Page URL changes to https://www.saucedemo.com/checkout-step-two.html

#### 2.2. TC2.2: Validate error message when First Name is empty

**File:** `tests/ac2-checkout-info-entry/tc2.2-empty-first-name.spec.ts`

**Steps:**
  1. Log in, add items to cart, and navigate to checkout step one
    - expect: Checkout information form is displayed
  2. Leave First Name empty, enter Last Name: 'Doe', Zip/Postal Code: '12345'
    - expect: First Name field remains empty
  3. Click the 'Continue' button
    - expect: Form submission is blocked
    - expect: Error message is displayed: 'Error: First Name is required'
    - expect: User remains on checkout step one page
  4. Verify error message has a close button
    - expect: Error message displays with a close button (X)
    - expect: Close button is clickable

#### 2.3. TC2.3: Validate error message when Last Name is empty

**File:** `tests/ac2-checkout-info-entry/tc2.3-empty-last-name.spec.ts`

**Steps:**
  1. Navigate to checkout step one form
    - expect: Checkout information form is ready
  2. Enter First Name: 'John', leave Last Name empty, enter Zip/Postal Code: '12345'
    - expect: Last Name field remains empty
  3. Click the 'Continue' button
    - expect: Error message appears: 'Error: Last Name is required'
    - expect: Form is not submitted
    - expect: User remains on the checkout step one page

#### 2.4. TC2.4: Validate error message when Zip/Postal Code is empty

**File:** `tests/ac2-checkout-info-entry/tc2.4-empty-zip-code.spec.ts`

**Steps:**
  1. Navigate to checkout step one form
    - expect: Checkout information form is displayed
  2. Enter First Name: 'John', Last Name: 'Doe', leave Zip/Postal Code empty
    - expect: Zip/Postal Code field is empty
  3. Click the 'Continue' button
    - expect: Error message appears: 'Error: Postal Code is required'
    - expect: Form validation prevents submission
    - expect: User stays on checkout step one

#### 2.5. TC2.5: Validate error when all fields are empty

**File:** `tests/ac2-checkout-info-entry/tc2.5-all-fields-empty.spec.ts`

**Steps:**
  1. Navigate to checkout step one form without entering any data
    - expect: All form fields are empty
  2. Click the 'Continue' button immediately
    - expect: Form validation triggers
    - expect: Error message appears for the first required field (likely 'Error: First Name is required')
    - expect: No form submission occurs

#### 2.6. TC2.6: Validate alphanumeric and special characters in First Name

**File:** `tests/ac2-checkout-info-entry/tc2.6-special-chars-first-name.spec.ts`

**Steps:**
  1. Navigate to checkout step one form
    - expect: Form is ready for input
  2. Enter First Name with special characters: 'John-@#$%', Last Name: 'Doe', Zip/Postal Code: '12345'
    - expect: First Name field accepts special characters
    - expect: Special characters are displayed in the field
  3. Click the 'Continue' button
    - expect: Form accepts the input with special characters
    - expect: User proceeds to checkout step two (no validation error)
    - expect: OR error message appears indicating special characters are not allowed

#### 2.7. TC2.7: Validate very long zip code entries (>10 digits)

**File:** `tests/ac2-checkout-info-entry/tc2.7-long-zip-code.spec.ts`

**Steps:**
  1. Navigate to checkout step one form
    - expect: Form fields are accessible
  2. Enter First Name: 'John', Last Name: 'Doe', Zip/Postal Code: '123456789012345'
    - expect: Zip field accepts the long input
  3. Click the 'Continue' button
    - expect: Form either accepts the input and proceeds OR shows validation error
    - expect: System handles the input gracefully

#### 2.8. TC2.8: Verify field focus and tab navigation

**File:** `tests/ac2-checkout-info-entry/tc2.8-field-focus-navigation.spec.ts`

**Steps:**
  1. Navigate to checkout step one form
    - expect: Form is displayed with all three input fields
  2. Click on First Name field and verify it gets focus
    - expect: First Name field is focused (highlighted or showing cursor)
  3. Press Tab key to move to Next field
    - expect: Focus moves to Last Name field
  4. Press Tab key again
    - expect: Focus moves to Zip/Postal Code field
  5. Press Tab key once more
    - expect: Focus moves to the 'Continue' button or next focusable element

### 3. AC3: Order Overview - Review order summary with shipping, payment info, subtotal, tax, total

**Seed:** `tests/seed.spec.ts`

#### 3.1. TC3.1: View order overview with all required information

**File:** `tests/ac3-order-overview/tc3.1-complete-order-overview.spec.ts`

**Steps:**
  1. Log in, add items to cart, go through checkout step one with valid information
    - expect: Checkout step one is completed successfully
  2. User arrives at checkout step two (Order Overview)
    - expect: Page URL is https://www.saucedemo.com/checkout-step-two.html
    - expect: Page title shows 'Checkout: Overview'
  3. Verify cart items are displayed with QTY and Description columns
    - expect: All items in cart are listed
    - expect: Quantity column shows the item count (e.g., 1)
    - expect: Description column shows product name and description
    - expect: Item prices are displayed
  4. Verify Payment Information section
    - expect: 'Payment Information:' label is present
    - expect: Payment method is displayed (e.g., 'SauceCard #31337')
  5. Verify Shipping Information section
    - expect: 'Shipping Information:' label is present
    - expect: Shipping method is displayed (e.g., 'Free Pony Express Delivery!')
  6. Verify Price Total section
    - expect: 'Price Total' section is visible
    - expect: 'Item total:' line shows subtotal (e.g., $39.98)
    - expect: 'Tax:' line shows calculated tax (e.g., $3.20)
    - expect: 'Total:' line shows final amount (e.g., $43.18)

#### 3.2. TC3.2: Verify order overview calculations with multiple items

**File:** `tests/ac3-order-overview/tc3.2-multiple-items-overview.spec.ts`

**Steps:**
  1. Add 4 items: Backpack ($29.99), Bike Light ($9.99), T-Shirt ($15.99), Onesie ($7.99)
    - expect: Items are added to cart
  2. Navigate through checkout to order overview page
    - expect: Order overview page is displayed
  3. Verify item total calculation: $29.99 + $9.99 + $15.99 + $7.99 = $63.96
    - expect: Item total shows $63.96
  4. Verify tax calculation is proportional to item total
    - expect: Tax is calculated based on item total percentage
  5. Verify grand total: Item total + Tax
    - expect: Grand total is correctly calculated as Item total + Tax

#### 3.3. TC3.3: Verify order overview with single item

**File:** `tests/ac3-order-overview/tc3.3-single-item-overview.spec.ts`

**Steps:**
  1. Add only Sauce Labs Bike Light ($9.99) to cart and proceed to order overview
    - expect: Order overview page shows single item in cart
  2. Verify item details are displayed
    - expect: Item name: Sauce Labs Bike Light
    - expect: Quantity: 1
    - expect: Item price: $9.99
  3. Verify totals section
    - expect: Item total: $9.99
    - expect: Tax is calculated
    - expect: Grand total: Item total + Tax

#### 3.4. TC3.4: Verify payment and shipping information consistency

**File:** `tests/ac3-order-overview/tc3.4-payment-shipping-info.spec.ts`

**Steps:**
  1. Add items and navigate to order overview
    - expect: Order overview page is displayed
  2. Note the Payment Information section
    - expect: Payment Information is present and displayed
    - expect: Payment method is visible (e.g., SauceCard #31337)
  3. Note the Shipping Information section
    - expect: Shipping Information is present and displayed
    - expect: Shipping method is visible (e.g., Free Pony Express Delivery!)
  4. Verify this information is consistent across sessions/cart states
    - expect: Same payment method is shown
    - expect: Same shipping method is shown

#### 3.5. TC3.5: Verify Cancel button on order overview

**File:** `tests/ac3-order-overview/tc3.5-cancel-button-overview.spec.ts`

**Steps:**
  1. Add items and navigate to order overview page
    - expect: Order overview page is displayed
  2. Verify 'Cancel' button is present (Go back button)
    - expect: 'Cancel' button is visible and clickable
  3. Click the 'Cancel' button
    - expect: User is taken back to the previous page (either cart or inventory)
    - expect: Cart items are preserved
    - expect: User does not lose their cart data

#### 3.6. TC3.6: Verify Finish button on order overview

**File:** `tests/ac3-order-overview/tc3.6-finish-button-overview.spec.ts`

**Steps:**
  1. Navigate to order overview page with valid items and information
    - expect: Order overview page is fully loaded
  2. Verify 'Finish' button is present
    - expect: 'Finish' button is visible and clickable
    - expect: Button is positioned at the bottom right of the form
  3. Click the 'Finish' button
    - expect: Order is submitted
    - expect: User is redirected to the order completion/confirmation page

### 4. AC4: Order Completion - Finish order and see confirmation page with 'Back Home' button

**Seed:** `tests/seed.spec.ts`

#### 4.1. TC4.1: Successfully complete order and view confirmation

**File:** `tests/ac4-order-completion/tc4.1-successful-order-completion.spec.ts`

**Steps:**
  1. Log in, add items to cart, complete checkout information, and review order
    - expect: Order overview is ready
  2. Click the 'Finish' button on order overview page
    - expect: Order is submitted successfully
  3. Verify redirect to order completion page
    - expect: Page URL is https://www.saucedemo.com/checkout-complete.html
    - expect: Page title shows 'Checkout: Complete!'
  4. Verify confirmation message is displayed
    - expect: Heading 'Thank you for your order!' is visible
    - expect: Message text: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!' is displayed
    - expect: Pony Express illustration/image is shown
  5. Verify 'Back Home' button is present
    - expect: 'Back Home' button is visible and clickable

#### 4.2. TC4.2: Click Back Home button returns to inventory

**File:** `tests/ac4-order-completion/tc4.2-back-home-button.spec.ts`

**Steps:**
  1. Complete an order and view the confirmation page
    - expect: Confirmation page is displayed with all elements
  2. Click the 'Back Home' button
    - expect: User is redirected to the inventory page
    - expect: Page URL is https://www.saucedemo.com/inventory.html
    - expect: Cart is reset/cleared (cart badge should show 0 or no items)

#### 4.3. TC4.3: Verify order completion after different product combinations

**File:** `tests/ac4-order-completion/tc4.3-order-completion-multiple-items.spec.ts`

**Steps:**
  1. Add 3 different items to cart (e.g., Backpack, T-Shirt, Onesie)
    - expect: Items are added
  2. Complete the checkout process with all steps
    - expect: Order is submitted successfully
  3. Verify confirmation page appears
    - expect: 'Thank you for your order!' message is displayed
    - expect: Confirmation page URL is checkout-complete.html
  4. Click 'Back Home'
    - expect: Returned to inventory page
    - expect: Cart is empty

#### 4.4. TC4.4: Verify confirmation page elements are interactive

**File:** `tests/ac4-order-completion/tc4.4-confirmation-page-elements.spec.ts`

**Steps:**
  1. Navigate to the order confirmation page
    - expect: Confirmation page is displayed
  2. Verify page elements: Heading, message, image, and button are all present
    - expect: All confirmation page elements are visible and properly rendered
  3. Hover over 'Back Home' button
    - expect: Button shows visual feedback (e.g., color change or hover effect)
  4. Click 'Back Home' and verify it's interactive
    - expect: Button click is registered and triggers navigation

#### 4.5. TC4.5: Verify cart is empty after order completion

**File:** `tests/ac4-order-completion/tc4.5-cart-emptied-after-order.spec.ts`

**Steps:**
  1. Complete a full checkout process with items in cart
    - expect: Order is finished
  2. On the confirmation page, check the cart badge
    - expect: Cart badge shows 0 or is not displayed (no items in cart)
  3. Click 'Back Home' to go to inventory
    - expect: Inventory page is displayed
    - expect: Cart badge shows 0 items
    - expect: All previous cart items are gone
  4. Click on shopping cart icon
    - expect: Cart page is empty or shows 'Your Cart is Empty' message

### 5. AC5: Error Handling - Validate error messages for invalid data

**Seed:** `tests/seed.spec.ts`

#### 5.1. TC5.1: Validate error message display and formatting

**File:** `tests/ac5-error-handling/tc5.1-error-message-formatting.spec.ts`

**Steps:**
  1. Navigate to checkout step one form
    - expect: Form is ready
  2. Attempt to submit form without filling First Name field
    - expect: Error message appears
  3. Verify error message format and content
    - expect: Error message is clearly visible
    - expect: Message text: 'Error: First Name is required'
    - expect: Error is displayed in a distinct color (usually red)
    - expect: Error has a close button (X)

#### 5.2. TC5.2: Close error message and retry submission

**File:** `tests/ac5-error-handling/tc5.2-close-error-retry.spec.ts`

**Steps:**
  1. Trigger an error by leaving a required field empty and clicking Continue
    - expect: Error message is displayed
  2. Click the close button (X) on the error message
    - expect: Error message is dismissed
    - expect: Form remains on the same page
    - expect: Input fields retain their values (if any)
  3. Fill in the required field that caused the error
    - expect: Field accepts the input
  4. Click Continue to retry submission
    - expect: Form is submitted successfully
    - expect: No error message appears
    - expect: User proceeds to next step

#### 5.3. TC5.3: Multiple field errors - test sequence of error messages

**File:** `tests/ac5-error-handling/tc5.3-multiple-field-errors.spec.ts`

**Steps:**
  1. Navigate to checkout form with all fields empty
    - expect: Form is ready
  2. Click Continue button
    - expect: First error message appears (likely 'Error: First Name is required')
  3. Close error and fill First Name field only
    - expect: First Name field now has a value
  4. Click Continue button again
    - expect: New error message appears for the next required field (Last Name)
  5. Close error and fill Last Name field
    - expect: Last Name field now has a value
  6. Click Continue again
    - expect: Third error appears for Zip/Postal Code field
  7. Fill Zip/Postal Code and click Continue
    - expect: All fields are valid and form is submitted successfully

#### 5.4. TC5.4: Validate error persistence across page navigation

**File:** `tests/ac5-error-handling/tc5.4-error-persistence.spec.ts`

**Steps:**
  1. Navigate to checkout step one and trigger an error by leaving First Name empty
    - expect: Error message is displayed
  2. Click Cancel button to go back to cart
    - expect: User is taken to cart page
    - expect: Error message is cleared
  3. Click Checkout again
    - expect: User returns to checkout step one with empty form
    - expect: No error message is present initially

#### 5.5. TC5.5: Validate special characters in First Name field

**File:** `tests/ac5-error-handling/tc5.5-special-chars-validation.spec.ts`

**Steps:**
  1. Navigate to checkout step one form
    - expect: Form is displayed
  2. Enter First Name with special characters: '@#$%^&*' 
    - expect: Field accepts special character input
  3. Fill other required fields with valid data
    - expect: Last Name and Zip fields have valid values
  4. Click Continue button
    - expect: Form either accepts input and proceeds OR displays validation error
    - expect: If error: message indicates what characters are not allowed

#### 5.6. TC5.6: Validate zero or negative zip code behavior

**File:** `tests/ac5-error-handling/tc5.6-invalid-zip-code.spec.ts`

**Steps:**
  1. Navigate to checkout form and fill First Name and Last Name with valid data
    - expect: First two fields have values
  2. Enter Zip/Postal Code as '0' (single zero)
    - expect: Field accepts the input
  3. Click Continue
    - expect: Form accepts this as valid OR shows validation error for invalid zip format

#### 5.7. TC5.7: Verify error message text accuracy

**File:** `tests/ac5-error-handling/tc5.7-error-message-text-accuracy.spec.ts`

**Steps:**
  1. Trigger error for First Name: Leave empty and submit
    - expect: Error text is: 'Error: First Name is required'
  2. Close error, clear First Name, trigger error for Last Name
    - expect: Error text is: 'Error: Last Name is required'
  3. Close error, clear Last Name, trigger error for Zip Code
    - expect: Error text is: 'Error: Postal Code is required'

#### 5.8. TC5.8: Validate numeric-only enforcement in Zip field

**File:** `tests/ac5-error-handling/tc5.8-zip-field-validation.spec.ts`

**Steps:**
  1. Navigate to checkout form and enter all required data
    - expect: Form ready for final verification
  2. Attempt to enter alphabetic characters in Zip/Postal Code field (e.g., 'abcde')
    - expect: Field behavior: either rejects letters OR accepts them (application dependent)
  3. Enter valid numeric zip code: '12345'
    - expect: Field accepts the numeric input
  4. Click Continue
    - expect: Form is submitted successfully OR validation error is shown if alphabetic input was accepted in previous step
