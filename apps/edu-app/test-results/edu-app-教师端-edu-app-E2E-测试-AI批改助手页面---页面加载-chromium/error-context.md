# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: edu-app.spec.ts >> 教师端 edu-app E2E 测试 >> AI批改助手页面 - 页面加载
- Location: tests\edu-app.spec.ts:49:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('textarea[name="question"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('textarea[name="question"]')

```

```yaml
- navigation:
  - link "🐮 萌牛AI教师端":
    - /url: /
  - button "AI工具 ▼"
  - link "模板库":
    - /url: /templates
  - link "订阅计划":
    - /url: /pricing
  - link "对赌协议":
    - /url: /guarantee
  - link "我的":
    - /url: /my/history
  - link "登录/注册":
    - /url: /login
- main:
  - text: ✅
  - heading "AI批改助手" [level=1]
  - paragraph: 输入题目和学生答案，AI自动批改评分
  - heading "AI 批改" [level=2]
  - text: 学科
  - combobox:
    - option "语文"
    - option "数学" [selected]
    - option "英语"
    - option "物理"
    - option "化学"
  - text: 题目 *
  - textbox "例：解方程 x²+2x-3=0"
  - text: 学生答案 *
  - textbox "例：x = 1 或 x = -3"
  - text: 参考答案 (选填)
  - textbox "例：x = 1 或 x = -3"
  - button "🚀 开始批改"
  - paragraph: AI 评分仅供参考，低置信度结果会标记需人工复核
  - text: ✅
  - paragraph: 填写题目和学生答案后点击批改
- contentinfo:
  - heading "AI工具" [level=3]
  - list:
    - listitem:
      - link "AI备课助手":
        - /url: /tools/lesson
    - listitem:
      - link "AI出题机":
        - /url: /tools/quiz
    - listitem:
      - link "AI批改助手":
        - /url: /tools/grade
    - listitem:
      - link "AI课件生成":
        - /url: /tools/slides
  - heading "资源" [level=3]
  - list:
    - listitem:
      - link "模板库":
        - /url: /templates
    - listitem:
      - link "我的教案":
        - /url: /my/lessons
    - listitem:
      - link "我的题库":
        - /url: /my/quizbank
  - heading "关于" [level=3]
  - list:
    - listitem:
      - link "订阅计划":
        - /url: /pricing
    - listitem:
      - link "对赌协议":
        - /url: /guarantee
    - listitem:
      - link "联系我们":
        - /url: undefined/contact
  - heading "其他平台" [level=3]
  - list:
    - listitem:
      - link "官网首页":
        - /url: "#"
    - listitem:
      - link "程序员学习平台":
        - /url: "#"
    - listitem:
      - link "少儿编程平台":
        - /url: "#"
  - paragraph: © 2026 萌牛AI. All rights reserved.
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("教师端 edu-app E2E 测试", () => {
  4  |   test("首页加载正常，显示工具卡片", async ({ page }) => {
  5  |     await page.goto("http://localhost:3004");
  6  |     await expect(page.locator("h1").first()).toContainText("AI帮你备课");
  7  |     await expect(page.locator("h3", { hasText: "AI备课助手" })).toBeVisible();
  8  |     await expect(page.locator("h3", { hasText: "AI出题机" })).toBeVisible();
  9  |   });
  10 | 
  11 |   test("AI备课助手页面 - 生成教案", async ({ page }) => {
  12 |     await page.goto("http://localhost:3004/tools/lesson");
  13 |     await expect(page.locator("text=设置参数").first()).toBeVisible({ timeout: 10000 });
  14 | 
  15 |     await page.fill('input[name="topic"]', "Quadratic Function");
  16 |     await page.selectOption('select[name="subject"]', "数学");
  17 |     await page.selectOption('select[name="grade"]', "初三");
  18 |     await page.click('button:has-text("AI生成教案")');
  19 | 
  20 |     // 等待结果出现（pre 标签内容长度 > 0）
  21 |     await expect.poll(async () => {
  22 |       const text = await page.locator("pre").textContent();
  23 |       return text?.length || 0;
  24 |     }, { timeout: 15000 }).toBeGreaterThan(10);
  25 |   });
  26 | 
  27 |   test("AI出题机页面 - 生成题目", async ({ page }) => {
  28 |     await page.goto("http://localhost:3004/tools/quiz");
  29 |     await expect(page.locator("text=设置出题参数").first()).toBeVisible({ timeout: 10000 });
  30 | 
  31 |     await page.fill('textarea[name="knowledgePoints"]', "Quadratic");
  32 |     await page.click('button:has-text("AI生成题目")');
  33 | 
  34 |     // 等待结果
  35 |     await expect(page.locator("text=生成结果")).toBeVisible({ timeout: 15000 });
  36 |   });
  37 | 
  38 |   test("AI课件生成页面 - 生成课件", async ({ page }) => {
  39 |     await page.goto("http://localhost:3004/tools/slides");
  40 |     await expect(page.locator("text=设置课件参数").first()).toBeVisible({ timeout: 10000 });
  41 | 
  42 |     await page.fill('input[name="topic"]', "Photosynthesis");
  43 |     await page.click('button:has-text("AI生成课件结构")');
  44 | 
  45 |     // 等待结果
  46 |     await expect(page.locator("text=课件预览")).toBeVisible({ timeout: 15000 });
  47 |   });
  48 | 
  49 |   test("AI批改助手页面 - 页面加载", async ({ page }) => {
  50 |     await page.goto("http://localhost:3004/tools/grade");
  51 |     await expect(page.locator("h2", { hasText: "AI 批改" })).toBeVisible({ timeout: 10000 });
> 52 |     await expect(page.locator('textarea[name="question"]')).toBeVisible();
     |                                                             ^ Error: expect(locator).toBeVisible() failed
  53 |     await expect(page.locator('textarea[name="studentAnswer"]')).toBeVisible();
  54 |   });
  55 | 
  56 |   test("模板库页面", async ({ page }) => {
  57 |     await page.goto("http://localhost:3004/templates");
  58 |     await expect(page.locator("h1").first()).toContainText("模板库");
  59 |     await expect(page.locator("text=通用教案模板")).toBeVisible();
  60 |   });
  61 | 
  62 |   test("我的教案库页面", async ({ page }) => {
  63 |     await page.goto("http://localhost:3004/my/lessons");
  64 |     await expect(page.locator("h1").first()).toContainText("我的教案库");
  65 |   });
  66 | 
  67 |   test("使用记录页面", async ({ page }) => {
  68 |     await page.goto("http://localhost:3004/my/history");
  69 |     await expect(page.locator("h1").first()).toContainText("使用记录");
  70 |     await expect(page.locator("text=对赌达成进度")).toBeVisible();
  71 |   });
  72 | 
  73 |   test("登录页面", async ({ page }) => {
  74 |     await page.goto("http://localhost:3004/login");
  75 |     await expect(page.locator("button:has-text(\"登录\")").first()).toBeVisible();
  76 |     await expect(page.locator("text=萌牛AI").first()).toBeVisible();
  77 |   });
  78 | 
  79 |   test("定价页面", async ({ page }) => {
  80 |     await page.goto("http://localhost:3004/pricing");
  81 |     await expect(page.locator("body")).toContainText("订阅");
  82 |   });
  83 | 
  84 |   test("对赌协议页面", async ({ page }) => {
  85 |     await page.goto("http://localhost:3004/guarantee");
  86 |     await expect(page.locator("body")).toContainText("对赌");
  87 |   });
  88 | });
  89 | 
```