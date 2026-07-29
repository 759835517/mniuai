"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Metadata } from "next";

const STORIES = [
  { id: 1, name: "张同学", role: "后端工程师 → AI工程师", persona: "程序员", before: "工作3年Java后端，投了40份简历无回音", after: "拿到字节跳动AI岗位offer，薪资涨幅60%", quote: "对赌协议让我没有后顾之忧，AI面试官练习非常真实。", avatar: "👨‍💻", tag: "bg-blue-100 text-blue-700" },
  { id: 2, name: "李老师", role: "初中语文教师", persona: "老师", before: "每天备课4小时，精力耗尽", after: "用AI备课效率提升70%，每周节省15小时", quote: "以前觉得AI是程序员的事，学完才发现教师用好AI收益更大。", avatar: "👨‍🏫", tag: "bg-yellow-100 text-yellow-700" },
  { id: 3, name: "陈同学", role: "大三 → 互联网公司实习", persona: "大学生", before: "计算机专业大三，代码能力一般，担心找不到工作", after: "完成3个AI项目，毕业前拿到两个实习offer", quote: "对赌协议给了我信心，就算失败也不亏。", avatar: "🎓", tag: "bg-purple-100 text-purple-700" },
  { id: 4, name: "王同学", role: "初中生 → 省级竞赛二等奖", persona: "少儿", before: "初二开始学编程，参加比赛总是止步市级", after: "系统训练8个月，省信息学联赛二等奖", quote: "萌牛AI的竞赛课题目真的很有针对性。", avatar: "👶", tag: "bg-green-100 text-green-700" },
  { id: 5, name: "赵女士", role: "宝妈博主", persona: "自媒体", before: "公众号运营2年，粉丝才800，写一篇文章要4小时", after: "用AI创作3个月，增粉1200+，阅读量翻3倍", quote: "AI工具帮我从选题到排版全流程提速，每天只需1小时。", avatar: "📱", tag: "bg-pink-100 text-pink-700" },
  { id: 6, name: "刘老板", role: "餐饮店主", persona: "小老板", before: "门店客流越来越少，发传单没效果", after: "用AI做朋友圈内容1个月，到店客流增加30%", quote: "完全不懂AI，老师手把手教，现在每天自己用AI写文案。", avatar: "🏪", tag: "bg-orange-100 text-orange-700" },
];

const PERSONAS = ["全部", "程序员", "老师", "大学生", "少儿", "自媒体", "小老板"];

export default function SuccessStoriesPage() {
  const [selectedPersona, setSelectedPersona] = useState("全部");

  const filteredStories = useMemo(() => {
    if (selectedPersona === "全部") return STORIES;
    return STORIES.filter((s) => s.persona === selectedPersona);
  }, [selectedPersona]);

  return (
    <div className="pt-16">
      <section className="py-16 bg-gray-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">真实学员故事</h1>
          <p className="text-gray-400 text-lg">他们用萌牛AI改变了职业轨迹和生活</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab 筛选 */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {PERSONAS.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPersona(p)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  p === selectedPersona
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                }`}
              >
                {p}
                {p !== "全部" && (
                  <span className="ml-1 text-xs opacity-70">
                    ({STORIES.filter((s) => s.persona === p).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {filteredStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story) => (
                <div key={story.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{story.avatar}</span>
                    <div>
                      <div className="font-bold text-gray-900">{story.name}</div>
                      <div className="text-sm text-gray-500">{story.role}</div>
                    </div>
                    <span className={`ml-auto text-xs font-medium px-2 py-1 rounded-full ${story.tag}`}>{story.persona}</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="bg-red-50 rounded-lg p-3 text-xs text-gray-600"><span className="font-medium text-red-500">学前：</span>{story.before}</div>
                    <div className="bg-green-50 rounded-lg p-3 text-xs text-gray-600"><span className="font-medium text-green-600">学后：</span>{story.after}</div>
                  </div>
                  <blockquote className="text-sm text-gray-500 italic border-l-2 border-orange-300 pl-3">"{story.quote}"</blockquote>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 block">📭</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">该分类暂无案例</h3>
              <p className="text-gray-500">请选择其他分类查看</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-orange-500 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">你也可以成为下一个成功案例</h2>
          <Link href="/#personas" className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors">
            选择你的学习路径 →
          </Link>
        </div>
      </section>
    </div>
  );
}
