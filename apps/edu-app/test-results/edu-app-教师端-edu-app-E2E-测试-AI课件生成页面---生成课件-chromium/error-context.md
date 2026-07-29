# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: edu-app.spec.ts >> 教师端 edu-app E2E 测试 >> AI课件生成页面 - 生成课件
- Location: tests\edu-app.spec.ts:42:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=课件预览')
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('text=课件预览')

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
  - text: 📊
  - heading "AI课件生成" [level=1]
  - paragraph: 输入课题，一键生成可下载的PPTX课件
  - heading "设置课件参数" [level=2]
  - text: 课题名称 *
  - textbox "例：光合作用": 光合作用
  - text: 学科
  - combobox:
    - option "语文" [selected]
    - option "数学"
    - option "英语"
    - option "物理"
    - option "化学"
    - option "历史"
    - option "通用"
  - text: 学段
  - combobox:
    - option "小学"
    - option "初中" [selected]
    - option "高中"
    - option "大学"
  - text: PPT风格
  - button "简约"
  - button "活泼"
  - button "学术"
  - button "🚀 AI生成课件结构"
  - text: 📊
  - paragraph: 填写课题后点击生成，预览每一页幻灯片
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
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("教师端 edu-app E2E 测试", () => {
  4   |   test("首页加载正常，显示工具卡片", async ({ page }) => {
  5   |     await page.goto("http://localhost:3004");
  6   |     await expect(page.locator("h1").first()).toContainText("AI帮你备课");
  7   |     // 工具卡片标题
  8   |     await expect(page.locator("h3", { hasText: "AI备课助手" })).toBeVisible();
  9   |     await expect(page.locator("h3", { hasText: "AI出题机" })).toBeVisible();
  10  |   });
  11  | 
  12  |   test("AI备课助手页面 - 生成教案", async ({ page }) => {
  13  |     await page.goto("http://localhost:3004/tools/lesson");
  14  |     await expect(page.locator("text=设置参数").first()).toBeVisible({ timeout: 10000 });
  15  | 
  16  |     // 填写表单
  17  |     await page.fill('input[name="topic"]', "二次函数");
  18  |     await page.selectOption('select[name="subject"]', "数学");
  19  |     await page.selectOption('select[name="grade"]', "初三");
  20  | 
  21  |     // 点击生成
  22  |     await page.click('button:has-text("AI生成教案")');
  23  | 
  24  |     // 等待结果包含学科信息
  25  |     await expect(page.locator("text=【学科】数学")).toBeVisible({ timeout: 15000 });
  26  |   });
  27  | 
  28  |   test("AI出题机页面 - 生成题目", async ({ page }) => {
  29  |     await page.goto("http://localhost:3004/tools/quiz");
  30  |     await expect(page.locator("text=设置出题参数").first()).toBeVisible({ timeout: 10000 });
  31  | 
  32  |     // 填写知识点
  33  |     await page.fill('textarea[name="knowledgePoints"]', "二次函数图像");
  34  | 
  35  |     // 点击生成
  36  |     await page.click('button:has-text("AI生成题目")');
  37  | 
  38  |     // 等待结果
  39  |     await expect(page.locator("text=生成结果")).toBeVisible({ timeout: 15000 });
  40  |   });
  41  | 
  42  |   test("AI课件生成页面 - 生成课件", async ({ page }) => {
  43  |     await page.goto("http://localhost:3004/tools/slides");
  44  |     await expect(page.locator("text=设置课件参数").first()).toBeVisible({ timeout: 10000 });
  45  | 
  46  |     // 填写课题
  47  |     await page.fill('input[name="topic"]', "光合作用");
  48  | 
  49  |     // 点击生成
  50  |     await page.click('button:has-text("AI生成课件结构")');
  51  | 
  52  |     // 等待结果
> 53  |     await expect(page.locator("text=课件预览")).toBeVisible({ timeout: 15000 });
      |                                             ^ Error: expect(locator).toBeVisible() failed
  54  |   });
  55  | 
  56  |   test("AI批改助手页面 - 批改作业", async ({ page }) => {
  57  |     await page.goto("http://localhost:3004/tools/grade");
  58  |     await expect(page.locator("text=AI 批改").first()).toBeVisible({ timeout: 10000 });
  59  | 
  60  |     // 填写表单
  61  |     await page.fill('textarea[name="question"]', "解方程 x^2+2x-3=0");
  62  |     await page.fill('textarea[name="studentAnswer"]', "x=1, x=-3");
  63  | 
  64  |     // 点击批改
  65  |     await page.click('button:has-text("开始批改")');
  66  | 
  67  |     // 等待结果
  68  |     await expect(page.locator("text=批改结果")).toBeVisible({ timeout: 15000 });
  69  |   });
  70  | 
  71  |   test("模板库页面", async ({ page }) => {
  72  |     await page.goto("http://localhost:3004/templates");
  73  |     await expect(page.locator("h1").first()).toContainText("模板库");
  74  |     await expect(page.locator("text=通用教案模板")).toBeVisible();
  75  |   });
  76  | 
  77  |   test("我的教案库页面", async ({ page }) => {
  78  |     await page.goto("http://localhost:3004/my/lessons");
  79  |     await expect(page.locator("h1").first()).toContainText("我的教案库");
  80  |   });
  81  | 
  82  |   test("使用记录页面", async ({ page }) => {
  83  |     await page.goto("http://localhost:3004/my/history");
  84  |     await expect(page.locator("h1").first()).toContainText("使用记录");
  85  |     await expect(page.locator("text=对赌达成进度")).toBeVisible();
  86  |   });
  87  | 
  88  |   test("登录页面", async ({ page }) => {
  89  |     await page.goto("http://localhost:3004/login");
  90  |     await expect(page.locator("button:has-text(\"登录\")").first()).toBeVisible();
  91  |     await expect(page.locator("text=萌牛AI").first()).toBeVisible();
  92  |   });
  93  | 
  94  |   test("定价页面", async ({ page }) => {
  95  |     await page.goto("http://localhost:3004/pricing");
  96  |     await expect(page.locator("body")).toContainText("订阅");
  97  |   });
  98  | 
  99  |   test("对赌协议页面", async ({ page }) => {
  100 |     await page.goto("http://localhost:3004/guarantee");
  101 |     await expect(page.locator("body")).toContainText("对赌");
  102 |   });
  103 | });
  104 | 
```