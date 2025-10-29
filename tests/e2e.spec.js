// E2E tests using Playwright
// Run with: npx playwright test

const { test, expect } = require('@playwright/test');
const path = require('path');

const extensionPath = path.join(__dirname, '..');

test.describe('Link Redirector Extension E2E', () => {
  test.beforeEach(async ({ context }) => {
    // Load the extension
    await context.addInitScript(() => {
      // Mock chrome APIs if needed
    });
  });

  test('should open extension popup and show configuration', async ({ page }) => {
    // Navigate to popup
    await page.goto(`chrome-extension://${extensionPath}/popup/popup.html`);
    
    // Check for input field
    const input = page.locator('#endpoint-input');
    await expect(input).toBeVisible();
    
    // Check for save button
    const saveBtn = page.locator('#save-btn');
    await expect(saveBtn).toBeVisible();
  });

  test('should validate endpoint template', async ({ page }) => {
    await page.goto(`chrome-extension://${extensionPath}/popup/popup.html`);
    
    const input = page.locator('#endpoint-input');
    const validationMessage = page.locator('#validation-message');
    
    // Test invalid template (no placeholder)
    await input.fill('https://example.com/redirect');
    await expect(validationMessage).toContainText('[LINK]');
    
    // Test valid template
    await input.fill('https://example.com/redirect?url=[LINK]');
    await expect(validationMessage).toContainText('Valid');
  });

  test('should save and load endpoint configuration', async ({ page }) => {
    await page.goto(`chrome-extension://${extensionPath}/popup/popup.html`);
    
    const input = page.locator('#endpoint-input');
    const saveBtn = page.locator('#save-btn');
    
    // Clear and set new endpoint
    await input.fill('');
    await input.fill('https://mysite.com/api/redirect?url=[LINK]');
    await saveBtn.click();
    
    // Wait for save confirmation
    await expect(page.locator('#validation-message')).toContainText('Saved');
    
    // Reload popup and verify persistence
    await page.reload();
    await expect(input).toHaveValue('https://mysite.com/api/redirect?url=[LINK]');
  });
});

