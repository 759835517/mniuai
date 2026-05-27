---
name: tdd-workflow
description: 在编写新功能、修复 bug 或重构代码时使用此 skill。强制执行测试驱动开发，覆盖率要求 80% 以上，包括单元测试、组件测试和 E2E 测试。专属于 MNIU AI Camp 前端项目（Next.js 14 + React 18 + Zustand + shadcn/ui）。
---

# 前端测试驱动开发工作流

此 skill 确保 MNIU AI Camp 前端项目所有代码开发遵循 TDD 原则并具有全面的测试覆盖。

## 项目技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 14.2.35（App Router）+ React 18 |
| 语言 | TypeScript 5（strict 模式） |
| 样式 | Tailwind CSS 3.4 + shadcn/ui（new-york 风格） |
| 状态管理 | Zustand 5 |
| 表单 | React Hook Form 7 + Zod 4 + @hookform/resolvers |
| HTTP | Axios（通过 `@/lib/utils/apiClient` 封装） |
| 动画 | Framer Motion |
| 图表 | Recharts |
| 代码编辑器 | Monaco Editor |
| Markdown | react-markdown + remark-gfm + rehype-highlight |
| 路径别名 | `@/*` → `./src/*` |
| 后端代理 | `/api/backend/:path*` → `http://localhost:8080/api/v1/:path*` |

## 何时激活

- 编写新功能或特性
- 修复 bug 或问题
- 重构现有代码
- 添加 API 端点调用（`src/lib/api/`）
- 创建新组件（`src/components/`）
- 添加 Zustand Store（`src/lib/stores/`）
- 编写自定义 Hook（`src/lib/hooks/`）
- 添加表单与校验

## 核心原则

### 1. 代码之前先写测试
始终先写测试（RED），然后实现代码使测试通过（GREEN），最后重构（REFACTOR）。

### 2. 覆盖率要求
- 最低 80% 覆盖率（单元 + 组件 + E2E）
- 覆盖所有边界情况
- 测试错误场景
- 验证边界条件

### 3. 测试类型

#### 单元测试（Vitest）
- 纯函数与工具方法（`src/lib/utils/format.ts`、`validation.ts`、`cn.ts`）
- Zustand Store 逻辑（`src/lib/stores/`）
- API 客户端函数（`src/lib/api/`）
- 自定义 Hook（`src/lib/hooks/`）
- TypeScript 类型守卫与校验 Schema（Zod）

#### 组件测试（Vitest + React Testing Library）
- 所有 React 组件的渲染与交互
- shadcn/ui 组件的封装行为
- 表单提交与校验流程
- 条件渲染与状态切换

#### E2E 测试（Playwright）
- 关键用户流程（登录、注册、创建项目、代码审查）
- 跨页面导航与数据流
- 响应式布局断点

## 目录结构

