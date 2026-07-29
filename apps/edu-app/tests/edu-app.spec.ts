import { test, expect } from "@playwright/test";

test.describe("教师端 edu-app E2E 测试", () => {
  test("首页加载正常，显示工具卡片", async ({ page }) => {
    await page.goto("http://localhost:3004");
    await expect(page.locator("h1").first()).toContainText("AI帮你备课");
    await expect(page.getByText("AI备课助手").first()).toBeVisible();
    await expect(page.getByText("AI出题机").first()).toBeVisible();
  });

  test("AI备课助手页面 - 生成教案", async ({ page }) => {
    await page.goto("http://localhost:3004/tools/lesson");
    await expect(page.getByText("设置参数").first()).toBeVisible();

    // 填写表单
    await page.fill('input[name="topic"]', "二次函数");
    await page.selectOption('select[name="subject"]', "数学");
    await page.selectOption('select[name="grade"]', "初三");

    // 点击生成
    await page.click('button:has-text("AI生成教案")');

    // 等待结果包含学科信息
    await expect(page.getByText("【学科】数学")).toBeVisible({ timeout: 15000 });
  });

  test("AI出题机页面 - 生成题目", async ({ page }) => {
    await page.goto("http://localhost:3004/tools/quiz");
    await expect(page.getByText("设置出题参数").first()).toBeVisible();

    // 填写知识点
    await page.fill('textarea[name="knowledgePoints"]', "二次函数图像");

    // 点击生成
    await page.click('button:has-text("AI生成题目")');

    // 等待结果
    await expect(page.getByText("生成结果")).toBeVisible({ timeout: 15000 });
  });

  test("AI课件生成页面 - 生成课件", async ({ page }) => {
    await page.goto("http://localhost:3004/tools/slides");
    await expect(page.getByText("设置课件参数").first()).toBeVisible();

    // 填写课题
    await page.fill('input[name="topic"]', "光合作用");

    // 点击生成
    await page.click('button:has-text("AI生成课件结构")');

    // 等待结果
    await expect(page.getByText("课件预览")).toBeVisible({ timeout: 15000 });
  });

  test("AI批改助手页面 - 批改作业", async ({ page }) => {
    await page.goto("http://localhost:3004/tools/grade");
    await expect(page.getByText("AI 批改").first()).toBeVisible();

    // 填写表单
    await page.fill('textarea[name="question"]', "解方程 x^2+2x-3=0");
    await page.fill('textarea[name="studentAnswer"]', "x=1, x=-3");

    // 点击批改
    await page.click('button:has-text("开始批改")');

    // 等待结果
    await expect(page.getByText("批改结果")).toBeVisible({ timeout: 15000 });
  });

  test("模板库页面", async ({ page }) => {
    await page.goto("http://localhost:3004/templates");
    await expect(page.locator("h1").first()).toContainText("模板库");
    await expect(page.getByText("通用教案模板")).toBeVisible();
  });

  test("我的教案库页面", async ({ page }) => {
    await page.goto("http://localhost:3004/my/lessons");
    await expect(page.locator("h1").first()).toContainText("我的教案库");
  });

  test("使用记录页面", async ({ page }) => {
    await page.goto("http://localhost:3004/my/history");
    await expect(page.locator("h1").first()).toContainText("使用记录");
    await expect(page.getByText("对赌达成进度")).toBeVisible();
  });

  test("登录页面", async ({ page }) => {
    await page.goto("http://localhost:3004/login");
    await expect(page.getByRole("button", { name: "登录" })).toBeVisible();
    await expect(page.getByText("萌牛AI")).toBeVisible();
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
