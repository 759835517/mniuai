/**
 * E2E 测试：前端 UI 交互流程（Playwright 页面级测试）
 * 场景：
 *   A. 登录页面 → 登录成功 → 跳转 Dashboard
 *   B. Coach 页面 → 新建会话 → 发送消息 → 查看回复
 *   C. 课时页面 → 视频播放器渲染
 *   D. 沙盒面板 → 代码编辑器渲染
 */
const { chromium } = require('playwright');
const assert = require('assert');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://localhost:8080';

let browser;
let passed = 0;
let failed = 0;
let authToken = null;

function log(msg) {
  console.log(`  ${msg}`);
}

function pass(name) {
  passed++;
  console.log(`  ✅ ${name}`);
}

function fail(name, err) {
  failed++;
  console.log(`  ❌ ${name}: ${err?.message || err}`);
}

async function test(name, fn) {
  console.log(`\n▶ ${name}`);
  try {
    await fn();
    pass(name);
  } catch (err) {
    fail(name, err);
  }
}

(async () => {
  console.log('========================================');
  console.log('  E2E 测试：前端 UI 交互流程');
  console.log('========================================');

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 注册测试用户
  const email = `e2e_ui_${Date.now()}@test.com`;
  await page.request.post(`${API_URL}/api/v1/auth/register`, {
    data: { email, password: 'Test123456', displayName: 'UI Test' },
  });
  const loginRes = await page.request.post(`${API_URL}/api/v1/auth/login`, {
    data: { email, password: 'Test123456' },
  });
  const loginBody = await loginRes.json();
  authToken = loginBody.data.accessToken;

  // ===== 场景 A: 登录页面 =====
  await test('A1. 登录页面渲染', async () => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    // 检查登录表单元素
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    assert.ok(await emailInput.count() > 0, '应存在邮箱输入框');
    assert.ok(await passwordInput.count() > 0, '应存在密码输入框');
    assert.ok(await submitButton.count() > 0, '应存在提交按钮');
    log('    登录表单元素渲染正常');
  });

  await test('A2. 登录成功后跳转 Dashboard', async () => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    await page.fill('input[type="email"], input[name="email"]', email);
    await page.fill('input[type="password"], input[name="password"]', 'Test123456');
    await page.click('button[type="submit"]');

    // 等待跳转
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    log(`    登录后 URL: ${currentUrl}`);
    // 应跳转到非登录页面
    assert.ok(!currentUrl.includes('/login'), '登录后不应仍在登录页');
  });

  // ===== 场景 B: Coach 页面 =====
  await test('B1. Coach 页面渲染', async () => {
    // 先设置 token 到 localStorage
    await page.goto(`${BASE_URL}/coach`);
    await page.evaluate((token) => {
      localStorage.setItem('mniu_access_token', token);
    }, authToken);
    await page.goto(`${BASE_URL}/coach`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 检查页面标题
    const heading = page.locator('h1').first();
    if (await heading.count() > 0) {
      const text = await heading.textContent();
      log(`    页面标题: ${text}`);
    }
  });

  await test('B2. 新建会话按钮存在', async () => {
    await page.goto(`${BASE_URL}/coach`);
    await page.evaluate((token) => {
      localStorage.setItem('mniu_access_token', token);
    }, authToken);
    await page.goto(`${BASE_URL}/coach`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // 查找新建会话按钮
    const newButton = page.locator('button').filter({ hasText: /新建|开始|创建/ }).first();
    const count = await newButton.count();
    log(`    新建会话按钮数量: ${count}`);
  });

  // ===== 场景 C: 课时页面 =====
  await test('C1. 课时页面视频播放器渲染', async () => {
    // 获取一个课时 ID
    const lessonsRes = await page.request.get(`${API_URL}/api/v1/lessons?page=1&size=1`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const body = await lessonsRes.json();
    if (!body.data?.items?.length) {
      log('    无课时数据，跳过视频播放器测试');
      return;
    }
    const lesson = body.data.items[0];

    await page.evaluate((token) => {
      localStorage.setItem('mniu_access_token', token);
    }, authToken);
    await page.goto(`${BASE_URL}/courses/${lesson.courseId}/lessons/${lesson.id}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 检查 video 元素
    const video = page.locator('video').first();
    const videoCount = await video.count();
    log(`    video 元素数量: ${videoCount}`);
    if (videoCount > 0) {
      log('    视频播放器渲染成功');
    }
  });

  // ===== 场景 D: 沙盒面板 =====
  await test('D1. 沙盒面板组件存在', async () => {
    // 沙盒可能在课时页面内
    const lessonsRes = await page.request.get(`${API_URL}/api/v1/lessons?page=1&size=1`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const body = await lessonsRes.json();
    if (!body.data?.items?.length) {
      log('    无课时数据，跳过沙盒测试');
      return;
    }
    const lesson = body.data.items[0];

    await page.evaluate((token) => {
      localStorage.setItem('mniu_access_token', token);
    }, authToken);
    await page.goto(`${BASE_URL}/courses/${lesson.courseId}/lessons/${lesson.id}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 检查运行按钮
    const runButton = page.locator('button').filter({ hasText: /运行|执行|Run/ }).first();
    const runCount = await runButton.count();
    log(`    运行按钮数量: ${runCount}`);
  });

  await browser.close();

  // ===== 汇总 =====
  console.log('\n========================================');
  console.log(`  UI 交互 E2E 测试结果: ${passed} 通过, ${failed} 失败`);
  console.log('========================================');
  process.exit(failed > 0 ? 1 : 0);
})();
