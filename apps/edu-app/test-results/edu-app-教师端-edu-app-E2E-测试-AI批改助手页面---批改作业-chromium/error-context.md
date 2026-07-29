# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: edu-app.spec.ts >> 教师端 edu-app E2E 测试 >> AI批改助手页面 - 批改作业
- Location: tests\edu-app.spec.ts:56:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('textarea[name="question"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "🐮 萌牛AI教师端" [ref=e5] [cursor=pointer]:
        - /url: /
        - generic [ref=e6]: 🐮
        - generic [ref=e7]: 萌牛AI教师端
      - generic [ref=e8]:
        - button "AI工具 ▼" [ref=e10] [cursor=pointer]:
          - text: AI工具
          - generic [ref=e11]: ▼
        - link "模板库" [ref=e12] [cursor=pointer]:
          - /url: /templates
        - link "订阅计划" [ref=e13] [cursor=pointer]:
          - /url: /pricing
        - link "对赌协议" [ref=e14] [cursor=pointer]:
          - /url: /guarantee
        - link "我的" [ref=e15] [cursor=pointer]:
          - /url: /my/history
        - link "登录/注册" [ref=e16] [cursor=pointer]:
          - /url: /login
  - main [ref=e17]:
    - generic [ref=e18]:
      - generic [ref=e20]:
        - generic [ref=e21]: ✅
        - generic [ref=e22]:
          - heading "AI批改助手" [level=1] [ref=e23]
          - paragraph [ref=e24]: 输入题目和学生答案，AI自动批改评分
      - generic [ref=e26]:
        - generic [ref=e28]:
          - heading "AI 批改" [level=2] [ref=e29]
          - generic [ref=e30]:
            - generic [ref=e31]: 学科
            - combobox [ref=e32]:
              - option "语文"
              - option "数学" [selected]
              - option "英语"
              - option "物理"
              - option "化学"
          - generic [ref=e33]:
            - generic [ref=e34]: 题目 *
            - textbox "例：解方程 x²+2x-3=0" [ref=e35]
          - generic [ref=e36]:
            - generic [ref=e37]: 学生答案 *
            - textbox "例：x = 1 或 x = -3" [ref=e38]
          - generic [ref=e39]:
            - generic [ref=e40]: 参考答案 (选填)
            - textbox "例：x = 1 或 x = -3" [ref=e41]
          - button "🚀 开始批改" [ref=e42] [cursor=pointer]
          - paragraph [ref=e43]: AI 评分仅供参考，低置信度结果会标记需人工复核
        - generic [ref=e46]:
          - generic [ref=e47]: ✅
          - paragraph [ref=e48]: 填写题目和学生答案后点击批改
  - contentinfo [ref=e49]:
    - generic [ref=e50]:
      - generic [ref=e51]:
        - generic [ref=e52]:
          - heading "AI工具" [level=3] [ref=e53]
          - list [ref=e54]:
            - listitem [ref=e55]:
              - link "AI备课助手" [ref=e56] [cursor=pointer]:
                - /url: /tools/lesson
            - listitem [ref=e57]:
              - link "AI出题机" [ref=e58] [cursor=pointer]:
                - /url: /tools/quiz
            - listitem [ref=e59]:
              - link "AI批改助手" [ref=e60] [cursor=pointer]:
                - /url: /tools/grade
            - listitem [ref=e61]:
              - link "AI课件生成" [ref=e62] [cursor=pointer]:
                - /url: /tools/slides
        - generic [ref=e63]:
          - heading "资源" [level=3] [ref=e64]
          - list [ref=e65]:
            - listitem [ref=e66]:
              - link "模板库" [ref=e67] [cursor=pointer]:
                - /url: /templates
            - listitem [ref=e68]:
              - link "我的教案" [ref=e69] [cursor=pointer]:
                - /url: /my/lessons
            - listitem [ref=e70]:
              - link "我的题库" [ref=e71] [cursor=pointer]:
                - /url: /my/quizbank
        - generic [ref=e72]:
          - heading "关于" [level=3] [ref=e73]
          - list [ref=e74]:
            - listitem [ref=e75]:
              - link "订阅计划" [ref=e76] [cursor=pointer]:
                - /url: /pricing
            - listitem [ref=e77]:
              - link "对赌协议" [ref=e78] [cursor=pointer]:
                - /url: /guarantee
            - listitem [ref=e79]:
              - link "联系我们" [ref=e80] [cursor=pointer]:
                - /url: undefined/contact
        - generic [ref=e81]:
          - heading "其他平台" [level=3] [ref=e82]
          - list [ref=e83]:
            - listitem [ref=e84]:
              - link "官网首页" [ref=e85] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e86]:
              - link "程序员学习平台" [ref=e87] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e88]:
              - link "少儿编程平台" [ref=e89] [cursor=pointer]:
                - /url: "#"
      - paragraph [ref=e91]: © 2026 萌牛AI. All rights reserved.
  - alert [ref=e92]
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
  53  |     await expect(page.locator("text=课件预览")).toBeVisible({ timeout: 15000 });
  54  |   });
  55  | 
  56  |   test("AI批改助手页面 - 批改作业", async ({ page }) => {
  57  |     await page.goto("http://localhost:3004/tools/grade");
  58  |     await expect(page.locator("text=AI 批改").first()).toBeVisible({ timeout: 10000 });
  59  | 
  60  |     // 填写表单
> 61  |     await page.fill('textarea[name="question"]', "解方程 x^2+2x-3=0");
      |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
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