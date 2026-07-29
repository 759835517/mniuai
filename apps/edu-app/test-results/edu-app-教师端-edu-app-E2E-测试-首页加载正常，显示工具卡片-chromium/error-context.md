# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: edu-app.spec.ts >> 教师端 edu-app E2E 测试 >> 首页加载正常，显示工具卡片
- Location: tests\edu-app.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  getByText('AI备课助手').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('AI备课助手').first()
    14 × locator resolved to <span class="text-sm font-medium text-gray-700">AI备课助手</span>
       - unexpected value "hidden"

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
  - text: 🎯 专为教师设计的AI效率工具平台
  - heading "AI帮你备课，每周省出10小时" [level=1]
  - paragraph: 备课、出题、批改、课件制作全流程AI辅助。使用50次无效果，60天内全额退款。
  - link "免费体验7天 →":
    - /url: /login
  - link "先试试AI备课":
    - /url: /tools/lesson
  - text: 5000+ 教师在用 70% 备课时间节省 10h+ 每周节省时长 60天 对赌退款保障
  - heading "6大AI工具，覆盖教师全工作流" [level=2]
  - paragraph: 注册即送7天专业版体验，无需绑卡
  - link "📝 最受欢迎 AI备课助手 输入课题，5分钟生成完整教案 ⚡ ≤15秒":
    - /url: /tools/lesson
    - text: 📝 最受欢迎
    - heading "AI备课助手" [level=3]
    - paragraph: 输入课题，5分钟生成完整教案
    - text: ⚡ ≤15秒
  - link "📋 P0 AI出题机 按知识点、难度自动生成试题，一键组卷 ⚡ ≤8秒/10题":
    - /url: /tools/quiz
    - text: 📋 P0
    - heading "AI出题机" [level=3]
    - paragraph: 按知识点、难度自动生成试题，一键组卷
    - text: ⚡ ≤8秒/10题
  - link "✅ P1 AI批改助手 上传作业图片，AI初审+评分，人工复核 ⚡ ≤5秒/页":
    - /url: /tools/grade
    - text: ✅ P1
    - heading "AI批改助手" [level=3]
    - paragraph: 上传作业图片，AI初审+评分，人工复核
    - text: ⚡ ≤5秒/页
  - link "📊 P1 AI课件生成 输入课题，一键生成可下载的PPTX课件 ⚡ 30秒":
    - /url: /tools/slides
    - text: 📊 P1
    - heading "AI课件生成" [level=3]
    - paragraph: 输入课题，一键生成可下载的PPTX课件
    - text: ⚡ 30秒
  - link "📚 模板库 精选教案/试卷/通知模板，10分钟完成备课 ⚡ 即用":
    - /url: /templates
    - text: 📚
    - heading "模板库" [level=3]
    - paragraph: 精选教案/试卷/通知模板，10分钟完成备课
    - text: ⚡ 即用
  - link "📁 我的资料库 管理所有教案、题库和生成记录":
    - /url: /my/lessons
    - text: 📁
    - heading "我的资料库" [level=3]
    - paragraph: 管理所有教案、题库和生成记录
  - text: 🤝
  - heading "对赌协议保障你的每一分投入" [level=2]
  - paragraph: 购买专业版后，认真使用满50次仍觉得效率无提升，60天内申请全额退款。
  - text: 步骤1 使用满50次 至少30天，覆盖3个工具 步骤2 自评无效果 填写5题问卷说明情况 步骤3 72小时退款 系统自动核查，极速到账
  - link "查看完整对赌协议条款 →":
    - /url: /guarantee
  - heading "5000+ 教师正在用萌牛AI省时间" [level=2]
  - text: 👩‍🏫 李老师 初中语文，教龄12年 每周节省15小时
  - blockquote: "\"以前备一节公开课要4小时，现在用AI生成框架再修改，1小时搞定。期末出卷子以前要一整天，现在30分钟。\""
  - text: 👩‍🏫 王老师 小学数学，班主任 批改效率提升80%
  - blockquote: "\"AI出的题目质量让我很惊喜，知识点覆盖全，还会自动生成解析。批改30份作业以前要2小时，现在AI初审完我只需20分钟复核。\""
  - heading "免费试用7天，感受AI为教学减负" [level=2]
  - paragraph: 无需绑卡，注册即送专业版体验，支持全部4大AI工具
  - link "立即免费注册 →":
    - /url: /login
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
> 7   |     await expect(page.getByText("AI备课助手").first()).toBeVisible();
      |                                                    ^ Error: expect(locator).toBeVisible() failed
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
  24  |     await expect(page.getByText("【学科】数学")).toBeVisible({ timeout: 15000 });
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