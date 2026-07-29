package com.mniu.aicamp.interview.application;

import com.mniu.aicamp.interview.infrastructure.mapper.InterviewQuestionMapper;
import com.mniu.aicamp.interview.infrastructure.po.InterviewQuestionPO;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

/**
 * Seeds interview question bank with sample questions on first startup.
 * Only runs when 'seed' profile is active or questions table is empty.
 */
@Component
@ConditionalOnProperty(name = "app.interview.seed-enabled", havingValue = "true", matchIfMissing = true)
public class InterviewDataSeeder {
    private final InterviewQuestionMapper questions;
    private final SnowflakeIdGenerator idGenerator;

    public InterviewDataSeeder(InterviewQuestionMapper questions, SnowflakeIdGenerator idGenerator) {
        this.questions = questions;
        this.idGenerator = idGenerator;
    }

    @PostConstruct
    public void seed() {
        Long existing = questions.selectCount(null);
        if (existing != null && existing > 0) {
            return;
        }
        for (InterviewQuestionCreateRequest req : sampleQuestions()) {
            InterviewQuestionPO po = new InterviewQuestionPO();
            po.setId(idGenerator.nextId());
            po.setCategory(req.category());
            po.setSubCategory(req.subCategory());
            po.setDifficulty(req.difficulty());
            po.setTitle(req.title());
            po.setContent(req.content());
            po.setExpectedAnswer(req.expectedAnswer());
            po.setKeyPoints(toJson(req.keyPoints()));
            po.setCompanies(toJson(req.companies()));
            po.setTags(toJson(req.tags()));
            po.setSource(req.source());
            po.setStatus("ACTIVE");
            po.setViewCount(0L);
            po.setCreatedAt(Instant.now());
            po.setUpdatedAt(Instant.now());
            questions.insert(po);
        }
    }

