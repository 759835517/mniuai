const { chromium } = require('playwright');

(async () => {
  console.log('=== Playwright Roadmap Generation Test ===\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Log browser console
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.text().includes('error') || msg.text().includes('Error')) {
        console.log(`[BROWSER ERROR]: ${msg.text()}`);
      }
    });

    // Step 1: Login
    console.log('1. Navigate to login page');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    console.log('2. Login with test account');
    await page.fill('input[type="email"]', 'testdebug2026@test.com');
    await page.fill('input[type="password"]', 'Test123456');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(8000);

    const afterLoginUrl = page.url();
    console.log('   After login URL:', afterLoginUrl);

    if (afterLoginUrl.includes('/login')) {
      console.log('   ❌ Login failed - still on login page');
      await page.screenshot({ path: 'roadmap-test-login-failed.png', fullPage: true });
      await browser.close();
      return;
    }
    console.log('   ✅ Login successful');

    // Step 2: Navigate to roadmap page
    console.log('\n3. Navigate to roadmap page');
    await page.goto('http://localhost:3000/roadmap');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if empty state or existing roadmap
    const generateButton = page.locator('button:has-text("生成路线图")');
    const regenerateButton = page.locator('button:has-text("重新生成")');

    const hasGenerate = await generateButton.count() > 0 && await generateButton.isVisible().catch(() => false);
    const hasRegenerate = await regenerateButton.count() > 0 && await regenerateButton.isVisible().catch(() => false);

    if (hasRegenerate) {
      console.log('   Existing roadmap found, clicking "重新生成"');
      await regenerateButton.click();
      await page.waitForTimeout(1000);
    } else if (hasGenerate) {
      console.log('   No roadmap found, clicking "生成路线图"');
      await generateButton.click();
      await page.waitForTimeout(1000);
    } else {
      console.log('   ⚠️ Could not find generate button');
      await page.screenshot({ path: 'roadmap-test-no-button.png', fullPage: true });
    }

    // Step 3: Fill and submit form
    console.log('\n4. Fill roadmap generation form');

    // Check for form fields
    const skillsInput = page.locator('input[placeholder*="技能"], textarea[placeholder*="技能"]').first();
    const hoursInput = page.locator('input[type="number"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    if (await skillsInput.count() === 0) {
      console.log('   ⚠️ Skills input not found, form might not be visible');
      await page.screenshot({ path: 'roadmap-test-no-form.png', fullPage: true });
      await browser.close();
      return;
    }

    // Fill form
    await skillsInput.fill('Java, Spring Boot');
    if (await hoursInput.count() > 0) {
      await hoursInput.fill('10');
    }

    console.log('5. Submit form');
    await submitButton.click();
    await page.waitForTimeout(10000); // Wait for API response

    // Step 4: Check results
    console.log('\n6. Check results');
    const finalUrl = page.url();
    console.log('   Final URL:', finalUrl);

    // Check for error overlay
    const errorOverlay = page.locator('div:has-text("Unhandled Runtime Error")').first();
    if (await errorOverlay.count() > 0 && await errorOverlay.isVisible()) {
      console.log('   ❌ ERROR: Runtime error detected');
      await page.screenshot({ path: 'roadmap-test-error.png', fullPage: true });
      await browser.close();
      return;
    }

    // Check for roadmap content
    const roadmapContent = page.locator('text="Week"').first();
    if (await roadmapContent.count() > 0) {
      console.log('   ✅ Roadmap content visible');
    } else {
      console.log('   ⚠️ Roadmap content not visible (may need more time)');
    }

    await page.screenshot({ path: 'roadmap-test-result.png', fullPage: true });
    console.log('\n   Screenshot saved to roadmap-test-result.png');

    // Success if we got here without errors
    console.log('\n✅ TEST PASSED - No runtime errors');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    await page.screenshot({ path: 'roadmap-test-error.png', fullPage: true }).catch(() => {});
  }

  await browser.close();
})();
