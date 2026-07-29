---
name: backend-tdd
description: 后端 TDD 工作流（Java / Spring Boot）。编写新功能、修复 bug、重构、添加 API 端点、创建 Service/Repository/Domain 对象时激活。强制先写测试再实现，覆盖率 80%+。
---

# 后端测试驱动开发工作流（Java / Spring Boot）

此 skill 确保所有 Java 后端代码开发遵循 TDD 原则并具有全面的测试覆盖。

## 何时激活

- 编写新功能或特性
- 修复 bug 或问题
- 重构现有代码
- 添加 API 端点
- 创建新 Service / Repository / Domain 对象
- 数据库迁移与数据层变更

## 核心原则

### 1. 代码之前先写测试
始终先写测试，然后实现代码使测试通过。

### 2. 覆盖率要求
- 最低 80% 覆盖率（单元 + 集成 + API 测试）
- 覆盖所有边界情况
- 测试错误场景
- 验证边界条件

### 3. 测试类型

#### 单元测试（Unit Test）
- 纯函数与工具方法（如 MapStruct Mapper、Validator）
- Domain 对象的行为与业务规则
- Service 层逻辑（Mock 依赖）
- 异常处理器与安全工具

#### 集成测试（Integration Test）
- Controller 端点（MockMvc）
- 数据库操作（Testcontainers + PostgreSQL）
- Redis 缓存操作
- 外部 API 调用（Mock 服务或 WireMock）

#### API / E2E 测试
- 完整 HTTP 请求流（TestRestTemplate / WebTestClient）
- 认证与授权流程
- 跨模块业务流程

## 项目结构

```
src/
├── main/
│   └── java/com/mniu/aicamp/
│       ├── auth/                    # 认证模块
│       │   ├── api/                 # Controller 层
│       │   ├── application/         # Service 层
│       │   ├── domain/              # 领域模型
│       │   └── infrastructure/      # 基础设施（Repository、外部服务）
│       ├── coach/
│       ├── growth/
│       ├── notification/
│       ├── project/
│       ├── review/
│       ├── roadmap/
│       └── shared/                  # 公共模块（AI、安全、限流等）
└── test/
    └── java/com/mniu/aicamp/
        ├── IntegrationTestBase.java # 集成测试基类
        ├── project/                 # 按模块组织测试
        │   └── domain/
        │       └── ProjectStatusTest.java
        └── shared/
            ├── ai/
            │   └── AiUtilitiesTest.java
            ├── ratelimit/
            └── security/
```

### 测试文件命名规范
- 单元测试：`{Class}Test.java`（如 `ProjectStatusTest.java`）
- 集成测试：`{Class}IntegrationTest.java`
- API 测试：`{Endpoint}ApiTest.java`

## TDD 工作流步骤

### 步骤 1：编写用户故事 / 需求

```
作为 [角色]，我想要 [动作]，以便 [收益]

示例：
作为用户，我想要通过 API 创建项目，
以便在平台上管理我的学习任务。
```

### 步骤 2：生成测试用例

为每个需求创建全面的测试用例，先写失败测试。

#### 单元测试示例

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.assertj.core.api.Assertions.*;

@DisplayName("ProjectStatus 枚举测试")
class ProjectStatusTest {

    @Test
    @DisplayName("应能从状态码解析出正确的 ProjectStatus")
    void shouldParseFromCode() {
        assertThat(ProjectStatus.fromCode(1))
            .isEqualTo(ProjectStatus.ACTIVE);
    }

    @Test
    @DisplayName("未知状态码应抛出 IllegalArgumentException")
    void shouldThrowOnInvalidCode() {
        assertThatThrownBy(() -> ProjectStatus.fromCode(999))
            .isInstanceOf(IllegalArgumentException.class);
    }
}
```

#### Service 单元测试示例

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProjectService 单元测试")
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserContextService userContextService;

    @InjectMocks
    private ProjectServiceImpl projectService;

    @Test
    @DisplayName("创建项目时应调用 Repository 保存并返回项目信息")
    void shouldCreateProjectSuccessfully() {
        // Arrange
        CreateProjectRequest request = new CreateProjectRequest("Test Project", "desc");
        when(userContextService.getCurrentUserId()).thenReturn(1L);
        when(projectRepository.save(any(Project.class)))
            .thenAnswer(inv -> {
                Project p = inv.getArgument(0);
                p.setId(1L);
                return p;
            });

        // Act
        ProjectResult result = projectService.createProject(request);

        // Assert
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Test Project");
        verify(projectRepository).save(any(Project.class));
    }

    @Test
    @DisplayName("查询不存在的项目应抛出 NotFoundException")
    void shouldThrowWhenProjectNotFound() {
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.getProject(999L))
            .isInstanceOf(NotFoundException.class);
    }
}
```