```
front-end/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页
│   │   ├── (auth)/             # 登录/注册
│   │   └── (dashboard)/        # 仪表盘、教练、项目、审查、路线图
│   ├── components/             # React 组件
│   │   ├── auth/               # AuthGuard
│   │   ├── coach/              # ChatInterface、MessageBubble、SessionSidebar
│   │   ├── growth/             # AchievementCard、XPBar、StreakFire 等
│   │   ├── layout/             # Header、Sidebar、MobileNav
│   │   ├── project/            # ProjectDashboard、TaskBoard 等
│   │   ├── shared/             # CodeBlock、ConfirmDialog、ErrorBoundary 等
│   │   └── ui/                 # shadcn/ui 基础组件
│   └── lib/                    # 工具库
│       ├── api/                # API 客户端（auth、coach、project、review 等）
│       ├── hooks/              # useAuth、useChat、useSSE
│       ├── mocks/              # Mock 数据
│       ├── stores/             # Zustand Store（auth、chat、project、roadmap、ui）
│       ├── types/              # TypeScript 类型定义
│       └── utils/              # apiClient、cn、format、validation、tokenStorage
├── tests/                      # 测试目录（新增）
│   ├── setup.ts                # 测试全局 setup
│   ├── unit/                   # 单元测试
│   │   └── lib/
│   │       ├── utils/          # format.test.ts、validation.test.ts、cn.test.ts
│   │       ├── stores/         # authStore.test.ts、projectStore.test.ts
│   │       ├── api/            # auth.test.ts、project.test.ts
│   │       └── hooks/          # useAuth.test.ts、useChat.test.ts
│   ├── components/             # 组件测试
│   │   ├── shared/             # CodeBlock.test.tsx、ErrorBoundary.test.tsx
│   │   ├── coach/              # ChatInterface.test.tsx
│   │   ├── project/            # ProjectDashboard.test.tsx
│   │   └── growth/             # XPBar.test.tsx、LevelBadge.test.tsx
│   └── e2e/                    # E2E 测试
│       ├── auth.spec.ts        # 登录/注册流程
│       ├── coach.spec.ts       # AI 教练对话流程
│       ├── project.spec.ts     # 项目管理流程
│       └── navigation.spec.ts  # 导航与路由守卫
├── vitest.config.ts            # Vitest 配置（新增）
├── playwright.config.ts        # Playwright 配置（新增）
└── package.json
```

### 测试文件命名规范
- 单元测试：`{name}.test.ts`（纯逻辑，无 JSX）
- 组件测试：`{name}.test.tsx`（含 JSX 渲染）
- E2E 测试：`{feature}.spec.ts`

## TDD 工作流步骤

### 步骤 1：编写用户故事

```
作为 [角色]，我想要 [动作]，以便 [收益]

示例：
作为已登录用户，我想要创建 AI 教练会话，
以便获得个性化的学习指导。
```

### 步骤 2：生成测试用例

#### 单元测试示例（纯函数）

```typescript
import { describe, it, expect } from 'vitest'
import { formatRelativeTime, formatDate } from '@/lib/utils/format'

describe('formatRelativeTime', () => {
  it('应将几秒前的时间格式化为 "刚刚"', () => {
    const now = new Date()
    expect(formatRelativeTime(now)).toBe('刚刚')
  })

  it('应将 5 分钟前格式化为 "5 分钟前"', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000)
    expect(formatRelativeTime(fiveMinAgo)).toBe('5 分钟前')
  })

  it('null 应返回空字符串', () => {
    expect(formatRelativeTime(null)).toBe('')
  })
})

describe('formatDate', () => {
  it('应将日期格式化为 YYYY-MM-DD', () => {
    expect(formatDate(new Date('2025-06-15'))).toBe('2025-06-15')
  })

  it('无效日期应返回 "-"', () => {
    expect(formatDate(new Date('invalid'))).toBe('-')
  })
})
```

#### Zustand Store 测试示例

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/lib/stores/authStore'

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().reset()
  })

  it('初始状态应为未登录', () => {
    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
  })

  it('login 应设置用户并更新 isAuthenticated', () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' }
    useAuthStore.getState().login(mockUser)

    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).toEqual(mockUser)
    expect(isAuthenticated).toBe(true)
  })

  it('logout 应清除用户状态', () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' }
    useAuthStore.getState().login(mockUser)
    useAuthStore.getState().logout()

    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
  })
})
```

#### API 客户端测试示例

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProjects, createProject } from '@/lib/api/project'
import apiClient from '@/lib/utils/apiClient'

vi.mock('@/lib/utils/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('Project API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getProjects 应调用 GET /api/backend/projects', async () => {
    const mockData = { success: true, data: [{ id: 1, name: 'Test' }] }
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockData })

    const result = await getProjects()

    expect(apiClient.get).toHaveBeenCalledWith('/api/backend/projects')
    expect(result).toEqual(mockData)
  })

  it('createProject 应调用 POST 并传递项目数据', async () => {
    const newProject = { name: 'New Project', description: 'A new project' }
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: { success: true, data: { id: 2, ...newProject } },
    })

    const result = await createProject(newProject)

    expect(apiClient.post).toHaveBeenCalledWith('/api/backend/projects', newProject)
    expect(result.data.data.id).toBe(2)
  })

  it('网络错误应抛出异常', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network Error'))

    await expect(getProjects()).rejects.toThrow('Network Error')
  })
})
```

