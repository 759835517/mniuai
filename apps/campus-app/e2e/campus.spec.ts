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
    // 登录页有登录/注册 tab
    await expect(page.locator("button:has-text('登录')")).toBeVisible();
    await expect(page.locator("button:has-text('注册')")).toBeVisible();
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
    await expect(page.locator("h1")).toContainText("我的学习进度");
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
});
