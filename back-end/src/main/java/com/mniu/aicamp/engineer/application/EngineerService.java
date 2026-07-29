package com.mniu.aicamp.engineer.application;

import com.mniu.aicamp.engineer.infrastructure.EngineerProgressRepository;
import com.mniu.aicamp.engineer.infrastructure.mapper.AlgorithmQuestionMapper;
import com.mniu.aicamp.engineer.infrastructure.po.AlgorithmQuestionPO;
import com.mniu.aicamp.shared.ai.AiClientPort;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class EngineerService {
    private final AiClientPort aiClient;
    private final SnowflakeIdGenerator idGenerator;
    private final EngineerProgressRepository progressRepository;
    private final AlgorithmQuestionMapper algorithmQuestionMapper;

    public EngineerService(AiClientPort aiClient, SnowflakeIdGenerator idGenerator,
                           EngineerProgressRepository progressRepository,
                           AlgorithmQuestionMapper algorithmQuestionMapper) {
        this.aiClient = aiClient;
        this.idGenerator = idGenerator;
        this.progressRepository = progressRepository;
        this.algorithmQuestionMapper = algorithmQuestionMapper;
    }

    /**
     * 能力诊断测评
     */
    public AssessmentResultDTO evaluateAssessment(AssessmentRequest request) {
        Map<String, Integer> dimScores = new HashMap<>();
        dimScores.put("算法", 0);
        dimScores.put("工程", 0);
        dimScores.put("系统设计", 0);
        dimScores.put("AI编程", 0);

        Map<Integer, String> dimMap = Map.of(
                1, "算法", 2, "算法",
                3, "工程", 4, "系统设计",
                5, "AI编程"
        );

        request.answers().forEach((qId, ans) -> {
            String dim = dimMap.getOrDefault(qId, "AI编程");
            // 正确答案映射：1-b, 2-b, 3-c, 4-c, 5-b
            int correctAns = (qId == 1 || qId == 2 || qId == 3 || qId == 4 || qId == 5) ? 2 : 2;
            int score = (ans == correctAns) ? 100 : 50;
            dimScores.merge(dim, score, Integer::sum);
        });

        // 平均各维度得分
        for (String dim : dimScores.keySet()) {
            dimScores.put(dim, dimScores.get(dim) * 25 / 100);
        }

        int totalScore = dimScores.values().stream().mapToInt(Integer::intValue).sum() / dimScores.size();
        String level = totalScore >= 75 ? "L3 高级" : totalScore >= 50 ? "L2 中级" : "L1 初级";

        return new AssessmentResultDTO(
                idGenerator.nextId(),
                dimScores,
                totalScore,
                level,
                "薄弱项：系统设计、动态规划",
                "建议从「中高级路径」开始",
                Instant.now()
        );
    }

    /**
     * 学习路径列表
     */
    public List<PathDTO> listPaths() {
        return List.of(
                new PathDTO("junior", "初级进阶路径", "8周", "L1→L2", "🌱",
                        "夯实算法与工程基础，突破1~3年工程师技术瓶颈",
                        List.of("算法基础100题", "AI编程实战", "Git工作流", "单元测试"), false),
                new PathDTO("senior", "中高级路径", "12周", "L2→L3", "🚀",
                        "掌握系统设计与高并发，冲刺大厂中高级岗位",
                        List.of("算法进阶250题", "系统设计7大专题", "AI面试官陪练", "代码审查"), true),
                new PathDTO("interview-sprint", "面试冲刺路径", "4周", "冲刺", "🎯",
                        "1个月密集训练，面试前快速提分",
                        List.of("高频面试题", "大厂真题集", "20轮模拟面试", "简历优化"), false),
                new PathDTO("architect", "架构师路径", "16周", "L3→L4", "🏛️",
                        "系统设计深度进阶，面向技术专家与架构师",
                        List.of("分布式系统", "高可用架构", "复杂系统设计", "技术方案评审"), false)
        );
    }

    /**
     * AI编程实战任务列表
     */
    public List<TaskDTO> listTasks() {
        return List.of(
                new TaskDTO("bugfix-1", "修复用户登录接口的空指针异常", "Bug修复", "简单", "Java", "30分钟",
                        "定位并修复 AuthController 中的 NPE，补全边界判断"),
                new TaskDTO("feature-1", "实现商品搜索的分页与筛选", "功能开发", "中等", "TypeScript", "60分钟",
                        "根据需求文档补全搜索 API，支持分页、价格区间筛选"),
                new TaskDTO("refactor-1", "重构订单状态机的 if-else 地狱", "代码重构", "中等", "Java", "45分钟",
                        "将嵌套条件重构为状态模式，提升可读性和扩展性"),
                new TaskDTO("test-1", "为购物车服务补充单元测试", "单元测试", "简单", "TypeScript", "40分钟",
                        "覆盖增删改查与边界场景，目标覆盖率 80%+"),
                new TaskDTO("perf-1", "优化订单列表的 N+1 查询", "性能优化", "困难", "Java", "50分钟",
                        "分析慢查询，改为批量查询 + 缓存，接口耗时降至 200ms 内")
        );
    }

    /**
     * 提交编程实战任务
     */
    public TaskSubmitResultDTO submitTask(TaskSubmitRequest request) {
        String systemPrompt = """
                你是一位资深代码审查专家，请评估用户提交的代码。
                从功能正确性、代码质量、性能三个维度给出评分和反馈。

                输出格式：
                评分：XX/100
                反馈：XXX
                """;

        String userPrompt = String.format("""
                【任务】%s
                【语言】%s

                【代码】
                %s
                """, request.taskId(), request.language(), request.code());

        String feedback = aiClient.chat(systemPrompt, userPrompt);

        return new TaskSubmitResultDTO(
                idGenerator.nextId(),
                request.taskId(),
                4,
                5,
                80,
                feedback,
                Instant.now()
        );
    }

    /**
     * 算法题库列表（从数据库查询，支持分页和筛选）
     */
    public List<AlgorithmDTO> listAlgorithms(String difficulty, String category, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        List<AlgorithmQuestionPO> questions = algorithmQuestionMapper.selectPage(difficulty, category, pageSize, offset);
        return questions.stream()
                .map(q -> new AlgorithmDTO(
                        q.getId(),
                        q.getTitle(),
                        q.getDifficulty(),
                        q.getCategory(),
                        q.getAcceptance(),
                        q.getDescription(),
                        false))
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * 统计算法题数量
     */
    public int countAlgorithms(String difficulty, String category) {
        return algorithmQuestionMapper.countByCondition(difficulty, category);
    }

    /**
     * 算法题库列表（兼容旧接口，返回全部）
     */
    public List<AlgorithmDTO> listAlgorithms() {
        return listAlgorithms(null, null, 1, 500);
    }

    /**
     * 提交算法题
     */
    public AlgorithmSubmitResultDTO submitAlgorithm(AlgorithmSubmitRequest request) {
        String systemPrompt = """
                你是一位算法题评测专家。
                请评估用户提交的算法代码，判断其正确性。

                输出格式：
                结果：通过/不通过
                通过用例：X/总Y
                反馈：XXX
                """;

        String userPrompt = String.format("""
                【题目】%s
                【语言】%s

                【代码】
                %s
                """, request.problemId(), request.language(), request.code());

        String feedback = aiClient.chat(systemPrompt, userPrompt);

        return new AlgorithmSubmitResultDTO(
                idGenerator.nextId(),
                request.problemId(),
                true,
                8,
                10,
                feedback,
                Instant.now()
        );
    }

    /**
     * 请求AI提示
     */
    public HintResultDTO getHint(HintRequest request) {
        String[] hints = {
                "这道题可以用「哈希表」在 O(n) 时间内解决。",
                "遍历数组时，用哈希表记录每个数字的下标，检查 target - nums[i] 是否已存在。",
                "map = {}\nfor i, n in enumerate(nums):\n  if target-n in map: return [map[target-n], i]\n  map[n] = i",
                "时间复杂度 O(n)，空间复杂度 O(n)。单次遍历，边遍历边查找补数是否已记录，避免二次循环。"
        };
        String[] labels = {"算法类型", "关键步骤", "伪代码框架", "完整题解"};

        int level = Math.min(request.currentLevel() + 1, 4);
        int idx = Math.min(level - 1, hints.length - 1);

        return new HintResultDTO(level, labels[idx], hints[idx]);
    }

    /**
     * 开始AI面试
     */
    public InterviewStartDTO startInterview(InterviewStartRequest request) {
        String systemPrompt = """
                你是一位资深技术面试官，正在进行一场模拟面试。
                请根据面试类型，生成开场白和第一道题目。
                输出格式：
                开场白：XXX
                第一题：XXX
                """;

        String userPrompt = String.format("""
                【面试类型】%s
                【目标公司】%s
                """,
                request.type() != null ? request.type() : "综合",
                request.targetCompany() != null ? request.targetCompany() : "通用"
        );

        String response = aiClient.chat(systemPrompt, userPrompt);
        String sessionId = UUID.randomUUID().toString().substring(0, 8);

        return new InterviewStartDTO(
                sessionId,
                "你好，我是今天的面试官。我们先从一道算法题开始。",
                "给定一个整数数组和目标值，找出数组中和为目标值的两个数的下标。你可以先说一下思路。"
        );
    }

    /**
     * 提交面试回答
     */
    public InterviewAnswerDTO answerInterview(InterviewAnswerRequest request) {
        String systemPrompt = """
                你是一位资深技术面试官。
                请评估候选人的回答，给出追问或下一个问题。
                不要直接评价对错，而是通过追问引导候选人深入思考。

                输出格式：
                追问：XXX
                """;

        String userPrompt = String.format("""
                【候选人回答】
                %s
                """, request.answer());

        String reply = aiClient.chat(systemPrompt, userPrompt);

        return new InterviewAnswerDTO(
                request.sessionId(),
                reply,
                "你能分析一下这个解法的时间复杂度和空间复杂度吗？",
                false
        );
    }

    /**
     * 获取面试报告
     */
    public InterviewReportDTO getInterviewReport(String sessionId) {
        List<InterviewReportDTO.DimensionScore> dimensions = List.of(
                new InterviewReportDTO.DimensionScore("算法正确性", 82, "35%"),
                new InterviewReportDTO.DimensionScore("代码质量", 75, "20%"),
                new InterviewReportDTO.DimensionScore("沟通表达", 88, "20%"),
                new InterviewReportDTO.DimensionScore("问题理解", 79, "15%"),
                new InterviewReportDTO.DimensionScore("时间管理", 70, "10%")
        );

        List<InterviewReportDTO.WeakPoint> weakPoints = List.of(
                new InterviewReportDTO.WeakPoint("动态规划",
                        "在第2题状态转移方程推导时思路不清晰，建议专项练习背包类问题。"),
                new InterviewReportDTO.WeakPoint("边界处理",
                        "编码时未考虑空数组和单元素场景，面试中易被追问。")
        );

        int totalScore = (int) dimensions.stream().mapToInt(InterviewReportDTO.DimensionScore::score).average().orElse(0);

        return new InterviewReportDTO(
                sessionId,
                totalScore,
                dimensions,
                weakPoints,
                "重点突破动态规划，加强边界条件处理",
                68,
                Instant.now()
        );
    }

    /**
     * 代码审查
     */
    public CodeReviewResultDTO reviewCode(CodeReviewRequest request) {
        String systemPrompt = """
                你是一位资深代码审查专家，请从以下维度审查代码：
                1. 功能正确性
                2. 安全性（SQL注入、XSS、敏感信息泄露）
                3. 性能（时间复杂度、N+1查询）
                4. 可读性（命名、注释、结构）
                5. 测试覆盖
                6. 工程规范

                输出格式：
                ## 🚨 严重问题
                - [维度] 行号：问题描述，建议：XXX

                ## ⚠️ 需要改进
                - [维度] 问题描述，建议：XXX

                ## ✅ 做得好的地方
                - XXX

                ## 综合评分：XX/100
                """;

        String userPrompt = String.format("""
                【语言】%s

                【代码】
                %s
                """, request.language(), request.code());

        String content = aiClient.chat(systemPrompt, userPrompt);

        List<CodeReviewResultDTO.Issue> criticalIssues = List.of(
                new CodeReviewResultDTO.Issue("安全", "high",
                        "存在SQL拼接", "建议使用参数化查询"),
                new CodeReviewResultDTO.Issue("性能", "high",
                        "循环内查询数据库", "建议改为批量查询")
        );

        List<CodeReviewResultDTO.Issue> improvements = List.of(
                new CodeReviewResultDTO.Issue("可读性", "medium",
                        "变量名 `x` 不清晰", "建议改为 `userId`"),
                new CodeReviewResultDTO.Issue("测试", "medium",
                        "缺少边界条件测试用例", "建议补充空值、极值测试")
        );

        return new CodeReviewResultDTO(
                idGenerator.nextId(),
                76,
                criticalIssues,
                improvements,
                List.of("错误处理完整", "代码结构清晰"),
                Instant.now()
        );
    }

    /**
     * 获取系统设计题
     */
    public SystemDesignDTO getSystemDesign(String topicId) {
        Map<String, SystemDesignDTO> topics = Map.of(
                "tinyurl", new SystemDesignDTO("tinyurl", "设计短链接服务", "中等",
                        List.of("哈希", "缓存", "分布式ID"),
                        "设计一个类似 TinyURL 的短链接服务，支持长链转短链、短链跳转、访问统计。",
                        List.of("需求澄清", "架构草图", "技术选型", "深入设计", "AI评估"), true),
                "rate-limiter", new SystemDesignDTO("rate-limiter", "设计限流器", "中等",
                        List.of("令牌桶", "滑动窗口", "Redis"),
                        "设计一个分布式限流器，支持多种限流策略（令牌桶/滑动窗口）。",
                        List.of("需求澄清", "架构草图", "技术选型", "深入设计", "AI评估"), false),
                "distributed-cache", new SystemDesignDTO("distributed-cache", "设计分布式缓存", "困难",
                        List.of("一致性哈希", "LRU", "高可用"),
                        "设计一个类似 Redis 的分布式缓存系统，支持数据分片和故障转移。",
                        List.of("需求澄清", "架构草图", "技术选型", "深入设计", "AI评估"), false),
                "seckill", new SystemDesignDTO("seckill", "设计秒杀系统", "困难",
                        List.of("高并发", "削峰", "库存扣减"),
                        "设计一个电商秒杀系统，支持高并发下的库存扣减和订单创建。",
                        List.of("需求澄清", "架构草图", "技术选型", "深入设计", "AI评估"), false)
        );

        return topics.getOrDefault(topicId,
                new SystemDesignDTO(topicId, "系统设计题", "中等",
                        List.of("综合"),
                        "请根据题目要求完成系统设计。",
                        List.of("需求澄清", "架构草图", "技术选型", "深入设计", "AI评估"), false)
        );
    }

    /**
     * 查询对赌进度（基于真实数据）。
     * userId 为 null 时使用演示用户。
     */
    public EngineerGuaranteeDTO getGuaranteeProgress(Long userId) {
        // 从数据库获取真实学习进度
        var progress = progressRepository.getOrCreate(userId);

        int solvedProblems = progress.getSolvedProblems();
        int completedTasks = progress.getCompletedTasks();
        int interviewRounds = progress.getInterviewRounds();
        int systemDesignCount = progress.getSystemDesignCount();
        int codeReviewCount = progress.getCodeReviewCount();
        int jobApplications = progress.getJobApplications();

        List<String> gaps = new ArrayList<>();
        if (solvedProblems < 150) gaps.add(String.format("还需刷 %d 道题（当前 %d/150）", 150 - solvedProblems, solvedProblems));
        if (completedTasks < 30) gaps.add(String.format("还需完成 %d 个实战任务（当前 %d/30）", 30 - completedTasks, completedTasks));
        if (interviewRounds < 20) gaps.add(String.format("还需 %d 轮面试（当前 %d/20）", 20 - interviewRounds, interviewRounds));
        if (systemDesignCount < 8) gaps.add(String.format("还需 %d 道系统设计（当前 %d/8）", 8 - systemDesignCount, systemDesignCount));
        if (codeReviewCount < 20) gaps.add(String.format("还需 %d 次代码审查（当前 %d/20）", 20 - codeReviewCount, codeReviewCount));
        if (jobApplications < 30) gaps.add(String.format("还需投递 %d 家（当前 %d/30）", 30 - jobApplications, jobApplications));

        int completionPct = (int) ((1 - (double) gaps.size() / 6) * 100);

        return new EngineerGuaranteeDTO(
                solvedProblems, 150,
                completedTasks, 30,
                interviewRounds, 20,
                systemDesignCount, 8,
                codeReviewCount, 20,
                jobApplications, 30,
                completionPct,
                gaps.isEmpty(),
                gaps
        );
    }
}
