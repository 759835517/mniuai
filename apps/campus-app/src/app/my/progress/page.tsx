import type { Metadata } from "next";

export const metadata: Metadata = { title: "我的学习进度" };

const PROGRESS_DATA = {
  currentPath: "全栈工程师路径",
  level: "L2",
  completedWeeks: 4,
  totalWeeks: 12,
  practicesSolved: 68,
  totalPractices: 200,
  streak: 12,
  recentLessons: [
    { title: "MyBatis-Plus CRUD操作", completedAt: "今天", duration: "45分钟" },
    { title: "Spring Boot RESTful API设计", completedAt: "昨天", duration: "60分钟" },
    { title: "React Hooks进阶", completedAt: "2天前", duration: "50分钟" },
  ],
  weeklyActivity: [3, 5, 4, 2, 6, 5, 1],
};

export default function ProgressPage() {
  const courseProgress = Math.round((PROGRESS_DATA.completedWeeks / PROGRESS_DATA.totalWeeks) * 100);
  const practiceProgress = Math.round((PROGRESS_DATA.practicesSolved / PROGRESS_DATA.totalPractices) * 100);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">我的学习进度</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "当前等级", value: PROGRESS_DATA.level, sub: "全栈路径", icon: "📈" },
            { label: "连续打卡", value: `${PROGRESS_DATA.streak}天`, sub: "继续加油！", icon: "🔥" },
            { label: "刷题数", value: `${PROGRESS_DATA.practicesSolved}`, sub: `共${PROGRESS_DATA.totalPractices}题`, icon: "🧮" },
            { label: "学习周数", value: `${PROGRESS_DATA.completedWeeks}/${PROGRESS_DATA.totalWeeks}`, sub: "周", icon: "📅" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              <div className="text-xs text-gray-400">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-900 text-sm">课程进度</span>
              <span className="text-sm font-bold text-blue-500">{courseProgress}%</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2 mb-2">
              <div className="bg-blue-500 rounded-full h-2 transition-all" style={{ width: `${courseProgress}%` }} />
            </div>
            <div className="text-xs text-gray-400">{PROGRESS_DATA.currentPath} · 第{PROGRESS_DATA.completedWeeks}/{PROGRESS_DATA.totalWeeks}周</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-900 text-sm">编程练习</span>
              <span className="text-sm font-bold text-green-500">{practiceProgress}%</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2 mb-2">
              <div className="bg-green-500 rounded-full h-2 transition-all" style={{ width: `${practiceProgress}%` }} />
            </div>
            <div className="text-xs text-gray-400">{PROGRESS_DATA.practicesSolved} / {PROGRESS_DATA.totalPractices} 题完成</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">最近学习记录</h2>
          <div className="space-y-3">
            {PROGRESS_DATA.recentLessons.map((lesson, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-sm">✓</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                    <div className="text-xs text-gray-400">{lesson.completedAt} · {lesson.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
