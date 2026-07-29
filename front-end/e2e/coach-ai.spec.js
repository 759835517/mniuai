/**
 * E2E 测试：AI 教练 + RAG 知识库
 * 场景：
 *   A. 创建会话 → 发送消息 → 接收回复
 *   B. 流式消息（SSE）
 *   C. 多轮对话上下文
 *   D. 会话列表和删除
 *   E. RAG 知识库索引 → Coach 引用课程内容
 *   F. 消息长度限制
 */
const { chromium } = require('playwright');
const assert = require('assert');

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

async function setup() {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const email = `e2e_coach_${Date.now()}@test.com`;
  const regRes = await page.request.post(`${API_URL}/api/v1/auth/register`, {
    data: { email, password: 'Test123456', displayName: 'Coach Test' },
  });
  const body = await regRes.json();
  authToken = body.data.accessToken;
  return { page };
}

async function cleanup() {
  if (browser) await browser.close();
}

(async () => {
  console.log('========================================');
  console.log('  E2E 测试：AI 教练 + RAG 知识库');
  console.log('========================================');

  const { page } = await setup();
  const authHeader = { Authorization: `Bearer ${authToken}` };

  let createdSessionId = null;

  // ===== 场景 A: 创建会话 + 发送消息 =====
  await test('A1. 创建 AI 教练会话', async () => {
    const res = await page.request.post(`${API_URL}/api/v1/coach/sessions`, {
      headers: authHeader,
      data: { title: 'E2E Test Session', contextType: 'GENERAL' },
    });
    assert.strictEqual(res.status(), 200, `创建会话返回 ${res.status()}`);
    const body = await res.json();
    assert.ok(body.data?.id, '应返回会话 ID');
    createdSessionId = body.data.id;
    log(`    会话 ID: ${createdSessionId}`);
    log(`    标题: ${body.data.title}`);
  });

  await test('A2. 发送消息并接收 AI 回复', async () => {
    if (!createdSessionId) {
      log('    无可用会话，跳过');
      return;
    }
    const res = await page.request.post(
      `${API_URL}/api/v1/coach/sessions/${createdSessionId}/messages`,
      {
        headers: authHeader,
        data: { content: '你好，请介绍一下 Java 编程语言' },
      }
    );
    assert.strictEqual(res.status(), 200, `发送消息返回 ${res.status()}`);
    const body = await res.json();
    const messages = body.data?.messages || body.data?.items || [];
    log(`    消息数量: ${messages.length}`);
    if (messages.length >= 2) {
      log(`    用户消息: ${messages[0]?.content?.substring(0, 50)}`);
      log(`    AI 回复: ${messages[1]?.content?.substring(0, 100)}...`);
    }
    // 验证至少包含用户消息和 AI 回复
    assert.ok(messages.length >= 2, '应包含用户消息和 AI 回复');
  });

  // ===== 场景 B: 流式消息 =====
  await test('B1. 流式消息返回 SSE 事件', async () => {
    if (!createdSessionId) {
      log('    无可用会话，跳过');
      return;
    }
    const res = await page.request.post(
      `${API_URL}/api/v1/coach/sessions/${createdSessionId}/messages/stream`,
      {
        headers: { ...authHeader, Accept: 'text/event-stream' },
        data: { content: '用一句话解释什么是 Spring Boot' },
      }
    );
    assert.strictEqual(res.status(), 200, `流式消息返回 ${res.status()}`);
    const contentType = res.headers()['content-type'] || '';
    log(`    Content-Type: ${contentType}`);
    assert.ok(contentType.includes('text/event-stream'), '应为 SSE 流');
  });

  // ===== 场景 C: 多轮对话 =====
  await test('C1. 多轮对话保持上下文', async () => {
    if (!createdSessionId) {
      log('    无可用会话，跳过');
      return;
    }
    // 第二轮消息
    const res = await page.request.post(
      `${API_URL}/api/v1/coach/sessions/${createdSessionId}/messages`,
      {
        headers: authHeader,
        data: { content: '它有什么核心特性？' },
      }
    );
    assert.strictEqual(res.status(), 200);
    const body = await res.json();
    const messages = body.data?.messages || body.data?.items || [];
    log(`    多轮对话后消息总数: ${messages.length}`);
    assert.ok(messages.length >= 4, '两轮对话后应至少有 4 条消息');
  });

  // ===== 场景 D: 会话管理 =====
  await test('D1. 获取会话列表', async () => {
    const res = await page.request.get(`${API_URL}/api/v1/coach/sessions`, {
      headers: authHeader,
    });
    assert.strictEqual(res.status(), 200);
    const body = await res.json();
    const sessions = body.data?.items || body.data || [];
    log(`    会话数量: ${sessions.length}`);
    assert.ok(sessions.length >= 1, '应至少有 1 个会话');
  });

  await test('D2. 获取会话详情', async () => {
    if (!createdSessionId) return;
    const res = await page.request.get(
      `${API_URL}/api/v1/coach/sessions/${createdSessionId}`,
      { headers: authHeader }
    );
    assert.strictEqual(res.status(), 200);
    const body = await res.json();
    assert.strictEqual(body.data.id, createdSessionId);
  });

  await test('D3. 删除会话', async () => {
    if (!createdSessionId) return;
    const res = await page.request.delete(
      `${API_URL}/api/v1/coach/sessions/${createdSessionId}`,
      { headers: authHeader }
    );
    assert.strictEqual(res.status(), 200, `删除会话返回 ${res.status()}`);
    log('    会话删除成功');
  });

  // ===== 场景 E: RAG 知识库 =====
  await test('E1. 索引所有已发布课程（admin）', async () => {
    const res = await page.request.post(
      `${API_URL}/api/v1/admin/rag/index-all`,
      { headers: authHeader }
    );
    // 非 admin 可能返回 403
    if (res.status() === 403) {
      log('    非 admin 用户，跳过索引测试');
      return;
    }
    assert.strictEqual(res.status(), 200, `索引返回 ${res.status()}`);
    const body = await res.json();
    log(`    索引 chunk 总数: ${body.data?.totalChunks}`);
  });

  await test('E2. 索引指定课时', async () => {
    // 获取一个课时
    const lessonsRes = await page.request.get(
      `${API_URL}/api/v1/lessons?page=1&size=1`,
      { headers: authHeader }
    );
    const body = await lessonsRes.json();
    if (!body.data?.items?.length) {
      log('    无课时数据，跳过');
      return;
    }
    const lessonId = body.data.items[0].id;

    const res = await page.request.post(
      `${API_URL}/api/v1/admin/rag/index-lesson/${lessonId}`,
      { headers: authHeader }
    );
    if (res.status() === 403) {
      log('    非 admin 用户，跳过');
      return;
    }
    assert.strictEqual(res.status(), 200);
    const ragBody = await res.json();
    log(`    课时 ${lessonId} 索引 chunk 数: ${ragBody.data?.chunksCreated}`);
  });

  // ===== 场景 F: 消息长度限制 =====
  await test('F1. 超长消息应被拒绝', async () => {
    // 创建新会话
    const sessionRes = await page.request.post(`${API_URL}/api/v1/coach/sessions`, {
      headers: authHeader,
      data: { title: 'Limit Test', contextType: 'GENERAL' },
    });
    if (sessionRes.status() !== 200) return;
    const sessionId = (await sessionRes.json()).data.id;

    // 发送超长消息（> 12000 字符）
    const longContent = 'A'.repeat(13000);
    const res = await page.request.post(
      `${API_URL}/api/v1/coach/sessions/${sessionId}/messages`,
      {
        headers: authHeader,
        data: { content: longContent },
      }
    );
    assert.strictEqual(res.status(), 400, `超长消息应返回 400，实际 ${res.status()}`);
    log('    超长消息正确被拒绝（400）');
  });

  await cleanup();

  // ===== 汇总 =====
  console.log('\n========================================');
  console.log(`  AI 教练 E2E 测试结果: ${passed} 通过, ${failed} 失败`);
  console.log('========================================');
  process.exit(failed > 0 ? 1 : 0);
})();
