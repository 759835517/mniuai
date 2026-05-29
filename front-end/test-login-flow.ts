import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture console logs
  page.on('console', msg => {
    if (msg.type() === 'log' || msg.type() === 'error') {
      console.log(`[BROWSER ${msg.type()}]:`, msg.text());
    }
  });

  // Capture network requests
  page.on('request', req => {
    if (req.url().includes('/auth/') || req.url().includes('/users/')) {
      console.log(`[REQUEST] ${req.method()} ${req.url()}`);
      console.log('[REQUEST BODY]', req.postData());
    }
  });

  // Capture network responses
  page.on('response', res => {
    if (res.url().includes('/auth/') || res.url().includes('/users/')) {
      console.log(`[RESPONSE] ${res.status()} ${res.url()}`);
    }
  });

  console.log('=== STEP 1: Open login page ===');
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('\n=== STEP 2: Fill login form ===');
  await page.fill('input[type="email"]', 'testdebug2026@test.com');
  await page.fill('input[type="password"]', 'Test123456');
  await page.waitForTimeout(500);

  console.log('\n=== STEP 3: Click submit ===');
  const submitButton = page.locator('button[type="submit"]');
  const buttonText = await submitButton.textContent();
  console.log('Button text before click:', buttonText);

  await submitButton.click();

  console.log('\n=== STEP 4: Wait and observe ===');
  await page.waitForTimeout(10000);

  console.log('\n=== STEP 5: Check results ===');
  const finalUrl = page.url();
  console.log('Final URL:', finalUrl);
  console.log('On login page?', finalUrl.includes('/login'));

  // Check error display
  const errorDiv = page.locator('.text-red-400');
  const errorCount = await errorDiv.count();
  console.log('Error elements:', errorCount);
  if (errorCount > 0) {
    console.log('Error text:', await errorDiv.first().textContent());
  }

  // Check localStorage
  const token = await page.evaluate(() => localStorage.getItem('mniu_access_token'));
  console.log('Token in localStorage:', token ? 'YES (first 20 chars: ' + token.substring(0, 20) + '...)' : 'NO');

  // Check page content
  const pageContent = await page.textContent('body');
  console.log('\nPage contains "登录中":', pageContent?.includes('登录中') ?? false);
  console.log('Page contains "Dashboard":', pageContent?.includes('Dashboard') ?? false);

  // Take screenshot
  await page.screenshot({ path: 'login-test-result.png', fullPage: true });
  console.log('\nScreenshot saved to login-test-result.png');

  await browser.close();
})();
