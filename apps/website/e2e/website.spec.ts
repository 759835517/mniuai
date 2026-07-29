import { test, expect } from "@playwright/test";

// 官网 E2E 验收测试
// 覆盖：页面可访问性、关键内容渲染、导航、课程筛选、联系表单

test.describe("页面可访问性", () => {
  test("首页返回 200 且标题包含萌牛AI", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/萌牛AI/);
  });

  test("课程广场页可访问", async ({ page }) => {
    const response = await page.goto("/courses");
    expect(response?.status()).toBe(200);
  });

  test("定价页可访问", async ({ page }) => {
    const response = await page.goto("/pricing");
    expect(response?.status()).toBe(200);
  });

  test("博客页可访问", async ({ page }) => {
    const response = await page.goto("/blog");
    expect(response?.status()).toBe(200);
  });

  test("联系页可访问", async ({ page }) => {
    const response = await page.goto("/contact");
    expect(response?.status()).toBe(200);
  });

  test("关于页可访问", async ({ page }) => {
    const response = await page.goto("/about");
    expect(response?.status()).toBe(200);
  });

  test("对赌协议页可访问", async ({ page }) => {
    const response = await page.goto("/guarantee");
    expect(response?.status()).toBe(200);
  });

  test("成功案例页可访问", async ({ page }) => {
    const response = await page.goto("/success-stories");
    expect(response?.status()).toBe(200);
  });

  test("人群落地页 for/engineer 可访问", async ({ page }) => {
    const response = await page.goto("/for/engineer");
    expect(response?.status()).toBe(200);
  });

  test("人群落地页 for/kids 可访问", async ({ page }) => {
    const response = await page.goto("/for/kids");
    expect(response?.status()).toBe(200);
  });

  test("课程详情页可访问", async ({ page }) => {
    const response = await page.goto("/courses/ai-engineer-bootcamp");
    expect(response?.status()).toBe(200);
  });

  test("博客文章页可访问", async ({ page }) => {
    const response = await page.goto("/blog/ai-programming-guide-2026");
    expect(response?.status()).toBe(200);
  });
});

test.describe("SEO 与站点地图", () => {
  test("sitemap.xml 可访问且包含关键 URL", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("https://mniuai.com");
    expect(text).toContain("/courses");
    expect(text).toContain("/pricing");
  });

  test("robots.txt 可访问且包含 Sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("Sitemap");
  });
});

test.describe("课程广场", () => {
  test("页面加载后显示课程相关内容", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForLoadState("networkidle");
    const content = await page.textContent("body");
    expect(content).toContain("课程");
  });
});

test.describe("联系表单校验", () => {
  test("表单校验 - 空姓名显示错误", async ({ page }) => {
    await page.goto("/contact");
    await page.fill("#email", "test@example.com");
    await page.fill("#message", "消息内容");
    await page.click("button[type=submit]");
    await page.waitForTimeout(1000);
    const content = await page.textContent("body");
    expect(content).toContain("请填写姓名");
  });

  test("表单校验 - 空消息显示错误", async ({ page }) => {
    await page.goto("/contact");
    await page.fill("#name", "测试");
    await page.fill("#email", "test@example.com");
    await page.click("button[type=submit]");
    await page.waitForTimeout(1000);
    const content = await page.textContent("body");
    expect(content).toContain("请填写消息内容");
  });
});