    private String toJson(Object obj) {
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            return "[]";
        }
    }

    private List<InterviewQuestionCreateRequest> sampleQuestions() {
        return List.of(
                // ===== JAVA 基础 =====
                new InterviewQuestionCreateRequest("JAVA", "COLLECTION", "EASY",
                        "ArrayList 与 LinkedList 的区别",
                        "请详细说明 ArrayList 和 LinkedList 在底层数据结构、随机访问性能、插入删除性能方面的区别，以及各自适用的场景。",
                        "ArrayList 基于动态数组，随机访问 O(1)，头部插入 O(n)；LinkedList 基于双向链表，随机访问 O(n)，头部插入 O(1)。",
                        List.of("底层数据结构", "时间复杂度", "适用场景"),
                        List.of("阿里巴巴", "字节跳动"),
                        List.of("集合", "数据结构"),
                        "真题"),
                new InterviewQuestionCreateRequest("JAVA", "COLLECTION", "MEDIUM",
                        "HashMap 的原理与扩容机制",
                        "请解释 HashMap 的底层实现（数组+链表/红黑树），说明 hash 冲突的解决方式，以及扩容机制（load factor、threshold、resize）。",
                        "HashMap 使用 Node[] 数组，hash 冲突用链表/红黑树（>=8 转树）。默认 load factor 0.75，扩容翻倍，rehash。",
                        List.of("数据结构", "hash 冲突", "扩容机制", "红黑树转换阈值"),
                        List.of("腾讯", "美团"),
                        List.of("HashMap", "集合"),
                        "真题"),
                new InterviewQuestionCreateRequest("JAVA", "CONCURRENCY", "MEDIUM",
                        "synchronized 与 ReentrantLock 的区别",
                        "请对比 synchronized 关键字和 ReentrantLock 在锁机制、可中断性、公平性、条件变量方面的异同。",
                        "synchronized 是 JVM 级锁，自动释放；ReentrantLock 是 API 级，需手动释放，支持可中断、公平锁、多条件变量。",
                        List.of("锁升级", "可中断锁", "公平锁", "条件变量"),
                        List.of("阿里巴巴", "京东"),
                        List.of("并发", "锁"),
                        "真题"),
                new InterviewQuestionCreateRequest("JAVA", "CONCURRENCY", "HARD",
                        "线程池参数配置与拒绝策略",
                        "请解释 ThreadPoolExecutor 的 7 个核心参数，说明任务执行流程，以及 4 种拒绝策略的适用场景。如何合理配置线程池大小？",
                        "corePoolSize, maxPoolSize, keepAliveTime, workQueue, handler。CPU 密集型 N+1，2N；IO 密集型 2N。",
                        List.of("核心参数", "执行流程", "拒绝策略", "线程数配置"),
                        List.of("字节跳动", "美团"),
                        List.of("线程池", "并发"),
                        "真题"),
                new InterviewQuestionCreateRequest("JAVA", "JVM", "MEDIUM",
                        "JVM 内存模型与垃圾回收",
                        "请描述 JVM 内存区域（堆/栈/方法区/元空间），说明 G1 和 CMS 垃圾回收器的工作原理及适用场景。",
                        "堆分 Young(G0/G1) + Old。G1 用 Region + 预测停顿，CMS 用并发标记清除，产生碎片。",
                        List.of("内存分区", "GC Roots", "回收算法", "回收器对比"),
                        List.of("阿里巴巴", "腾讯"),
                        List.of("JVM", "GC"),
                        "真题"),
                new InterviewQuestionCreateRequest("JAVA", "JVM", "HARD",
                        "类加载机制与双亲委派",
                        "请说明类加载的 5 个步骤，双亲委派模型的工作流程，以及如何打破双亲委派（如 Tomcat、SPI）。",
                        "加载→验证→准备→解析→初始化。双亲委派：先委托父加载器。打破方式：重写 loadChild()。",
                        List.of("类加载步骤", "双亲委派", "打破方式"),
                        List.of("字节跳动"),
                        List.of("JVM", "类加载"),
                        "变形题"),

                // ===== 算法 =====
                new InterviewQuestionCreateRequest("ALGORITHM", "DYNAMIC_PROGRAMMING", "MEDIUM",
                        "最长递增子序列 (LIS)",
                        "给定一个整数数组，找到其中最长严格递增子序列的长度。要求时间复杂度 O(n log n)。",
                        "贪心 + 二分：维护 tails 数组，lower_bound 替换。",
                        List.of("DP 思路", "二分优化", "边界处理"),
                        List.of("字节跳动", "腾讯"),
                        List.of("DP", "二分"),
                        "真题"),
                new InterviewQuestionCreateRequest("ALGORITHM", "TREE", "EASY",
                        "二叉树的层序遍历",
                        "给定一个二叉树，返回其按层序遍历的节点值（即逐层地，从左到右访问所有节点）。",
                        "BFS + Queue，每层记录 size。",
                        List.of("BFS", "队列使用", "分层处理"),
                        List.of("阿里巴巴", "美团"),
                        List.of("二叉树", "BFS"),
                        "真题"),
                new InterviewQuestionCreateRequest("ALGORITHM", "GRAPH", "HARD",
                        "Dijkstra 最短路径",
                        "请描述 Dijkstra 算法的原理，说明为什么不能处理负权边，以及如何用堆优化。",
                        "贪心 + 松弛操作。负权导致已确定最短路径被破坏。堆优化 O((V+E)logV)。",
                        List.of("贪心策略", "负权问题", "堆优化"),
                        List.of("字节跳动"),
                        List.of("图论", "最短路径"),
                        "变形题"),
                new InterviewQuestionCreateRequest("ALGORITHM", "SORTING", "EASY",
                        "快速排序与归并排序对比",
                        "请比较快排和归并排序的时间/空间复杂度、稳定性，以及各自的适用场景。",
                        "快排平均 O(n log n) 原地不稳定，最坏 O(n²)；归并 O(n log n) 稳定需额外空间。",
                        List.of("时间复杂度", "稳定性", "空间复杂度"),
                        List.of("腾讯", "阿里巴巴"),
                        List.of("排序", "分治"),
                        "真题"),
                new InterviewQuestionCreateRequest("ALGORITHM", "DYNAMIC_PROGRAMMING", "HARD",
                        "编辑距离 (Edit Distance)",
                        "给定两个单词 word1 和 word2，请计算将 word1 转换成 word2 所使用的最少操作数（插入/删除/替换）。",
                        "DP[i][j] = min(DP[i-1][j]+1, DP[i][j-1]+1, DP[i-1][j-1]+cost)。",
                        List.of("状态定义", "转移方程", "空间优化"),
                        List.of("字节跳动", "美团"),
                        List.of("DP", "字符串"),
                        "真题"),

                // ===== 系统设计 =====
                new InterviewQuestionCreateRequest("SYSTEM_DESIGN", "DISTRIBUTED", "MEDIUM",
                        "设计一个短链接服务",
                        "请设计一个类似 bit.ly 的短链接服务，包括 hash 算法、存储方案、缓存策略、高并发处理。",
                        "发号器 + Base62 编码，Redis 缓存热点，MySQL 持久化，布隆过滤器防穿透。",
                        List.of("Hash 算法", "存储选型", "缓存策略", "高并发"),
                        List.of("字节跳动", "阿里巴巴"),
                        List.of("短链接", "分布式"),
                        "真题"),
                new InterviewQuestionCreateRequest("SYSTEM_DESIGN", "CACHE", "MEDIUM",
                        "Redis 缓存一致性策略",
                        "请说明缓存更新的几种策略（Cache-Aside、Read/Write Through、Write Behind），以及各自的优缺点。",
                        "Cache-Aside 最常用：读未命中回源，写先更新 DB 再删缓存。",
                        List.of("更新策略", "一致性保证", "延迟双删"),
                        List.of("腾讯", "美团"),
                        List.of("Redis", "缓存"),
                        "真题"),
                new InterviewQuestionCreateRequest("SYSTEM_DESIGN", "DATABASE", "HARD",
                        "设计一个分布式 ID 生成器",
                        "请设计一个全局唯一的 ID 生成方案，要求趋势递增、高性能、高可用。对比 Snowflake、UUID、数据库号段模式。",
                        "Snowflake: 1+41+10+12，时钟回拨问题。号段模式：双 buffer 预取。",
                        List.of("ID 结构", "时钟回拨", "号段模式"),
                        List.of("阿里巴巴", "字节跳动"),
                        List.of("分布式", "ID 生成"),
                        "真题"),
                new InterviewQuestionCreateRequest("SYSTEM_DESIGN", "MESSAGE_QUEUE", "MEDIUM",
                        "Kafka 消息丢失与重复消费",
                        "请分析 Kafka 在哪些环节可能丢失消息，以及如何保证消息不丢、不重复消费。",
                        "Producer acks=all，Consumer 手动提交 offset + 幂等处理。",
                        List.of("acks 配置", "手动提交", "幂等性"),
                        List.of("阿里巴巴", "美团"),
                        List.of("Kafka", "消息队列"),
                        "真题"),

                // ===== AI/ML =====
                new InterviewQuestionCreateRequest("AI", "RAG", "MEDIUM",
                        "RAG 检索增强生成原理",
                        "请描述 RAG 的完整流程，包括文档分块、Embedding、向量检索、重排序，以及如何评估 RAG 系统质量。",
                        "分块→Embedding→向量库召回→LLM 生成。评估：Recall、Precision、Faithfulness。",
                        List.of("分块策略", "Embedding", "评估指标"),
                        List.of("字节跳动", "阿里巴巴"),
                        List.of("RAG", "LLM"),
                        "真题"),
                new InterviewQuestionCreateRequest("AI", "LLM", "MEDIUM",
                        "Transformer 注意力机制",
                        "请解释 Self-Attention 的计算公式（Q/K/V），说明 Multi-Head Attention 的作用，以及位置编码的意义。",
                        "Attention(Q,K,V)=softmax(QK^T/√d_k)V。多头捕获不同子空间信息。位置编码补充序列顺序。",
                        List.of("Q/K/V", "多头注意力", "位置编码"),
                        List.of("腾讯"),
                        List.of("Transformer", "深度学习"),
                        "真题"),
                new InterviewQuestionCreateRequest("AI", "PROMPT", "EASY",
                        "Prompt Engineering 技巧",
                        "请列举 5 种常用的 Prompt 优化技巧，并说明 Chain-of-Thought 和 Few-shot 的适用场景。",
                        "CoT 适合推理任务，Few-shot 适合格式引导。技巧：角色设定、分步引导、示例、约束、输出格式。",
                        List.of("CoT", "Few-shot", "角色设定"),
                        List.of("字节跳动"),
                        List.of("Prompt", "LLM"),
                        "原创"),

                // ===== 数据库 =====
                new InterviewQuestionCreateRequest("DATABASE", "MYSQL", "MEDIUM",
                        "MySQL 索引原理与优化",
                        "请解释 B+Tree 索引的结构，说明最左前缀原则，以及如何分析慢查询（EXPLAIN）。",
                        "B+Tree 叶子节点形成链表。最左前缀：联合索引按定义顺序匹配。EXPLAIN 看 type/key/Extra。",
                        List.of("B+Tree", "最左前缀", "EXPLAIN"),
                        List.of("阿里巴巴", "腾讯"),
                        List.of("MySQL", "索引"),
                        "真题"),
                new InterviewQuestionCreateRequest("DATABASE", "REDIS", "EASY",
                        "Redis 持久化机制",
                        "请说明 RDB 和 AOF 两种持久化方式的工作原理、优缺点，以及混合持久化的方案。",
                        "RDB 快照恢复快但丢数据多，AOF 日志安全但文件大。混合：RDB 全量 + AOF 增量。",
                        List.of("RDB", "AOF", "混合持久化"),
                        List.of("美团", "字节跳动"),
                        List.of("Redis", "持久化"),
                        "真题"),

                // ===== 行为面试 =====
                new InterviewQuestionCreateRequest("BEHAVIORAL", "TEAMWORK", "EASY",
                        "描述一次团队合作冲突",
                        "请分享一次在团队中与他人产生意见分歧的经历，你是如何处理的，最终结果如何？",
                        "STAR 法则：Situation→Task→Action→Result。重点体现沟通与妥协能力。",
                        List.of("STAR 法则", "冲突处理", "沟通能力"),
                        List.of("腾讯", "阿里巴巴"),
                        List.of("行为面试", "团队合作"),
                        "真题"),
                new InterviewQuestionCreateRequest("BEHAVIORAL", "LEADERSHIP", "MEDIUM",
                        "描述一次你主导的技术项目",
                        "请分享一次你作为技术负责人推动项目的经历，包括如何协调资源、把控进度、处理风险。",
                        "体现技术决策、跨团队协调、风险预判能力。用数据量化成果。",
                        List.of("项目推动", "资源协调", "风险管控"),
                        List.of("字节跳动", "美团"),
                        List.of("行为面试", "领导力"),
                        "真题")
        );
    }
}
