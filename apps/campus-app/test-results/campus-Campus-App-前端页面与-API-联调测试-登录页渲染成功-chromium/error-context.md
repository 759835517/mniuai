# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: campus.spec.ts >> Campus App 前端页面与 API 联调测试 >> 登录页渲染成功
- Location: e2e\campus.spec.ts:31:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button:has-text(\'登录\')')
Expected: visible
Error: strict mode violation: locator('button:has-text(\'登录\')') resolved to 2 elements:
    1) <button class="flex-1 py-2 text-sm font-medium rounded-lg transition-all bg-white shadow text-gray-900">登录</button> aka getByRole('button', { name: '登录' }).first()
    2) <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors">登录</button> aka locator('form').getByRole('button', { name: '登录' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('button:has-text(\'登录\')')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "🎓 萌牛AI大学生" [ref=e5] [cursor=pointer]:
        - /url: /
        - generic [ref=e6]: 🎓
        - generic [ref=e7]: 萌牛AI大学生
      - generic [ref=e8]:
        - link "学习路径" [ref=e9] [cursor=pointer]:
          - /url: /paths
        - link "编程练习" [ref=e10] [cursor=pointer]:
          - /url: /practice
        - link "AI面试官" [ref=e11] [cursor=pointer]:
          - /url: /interview
        - link "订阅计划" [ref=e12] [cursor=pointer]:
          - /url: /pricing
        - link "就业保障" [ref=e13] [cursor=pointer]:
          - /url: /guarantee
        - link "我的" [ref=e14] [cursor=pointer]:
          - /url: /my/progress
        - link "登录/注册" [ref=e15] [cursor=pointer]:
          - /url: /login
  - main [ref=e16]:
    - generic [ref=e18]:
      - link "🎓 萌牛AI大学生" [ref=e20] [cursor=pointer]:
        - /url: /
        - generic [ref=e21]: 🎓
        - generic [ref=e22]: 萌牛AI大学生
      - generic [ref=e23]:
        - generic [ref=e24]:
          - button "登录" [ref=e25] [cursor=pointer]
          - button "注册" [ref=e26] [cursor=pointer]
        - generic [ref=e27]:
          - generic [ref=e28]:
            - generic [ref=e29]: 邮箱
            - textbox "your@email.com" [ref=e30]
          - generic [ref=e31]:
            - generic [ref=e32]: 密码
            - textbox "至少8位" [ref=e33]
          - button "登录" [ref=e34] [cursor=pointer]
  - contentinfo [ref=e35]:
    - generic [ref=e36]:
      - generic [ref=e37]:
        - generic [ref=e38]:
          - heading "学习" [level=3] [ref=e39]
          - list [ref=e40]:
            - listitem [ref=e41]:
              - link "学习路径" [ref=e42] [cursor=pointer]:
                - /url: /paths
            - listitem [ref=e43]:
              - link "编程练习" [ref=e44] [cursor=pointer]:
                - /url: /practice
            - listitem [ref=e45]:
              - link "AI面试官" [ref=e46] [cursor=pointer]:
                - /url: /interview
        - generic [ref=e47]:
          - heading "资源" [level=3] [ref=e48]
          - list [ref=e49]:
            - listitem [ref=e50]:
              - link "作品集" [ref=e51] [cursor=pointer]:
                - /url: /portfolio
            - listitem [ref=e52]:
              - link "简历生成" [ref=e53] [cursor=pointer]:
                - /url: /resume
        - generic [ref=e54]:
          - heading "关于" [level=3] [ref=e55]
          - list [ref=e56]:
            - listitem [ref=e57]:
              - link "订阅计划" [ref=e58] [cursor=pointer]:
                - /url: /pricing
            - listitem [ref=e59]:
              - link "就业保障" [ref=e60] [cursor=pointer]:
                - /url: /guarantee
            - listitem [ref=e61]:
              - link "联系我们" [ref=e62] [cursor=pointer]:
                - /url: undefined/contact
        - generic [ref=e63]:
          - heading "其他平台" [level=3] [ref=e64]
          - list [ref=e65]:
            - listitem [ref=e66]:
              - link "官网首页" [ref=e67] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e68]:
              - link "程序员平台" [ref=e69] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e70]:
              - link "教师平台" [ref=e71] [cursor=pointer]:
                - /url: "#"
      - paragraph [ref=e73]: © 2026 萌牛AI. All rights reserved.
  - alert [ref=e74]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Campus App 前端页面与 API 联调测试", () => {
  4  |   test("首页渲染成功", async ({ page }) => {
  5  |     await page.goto("/");
  6  |     await expect(page.locator("h1")).toContainText("从零到");
  7  |     // 首页 CTA 按钮
  8  |     await expect(page.locator("a:has-text('免费体验')").first()).toBeVisible();
  9  |   });
  10 | 
  11 |   test("学习路径列表页渲染 API 数据", async ({ page }) => {
  12 |     await page.goto("/paths");
  13 |     await expect(page.locator("h1")).toContainText("选择你的学习路径");
  14 |     // 验证至少有一条路径卡片渲染
  15 |     await expect(page.locator("a[href^='/paths/']").first()).toBeVisible();
  16 |   });
  17 | 
  18 |   test("学习路径详情页渲染 API 数据", async ({ page }) => {
  19 |     await page.goto("/paths/fullstack");
  20 |     await expect(page.locator("h1")).toContainText("全栈工程师路径");
  21 |     await expect(page.locator("a:has-text('免费开始学习')")).toBeVisible();
  22 |   });
  23 | 
  24 |   test("编程练习页渲染 API 数据", async ({ page }) => {
  25 |     await page.goto("/practice");
  26 |     await expect(page.locator("h1")).toContainText("编程练习");
  27 |     // 验证题目列表渲染
  28 |     await expect(page.locator("tbody tr").first()).toBeVisible();
  29 |   });
  30 | 
  31 |   test("登录页渲染成功", async ({ page }) => {
  32 |     await page.goto("/login");
  33 |     // 登录页有登录/注册 tab
> 34 |     await expect(page.locator("button:has-text('登录')")).toBeVisible();
     |                                                         ^ Error: expect(locator).toBeVisible() failed
  35 |     await expect(page.locator("button:has-text('注册')")).toBeVisible();
  36 |   });
  37 | 
  38 |   test("未登录访问学习进度跳转登录", async ({ page }) => {
  39 |     await page.goto("/my/progress");
  40 |     // 未登录应跳转到登录页
  41 |     await page.waitForURL(/\/login/);
  42 |     await expect(page.url()).toContain("/login");
  43 |   });
  44 | 
  45 |   test("未登录访问对赌进度跳转登录", async ({ page }) => {
  46 |     await page.goto("/my/guarantee");
  47 |     await page.waitForURL(/\/login/);
  48 |     await expect(page.url()).toContain("/login");
  49 |   });
  50 | 
  51 |   test("登录后可以查看学习进度", async ({ page }) => {
  52 |     // 登录
  53 |     await page.goto("/login");
  54 |     await page.fill('input[type="email"]', "campus_test_2026@test.com");
  55 |     await page.fill('input[type="password"]', "password123");
  56 |     await page.click('button[type="submit"]');
  57 | 
  58 |     // 跳转到学习进度页
  59 |     await page.waitForURL(/\/my\/progress/, { timeout: 15000 });
  60 |     await expect(page.locator("h1")).toContainText("我的学习进度");
  61 |   });
  62 | 
  63 |   test("登录后可以查看对赌进度", async ({ page }) => {
  64 |     // 登录
  65 |     await page.goto("/login");
  66 |     await page.fill('input[type="email"]', "campus_test_2026@test.com");
  67 |     await page.fill('input[type="password"]', "password123");
  68 |     await page.click('button[type="submit"]');
  69 | 
  70 |     // 跳转到学习进度页
  71 |     await page.waitForURL(/\/my\/progress/, { timeout: 15000 });
  72 | 
  73 |     // 访问对赌进度
  74 |     await page.goto("/my/guarantee?slug=fullstack");
  75 |     await expect(page.locator("h1")).toContainText("就业对赌进度");
  76 |     await expect(page.locator("text=对赌条件达成情况")).toBeVisible();
  77 |   });
  78 | 
  79 |   test("导航栏链接正常工作", async ({ page }) => {
  80 |     await page.goto("/");
  81 |     // 使用更精确的选择器
  82 |     await page.click('nav a[href="/paths"]');
  83 |     await expect(page).toHaveURL(/\/paths/);
  84 | 
  85 |     await page.click('nav a[href="/practice"]');
  86 |     await expect(page).toHaveURL(/\/practice/);
  87 | 
  88 |     await page.click('nav a[href="/login"]');
  89 |     await expect(page).toHaveURL(/\/login/);
  90 |   });
  91 | });
  92 | 
```