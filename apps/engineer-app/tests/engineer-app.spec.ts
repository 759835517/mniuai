import { test, expect } from "@playwright/test";

test.describe("程序员端 engineer-app E2E 测试", () => {
  test("首页加载正常，显示核心功能卡片", async ({ page }) => {
    await page.goto("http://localhost:3001");
    await expect(page.locator("h1").first()).toContainText("3~6个月");
    await expect(page.locator("h3", { hasText: "AI编程实战" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "算法题库" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "AI面试官" })).toBeVisible();
  });

  test("能力诊断页面 - 答题流程", async ({ page }) => {
    await page.goto("http://localhost:3001/assessment");
    await expect(page.locator("text=能力诊断测评")).toBeVisible();

    // 开始测评
    await page.click("text=开始测评");
    await expect(page.locator("text=第 1 / 5 题")).toBeVisible();

    // 回答所有 5 道题
    for (let i = 0; i < 5; i++) {
      await page.locator("button").filter({ hasText: /^B\./ }).click();
      await page.waitForTimeout(200);
      if (i < 4) {
        await page.click("text=下一题");
      } else {
        await page.click("text=提交测评");
      }
    }

    // 验证结果页面
    await expect(page.locator("text=测评完成")).toBeVisible({ timeout: 15000 });
  });

  test("算法题库 - 页面加载和筛选", async ({ page }) => {
    await page.goto("http://localhost:3001/algorithms");
    await expect(page.locator("h1", { hasText: "算法题库" })).toBeVisible({ timeout: 10000 });

    // 验证题目列表加载
    await expect(page.locator("text=两数之和")).toBeVisible();
    await expect(page.locator("text=反转链表")).toBeVisible();

    // 筛选难度
    await page.click("text=中等");
    await expect(page.locator("text=最长回文子串")).toBeVisible();
  });

  test("AI编程实战 - 页面加载和任务列表", async ({ page }) => {
    await page.goto("http://localhost:3001/practice");
    await expect(page.locator("h1", { hasText: "AI 编程实战" })).toBeVisible({ timeout: 10000 });

    // 验证任务列表加载
    await expect(page.locator("text=修复用户登录接口的空指针异常")).toBeVisible();
    await expect(page.locator("text=实现商品搜索的分页与筛选")).toBeVisible();

    // 筛选类型
    await page.click("text=Bug修复");
    await expect(page.locator("text=修复用户登录接口的空指针异常")).toBeVisible();
  });

  test("AI面试官 - 页面加载和面试类型选择", async ({ page }) => {
    await page.goto("http://localhost:3001/interview");
    await expect(page.locator("h1", { hasText: "AI 面试官陪练" })).toBeVisible();

    // 验证面试类型卡片
    await expect(page.locator("h3", { hasText: "算法面试" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "系统设计面试" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "综合模拟" })).toBeVisible();
  });

  test("代码审查 - 页面加载和交互元素", async ({ page }) => {
    await page.goto("http://localhost:3001/code-review");
    await expect(page.locator("h1", { hasText: "AI 代码审查" })).toBeVisible();

    // 验证输入区域
    await expect(page.locator("textarea[placeholder*='粘贴需要审查']")).toBeVisible();
    await expect(page.locator("button", { hasText: "开始 AI 审查" })).toBeVisible();

    // 填写代码并提交
    await page.fill("textarea[placeholder*='粘贴需要审查']", "def hello():\n    return 'world'");
    await page.click("text=开始 AI 审查");

    // 等待结果
    await expect(page.locator("pre").filter({ hasText: "综合评分" })).toBeVisible({ timeout: 15000 });
  });

  test("系统设计 - 页面加载和题目列表", async ({ page }) => {
    await page.goto("http://localhost:3001/system-design");
    await expect(page.locator("h1", { hasText: "系统设计题库" })).toBeVisible();

    // 验证题目卡片
    await expect(page.locator("h3", { hasText: "设计短链接服务" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "设计限流器" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "设计秒杀系统" })).toBeVisible();
  });

  test("系统设计详情页 - 步骤导航", async ({ page }) => {
    await page.goto("http://localhost:3001/system-design/tinyurl");
    await expect(page.locator("h1", { hasText: "设计短链接服务" })).toBeVisible({ timeout: 15000 });

    // 等待步骤按钮加载
    await expect(page.getByRole("button", { name: "下一步" })).toBeVisible({ timeout: 5000 });

    // 点击下一步按钮
    await page.getByRole("button", { name: "下一步" }).click();
    await expect(page.locator("h2", { hasText: "架构草图" })).toBeVisible({ timeout: 5000 });
  });

  test("学习路径 - 页面加载", async ({ page }) => {
    await page.goto("http://localhost:3001/paths");
    await expect(page.locator("h1", { hasText: "选择学习路径" })).toBeVisible({ timeout: 10000 });

    // 验证路径卡片
    await expect(page.locator("text=初级进阶路径")).toBeVisible();
    await expect(page.locator("text=中高级路径")).toBeVisible();
    await expect(page.locator("text=面试冲刺路径")).toBeVisible();
  });

  test("学习进度页面", async ({ page }) => {
    await page.goto("http://localhost:3001/my/progress");
    await expect(page.locator("h1", { hasText: "学习进度" })).toBeVisible({ timeout: 10000 });

    // 验证统计卡片
    await expect(page.locator("text=已刷算法题")).toBeVisible();
    await expect(page.locator("text=实战任务")).toBeVisible();
  });

  test("对赌进度页面", async ({ page }) => {
    await page.goto("http://localhost:3001/my/guarantee");
    await expect(page.locator("h1", { hasText: "对赌涨薪进度" })).toBeVisible({ timeout: 10000 });

    // 验证条件列表
    await expect(page.locator("text=算法刷题")).toBeVisible();
    await expect(page.locator("span.font-medium", { hasText: "AI编程实战" })).toBeVisible();
  });

  test("登录页面", async ({ page }) => {
    await page.goto("http://localhost:3001/login");
    await expect(page.locator("button:has-text(\"登录\")").first()).toBeVisible();
    await expect(page.locator("text=萌牛AI").first()).toBeVisible();
  });

  test("定价页面", async ({ page }) => {
    await page.goto("http://localhost:3001/pricing");
    await expect(page.locator("h1", { hasText: "选择你的订阅计划" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "免费版" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "进阶版" })).toBeVisible();
  });

  test("对赌协议页面", async ({ page }) => {
    await page.goto("http://localhost:3001/guarantee");
    await expect(page.locator("h1", { hasText: "对赌涨薪协议" })).toBeVisible();
    await expect(page.locator("text=退款条件")).toBeVisible();
  });

  test("作品集页面", async ({ page }) => {
    await page.goto("http://localhost:3001/portfolio");
    await expect(page.locator("h1", { hasText: "我的作品集" })).toBeVisible();
    await expect(page.locator("text=高并发短链服务")).toBeVisible();
  });
});
