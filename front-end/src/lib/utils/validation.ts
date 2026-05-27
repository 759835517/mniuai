import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(8, "密码至少 8 位"),
});

export const registerSchema = z.object({
  nickname: z.string().min(1, "请输入昵称").max(100),
  email: z.string().email("请输入有效邮箱"),
  password: z
    .string()
    .min(8, "密码至少 8 位")
    .max(72, "密码不能超过 72 位")
    .regex(/[A-Za-z]/, "密码需要包含字母")
    .regex(/\d/, "密码需要包含数字"),
});

export const learningGoalSchema = z.enum(["Agent", "RAG", "AI_SaaS", "MCP_SERVER"]);

export const roadmapGenerateSchema = z.object({
  skills: z.array(z.string().min(1)).min(1, "请至少选择一个技能").max(20),
  goal: learningGoalSchema,
  hours: z.number().int().min(1).max(40),
  durationWeeks: z.number().int().min(4).max(24).optional(),
});

export const repoReviewSchema = z.object({
  sourceRef: z.string().url().regex(/^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/, "请输入 GitHub 仓库 URL"),
  branch: z.string().optional(),
  language: z.string().optional(),
});

export const snippetReviewSchema = z.object({
  code: z.string().min(1, "请输入代码").max(200_000, "代码片段过长"),
  language: z.string().min(1, "请选择语言"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type RoadmapGenerateFormData = z.infer<typeof roadmapGenerateSchema>;
