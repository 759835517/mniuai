package com.mniu.aicamp.pro.application;

import com.mniu.aicamp.shared.ai.AiClientPort;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProService {
    private final AiClientPort aiClient;
    private final SnowflakeIdGenerator idGenerator;

    public ProService(AiClientPort aiClient, SnowflakeIdGenerator idGenerator) {
        this.aiClient = aiClient;
        this.idGenerator = idGenerator;
    }

    /**
     * AI 生成文档
     */
    public WritingResultDTO generateDocument(WritingRequest request) {
        String systemPrompt = """
                你是一位资深职场文档专家，擅长撰写各类职场文档。
                请根据用户输入生成专业、结构清晰的文档。

                要求：
                - 内容专业、符合职场规范
                - 不使用模糊表达（如"相关工作""一些改进"）
                - 自动量化描述（如将"提升了效率"改为"效率提升约30%"）
                - 结构清晰，适合快速阅读
                - 用 Markdown 格式输出
                """;

        String userPrompt = String.format("""
                【文档类型】%s
                【行业】%s
                【使用模板】%s

                【内容】
                %s
                """,
                request.docType(),
                request.industry() != null ? request.industry() : "互联网",
                request.template() != null ? request.template() : "通用",
                request.content()
        );

        String content = aiClient.chat(systemPrompt, userPrompt);

        return new WritingResultDTO(
                idGenerator.nextId(),
                request.docType(),
                request.docType() + " · AI生成",
                content,
                Instant.now()
        );
    }

    /**
     * AI 生成会议纪要
     */
    public MeetingResultDTO generateMeetingMinutes(MeetingRequest request) {
        String systemPrompt = """
                你是一位专业的会议纪要整理专家。
                请将以下会议文字记录整理为结构化会议纪要。

                输出格式：
                # 会议纪要

                ## 基本信息
                - 会议主题：XXX
                - 时间：XXX
                - 参与人：XXX

                ## 会议结论
                1. XXX

                ## 关键决策
                | 决策项 | 负责人 | 截止日期 |
                |---|---|---|

                ## 待办事项（Action Items）
                - [ ] [负责人] 任务描述（截止：日期）

                ## 下次会议
                - 时间：XXX
                - 议题：XXX

                要求：
                - 自动识别并提取 Action Item（含责任人和截止日期）
                - 不编造未在记录中出现的信息
                - 对无法确认的信息标注 [待确认]
                """;

        String userPrompt = String.format("""
                【会议主题】%s
                【参与人】%s

                【会议记录】
                %s
                """,
                request.topic() != null ? request.topic() : "未指定",
                request.participants() != null ? request.participants() : "未指定",
                request.record()
        );

        String minutes = aiClient.chat(systemPrompt, userPrompt);

        return new MeetingResultDTO(
                idGenerator.nextId(),
                request.topic(),
                request.participants(),
                minutes,
                Instant.now()
        );
    }

    /**
     * AI 数据分析
     */
    public DataAnalysisResultDTO analyzeData(DataAnalysisRequest request) {
        String systemPrompt = """
                你是一位资深数据分析师，擅长从数据中提取洞察。
                请根据用户的问题，分析数据并给出洞察结论。

                输出格式：
                1. 关键发现（3条以内）
                2. 详细分析
                3. 建议

                要求：
                - 分析基于数据事实，不编造数据
                - 用简洁的语言说明核心洞察
                - 给出可操作的建议
                """;

        String userPrompt = String.format("""
                【分析问题】
                %s
                """,
                request.query()
        );

        String insight = aiClient.chat(systemPrompt, userPrompt);

        return new DataAnalysisResultDTO(
                idGenerator.nextId(),
                request.query(),
                insight,
                "bar",
                Instant.now()
        );
    }

    /**
     * AI 简历优化
     */
    public ResumeResultDTO analyzeResume(ResumeRequest request) {
        String systemPrompt = """
                你是一位资深HR和简历优化专家。
                请分析用户简历与目标JD的匹配度，给出优化建议。

                输出内容：
                1. ATS 评分（0-100）
                2. 建议补充的关键词
                3. 优化建议（含修改前后对比）

                要求：
                - 关键词匹配：提取 JD 中的关键词，标注简历中缺失的高频词
                - 成就量化：将模糊描述改为带数据的成就陈述
                - 不编造不存在的信息
                """;

        String userPrompt = String.format("""
                【目标JD】
                %s

                【简历内容】
                %s
                """,
                request.targetJd() != null ? request.targetJd() : "未提供JD",
                request.resume()
        );

        // 简化版：返回模拟结果
        List<ResumeResultDTO.ResumeSuggestionDTO> suggestions = List.of(
                new ResumeResultDTO.ResumeSuggestionDTO("量化成就", "high",
                        "负责用户增长工作",
                        "主导用户增长专项，3个月内DAU从10万提升至15万（+50%）"),
                new ResumeResultDTO.ResumeSuggestionDTO("关键词补充", "high",
                        "简历缺少岗位关键词",
                        "建议加入：数据驱动、A/B测试、用户漏斗分析"),
                new ResumeResultDTO.ResumeSuggestionDTO("结构优化", "medium",
                        "工作经历排列顺序不佳",
                        "建议将最匹配的项目经验提前")
        );

        return new ResumeResultDTO(
                idGenerator.nextId(),
                42,
                78,
                List.of("数据驱动", "用户增长", "A/B测试", "留存率", "漏斗分析"),
                suggestions,
                Instant.now()
        );
    }

    /**
     * AI 生成汇报材料
     */
    public ReportResultDTO generateReport(ReportRequest request) {
        String systemPrompt = """
                你是一位资深职场汇报专家，擅长撰写各类汇报材料。
                请根据用户输入生成专业汇报材料。

                要求：
                - 自动使用数字和百分比量化成果
                - 不写空话套话（自动过滤"在领导的指导下"等）
                - 结构清晰，适合向上汇报
                - 用 Markdown 格式输出
                """;

        String userPrompt = String.format("""
                【汇报类型】%s

                【工作内容】
                %s
                """,
                request.reportType(),
                request.content()
        );

        String content = aiClient.chat(systemPrompt, userPrompt);

        return new ReportResultDTO(
                idGenerator.nextId(),
                request.reportType(),
                request.reportType() + " · AI生成",
                content,
                Instant.now()
        );
    }

    /**
     * 能力诊断结果
     */
    public AssessmentResultDTO evaluateAssessment(AssessmentRequest request) {
        // 计算各维度得分
        Map<String, Integer> dimScores = new HashMap<>();
        dimScores.put("文档写作", 0);
        dimScores.put("数据分析", 0);
        dimScores.put("沟通汇报", 0);
        dimScores.put("项目管理", 0);
        dimScores.put("AI工具", 0);

        request.answers().forEach((qId, ans) -> {
            String dim = getDimensionByQuestionId(qId);
            dimScores.merge(dim, (3 - ans) * 25, Integer::sum);
        });

        int totalScore = dimScores.values().stream().mapToInt(Integer::intValue).sum() / dimScores.size();
        String level = totalScore >= 75 ? "AI高手" : totalScore >= 55 ? "AI达人" : totalScore >= 35 ? "AI提效型" : "AI萌新";

        return new AssessmentResultDTO(
                idGenerator.nextId(),
                dimScores,
                totalScore,
                level,
                "建议从 AI文档写作 和 AI会议纪要 开始",
                Instant.now()
        );
    }

    private String getDimensionByQuestionId(int qId) {
        // 简化映射：每题对应一个维度
        String[] dims = {"文档写作", "文档写作", "数据分析", "数据分析",
                "沟通汇报", "沟通汇报", "项目管理", "项目管理", "AI工具", "AI工具"};
        if (qId >= 1 && qId <= dims.length) {
            return dims[qId - 1];
        }
        return "AI工具";
    }

    /**
     * 查询对赌进度
     */
    public ProGuaranteeDTO getGuaranteeProgress(Long userId) {
        // 简化版：返回模拟数据
        List<String> gaps = new ArrayList<>();
        int usageCount = 34;
        int completedTasks = 1;
        int activeDays = 42;

        if (usageCount < 50) {
            gaps.add(String.format("还需使用 %d 次（当前 %d/50）", 50 - usageCount, usageCount));
        }
        if (completedTasks < 3) {
            gaps.add(String.format("还需完成 %d 个学习任务（当前 %d/3）", 3 - completedTasks, completedTasks));
        }
        if (activeDays < 45) {
            gaps.add(String.format("还需活跃 %d 天（当前 %d/45）", 45 - activeDays, activeDays));
        }

        return new ProGuaranteeDTO(
                usageCount, 50,
                completedTasks, 3,
                activeDays, 45,
                gaps.isEmpty(),
                gaps
        );
    }
}
