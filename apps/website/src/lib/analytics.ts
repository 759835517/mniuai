// 数据埋点工具
// 支持：Google Analytics、自定义事件追踪

type EventName =
  | "page_view"
  | "hero_persona_click"
  | "cta_click"
  | "course_card_click"
  | "guarantee_section_view"
  | "guarantee_page_visit"
  | "landing_page_visit"
  | "register_click"
  | "blog_article_read"
  | "contact_form_submit";

interface EventParams {
  page_path?: string;
  referrer?: string;
  utm_source?: string;
  persona?: string;
  cta_text?: string;
  course_id?: string;
  course_name?: string;
  position?: number;
  referrer_page?: string;
  article_slug?: string;
  category?: string;
  form_type?: string;
  [key: string]: string | number | undefined;
}

// 统一的埋点函数
export function trackEvent(name: EventName, params: EventParams = {}) {
  // 添加通用参数
  const fullParams: EventParams = {
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    ...params,
  };

  // Google Analytics 4
  if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", name, fullParams);
  }

  // 开发环境打印日志
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${name}`, fullParams);
  }

  // TODO: 可接入自定义埋点系统
  // fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ name, params: fullParams }) });
}

// 页面浏览追踪
export function trackPageView(path: string) {
  trackEvent("page_view", { page_path: path });
}

// 人群卡片点击
export function trackPersonaClick(persona: string) {
  trackEvent("hero_persona_click", { persona });
}

// CTA 点击
export function trackCtaClick(ctaText: string, persona?: string) {
  trackEvent("cta_click", { cta_text: ctaText, persona });
}

// 课程卡片点击
export function trackCourseClick(courseId: string, courseName: string, persona: string, position: number) {
  trackEvent("course_card_click", { course_id: courseId, course_name: courseName, persona, position });
}

// 对赌区域曝光
export function trackGuaranteeView(pagePath: string) {
  trackEvent("guarantee_section_view", { page_path: pagePath });
}

// 对赌页面访问
export function trackGuaranteeVisit(referrerPage: string) {
  trackEvent("guarantee_page_visit", { referrer_page: referrerPage });
}

// 落地页访问
export function trackLandingPageVisit(persona: string) {
  trackEvent("landing_page_visit", { persona });
}

// 注册/报名点击
export function trackRegisterClick(persona: string, courseId?: string) {
  trackEvent("register_click", { persona, course_id: courseId });
}

// 博客文章阅读完成
export function trackBlogRead(articleSlug: string, category: string) {
  trackEvent("blog_article_read", { article_slug: articleSlug, category });
}

// 联系表单提交
export function trackContactSubmit(formType: string) {
  trackEvent("contact_form_submit", { form_type: formType });
}