#### 自定义 Hook 测试示例

```typescript
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useChat } from '@/lib/hooks/useChat'

// Mock SSE 和 Zustand store
vi.mock('@/lib/stores/chatStore', () => ({
  useChatStore: vi.fn(() => ({
    messages: [],
    addMessage: vi.fn(),
    clearMessages: vi.fn(),
  })),
}))

describe('useChat', () => {
  it('应返回初始消息列表为空', () => {
    const { result } = renderHook(() => useChat('session-1'))
    expect(result.current.messages).toEqual([])
  })

  it('sendMessage 应调用 SSE 发送', async () => {
    const { result } = renderHook(() => useChat('session-1'))

    await act(async () => {
      await result.current.sendMessage('Hello')
    })

    // 验证 SSE 连接和消息发送行为
  })
})
```

#### 组件测试示例

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LevelBadge } from '@/components/growth/LevelBadge'

describe('LevelBadge', () => {
  it('应渲染等级数字', () => {
    render(<LevelBadge level={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('等级 1 应使用青铜样式', () => {
    render(<LevelBadge level={1} />)
    const badge = screen.getByText('1')
    expect(badge.className).toContain('bronze')
  })

  it('等级 10 应使用钻石样式', () => {
    render(<LevelBadge level={10} />)
    const badge = screen.getByText('10')
    expect(badge.className).toContain('diamond')
  })

  it('点击应触发 onClick 回调', () => {
    const handleClick = vi.fn()
    render(<LevelBadge level={3} onClick={handleClick} />)

    fireEvent.click(screen.getByText('3'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

#### 表单组件测试示例

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectCreateForm } from '@/components/project/ProjectCreateForm'

describe('ProjectCreateForm', () => {
  it('应显示必填字段的校验错误', async () => {
    const user = userEvent.setup()
    render(<ProjectCreateForm onSubmit={vi.fn()} />)

    // 不填任何内容直接提交
    await user.click(screen.getByRole('button', { name: /创建/i }))

    await waitFor(() => {
      expect(screen.getByText(/项目名称不能为空/)).toBeInTheDocument()
    })
  })

  it('填写有效数据后应调用 onSubmit', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(<ProjectCreateForm onSubmit={handleSubmit} />)

    await user.type(screen.getByLabelText(/项目名称/), 'Test Project')
    await user.type(screen.getByLabelText(/项目描述/), 'A test project')
    await user.click(screen.getByRole('button', { name: /创建/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'Test Project',
        description: 'A test project',
      })
    })
  })
})
```

#### E2E 测试示例（Playwright）

```typescript
import { test, expect } from '@playwright/test'

test.describe('登录流程', () => {
  test('未登录访问仪表盘应重定向到登录页', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('应能成功登录并跳转到仪表盘', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.locator('text=欢迎')).toBeVisible()
  })

  test('错误密码应显示错误提示', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=密码错误')).toBeVisible()
  })
})

test.describe('AI 教练会话', () => {
  test('应能创建新会话并发送消息', async ({ page }) => {
    await page.goto('/coach')
    await page.click('button:has-text("新建会话")')
    await page.fill('textarea[placeholder*="输入消息"]', '帮我解释 React 的 hooks')
    await page.click('button:has-text("发送")')

    // 验证消息出现和 AI 回复流式输出
    await expect(page.locator('[data-testid="user-message"]').last())
      .toContainText('React hooks')
    await expect(page.locator('[data-testid="ai-message"]').first())
      .toBeVisible({ timeout: 10000 })
  })
})
```

### 步骤 3：运行测试（它们应该失败）

```bash
# 单元测试和组件测试
npm test

# E2E 测试
npx playwright test

# 运行特定文件
npx vitest run tests/unit/lib/utils/format.test.ts

# 监听模式（TDD 开发时使用）
npx vitest
```

### 步骤 4：实现代码

按照项目分层结构编写最少的代码使测试通过：

| 层级 | 目录 | 职责 |
|------|------|------|
| 页面 | `src/app/` | Next.js App Router 页面与布局 |
| 组件 | `src/components/` | React 组件，按模块分目录 |
| API 客户端 | `src/lib/api/` | Axios 封装，调用后端接口 |
| Hooks | `src/lib/hooks/` | 自定义 React Hook |
| Store | `src/lib/stores/` | Zustand 全局状态 |
| 类型 | `src/lib/types/` | TypeScript 类型定义 |
| 工具 | `src/lib/utils/` | 纯函数、格式化、校验 |

### 步骤 5：再次运行测试

```bash
npm test
# 测试现在应该通过（绿色）
```

### 步骤 6：重构

在保持测试绿色的情况下改进代码质量：
- 消除重复组件逻辑，提取共享 Hook
- 使用 Zustand Store 的 `persist` 中间件（如需要）
- 利用 Zod schema 同时作为类型和校验
- 利用 `clsx` + `tailwind-merge`（通过 `cn()` 工具函数）简化条件样式

### 步骤 7：验证覆盖率

```bash
npx vitest run --coverage
# 验证达到 80%+ 覆盖率
```

## 测试配置

### 安装测试依赖（首次使用）

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react \
  @testing-library/jest-dom @testing-library/user-event \
  @playwright/test @vitest/coverage-v8
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/app/layout.tsx',
        'src/app/globals.css',
        'src/lib/types/**',
        'src/components/ui/**',  // shadcn/ui 基础组件，通常不需覆盖
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
})
```

### tests/setup.ts

```typescript
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// 每个测试后自动清理 DOM
afterEach(() => {
  cleanup()
})

// Mock Next.js 路由
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}))

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: vi.fn(() => ({
    theme: 'dark',
    setTheme: vi.fn(),
  })),
}))

// Mock window.matchMedia（shadcn/ui 组件需要）
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver（Framer Motion 需要）
class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})
```

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
```

### package.json scripts（追加）

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Mock 策略

### 后端 API Mock（单元测试）

```typescript
vi.mock('@/lib/api/project', () => ({
  getProjects: vi.fn(),
  createProject: vi.fn(),
}))
```

### Zustand Store Mock

```typescript
import { useAuthStore } from '@/lib/stores/authStore'

// 在 beforeEach 中重置 store
beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    token: null,
  })
})
```

### SSE（Server-Sent Events）Mock

```typescript
class MockEventSource {
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: (() => void) | null = null

  constructor(public url: string) {
    // 模拟连接
    setTimeout(() => {
      this.onmessage?.(new MessageEvent('message', { data: '{"content":"Hello"}' }))
    }, 10)
  }

  close = vi.fn()
}

vi.stubGlobal('EventSource', MockEventSource)
```

### Monaco Editor Mock（组件测试中避免加载重量级编辑器）

```typescript
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: any) => (
    <textarea data-testid="monaco-mock" value={value} onChange={(e) => onChange?.(e.target.value)} />
  ),
  loader: { init: vi.fn() },
}))
```

### Mermaid Mock

```typescript
vi.mock('mermaid', () => ({
  default: { initialize: vi.fn(), render: vi.fn() },
}))
```

### sonner（Toast）Mock

```typescript
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
  Toaster: () => null,
}))
```

## 常见测试错误需避免

### ❌ 错误：测试实现细节

```typescript
// 不要测试内部状态或实现方式
expect(component._reactInternals).toBeDefined()
```

### ✅ 正确：测试用户可见行为

```typescript
// 测试用户看到的内容和交互
render(<XPBar current={75} max={100} />)
expect(screen.getByText('75%')).toBeInTheDocument()
```

### ❌ 错误：在单元测试中渲染整个 App

```typescript
// 不要加载完整的应用
render(<App />)
```

### ✅ 正确：只渲染被测组件

```typescript
// 只渲染需要测试的组件
render(<ProjectCard project={mockProject} />)
```

### ❌ 错误：跳过 async 操作

```typescript
it('should load data', () => {
  render(<ProjectList />)
  expect(screen.getByText('My Project')).toBeInTheDocument() // 可能还没加载完
})
```

### ✅ 正确：使用 waitFor / findBy 等待异步操作

```typescript
it('应加载并显示项目列表', async () => {
  render(<ProjectList />)
  expect(await screen.findByText('My Project')).toBeInTheDocument()
})
```

### ❌ 错误：使用脆弱的 CSS 选择器

```typescript
await page.click('.bg-blue-500.rounded-lg')
```

### ✅ 正确：使用语义化选择器

```typescript
await page.click('button:has-text("提交")')
await page.click('[data-testid="submit-button"]')
```

### ❌ 错误：测试间共享可变状态

```typescript
let sharedData = { count: 0 } // 共享状态泄漏！

