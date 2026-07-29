/**
 * E2E 测试：少儿编程端（Kids Programming）
 * 场景：
 *   A. 学习路径列表 API
 *   B. 竞赛题库列表 API
 *   C. 竞赛题目详情 API
 *   D. 提交竞赛代码 API
 *   E. 成长勋章列表 API
 *   F. 学习进度总览 API
 *   G. AI 助教对话 API
 *   H. 前端页面渲染
 *   I. 竞赛题目详情页交互
 *   J. 勋章页面渲染
 */
const { chromium } = require('playwright');
const assert = require('assert');

const API_URL = process.env.API_URL || 'http://localhost:8080';
const KIDS_URL = process.env.KIDS_URL || 'http://localhost:3002';

let browser;
let authToken = null;
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

/**
 * 获取认证 Token（通过登录 API）
 */
async function getAuthToken() {
  if (authToken) return authToken;

  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@mniuai.com',
      password: 'Test@123456',
    }),
  });

  const data = await response.json();
  if (data.data?.accessToken) {
    authToken = data.data.accessToken;
  } else {
    // 尝试注册
    const regResponse = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@mniuai.com',
        password: 'Test@123456',
        displayName: '测试用户',
      }),
    });
    const regData = await regResponse.json();
    authToken = regData.data?.accessToken || regData.data?.token;
  }

  return authToken;
}

/**
 * 发送带认证的 API 请求
 */
async function kidsApi(path, options = {}) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/kids${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  return response;
}

