const { chromium } = require('playwright');

// Helper function to capture console errors
function setupErrorCapture(page, errors) {
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', error => {
    errors.push(error.message);
  });
}

async function runTest(testName, testFn) {
  console.log(`\n========== ${testName} ==========`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];

  setupErrorCapture(page, errors);

  try {
    await testFn(page, errors);
    if (errors.length > 0) {
      console.log('⚠️ Console errors detected:', errors.slice(0, 3).join('\n'));
    }
    console.log(`✅ ${testName} PASSED`);
    return true;
  } catch (e) {
    console.error(`❌ ${testName} FAILED:`, e.message);
    await page.screenshot({ path: `error-${testName.replace(/\s+/g, '-').toLowerCase()}.png` }).catch(() => {});
    return false;
  } finally {
    await browser.close();
  }
}

async function main() {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'Test123456';
  const testNickname = 'TestUser';

  let authToken = null;
  let passed = 0;
  let failed = 0;

  // Test 1: Register flow
  const t1 = await runTest('Register', async (page, errors) => {
    console.log('1. Navigate to register page');
    await page.goto('http://localhost:3000/register');
    await page.waitForLoadState('networkidle');

    console.log('2. Fill registration form');
    await page.fill('input[placeholder*="昵称"], input#nickname', testNickname);
    await page.fill('input[type="email"], input#email', testEmail);
    await page.fill('input[type="password"], input#password', testPassword);

    console.log('3. Submit registration');
    await page.click('button[type="submit"]');

    console.log('4. Wait for redirect');
    await page.waitForTimeout(8000);

    const url = page.url();
    console.log('   Final URL:', url);
    if (url.includes('/register')) {
      throw new Error('Still on register page - registration failed');
    }
    if (!url.includes('/dashboard')) {
      throw new Error('Did not redirect to dashboard');
    }
  });
  t1 ? passed++ : failed++;

  // Test 2: Login flow
  const t2 = await runTest('Login', async (page, errors) => {
    console.log('1. Navigate to login page');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    console.log('2. Fill login form');
    await page.fill('input[type="email"], input#email', testEmail);
    await page.fill('input[type="password"], input#password', testPassword);

    console.log('3. Submit login');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(8000);

    const url = page.url();
    console.log('   Final URL:', url);
    if (url.includes('/login')) {
      throw new Error('Still on login page - login failed');
    }

    // Check localStorage for token
    const token = await page.evaluate(() => localStorage.getItem('mniu_access_token'));
    if (!token) {
      throw new Error('No access token in localStorage');
    }
    console.log('   Token stored in localStorage: YES');
  });
  t2 ? passed++ : failed++;

  // Test 3: Dashboard page
  const t3 = await runTest('Dashboard', async (page, errors) => {
    console.log('1. Login first');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(8000);

    console.log('2. Check dashboard content');
    const content = await page.textContent('body');
    if (content.includes('Runtime Error') || content.includes('Unhandled')) {
      throw new Error('Dashboard has runtime errors');
    }

    // Check greeting is shown
    const hasGreeting = content.includes('早上好') || content.includes('下午好') ||
                        content.includes('晚上好') || content.includes('夜深');
    console.log('   Has greeting:', hasGreeting);

    // Check quick links exist
    const hasRoadmapLink = content.includes('学习路线图');
    const hasCoachLink = content.includes('AI 教练');
    console.log('   Has roadmap link:', hasRoadmapLink);
    console.log('   Has coach link:', hasCoachLink);
  });
  t3 ? passed++ : failed++;

  // Test 4: Roadmap page (generate and view)
  const t4 = await runTest('Roadmap', async (page, errors) => {
    console.log('1. Login first');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(8000);

    console.log('2. Navigate to roadmap page');
    await page.goto('http://localhost:3000/roadmap');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('3. Check roadmap page content');
    const content = await page.textContent('body');
    if (content.includes('Runtime Error')) {
      throw new Error('Roadmap page has runtime errors');
    }

    // Check if we see generate button or existing roadmap
    const hasGenerateBtn = content.includes('生成路线图') || content.includes('重新生成');
    console.log('   Has generate/re-generate button:', hasGenerateBtn);

    if (hasGenerateBtn) {
      console.log('4. Click generate button');
      const genBtn = page.locator('button', { hasText: /^生成路线图$|^重新生成$/ }).first();
      await genBtn.click();
      await page.waitForTimeout(1000);

      // Check if form appears
      const formContent = await page.textContent('body');
      if (formContent.includes('技能基础') || formContent.includes('学习目标')) {
        console.log('5. Select skills: Java, Python, LLM');
        // Click skill chips by exact text
        for (const skill of ['Java', 'Python', 'LLM']) {
          const chip = page.getByRole('button', { name: skill, exact: true });
          if (await chip.isVisible().catch(() => false)) {
            await chip.click();
            console.log(`   Selected skill: ${skill}`);
          }
        }

        // Wait for React state update
        await page.waitForTimeout(500);

        // Verify submit button is now enabled
        const submitBtn = page.getByRole('button', { name: '生成学习路线图' });
        const isDisabled = await submitBtn.getAttribute('disabled');
        console.log('   Submit button disabled:', isDisabled);

        if (isDisabled !== null) {
          throw new Error('Submit button is still disabled after selecting skills');
        }

        console.log('6. Submit form');
        await submitBtn.click();
        // Wait for AI generation (up to 30s)
        await page.waitForTimeout(15000);
      }
    }

    // Final check
    const finalContent = await page.textContent('body');
    if (finalContent.includes('Runtime Error')) {
      throw new Error('Roadmap page crashed after generation');
    }
    console.log('   Roadmap page state: OK');
  });
  t4 ? passed++ : failed++;

  // Test 5: Coach page
  const t5 = await runTest('Coach Page', async (page, errors) => {
    console.log('1. Login first');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(8000);

    console.log('2. Navigate to coach page');
    await page.goto('http://localhost:3000/coach');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const content = await page.textContent('body');
    if (content.includes('Runtime Error')) {
      throw new Error('Coach page has runtime errors');
    }
    console.log('   Coach page loaded successfully');
  });
  t5 ? passed++ : failed++;

  // Test 6: Projects page
  const t6 = await runTest('Projects Page', async (page, errors) => {
    console.log('1. Login first');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(8000);

    console.log('2. Navigate to projects page');
    await page.goto('http://localhost:3000/projects');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const content = await page.textContent('body');
    if (content.includes('Runtime Error')) {
      throw new Error('Projects page has runtime errors');
    }
    console.log('   Projects page loaded successfully');
  });
  t6 ? passed++ : failed++;

  // Test 7: Profile page
  const t7 = await runTest('Profile Page', async (page, errors) => {
    console.log('1. Login first');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(8000);

    console.log('2. Navigate to profile page');
    await page.goto('http://localhost:3000/profile');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const content = await page.textContent('body');
    if (content.includes('Runtime Error')) {
      throw new Error('Profile page has runtime errors');
    }
    console.log('   Profile page loaded successfully');
  });
  t7 ? passed++ : failed++;

  // Summary
  console.log('\n========== TEST SUMMARY ==========');
  console.log(`Total: ${passed + failed}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => {
  console.error('Test runner error:', e);
  process.exit(1);
});
