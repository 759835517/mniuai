import { test, expect } from "@playwright/test";

test.describe("职场赋能端 pro-app E2E 测试", () => {
  test("首页加载正常，显示工具卡片", async ({ page }) => {
    await page.goto("http://localhost:3005");
    await expect(page.locator("h1").first()).toContainText("用AI提升职场效率");
    await expect(page.locator("h3", { hasText: "AI文档写作" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "AI数据分析" })).toBeVisible();
  });

  test("职业能力诊断页面 - 答题流程", async ({ page }) => {
    await page.goto("http://localhost:3005/assessment");
    await expect(page.locator("text=职业能力诊断")).toBeVisible();

    // 开始诊断
    await page.click("text=开始诊断");
    await expect(page.locator("text=1 / 10")).toBeVisible();

    // 回答所有 10 道题
    for (let i = 0; i < 10; i++) {
      await page.locator("button").nth(2).click(); // 选择第一个选项
      await page.waitForTimeout(200);
    }

    // 验证结果页面
    await expect(page.locator("text=诊断完成")).toBeVisible({ timeout: 15000 });
  });

  test("AI文档写作 - 选择文档类型", async ({ page }) => {
    await page.goto("http://localhost:3005/writing");
    await expect(page.locator("h3", { hasText: "PRD 产品需求文档" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "工作报告" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "商务邮件" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "项目方案" })).toBeVisible();
  });

  test("AI文档写作 - 生成PRD", async ({ page }) => {
    await page.goto("http://localhost:3005/writing/prd");
    await expect(page.locator("text=填写核心信息")).toBeVisible({ timeout: 10000 });

    // 填写表单
    await page.fill('input[placeholder*="如：用户积分体系"]', "Test Product");
    await page.fill('textarea[placeholder*="描述当前问题"]', "Background test");
    await page.click("text=生成文档");

    // 等待结果
    await expect.poll(async () => {
      const textarea = page.locator("textarea").last();
      const text = await textarea.textContent();
      return text?.length || 0;
    }, { timeout: 15000 }).toBeGreaterThan(10);
  });

  test("AI会议纪要 - 生成纪要", async ({ page }) => {
    await page.goto("http://localhost:3005/meeting");
    await expect(page.locator("text=AI 会议纪要")).toBeVisible({ timeout: 10000 });

    await page.fill('input[placeholder*="Q3营销"]', "Test Meeting");
    await page.fill('input[placeholder*="张三"]', "Alice, Bob");
    await page.fill('textarea[placeholder*="粘贴会议"]', "Meeting record: Q3 target set. Action items assigned.");
    await page.click("text=生成会议纪要");

    // 等待结果
    await expect.poll(async () => {
      const textarea = page.locator("textarea").last();
      const text = await textarea.textContent();
      return text?.length || 0;
    }, { timeout: 15000 }).toBeGreaterThan(10);
  });

  test("AI数据分析 - 页面加载和交互元素", async ({ page }) => {
    await page.goto("http://localhost:3005/data-analysis");
    await expect(page.locator("h1", { hasText: "AI 数据分析" })).toBeVisible({ timeout: 10000 });

    // 验证上传区域存在
    await expect(page.locator("text=拖拽上传或点击加载示例数据")).toBeVisible();

    // 加载示例数据
    await page.click("text=拖拽上传或点击加载示例数据");
    await expect(page.locator("text=示例数据已加载")).toBeVisible();

    // 验证数据预览表格存在
    await expect(page.locator("text=数据预览")).toBeVisible();
    await expect(page.locator("text=GMV 趋势")).toBeVisible();

    // 验证提问输入框和按钮存在
    await expect(page.locator('input[placeholder*="用自然语言提问"]')).toBeVisible();
    await expect(page.locator("button", { hasText: "分析" })).toBeVisible();
  });

  test("AI简历优化 - 分析简历", async ({ page }) => {
    await page.goto("http://localhost:3005/resume");
    await expect(page.locator("text=AI 简历优化")).toBeVisible({ timeout: 10000 });

    await page.fill('textarea[placeholder*="粘贴简历"]', "负责用户增长工作，提升了活跃度");
    await page.click("text=开始优化分析");

    // 等待结果
    await expect(page.locator("text=ATS 通过率预测")).toBeVisible({ timeout: 15000 });
  });

  test("AI汇报材料 - 生成周报", async ({ page }) => {
    await page.goto("http://localhost:3005/report");
    await expect(page.locator("text=AI 汇报材料")).toBeVisible({ timeout: 10000 });

    await page.fill('textarea[placeholder*="列出本期"]', "完成PRD编写，跟进开发进度");
    await page.click("text=生成汇报材料");

    // 等待结果
    await expect.poll(async () => {
      const textarea = page.locator("textarea").last();
      const text = await textarea.textContent();
      return text?.length || 0;
    }, { timeout: 15000 }).toBeGreaterThan(10);
  });

  test("工具广场页面", async ({ page }) => {
    await page.goto("http://localhost:3005/tools");
    await expect(page.locator("text=AI工具广场")).toBeVisible();
    await expect(page.locator("text=AI文档写作")).toBeVisible();
    await expect(page.locator("text=AI数据分析")).toBeVisible();
  });

  test("模板库页面", async ({ page }) => {
    await page.goto("http://localhost:3005/templates");
    await expect(page.locator("h1", { hasText: "职场模板库" })).toBeVisible();
    await expect(page.locator("text=产品需求文档（PRD）")).toBeVisible();
  });

  test("使用进度页面", async ({ page }) => {
    await page.goto("http://localhost:3005/my/progress");
    await expect(page.locator("h1").first()).toContainText("使用进度");
  });

  test("对赌进度页面", async ({ page }) => {
    await page.goto("http://localhost:3005/my/guarantee");
    await expect(page.locator("text=对赌提效进度")).toBeVisible();
  });

  test("登录页面", async ({ page }) => {
    await page.goto("http://localhost:3005/login");
    await expect(page.locator("button:has-text(\"登录\")").first()).toBeVisible();
    await expect(page.locator("text=萌牛AI").first()).toBeVisible();
  });

  test("定价页面", async ({ page }) => {
    await page.goto("http://localhost:3005/pricing");
    await expect(page.locator("body")).toContainText("订阅");
  });

  test("对赌协议页面", async ({ page }) => {
    await page.goto("http://localhost:3005/guarantee");
    await expect(page.locator("body")).toContainText("对赌");
  });
});