(async () => {
  console.log('========================================');
  console.log('  E2E 测试：少儿编程端');
  console.log('========================================');

  browser = await chromium.launch({ headless: true });

  // ============================================================
  // A. 学习路径列表 API
  // ============================================================
  await test('A1. GET /api/v1/kids/paths 返回学习路径列表', async () => {
    const res = await kidsApi('/paths');
    assert.strictEqual(res.status, 200, `期望 200，实际 ${res.status}`);
    const data = await res.json();
    assert.ok(data.data, '响应应包含 data 字段');
    assert.ok(Array.isArray(data.data), 'data 应为数组');
    assert.ok(data.data.length > 0, '学习路径列表不应为空');
    // 验证路径字段完整性
    const first = data.data[0];
    assert.ok(first.id, '路径应有 id');
    assert.ok(first.slug, '路径应有 slug');
    assert.ok(first.name, '路径应有 name');
    assert.ok(first.icon, '路径应有 icon');
    assert.ok(first.stage, '路径应有 stage');
    log(`获取到 ${data.data.length} 条学习路径`);
    log(`第一条: ${first.icon} ${first.name} (${first.stage})`);
  });

  await test('A2. GET /api/v1/kids/paths/{slug} 返回路径详情', async () => {
    const res = await kidsApi('/paths/scratch-beginner');
    assert.strictEqual(res.status, 200, `期望 200，实际 ${res.status}`);
    const data = await res.json();
    assert.ok(data.data, '响应应包含 data');
    assert.strictEqual(data.data.slug, 'scratch-beginner');
    log(`路径详情: ${data.data.name}`);
  });

  await test('A3. GET /api/v1/kids/paths/{slug} 不存在返回错误', async () => {
    const res = await kidsApi('/paths/nonexistent-path');
    const data = await res.json();
    // 不存在应返回 success=false 和 error 信息
    assert.strictEqual(res.status, 200, `期望 200，实际 ${res.status}`);
    assert.strictEqual(data.success, false, 'success 应为 false');
    assert.ok(data.error, '错误响应应包含 error');
    assert.strictEqual(data.error.code, 'PATH_NOT_FOUND');
    log(`错误码: ${data.error.code}`);
  });

  // ============================================================
  // B. 竞赛题库列表 API
  // ============================================================
  await test('B1. GET /api/v1/kids/competition/problems 返回题目列表', async () => {
    const res = await kidsApi('/competition/problems');
    assert.strictEqual(res.status, 200, `期望 200，实际 ${res.status}`);
    const data = await res.json();
    assert.ok(data.data, '响应应包含 data');
    assert.ok(Array.isArray(data.data), 'data 应为数组');
    assert.ok(data.data.length > 0, '竞赛题目列表不应为空');
    const first = data.data[0];
    assert.ok(first.id, '题目应有 id');
    assert.ok(first.title, '题目应有 title');
    assert.ok(first.difficulty, '题目应有 difficulty');
    assert.ok(first.category, '题目应有 category');
    log(`获取到 ${data.data.length} 道竞赛题目`);
    log(`第一道: [${first.category}] ${first.title} (${first.difficulty})`);
  });

  await test('B2. GET /api/v1/kids/competition/problems?difficulty=PRIMARY 筛选小学难度', async () => {
    const res = await kidsApi('/competition/problems?difficulty=PRIMARY');
    assert.strictEqual(res.status, 200, `期望 200，实际 ${res.status}`);
    const data = await res.json();
    assert.ok(data.data, '响应应包含 data');
    // 所有返回的题目应为 PRIMARY 难度
    for (const problem of data.data) {
      assert.strictEqual(problem.difficulty, 'PRIMARY',
        `期望 PRIMARY，实际 ${problem.difficulty}`);
    }
    log(`筛选到 ${data.data.length} 道小学难度题目`);
  });

  await test('B3. GET /api/v1/kids/competition/problems?category=CSP 筛选 CSP 类别', async () => {
    const res = await kidsApi('/competition/problems?category=CSP');
    assert.strictEqual(res.status, 200, `期望 200，实际 ${res.status}`);
    const data = await res.json();
    assert.ok(data.data, '响应应包含 data');
    for (const problem of data.data) {
      assert.strictEqual(problem.category, 'CSP',
        `期望 CSP，实际 ${problem.category}`);
    }
    log(`筛选到 ${data.data.length} 道 CSP 类别题目`);
  });

  // ============================================================
  // C. 竞赛题目详情 API
  // ============================================================
  await test('C1. GET /api/v1/kids/competition/problems/{id} 返回题目详情', async () => {
    const res = await kidsApi('/competition/problems/1002000001');
    assert.strictEqual(res.status, 200, `期望 200，实际 ${res.status}`);
    const data = await res.json();
    assert.ok(data.data, '响应应包含 data');
    assert.strictEqual(data.data.id, 1002000001);
    assert.ok(data.data.content, '题目应有 content');
    assert.ok(data.data.sampleInput, '题目应有 sampleInput');
    assert.ok(data.data.sampleOutput, '题目应有 sampleOutput');
    log(`题目详情: ${data.data.title}`);
    log(`样例输入: ${data.data.sampleInput}`);
    log(`样例输出: ${data.data.sampleOutput}`);
  });

  // ============================================================
  // D. 提交竞赛代码 API
  // ============================================================
  await test('D1. POST /api/v1/kids/competition/submit 提交代码返回结果', async () => {
    const code = 'a, b = map(int, input().split())\nprint(a + b)';
    const res = await kidsApi('/competition/submit?problemId=1002000001&language=python', {
      method: 'POST',
      body: code,
    });
    assert.strictEqual(res.status, 200, `期望 200，实际 ${res.status}`);
    const data = await res.json();
    assert.ok(data.data, '响应应包含 data');
    assert.ok(data.data.id, '提交结果应有 id');
    assert.ok(data.data.status, '提交结果应有 status');
    log(`提交状态: ${data.data.status}`);
    log(`通过测试: ${data.data.passedCount}/${data.data.totalCount}`);
  });

  await test('D2. POST /api/v1/kids/competition/submit 需要认证', async () => {
    // 不带 token 提交应返回 401
    const response = await fetch(`${API_URL}/api/v1/kids/competition/submit?problemId=1002000001&language=python`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '""',
    });
    // 未授权应返回 401
    assert.strictEqual(response.status, 401, `期望 401，实际 ${response.status}`);
    log('未授权提交正确返回 401');
  });

  // ============================================================
  // E. 成长勋章列表 API
  // ============================================================
  await test('E1. GET /api/v1/kids/badges 返回勋章列表', async () => {
    const res = await kidsApi('/badges');
    assert.strictEqual(res.status, 200, `期望 200，实际 ${res.status}`);
    const data = await res.json();
    assert.ok(data.data, '响应应包含 data');
    assert.ok(Array.isArray(data.data), 'data 应为数组');
    assert.ok(data.data.length > 0, '勋章列表不应为空');
    const first = data.data[0];
    assert.ok(first.id, '勋章应有 id');
    assert.ok(first.name, '勋章应有 name');
    assert.ok(first.icon, '勋章应有 icon');
    assert.ok('earned' in first, '勋章应有 earned 字段');
    log(`获取到 ${data.data.length} 枚勋章定义`);
    log(`第一枚: ${first.icon} ${first.name} (已获得: ${first.earned})`);
  });

  // ============================================================
  // F. 学习进度总览 API
  // ============================================================
  await test('F1. GET /api/v1/kids/my/progress 返回学习进度', async () => {
    const res = await kidsApi('/my/progress');
    assert.strictEqual(res.status, 200, `期望 200，实际 ${res.status}`);
    const data = await res.json();
    assert.ok(data.data, '响应应包含 data');
    assert.ok('totalPaths' in data.data, '进度应有 totalPaths');
    assert.ok('totalPractice' in data.data, '进度应有 totalPractice');
    assert.ok('earnedBadges' in data.data, '进度应有 earnedBadges');
    log(`学习进度: 路径${data.data.totalPaths}, 提交${data.data.totalPractice}, 勋章${data.data.earnedBadges}`);
  });

  // ============================================================
  // G. AI 助教对话 API
  // ============================================================
  await test('G1. POST /api/v1/kids/ai/tutor 对话返回回复', async () => {
    const res = await kidsApi('/ai/tutor', {
      method: 'POST',
      body: JSON.stringify({
        message: '什么是编程？',
      }),
    });
    assert.strictEqual(res.status, 200, `期望 200，实际 ${res.status}`);
    const data = await res.json();
    assert.ok(data.data, '响应应包含 data');
    assert.ok(data.data.sessionId, '回复应有 sessionId');
    assert.ok(data.data.reply, '回复应有 reply 内容');
    log(`AI 回复 (前50字): ${data.data.reply.substring(0, 50)}...`);
    log(`会话 ID: ${data.data.sessionId}`);
  });

  await test('G2. GET /api/v1/kids/ai/sessions 返回会话列表', async () => {
    const res = await kidsApi('/ai/sessions');
    assert.strictEqual(res.status, 200, `期望 200，实际 ${res.status}`);
    const data = await res.json();
    assert.ok(data.data, '响应应包含 data');
    assert.ok(Array.isArray(data.data), 'data 应为数组');
    log(`会话数量: ${data.data.length}`);
  });

  // ============================================================
  // H. 前端页面渲染
  // ============================================================
  await test('H1. 少儿端首页渲染', async () => {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      const response = await page.goto(`${KIDS_URL}/`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      assert.ok(response, '页面应有响应');
      // 检查关键内容
      const title = await page.title();
      assert.ok(title.includes('少儿编程') || title.includes('萌牛'), `标题应包含关键词: ${title}`);
      log(`页面标题: ${title}`);
    } finally {
      await page.close();
      await context.close();
    }
  });

  await test('H2. 学习路径页面渲染', async () => {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(`${KIDS_URL}/paths`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      const content = await page.textContent('body');
      assert.ok(content, '页面应有内容');
      // 检查是否包含学习路径相关内容
      const hasPaths = content.includes('学习路径') || content.includes('Scratch') || content.includes('Python');
      assert.ok(hasPaths, '页面应包含学习路径相关内容');
      log('学习路径页面渲染成功');
    } finally {
      await page.close();
      await context.close();
    }
  });

  await test('H3. 竞赛题库页面渲染', async () => {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(`${KIDS_URL}/competition`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      const content = await page.textContent('body');
      assert.ok(content, '页面应有内容');
      const hasContent = content.includes('竞赛') || content.includes('CSP') || content.includes('题目');
      assert.ok(hasContent, '页面应包含竞赛相关内容');
      log('竞赛题库页面渲染成功');
    } finally {
      await page.close();
      await context.close();
    }
  });

  // ============================================================
  // I. 竞赛题目详情页交互
  // ============================================================
  await test('I1. 竞赛题目详情页可访问', async () => {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      const response = await page.goto(`${KIDS_URL}/competition/1002000001`, { waitUntil: 'networkidle', timeout: 15000 });
      // 页面应返回 200（Next.js 客户端路由）
      assert.ok(response, '页面应有响应');
      const status = response.status();
      assert.ok(status === 200 || status === 304, `期望 200/304，实际 ${status}`);
      log(`题目详情页状态码: ${status}`);
    } finally {
      await page.close();
      await context.close();
    }
  });

  // ============================================================
  // J. 勋章页面渲染
  // ============================================================
  await test('J1. 勋章页面渲染', async () => {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(`${KIDS_URL}/badges`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      const content = await page.textContent('body');
      assert.ok(content.includes('勋章') || content.includes('我的勋章'), '页面应包含勋章相关内容');
      log('勋章页面渲染成功');
    } finally {
      await page.close();
      await context.close();
    }
  });

  // ============================================================
  // 测试总结
  // ============================================================
  await browser.close();

  console.log('\n========================================');
  console.log(`  测试结果：通过 ${passed} / 失败 ${failed} / 总计 ${passed + failed}`);
  console.log('========================================');

  if (failed > 0) {
    process.exit(1);
  }
})().catch((err) => {
  console.error('测试执行异常:', err);
  if (browser) browser.close();
  process.exit(1);
});
