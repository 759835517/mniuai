# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: edu-app.spec.ts >> 教师端 edu-app E2E 测试 >> AI备课助手页面 - 生成教案
- Location: tests\edu-app.spec.ts:11:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('【学科】数学')
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByText('【学科】数学')

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
  - text: 📝
  - heading "AI备课助手" [level=1]
  - paragraph: 输入课题，5分钟生成完整教案
  - heading "设置参数" [level=2]
  - text: 学科
  - combobox:
    - option "语文"
    - option "数学" [selected]
    - option "英语"
    - option "物理"
    - option "化学"
    - option "历史"
    - option "政治"
    - option "生物"
    - option "地理"
    - option "体育"
    - option "其他"
  - text: 年级
  - combobox:
    - option "一年级"
    - option "二年级"
    - option "三年级"
    - option "四年级"
    - option "五年级"
    - option "六年级"
    - option "初一"
    - option "初二"
    - option "初三" [selected]
    - option "高一"
    - option "高二"
    - option "高三"
  - text: 课题名称 *
  - textbox "例：《背影》第一课时": 二次函数
  - text: 课时时长
  - combobox:
    - option "40分钟"
    - option "45分钟" [selected]
    - option "90分钟"
  - text: 教材版本
  - combobox:
    - option "人教版" [selected]
    - option "北师大版"
    - option "苏教版"
    - option "沪教版"
    - option "通用版"
  - text: 教学目标 (选填，AI可自动推断)
  - textbox "例：理解文章情感，学会分析人物描写手法..."
  - button "🚀 AI生成教案"
  - text: AI将生成完整教案框架，包含学情分析、教学流程等8个模块
  - button "🔄 重新生成"
  - button "📋 复制"
  - button "💾 保存到库"
  - button "📤 导出 ▾"
  - text: 生成失败，请重试
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
  7   |     await expect(page.getByText("AI备课助手").first()).toBeVisible();
  8   |     await expect(page.getByText("AI出题机").first()).toBeVisible();
  9   |   });
  10  | 
  11  |   test("AI备课助手页面 - 生成教案", async ({ page }) => {
  12  |     await page.goto("http://localhost:3004/tools/lesson");
  13  |     await expect(page.getByText("设置参数").first()).toBeVisible();
  14  | 
  15  |     // 填写表单
  16  |     await page.fill('input[name="topic"]', "二次函数");
  17  |     await page.selectOption('select[name="subject"]', "数学");
  18  |     await page.selectOption('select[name="grade"]', "初三");
  19  | 
  20  |     // 点击生成
  21  |     await page.click('button:has-text("AI生成教案")');
  22  | 
  23  |     // 等待结果包含学科信息
> 24  |     await expect(page.getByText("【学科】数学")).toBeVisible({ timeout: 15000 });
      |                                            ^ Error: expect(locator).toBeVisible() failed
  25  |   });
  26  | 
  27  |   test("AI出题机页面 - 生成题目", async ({ page }) => {
  28  |     await page.goto("http://localhost:3004/tools/quiz");
  29  |     await expect(page.getByText("设置出题参数").first()).toBeVisible();
  30  | 
  31  |     // 填写知识点
  32  |     await page.fill('textarea[name="knowledgePoints"]', "二次函数图像");
  33  | 
  34  |     // 点击生成
  35  |     await page.click('button:has-text("AI生成题目")');
  36  | 
  37  |     // 等待结果
  38  |     await expect(page.getByText("生成结果")).toBeVisible({ timeout: 15000 });
  39  |   });
  40  | 
  41  |   test("AI课件生成页面 - 生成课件", async ({ page }) => {
  42  |     await page.goto("http://localhost:3004/tools/slides");
  43  |     await expect(page.getByText("设置课件参数").first()).toBeVisible();
  44  | 
  45  |     // 填写课题
  46  |     await page.fill('input[name="topic"]', "光合作用");
  47  | 
  48  |     // 点击生成
  49  |     await page.click('button:has-text("AI生成课件结构")');
  50  | 
  51  |     // 等待结果
  52  |     await expect(page.getByText("课件预览")).toBeVisible({ timeout: 15000 });
  53  |   });
  54  | 
  55  |   test("AI批改助手页面 - 批改作业", async ({ page }) => {
  56  |     await page.goto("http://localhost:3004/tools/grade");
  57  |     await expect(page.getByText("AI 批改").first()).toBeVisible();
  58  | 
  59  |     // 填写表单
  60  |     await page.fill('textarea[name="question"]', "解方程 x^2+2x-3=0");
  61  |     await page.fill('textarea[name="studentAnswer"]', "x=1, x=-3");
  62  | 
  63  |     // 点击批改
  64  |     await page.click('button:has-text("开始批改")');
  65  | 
  66  |     // 等待结果
  67  |     await expect(page.getByText("批改结果")).toBeVisible({ timeout: 15000 });
  68  |   });
  69  | 
  70  |   test("模板库页面", async ({ page }) => {
  71  |     await page.goto("http://localhost:3004/templates");
  72  |     await expect(page.locator("h1").first()).toContainText("模板库");
  73  |     await expect(page.getByText("通用教案模板")).toBeVisible();
  74  |   });
  75  | 
  76  |   test("我的教案库页面", async ({ page }) => {
  77  |     await page.goto("http://localhost:3004/my/lessons");
  78  |     await expect(page.locator("h1").first()).toContainText("我的教案库");
  79  |   });
  80  | 
  81  |   test("使用记录页面", async ({ page }) => {
  82  |     await page.goto("http://localhost:3004/my/history");
  83  |     await expect(page.locator("h1").first()).toContainText("使用记录");
  84  |     await expect(page.getByText("对赌达成进度")).toBeVisible();
  85  |   });
  86  | 
  87  |   test("登录页面", async ({ page }) => {
  88  |     await page.goto("http://localhost:3004/login");
  89  |     await expect(page.getByRole("button", { name: "登录" })).toBeVisible();
  90  |     await expect(page.getByText("萌牛AI")).toBeVisible();
  91  |   });
  92  | 
  93  |   test("定价页面", async ({ page }) => {
  94  |     await page.goto("http://localhost:3004/pricing");
  95  |     await expect(page.locator("body")).toContainText("订阅");
  96  |   });
  97  | 
  98  |   test("对赌协议页面", async ({ page }) => {
  99  |     await page.goto("http://localhost:3004/guarantee");
  100 |     await expect(page.locator("body")).toContainText("对赌");
  101 |   });
  102 | });
  103 | 
```