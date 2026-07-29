import { test, expect } from "@playwright/test";

test.describe("教师端 edu-app E2E 测试", () => {
  test("首页加载正常，显示工具卡片", async ({ page }) => {
    await page.goto("http://localhost:3004");
    await expect(page.locator("h1").first()).toContainText("AI帮你备课");
    await expect(page.locator("h3", { hasText: "AI备课助手" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "AI出题机" })).toBeVisible();
  });

  test("AI备课助手页面 - 生成教案", async ({ page }) => {
    await page.goto("http://localhost:3004/tools/lesson");
    await expect(page.locator("text=设置参数").first()).toBeVisible({ timeout: 10000 });

    await page.fill('input[name="topic"]', "Quadratic Function");
    await page.selectOption('select[name="subject"]', "数学");
    await page.selectOption('select[name="grade"]', "初三");
    await page.click('button:has-text("AI生成教案")');

    // 等待结果出现（pre 标签内容长度 > 0）
    await expect.poll(async () => {
      const text = await page.locator("pre").textContent();
      return text?.length || 0;
    }, { timeout: 15000 }).toBeGreaterThan(10);
  });

  test("AI出题机页面 - 生成题目", async ({ page }) => {
    await page.goto("http://localhost:3004/tools/quiz");
    await expect(page.locator("text=设置出题参数").first()).toBeVisible({ timeout: 10000 });

    await page.fill('textarea[name="knowledgePoints"]', "Quadratic");
    await page.click('button:has-text("AI生成题目")');

    // 等待结果
    await expect(page.locator("text=生成结果")).toBeVisible({ timeout: 15000 });
  });

  test("AI课件生成页面 - 生成课件", async ({ page }) => {
    await page.goto("http://localhost:3004/tools/slides");
    await expect(page.locator("text=设置课件参数").first()).toBeVisible({ timeout: 10000 });

    await page.fill('input[name="topic"]', "Photosynthesis");
    await page.click('button:has-text("AI生成课件结构")');

    // 等待结果
    await expect(page.locator("text=课件预览")).toBeVisible({ timeout: 15000 });
  });

  test("AI批改助手页面 - 页面加载", async ({ page }) => {
    await page.goto("http://localhost:3004/tools/grade");
    await expect(page.locator("body")).toContainText("批改", { timeout: 10000 });
    await expect(page.locator('textarea[name="question"]')).toBeVisible();
    await expect(page.locator('textarea[name="studentAnswer"]')).toBeVisible();
  });

  test("模板库页面", async ({ page }) => {
    await page.goto("http://localhost:3004/templates");
    await expect(page.locator("h1").first()).toContainText("模板库");
    await expect(page.locator("text=通用教案模板")).toBeVisible();
  });

  test("我的教案库页面", async ({ page }) => {
    await page.goto("http://localhost:3004/my/lessons");
    await expect(page.locator("h1").first()).toContainText("我的教案库");
  });

  test("使用记录页面", async ({ page }) => {
    await page.goto("http://localhost:3004/my/history");
    await expect(page.locator("h1").first()).toContainText("使用记录");
    await expect(page.locator("text=对赌达成进度")).toBeVisible();
  });

  test("登录页面", async ({ page }) => {
    await page.goto("http://localhost:3004/login");
    await expect(page.locator("button:has-text(\"登录\")").first()).toBeVisible();
    await expect(page.locator("text=萌牛AI").first()).toBeVisible();
  });

  test("定价页面", async ({ page }) => {
    await page.goto("http://localhost:3004/pricing");
    await expect(page.locator("body")).toContainText("订阅");
  });

  test("对赌协议页面", async ({ page }) => {
    await page.goto("http://localhost:3004/guarantee");
    await expect(page.locator("body")).toContainText("对赌");
  });
});
