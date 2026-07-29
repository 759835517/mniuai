package com.mniu.aicamp.campus.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mniu.aicamp.campus.infrastructure.mapper.LearningPathMapper;
import com.mniu.aicamp.campus.infrastructure.mapper.PathCourseMapper;
import com.mniu.aicamp.campus.infrastructure.po.LearningPathPO;
import com.mniu.aicamp.campus.infrastructure.po.PathCoursePO;
import com.mniu.aicamp.course.infrastructure.mapper.CourseMapper;
import com.mniu.aicamp.course.infrastructure.po.CoursePO;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

/**
 * Campus 学习路径种子数据
 * 依赖 CourseDataSeeder 先执行（确保 courses 表已有数据）
 */
@Component
@DependsOn("courseDataSeeder")
@ConditionalOnProperty(name = "app.campus.seed-enabled", havingValue = "true", matchIfMissing = true)
public class CampusDataSeeder {
    private final LearningPathMapper learningPathMapper;
    private final PathCourseMapper pathCourseMapper;
    private final CourseMapper courseMapper;
    private final SnowflakeIdGenerator idGenerator;

    public CampusDataSeeder(LearningPathMapper learningPathMapper,
                            PathCourseMapper pathCourseMapper,
                            CourseMapper courseMapper,
                            SnowflakeIdGenerator idGenerator) {
        this.learningPathMapper = learningPathMapper;
        this.pathCourseMapper = pathCourseMapper;
        this.courseMapper = courseMapper;
        this.idGenerator = idGenerator;
    }

    @PostConstruct
    public void seed() {
        // 清空旧数据重新种子
        pathCourseMapper.delete(null);
        learningPathMapper.delete(null);

        // 路径 1：全栈工程师
        Long fullstack = createPath("fullstack", "全栈工程师路径",
                "从零到全栈，12周完成2个真实项目，覆盖前后端+AI编程+算法面试",
                "💻", 12, "L0", "L4", 1);

        // 路径 2：前端工程师
        Long frontend = createPath("frontend", "前端工程师路径",
                "React/Vue精通，10周完成作品集，覆盖现代前端全栈技术",
                "🎨", 10, "L0", "L3", 2);

        // 路径 3：Java后端
        Long backendJava = createPath("backend-java", "Java后端路径",
                "Spring Boot企业级开发，12周掌握Java后端全栈技能",
                "☕", 12, "L0", "L4", 3);

        // 路径 4：数据分析
        Long dataAnalysis = createPath("data-analysis", "数据分析路径",
                "Python数据分析+BI可视化，8周掌握数据分析师核心技能",
                "📊", 8, "L0", "L3", 4);

        // 路径 5：AI应用开发
        Long aiDev = createPath("ai-dev", "AI应用开发路径",
                "Prompt Engineering + RAG + Agent，10周成为AI应用工程师",
                "🤖", 10, "L0", "L4", 5);

        // 关联课程到路径
        List<CoursePO> allCourses = courseMapper.selectList(Wrappers.<CoursePO>lambdaQuery()
                .eq(CoursePO::getStatus, "PUBLISHED")
                .orderByAsc(CoursePO::getSortOrder));

        int sort = 0;
        for (CoursePO course : allCourses) {
            String cat = course.getCategory();
            if ("engineer".equals(cat)) {
                linkCourse(fullstack, course.getId(), sort++);
                linkCourse(backendJava, course.getId(), sort++);
                linkCourse(aiDev, course.getId(), sort++);
            } else if ("kids".equals(cat)) {
                linkCourse(frontend, course.getId(), sort++);
            } else if ("campus".equals(cat)) {
                linkCourse(fullstack, course.getId(), sort++);
                linkCourse(dataAnalysis, course.getId(), sort++);
            } else if ("creator".equals(cat)) {
                linkCourse(frontend, course.getId(), sort++);
            } else if ("teacher".equals(cat)) {
                linkCourse(dataAnalysis, course.getId(), sort++);
            } else if ("business".equals(cat)) {
                linkCourse(aiDev, course.getId(), sort++);
            }
        }
    }

    private Long createPath(String slug, String name, String desc, String icon,
                            int weeks, String levelFrom, String levelTo, int sortOrder) {
        LearningPathPO po = new LearningPathPO();
        po.setId(idGenerator.nextId());
        po.setSlug(slug);
        po.setName(name);
        po.setDescription(desc);
        po.setIcon(icon);
        po.setDurationWeeks(weeks);
        po.setLevelFrom(levelFrom);
        po.setLevelTo(levelTo);
        po.setSortOrder(sortOrder);
        po.setStatus("PUBLISHED");
        po.setCreatedAt(Instant.now());
        learningPathMapper.insert(po);
        return po.getId();
    }

    private void linkCourse(Long pathId, Long courseId, int sortOrder) {
        // 检查是否已关联
        PathCoursePO existing = pathCourseMapper.selectOne(Wrappers.<PathCoursePO>lambdaQuery()
                .eq(PathCoursePO::getPathId, pathId)
                .eq(PathCoursePO::getCourseId, courseId));
        if (existing != null) return;

        PathCoursePO po = new PathCoursePO();
        po.setId(idGenerator.nextId());
        po.setPathId(pathId);
        po.setCourseId(courseId);
        po.setSortOrder(sortOrder);
        po.setRequired(true);
        pathCourseMapper.insert(po);
    }
}
