const { chromium } = require('playwright');

(async () => {
  console.log('=== Playwright Login Test ===\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Log all console messages from browser
  page.on('console', msg => console.log(`[BROWSER]: ${msg.text()}`));

  // Log API calls
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/auth/') || url.includes('/users/')) {
      console.log(`[API] ${response.status()} ${url}`);
      try {
        const body = await response.json();
        console.log('[API BODY]', JSON.stringify(body).substring(0, 200));
      } catch {}
    }
  });

  try {
    console.log('1. Navigate to login page');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('\n2. Fill email: testdebug2026@test.com');
    await page.fill('input[type="email"]', 'testdebug2026@test.com');

    console.log('3. Fill password: Test123456');
    await page.fill('input[type="password"]', 'Test123456');
    await page.waitForTimeout(500);

    console.log('\n4. Click submit button');
    const button = page.locator('button[type="submit"]');
    console.log('Button text:', await button.textContent());
    console.log('Button disabled:', await button.isDisabled());

    await button.click();
    console.log('Button clicked!');

    console.log('\n5. Wait 12 seconds for login process...');
    await page.waitForTimeout(12000);

    console.log('\n6. Check results:');
    const finalUrl = page.url();
    console.log('   Final URL:', finalUrl);
    console.log('   Still on /login?', finalUrl.includes('/login'));

    // Check error
    const errorElement = page.locator('.text-red-400');
    if (await errorElement.count() > 0) {
      console.log('   Error displayed:', await errorElement.textContent());
    }

    // Check localStorage
    const token = await page.evaluate(() => localStorage.getItem('mniu_access_token'));
    console.log('   Token exists:', token ? 'YES' : 'NO');
    if (token) console.log('   Token preview:', token.substring(0, 30) + '...');

    // Take screenshot
    await page.screenshot({ path: 'test-login-result.png', fullPage: true });
    console.log('\n7. Screenshot saved to test-login-result.png');

  } catch (error) {
    console.error('Test failed:', error.message);
    await page.screenshot({ path: 'test-login-error.png' }).catch(() => {});
  }

  await browser.close();
})();
