package com.mniu.aicamp.campus.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mniu.aicamp.campus.infrastructure.mapper.PracticeProblemMapper;
import com.mniu.aicamp.campus.infrastructure.po.PracticeProblemPO;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.Instant;

/**
 * 编程练习种子数据
 */
@Component
@ConditionalOnProperty(name = "app.campus.seed-enabled", havingValue = "true", matchIfMissing = true)
public class PracticeDataSeeder {
    private final PracticeProblemMapper practiceProblemMapper;
    private final SnowflakeIdGenerator idGenerator;

    public PracticeDataSeeder(PracticeProblemMapper practiceProblemMapper,
                              SnowflakeIdGenerator idGenerator) {
        this.practiceProblemMapper = practiceProblemMapper;
        this.idGenerator = idGenerator;
    }

    @PostConstruct
    public void seed() {
        if (practiceProblemMapper.selectCount(null) > 0) return;

        // 入门题
        createProblem("two-sum", "两数之和",
                "给定一个整数数组 nums 和一个目标值 target，找出数组中两个数之和等于 target 的下标。\n\n" +
                        "示例：\n输入：nums = [2, 7, 11, 15], target = 9\n输出：[0, 1]",
                "入门", "数组", "[\"数组\",\"哈希表\"]",
                "def two_sum(nums, target):\n    # 请在此实现\n    pass",
                "[{\"input\":\"[2,7,11,15],9\",\"expected\":\"[0,1]\"},{\"input\":\"[3,2,4],6\",\"expected\":\"[1,2]\"}]",
                30, 256, 1);

        createProblem("reverse-string", "反转字符串",
                "编写一个函数，其作用是将输入的字符串反转过来。\n\n" +
                        "示例：\n输入：\"hello\"\n输出：\"olleh\"",
                "入门", "字符串", "[\"字符串\",\"双指针\"]",
                "def reverse_string(s):\n    # 请在此实现\n    pass",
                "[{\"input\":\"\\\"hello\\\"\",\"expected\":\"\\\"olleh\\\"\"},{\"input\":\"\\\"\\\"\",\"expected\":\"\\\"\\\"\"}]",
                30, 256, 2);

        createProblem("fizzbuzz", "FizzBuzz",
                "写一个程序，输出从 1 到 n 的数字的字符串表示。如果数字是 3 的倍数，输出 \"Fizz\"；如果是 5 的倍数，输出 \"Buzz\"；如果同时是 3 和 5 的倍数，输出 \"FizzBuzz\"。",
                "入门", "数学", "[\"数学\",\"模拟\"]",
                "def fizz_buzz(n):\n    # 请在此实现\n    pass",
                "[{\"input\":\"3\",\"expected\":\"[\\\"1\\\",\\\"2\\\",\\\"Fizz\\\"]\"},{\"input\":\"5\",\"expected\":\"[\\\"1\\\",\\\"2\\\",\\\"Fizz\\\",\\\"4\\\",\\\"Buzz\\\"]\"}]",
                30, 256, 3);

        // 进阶题
        createProblem("longest-substring", "无重复字符的最长子串",
                "给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。\n\n" +
                        "示例：\n输入：\"abcabcbb\"\n输出：3（解释：因为无重复字符的最长子串是 \"abc\"，所以其长度为 3）",
                "进阶", "字符串", "[\"字符串\",\"滑动窗口\",\"哈希表\"]",
                "def length_of_longest_substring(s):\n    # 请在此实现\n    pass",
                "[{\"input\":\"\\\"abcabcbb\\\"\",\"expected\":\"3\"},{\"input\":\"\\\"bbbbb\\\"\",\"expected\":\"1\"}]",
                30, 256, 4);

        createProblem("merge-sorted-array", "合并两个有序数组",
                "给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。\n\n" +
                        "示例：\n输入：nums1 = [1,2,3,0,0,0], nums2 = [2,5,6]\n输出：[1,2,2,3,5,6]",
                "进阶", "数组", "[\"数组\",\"双指针\",\"排序\"]",
                "def merge(nums1, m, nums2, n):\n    # 请在此实现\n    pass",
                "[{\"input\":\"[1,2,3,0,0,0],3,[2,5,6],3\",\"expected\":\"[1,2,2,3,5,6]\"}]",
                30, 256, 5);

        // 高级题
        createProblem("trapping-rain-water", "接雨水",
                "给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。\n\n" +
                        "示例：\n输入：[0,1,0,2,1,0,1,3,2,1,2,1]\n输出：6",
                "高级", "数组", "[\"数组\",\"双指针\",\"动态规划\",\"栈\"]",
                "def trap(height):\n    # 请在此实现\n    pass",
                "[{\"input\":\"[0,1,0,2,1,0,1,3,2,1,2,1]\",\"expected\":\"6\"},{\"input\":\"[4,2,0,3,2,5]\",\"expected\":\"9\"}]",
                30, 256, 6);
    }

    private void createProblem(String slug, String title, String desc, String difficulty,
                               String category, String tags, String starterCode,
                               String testCases, int timeLimit, int memoryLimit, int sortOrder) {
        PracticeProblemPO po = new PracticeProblemPO();
        po.setId(idGenerator.nextId());
        po.setSlug(slug);
        po.setTitle(title);
        po.setDescription(desc);
        po.setDifficulty(difficulty);
        po.setCategory(category);
        po.setTags(tags);
        po.setStarterCode(starterCode);
        po.setTestCases(testCases);
        po.setTimeLimitSec(timeLimit);
        po.setMemoryLimitMb(memoryLimit);
        po.setSortOrder(sortOrder);
        po.setStatus("PUBLISHED");
        po.setCreatedAt(Instant.now());
        practiceProblemMapper.insert(po);
    }
}
