package com.mniu.aicamp.public_.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mniu.aicamp.course.infrastructure.mapper.CourseMapper;
import com.mniu.aicamp.course.infrastructure.po.CoursePO;
import com.mniu.aicamp.public_.infrastructure.mapper.ContactMessageMapper;
import com.mniu.aicamp.public_.infrastructure.po.ContactMessagePO;
import com.mniu.aicamp.shared.api.PageResponse;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

/**
 * 官网公开接口业务逻辑（无需登录）
 */
@Service
public class PublicService {
    private final CourseMapper courseMapper;
    private final ContactMessageMapper contactMessageMapper;
    private final SnowflakeIdGenerator idGenerator;

    public PublicService(CourseMapper courseMapper,
                         ContactMessageMapper contactMessageMapper,
                         SnowflakeIdGenerator idGenerator) {
        this.courseMapper = courseMapper;
        this.contactMessageMapper = contactMessageMapper;
        this.idGenerator = idGenerator;
    }

    /**
     * 公开课程列表（无需登录）
     */
    public PageResponse<PublicCourseDTO> listCourses(String category, String difficulty, int page, int size) {
        List<CoursePO> all = courseMapper.selectList(Wrappers.<CoursePO>lambdaQuery()
                .eq(CoursePO::getStatus, "PUBLISHED")
                .eq(category != null && !category.isBlank(), CoursePO::getCategory, category)
                .eq(difficulty != null && !difficulty.isBlank(), CoursePO::getDifficulty, difficulty)
                .orderByAsc(CoursePO::getSortOrder));

        List<PublicCourseDTO> items = all.stream().map(po ->
                new PublicCourseDTO(po.getId(), po.getTitle(), po.getDescription(), po.getCoverUrl(),
                        po.getCategory(), po.getDifficulty(), po.getTargetAudience(),
                        po.getTotalLessons(), po.getTotalMinutes())).toList();

        return PageResponse.of(items, page, size);
    }

    /**
     * 公开课程详情（无需登录）
     */
    public PublicCourseDTO getCourse(Long courseId) {
        CoursePO po = courseMapper.selectById(courseId);
        if (po == null || !"PUBLISHED".equals(po.getStatus())) {
            return null;
        }
        return new PublicCourseDTO(po.getId(), po.getTitle(), po.getDescription(), po.getCoverUrl(),
                po.getCategory(), po.getDifficulty(), po.getTargetAudience(),
                po.getTotalLessons(), po.getTotalMinutes());
    }

    /**
     * 提交联系表单
     */
    @Transactional
    public ContactMessage submitContact(ContactRequest request) {
        ContactMessagePO po = new ContactMessagePO();
        po.setId(idGenerator.nextId());
        po.setName(request.name());
        po.setEmail(request.email());
        po.setType(request.type());
        po.setMessage(request.message());
        po.setStatus("PENDING");
        po.setCreatedAt(Instant.now());
        contactMessageMapper.insert(po);

        return new ContactMessage(po.getId(), po.getName(), po.getEmail(), po.getType(),
                po.getMessage(), po.getStatus(), po.getCreatedAt());
    }
}
