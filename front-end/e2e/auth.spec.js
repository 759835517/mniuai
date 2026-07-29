/**
 * E2E 测试：认证流程
 * 场景：
 *   A. 用户注册 → 登录 → 获取 Token
 *   B. 登录失败（错误密码）
 *   C. Token 过期后刷新
 *   D. 未授权访问受保护资源
 */
const { chromium } = require('playwright');
const assert = require('assert');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://localhost:8080';

let browser;
let passed = 0;
let failed = 0;

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
  console.log('  E2E 测试：认证流程');
  console.log('========================================');

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // ===== 场景 A: 注册 → 登录 → Token =====
  await test('A1. 用户注册成功', async () => {
    const uniqueEmail = `e2e_test_${Date.now()}@test.com`;
    const res = await page.request.post(`${API_URL}/api/v1/auth/register`, {
      data: {
        email: uniqueEmail,
        password: 'Test123456',
        displayName: 'E2E Test User',
      },
    });
    assert.strictEqual(res.status(), 200, `注册返回 ${res.status()}`);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data?.accessToken, '应返回 accessToken');
    assert.ok(body.data?.refreshToken, '应返回 refreshToken');
    log(`    注册邮箱: ${uniqueEmail}`);
    log(`    Token 前缀: ${body.data.accessToken.substring(0, 20)}...`);
  });

  await test('A2. 重复注册应失败', async () => {
    const dupEmail = `e2e_dup_${Date.now()}@test.com`;
    // 第一次注册
    const res1 = await page.request.post(`${API_URL}/api/v1/auth/register`, {
      data: { email: dupEmail, password: 'Test123456', displayName: 'Dup' },
    });
    assert.strictEqual(res1.status(), 200);
    // 第二次重复注册
    const res2 = await page.request.post(`${API_URL}/api/v1/auth/register`, {
      data: { email: dupEmail, password: 'Test123456', displayName: 'Dup2' },
    });
    assert.strictEqual(res2.status(), 409, `重复注册应返回 409，实际 ${res2.status()}`);
  });

  await test('A3. 登录成功获取 Token', async () => {
    const email = `e2e_login_${Date.now()}@test.com`;
    // 先注册
    await page.request.post(`${API_URL}/api/v1/auth/register`, {
      data: { email, password: 'Test123456', displayName: 'Login Test' },
    });
    // 登录
    const res = await page.request.post(`${API_URL}/api/v1/auth/login`, {
      data: { email, password: 'Test123456' },
    });
    assert.strictEqual(res.status(), 200);
    const body = await res.json();
    assert.ok(body.data?.accessToken);
    log(`    登录成功，获取到 Token`);
  });

  // ===== 场景 B: 登录失败 =====
  await test('B1. 错误密码登录失败', async () => {
    const email = `e2e_wrong_${Date.now()}@test.com`;
    await page.request.post(`${API_URL}/api/v1/auth/register`, {
      data: { email, password: 'Test123456', displayName: 'Wrong' },
    });
    const res = await page.request.post(`${API_URL}/api/v1/auth/login`, {
      data: { email, password: 'WrongPassword' },
    });
    assert.strictEqual(res.status(), 401, `错误密码应返回 401，实际 ${res.status()}`);
  });

  await test('B2. 不存在的用户登录失败', async () => {
    const res = await page.request.post(`${API_URL}/api/v1/auth/login`, {
      data: { email: 'nonexistent@test.com', password: 'Test123456' },
    });
    assert.strictEqual(res.status(), 401);
  });

  await test('B3. 空密码登录失败', async () => {
    const res = await page.request.post(`${API_URL}/api/v1/auth/login`, {
      data: { email: 'empty@test.com', password: '' },
    });
    assert.strictEqual(res.status(), 400, `空密码应返回 400，实际 ${res.status()}`);
  });

  // ===== 场景 C: Token 刷新 =====
  await test('C1. 使用 refreshToken 刷新 accessToken', async () => {
    const email = `e2e_refresh_${Date.now()}@test.com`;
    const regRes = await page.request.post(`${API_URL}/api/v1/auth/register`, {
      data: { email, password: 'Test123456', displayName: 'Refresh' },
    });
    const { refreshToken } = (await regRes.json()).data;

    const refreshRes = await page.request.post(`${API_URL}/api/v1/auth/refresh`, {
      data: { refreshToken },
    });
    assert.strictEqual(refreshRes.status(), 200);
    const body = await refreshRes.json();
    assert.ok(body.data?.accessToken, '刷新后应返回新 accessToken');
    log(`    Token 刷新成功`);
  });

  // ===== 场景 D: 未授权访问 =====
  await test('D1. 无 Token 访问受保护资源返回 401', async () => {
    const res = await page.request.get(`${API_URL}/api/v1/users/me`);
    assert.strictEqual(res.status(), 401);
  });

  await test('D2. 无效 Token 访问受保护资源返回 401', async () => {
    const res = await page.request.get(`${API_URL}/api/v1/users/me`, {
      headers: { Authorization: 'Bearer invalid_token_here' },
    });
    assert.strictEqual(res.status(), 401);
  });

  await browser.close();

  // ===== 汇总 =====
  console.log('\n========================================');
  console.log(`  认证 E2E 测试结果: ${passed} 通过, ${failed} 失败`);
  console.log('========================================');
  process.exit(failed > 0 ? 1 : 0);
})();
