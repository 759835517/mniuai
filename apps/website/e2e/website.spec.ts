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

  test("对接后端 API 显示真实课程数据", async ({ page }) => {
    await page.goto("/courses");
    // 等待课程卡片渲染（后端数据加载完成）
    await page.waitForSelector("text=AI 工程师面试训练营", { timeout: 10000 });
    const content = await page.textContent("body");
    // 验证后端种子数据正确渲染
    expect(content).toContain("AI 工程师面试训练营");
    expect(content).toContain("少儿 AI 编程竞赛班");
    expect(content).toContain("RAG + Agent 实战开发");
  });

  test("分类筛选 - 选择程序员显示 engineer 课程", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForLoadState("networkidle");
    // 点击"程序员"筛选按钮
    await page.click("text=程序员");
    await page.waitForTimeout(1500);
    const content = await page.textContent("body");
    // engineer 类别的课程应该显示
    expect(content).toContain("AI 工程师面试训练营");
    // 非 engineer 类别的课程不应显示
    expect(content).not.toContain("少儿 AI 编程竞赛班");
  });

  test("难度筛选 - 选择入门显示入门课程", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForLoadState("networkidle");
    await page.click("text=入门");
    await page.waitForTimeout(1500);
    const content = await page.textContent("body");
    expect(content).toContain("少儿 AI 编程竞赛班");
    expect(content).not.toContain("RAG + Agent 实战开发");
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