it('test 1', () => { sharedData.count++ })
it('test 2', () => { /* sharedData.count != 0 */ })
```

### ✅ 正确：每个测试独立设置数据

```typescript
it('test 1', () => {
  const data = { count: 0 }
  // 独立的测试逻辑
})

it('test 2', () => {
  const data = { count: 0 }
  // 独立的测试逻辑
})
```

## 持续测试

### 开发时的监听模式

```bash
npm run test:watch
# vitest 监听文件变化，自动运行受影响的测试
```

### Git 钩子（pre-commit）

```bash
#!/bin/sh
# .git/hooks/pre-commit
echo "运行前端测试..."
cd front-end
npx vitest run
if [ $? -ne 0 ]; then
    echo "测试失败，提交已中止"
    exit 1
fi
```

### CI/CD 集成（GitHub Actions）

```yaml
- name: Install Dependencies
  run: npm ci
  working-directory: front-end

- name: Run Unit Tests
  run: npm run test:coverage
  working-directory: front-end

- name: Run E2E Tests
  run: npx playwright install --with-deps && npx playwright test
  working-directory: front-end

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    flags: frontend
```

## 测试最佳实践

1. **先写测试（TDD）** — RED → GREEN → REFACTOR
2. **每个测试一个断言** — 聚焦单一行为
3. **使用 `@testing-library/user-event`** — 比 `fireEvent` 更真实地模拟用户交互
4. **使用 `cn()` 工具函数检查样式** — 通过 className 断言 Tailwind 类
5. **Mock 重量级组件** — Monaco Editor、Mermaid、react-markdown 在单元测试中用轻量 Mock 替代
6. **测试边界情况** — null、undefined、空数组、超长文本
7. **测试错误路径** — 不只是快乐路径，网络错误和权限不足同样重要
8. **保持测试快速** — 单元测试每个 < 50ms，不加载真实 DOM 以外的资源
9. **测试后清理** — setup.ts 中已配置 `afterEach(cleanup)`
10. **利用 `data-testid`** — 在复杂组件上添加测试标识，避免依赖 CSS 类名

## 成功指标

- 达到 80%+ 代码覆盖率
- 所有测试通过（绿色）
- 没有跳过或禁用的测试
- 单元测试执行时间 < 30 秒
- E2E 测试覆盖关键用户流程（登录、创建项目、教练对话）
- 测试在生产前捕获 bug

---

**切记**：测试不是可选的。它们是支撑自信重构、快速开发和生产可靠性的安全网。
