import { test, expect } from "@playwright/test";

test.describe("Campus App 前端页面与 API 联调测试", () => {
  test("首页渲染成功", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("从零到");
    // 首页 CTA 按钮
    await expect(page.locator("a:has-text('免费体验')").first()).toBeVisible();
  });

  test("学习路径列表页渲染 API 数据", async ({ page }) => {
    await page.goto("/paths");
    await expect(page.locator("h1")).toContainText("选择你的学习路径");
    // 验证至少有一条路径卡片渲染
    await expect(page.locator("a[href^='/paths/']").first()).toBeVisible();
  });

  test("学习路径详情页渲染 API 数据", async ({ page }) => {
    await page.goto("/paths/fullstack");
    await expect(page.locator("h1")).toContainText("全栈工程师路径");
    await expect(page.locator("a:has-text('免费开始学习')")).toBeVisible();
  });

  test("编程练习页渲染 API 数据", async ({ page }) => {
    await page.goto("/practice");
    await expect(page.locator("h1")).toContainText("编程练习");
    // 验证题目列表渲染
    await expect(page.locator("tbody tr").first()).toBeVisible();
  });

  test("登录页渲染成功", async ({ page }) => {
    await page.goto("/login");
    // 登录页有登录/注册 tab（使用更精确的选择器）
    await expect(page.locator("div.bg-white button").filter({ hasText: "登录" }).first()).toBeVisible();
    await expect(page.locator("div.bg-white button").filter({ hasText: "注册" }).first()).toBeVisible();
  });

  test("未登录访问学习进度跳转登录", async ({ page }) => {
    await page.goto("/my/progress");
    // 未登录应跳转到登录页
    await page.waitForURL(/\/login/);
    await expect(page.url()).toContain("/login");
  });

  test("未登录访问对赌进度跳转登录", async ({ page }) => {
    await page.goto("/my/guarantee");
    await page.waitForURL(/\/login/);
    await expect(page.url()).toContain("/login");
  });

  test("登录后可以查看学习进度", async ({ page }) => {
    // 登录
    await page.goto("/login");
    await page.fill('input[type="email"]', "campus_test_2026@test.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');

    // 跳转到学习进度页
    await page.waitForURL(/\/my\/progress/, { timeout: 15000 });
    // 验证页面内容（可能是"我的学习进度"或"还没有报名学习路径"）
    await expect(page.locator("body")).toContainText(/我的学习进度|还没有报名/);
  });

  test("登录后可以查看对赌进度", async ({ page }) => {
    // 登录
    await page.goto("/login");
    await page.fill('input[type="email"]', "campus_test_2026@test.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');

    // 跳转到学习进度页
    await page.waitForURL(/\/my\/progress/, { timeout: 15000 });

    // 访问对赌进度
    await page.goto("/my/guarantee?slug=fullstack");
    await expect(page.locator("h1")).toContainText("就业对赌进度");
    await expect(page.locator("text=对赌条件达成情况")).toBeVisible();
  });

  test("导航栏链接正常工作", async ({ page }) => {
    await page.goto("/");
    // 使用更精确的选择器
    await page.click('nav a[href="/paths"]');
    await expect(page).toHaveURL(/\/paths/);

    await page.click('nav a[href="/practice"]');
    await expect(page).toHaveURL(/\/practice/);

    await page.click('nav a[href="/login"]');
    await expect(page).toHaveURL(/\/login/);
  });

  test("AI 助教页面渲染成功", async ({ page }) => {
    await page.goto("/ai-tutor");
    await expect(page.locator("h1")).toContainText("AI 编程助教");
    // 验证聊天界面渲染
    await expect(page.locator("text=随时为你解答编程问题")).toBeVisible();
    // 验证输入框存在
    await expect(page.locator("textarea")).toBeVisible();
  });

  test("AI 助教对话功能", async ({ page }) => {
    await page.goto("/ai-tutor");
    // 登录
    await page.goto("/login");
    await page.fill('input[type="email"]', "campus_test_2026@test.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/my\/progress/, { timeout: 15000 });

    // 访问 AI 助教
    await page.goto("/ai-tutor");
    // 输入问题
    await page.fill("textarea", "What is OOP?");
    await page.click('button[type="submit"]');
    // 等待 AI 回复
    await expect(page.locator("text=请使用简体中文输出审查意见")).toBeVisible({ timeout: 15000 });
  });

  test("AI 面试官页面渲染成功", async ({ page }) => {
    await page.goto("/interview");
    await expect(page.locator("h1")).toContainText("AI面试官");
    // 验证面试类型卡片渲染
    await expect(page.locator("text=算法面试")).toBeVisible();
    await expect(page.locator("text=项目面试")).toBeVisible();
    await expect(page.locator("text=行为面试")).toBeVisible();
  });

  test("AI 面试官开始面试", async ({ page }) => {
    // 登录
    await page.goto("/login");
    await page.fill('input[type="email"]', "campus_test_2026@test.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/my\/progress/, { timeout: 15000 });

    // 访问面试页面
    await page.goto("/interview");
    // 点击算法面试
    await page.click('a[href="/interview/algorithm-session"]');
    // 等待面试加载完成（可能显示"正在准备面试"或"面试中"）
    await expect(page.locator("body")).toContainText(/正在准备面试|面试中|面试结束/, { timeout: 15000 });
  });

  test("作品集页面渲染成功", async ({ page }) => {
    // 登录
    await page.goto("/login");
    await page.fill('input[type="email"]', "campus_test_2026@test.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/my\/progress/, { timeout: 15000 });

    // 访问作品集页面
    await page.goto("/portfolio/testuser");
    // 验证页面内容
    await expect(page.locator("body")).toContainText(/项目作品|全栈工程师|刷题通过/, { timeout: 10000 });
  });

  test("简历生成器页面渲染成功", async ({ page }) => {
    await page.goto("/resume");
    await expect(page.locator("h1")).toContainText("AI简历生成器");
    // 验证表单渲染
    await expect(page.locator("text=大学生简历")).toBeVisible();
    await expect(page.locator("text=基本信息")).toBeVisible();
  });

  test("简历生成功能", async ({ page }) => {
    // 登录
    await page.goto("/login");
    await page.fill('input[type="email"]', "campus_test_2026@test.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/my\/progress/, { timeout: 15000 });

    // 访问简历生成页面
    await page.goto("/resume");
    // 填写姓名
    await page.fill('input[placeholder="张同学"]', "Test User");
    // 点击生成
    await page.click('button:has-text("AI生成简历")');
    // 等待生成完成
    await expect(page.locator("body")).toContainText(/Here is a practical next step|简历预览/, { timeout: 15000 });
  });

  test("订阅计划页面渲染成功", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("h1")).toContainText("选择你的方案");
    // 验证计划卡片渲染（使用 h2 标题）
    await expect(page.locator("h2:has-text('免费体验')")).toBeVisible();
    await expect(page.locator("h2:has-text('月度订阅')")).toBeVisible();
    await expect(page.locator("h2:has-text('就业保障版')")).toBeVisible();
  });

  test("对赌协议页面渲染成功", async ({ page }) => {
    await page.goto("/guarantee");
    await expect(page.locator("h1")).toContainText("就业对赌协议");
    // 验证条件列表渲染
    await expect(page.locator("text=完成课程学习")).toBeVisible();
    await expect(page.locator("text=完成编程练习")).toBeVisible();
  });
});
