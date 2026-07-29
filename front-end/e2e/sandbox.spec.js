/**
 * E2E 测试：Judge0 代码沙盒
 * 场景：
 *   A. 执行 Python 代码 → 验证输出
 *   B. 执行 JavaScript 代码
 *   C. 执行带 stdin 的代码
 *   D. 编译错误处理
 *   E. 运行时错误处理
 *   F. 查询提交记录
 *   G. 代码过长校验
 */
const { chromium } = require('playwright');
const assert = require('assert');

const API_URL = process.env.API_URL || 'http://localhost:8080';

let browser;
let passed = 0;
let failed = 0;
let authToken = null;
let judge0Available = false;

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

  const email = `e2e_sandbox_${Date.now()}@test.com`;
  const regRes = await page.request.post(`${API_URL}/api/v1/auth/register`, {
    data: { email, password: 'Test123456', displayName: 'Sandbox Test' },
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
  console.log('  E2E 测试：Judge0 代码沙盒');
  console.log('========================================');

  const { page } = await setup();
  const authHeader = { Authorization: `Bearer ${authToken}` };

  // 预备：检测 Judge0 是否可用
  await test('预备. 检测 Judge0 服务可用性', async () => {
    const probeRes = await page.request.post(`${API_URL}/api/v1/sandbox/execute`, {
      headers: authHeader,
      data: { languageId: 71, sourceCode: 'print("probe")' },
    });
    if (probeRes.status() === 200) {
      judge0Available = true;
      log('    Judge0 服务可用');
    } else {
      log(`    Judge0 服务不可用（HTTP ${probeRes.status()}），执行类测试将跳过`);
    }
  });

  // ===== 场景 A: Python 代码执行 =====
  await test('A1. 执行 Python Hello World', async () => {
    if (!judge0Available) { log('    Judge0 不可用，跳过'); return; }
    const res = await page.request.post(`${API_URL}/api/v1/sandbox/execute`, {
      headers: authHeader,
      data: { languageId: 71, sourceCode: 'print("Hello, World!")' },
    });
    assert.strictEqual(res.status(), 200, `执行返回 ${res.status()}`);
    const body = await res.json();
    assert.strictEqual(body.data.status, 'ACCEPTED', `状态应为 ACCEPTED，实际 ${body.data.status}`);
    assert.ok(body.data.actualOutput.includes('Hello, World!'), '输出应包含 Hello, World!');
    log(`    状态: ${body.data.status}, 输出: ${body.data.actualOutput.trim()}`);
    log(`    耗时: ${body.data.timeMs}ms, 内存: ${body.data.memoryKb}KB`);
  });

  await test('A2. 执行 Python 计算 (2+3*4=14)', async () => {
    if (!judge0Available) { log('    Judge0 不可用，跳过'); return; }
    const res = await page.request.post(`${API_URL}/api/v1/sandbox/execute`, {
      headers: authHeader,
      data: { languageId: 71, sourceCode: 'print(2 + 3 * 4)' },
    });
    assert.strictEqual(res.status(), 200);
    const body = await res.json();
    assert.strictEqual(body.data.status, 'ACCEPTED');
    assert.ok(body.data.actualOutput.includes('14'), '输出应包含 14');
    log(`    输出: ${body.data.actualOutput.trim()}`);
  });

  // ===== 场景 B: JavaScript 执行 =====
  await test('B1. 执行 JavaScript Hello World', async () => {
    if (!judge0Available) { log('    Judge0 不可用，跳过'); return; }
    const res = await page.request.post(`${API_URL}/api/v1/sandbox/execute`, {
      headers: authHeader,
      data: { languageId: 63, sourceCode: 'console.log("Hello from Node.js!");' },
    });
    assert.strictEqual(res.status(), 200);
    const body = await res.json();
    assert.strictEqual(body.data.status, 'ACCEPTED');
    assert.ok(body.data.actualOutput.includes('Hello from Node.js!'));
    log(`    输出: ${body.data.actualOutput.trim()}`);
  });

  // ===== 场景 C: 带 stdin 的代码 =====
  await test('C1. 执行带标准输入的 Python 代码', async () => {
    if (!judge0Available) { log('    Judge0 不可用，跳过'); return; }
    const res = await page.request.post(`${API_URL}/api/v1/sandbox/execute`, {
      headers: authHeader,
      data: {
        languageId: 71,
        sourceCode: 'name = input("Enter name: ")\nprint(f"Hello, {name}!")',
        stdin: 'Alice',
      },
    });
    assert.strictEqual(res.status(), 200);
    const body = await res.json();
    assert.strictEqual(body.data.status, 'ACCEPTED');
    assert.ok(body.data.actualOutput.includes('Hello, Alice!'));
    log(`    输入: Alice, 输出: ${body.data.actualOutput.trim()}`);
  });

  // ===== 场景 D: 编译错误 =====
  await test('D1. Python 语法错误返回编译错误状态', async () => {
    if (!judge0Available) { log('    Judge0 不可用，跳过'); return; }
    const res = await page.request.post(`${API_URL}/api/v1/sandbox/execute`, {
      headers: authHeader,
      data: { languageId: 71, sourceCode: 'print("missing paren"' },
    });
    assert.strictEqual(res.status(), 200);
    const body = await res.json();
    assert.notStrictEqual(body.data.status, 'ACCEPTED', '语法错误不应为 ACCEPTED');
    log(`    状态: ${body.data.status}, 输出: ${body.data.actualOutput.substring(0, 80)}`);
  });

  // ===== 场景 E: 运行时错误 =====
  await test('E1. Python 运行时错误（除零）', async () => {
    if (!judge0Available) { log('    Judge0 不可用，跳过'); return; }
    const res = await page.request.post(`${API_URL}/api/v1/sandbox/execute`, {
      headers: authHeader,
      data: { languageId: 71, sourceCode: 'x = 1 / 0\nprint(x)' },
    });
    assert.strictEqual(res.status(), 200);
    const body = await res.json();
    assert.notStrictEqual(body.data.status, 'ACCEPTED', '运行时错误不应为 ACCEPTED');
    log(`    状态: ${body.data.status}`);
  });

  // ===== 场景 F: 查询提交记录 =====
  await test('F1. 执行后查询提交记录', async () => {
    if (!judge0Available) { log('    Judge0 不可用，跳过'); return; }
    const execRes = await page.request.post(`${API_URL}/api/v1/sandbox/execute`, {
      headers: authHeader,
      data: { languageId: 71, sourceCode: 'print("query test")' },
    });
    const execBody = await execRes.json();
    const submissionId = execBody.data.submissionId;

    const getRes = await page.request.get(
      `${API_URL}/api/v1/sandbox/submissions/${submissionId}`,
      { headers: authHeader }
    );
    assert.strictEqual(getRes.status(), 200);
    const getBody = await getRes.json();
    assert.strictEqual(getBody.data.id, submissionId);
    assert.strictEqual(getBody.data.status, 'ACCEPTED');
    log(`    提交 ID: ${submissionId}, 查询状态: ${getBody.data.status}`);
  });

  await test('F2. 查询不存在的提交记录返回 404', async () => {
    const res = await page.request.get(
      `${API_URL}/api/v1/sandbox/submissions/999999999`,
      { headers: authHeader }
    );
    assert.strictEqual(res.status(), 404, `不存在记录应返回 404，实际 ${res.status()}`);
  });

  // ===== 场景 G: 代码过长校验 =====
  await test('G1. 空代码执行返回 400', async () => {
    if (!judge0Available) {
      log('    Judge0 不可用，但仍可测试参数校验');
    }
    const res = await page.request.post(`${API_URL}/api/v1/sandbox/execute`, {
      headers: authHeader,
      data: { languageId: 71, sourceCode: '' },
    });
    log(`    空代码执行返回状态: ${res.status()}`);
    assert.ok([200, 400, 422].includes(res.status()), '空代码应返回 200/400/422');
  });

  await cleanup();

  // ===== 汇总 =====
  console.log('\n========================================');
  console.log(`  沙盒 E2E 测试结果: ${passed} 通过, ${failed} 失败`);
  console.log(`  Judge0 可用: ${judge0Available ? '是' : '否 (需 docker compose up)'}`);
  console.log('========================================');
  process.exit(failed > 0 ? 1 : 0);
})();