#### Controller 集成测试示例（MockMvc）

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("ProjectController 集成测试")
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/projects 应返回项目列表")
    void shouldListProjects() throws Exception {
        mockMvc.perform(get("/api/projects")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("GET /api/projects/{id} 项目不存在时应返回 404")
    void shouldReturn404WhenProjectNotFound() throws Exception {
        mockMvc.perform(get("/api/projects/99999"))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/projects 缺少必填字段应返回 400")
    void shouldReturn400WhenMissingRequiredFields() throws Exception {
        mockMvc.perform(post("/api/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isBadRequest());
    }
}
```

#### API 集成测试示例（TestRestTemplate）

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import static org.assertj.core.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@DisplayName("Project API 端到端测试")
class ProjectApiTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    @DisplayName("应能完整执行项目创建和查询流程")
    void shouldCreateAndRetrieveProject() {
        // 创建项目
        CreateProjectRequest createReq = new CreateProjectRequest("E2E Project", "e2e desc");
        ResponseEntity<ProjectResult> createResp = restTemplate.postForEntity(
            "/api/projects", createReq, ProjectResult.class);

        assertThat(createResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        Long projectId = createResp.getBody().getId();

        // 查询项目
        ResponseEntity<ProjectResult> getResp = restTemplate.getForEntity(
            "/api/projects/" + projectId, ProjectResult.class);

        assertThat(getResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getResp.getBody().getName()).isEqualTo("E2E Project");
    }
}
```

### 步骤 3：运行测试（它们应该失败）

```bash
# 运行全部测试
mvn test

# 运行特定测试类
mvn test -Dtest=ProjectServiceTest

# 运行特定测试方法
mvn test -Dtest=ProjectServiceTest#shouldCreateProjectSuccessfully
```

### 步骤 4：实现代码

编写最少的代码使测试通过，遵循项目分层架构：

```
api/        → Controller（接收请求，调用 Service）
application/→ Service（业务逻辑）
domain/     → Domain（领域模型、枚举、值对象）
infrastructure/ → Repository（数据访问）、外部服务适配器
```

### 步骤 5：再次运行测试

```bash
mvn test
# 测试现在应该通过（绿色）
```

### 步骤 6：重构

在保持测试绿色的情况下改进代码质量：
- 提取公共方法
- 改善命名（符合 Java 规范）
- 优化查询（N+1 问题）
- 使用 MapStruct 进行对象转换

### 步骤 7：验证覆盖率

```bash
mvn verify jacoco:report
# 报告生成在 target/site/jacoco/index.html
```

验证各模块覆盖率达到 80%+。

## 测试基础设施

### 集成测试基类（IntegrationTestBase）

项目已配置 `IntegrationTestBase.java` 作为集成测试基类，提供：
- Testcontainers PostgreSQL 容器管理
- 公共测试数据准备
- 测试前后的数据清理

```java
public abstract class IntegrationTestBase {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
        .withDatabaseName("test_db")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @BeforeEach
    void setUpBase() {
        // 公共测试数据准备
    }

    @AfterEach
    void cleanUpBase() {
        // 清理测试数据
    }
}
```

### 配置文件 `application-test.yml`

```yaml
spring:
  datasource:
    driver-class-name: org.postgresql.Driver
  flyway:
    locations: classpath:db/migration
  data:
    redis:
      host: localhost
      port: 6379

logging:
  level:
    com.mniu.aicamp: DEBUG
    org.springframework.security: DEBUG
```

## 模拟外部服务

### Redis 缓存 Mock

```java
@MockBean
private RedisTemplate<String, Object> redisTemplate;

@Mock
private ValueOperations<String, Object> valueOperations;

when(redisTemplate.opsForValue()).thenReturn(valueOperations);
when(valueOperations.get("cache:key")).thenReturn(cachedValue);
```

### 外部 API Mock（如 GitHub API）

```java
@MockBean
private GitHubService gitHubService;

when(gitHubService.getRepository(anyString()))
    .thenReturn(new GitHubRepository("test-repo", "https://github.com/test"));
```

### Security Context Mock

```java
@WithMockUser(username = "testuser", roles = {"USER"})
@Test
@DisplayName("认证用户应能访问受保护端点")
void shouldAllowAuthenticatedUser() throws Exception {
    mockMvc.perform(get("/api/projects"))
        .andExpect(status().isOk());
}
```

## 测试覆盖率配置（Maven JaCoCo）

在 `pom.xml` 中配置覆盖率阈值：

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.12</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>verify</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <rules>
            <rule>
                <element>BUNDLE</element>
                <limits>
                    <limit>
                        <counter>LINE</counter>
                        <value>COVEREDRATIO</value>
                        <minimum>0.80</minimum>
                    </limit>
                    <limit>
                        <counter>BRANCH</counter>
                        <value>COVEREDRATIO</value>
                        <minimum>0.80</minimum>
                    </limit>
                </limits>
            </rule>
        </rules>
    </configuration>
</plugin>
```

## 常见测试错误需避免

### ❌ 错误：测试实现细节
```java
// 不要直接测试私有方法
Method method = clazz.getDeclaredMethod("privateMethod");
method.setAccessible(true);
```

### ✅ 正确：测试公开行为
```java
// 通过公开 API 测试行为
ProjectResult result = projectService.createProject(request);
assertThat(result.getName()).isEqualTo("Test Project");
```

### ❌ 错误：在单元测试中依赖 Spring 上下文
```java
@SpringBootTest  // 单元测试不需要这个注解
class MyServiceTest {
    // 这会让单元测试变成集成测试
}
```

### ✅ 正确：单元测试使用 Mockito
```java
@ExtendWith(MockitoExtension.class)
class MyServiceTest {
    // 纯 Mockito，无 Spring 上下文，执行速度快
}
```

### ❌ 错误：测试间共享状态
```java
@ExtendWith(MockitoExtension.class)
class BadTest {
    private static int counter = 0; // 共享可变状态！

    @Test
    void test1() { counter++; }
    @Test
    void test2() { /* counter 可能是 0 或 1 */ }
}
```

### ✅ 正确：每个测试独立
```java
@ExtendWith(MockitoExtension.class)
class GoodTest {
    @Test
    void shouldHandleCase1() {
        // 独立的 Arrange-Act-Assert
    }

    @Test
    void shouldHandleCase2() {
        // 独立的 Arrange-Act-Assert
    }
}
```

### ❌ 错误：忽略异常测试
```java
@Test
void shouldHandleErrors() {
    service.doSomething(); // 没有测试异常情况
}
```

### ✅ 正确：显式测试异常路径
```java
@Test
@DisplayName("无效输入应抛出 ValidationException")
void shouldThrowOnInvalidInput() {
    assertThatThrownBy(() -> service.createProject(null))
        .isInstanceOf(ValidationException.class)
        .hasMessageContaining("项目名称不能为空");
}
```

## 常用 Maven 测试命令

```bash
# 运行所有测试
mvn test

# 运行特定模块测试
mvn test -pl com.mniu:project-module

# 运行并生成覆盖率报告
mvn verify jacoco:report

# 查看覆盖率报告（生成后）
# 浏览器打开 target/site/jacoco/index.html

# 跳过测试（仅在紧急情况下使用）
mvn package -DskipTests

# 运行失败的测试（重跑上次失败的）
mvn test -rf :failed-tests
```

## 持续测试

### 本地开发（IntelliJ IDEA）
- 使用内置测试运行器的 "Run with Coverage" 功能
- 配置 "Re-run on Change" 实现自动测试

### Git 钩子（pre-commit）

```bash
#!/bin/sh
# .git/hooks/pre-commit
echo "运行测试..."
mvn test -q
if [ $? -ne 0 ]; then
    echo "测试失败，提交已中止"
    exit 1
fi
```

### CI/CD 集成（GitHub Actions）

```yaml
- name: Run Tests
  run: mvn verify jacoco:report

- name: Upload Coverage Report
  uses: codecov/codecov-action@v3
  with:
    file: target/site/jacoco/jacoco.xml
    flags: backend

- name: Fail on Low Coverage
  run: |
    # 检查覆盖率是否达到 80%
    mvn jacoco:check
```

## 最佳实践

1. **先写测试（TDD）** - 始终 RED → GREEN → REFACTOR
2. **使用 AssertJ 断言** - 项目已集成，可读性更好
3. **描述性测试名称** - 使用 `@DisplayName` 注解说明测试什么
4. **准备-执行-断言** - 清晰的测试结构（Arrange-Act-Assert）
5. **隔离外部依赖** - 单元测试中 Mock 所有外部服务
6. **测试边界情况** - null、空字符串、极大值、并发
7. **测试错误路径** - 不只是快乐路径，异常处理同样重要
8. **保持测试快速** - 单元测试无 Spring 上下文，每个 < 50ms
9. **测试后清理** - 使用 `@AfterEach` 确保无副作用
10. **关注覆盖率报告** - 识别测试盲区，优先覆盖核心业务逻辑

## 成功指标

- 达到 80%+ 代码覆盖率（JaCoCo 验证）
- 所有测试通过（绿色）
- 没有跳过或 `@Disabled` 的测试
- 单元测试执行时间 < 30 秒
- 集成测试覆盖核心 API 端点
- 测试在生产前捕获 bug

---

**切记**：测试不是可选的。它们是支撑自信重构、快速开发和生产可靠性的安全网。
