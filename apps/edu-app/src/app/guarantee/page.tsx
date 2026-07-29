import Link from "next/link";

export default function GuaranteePage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🤝</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">对赌协议</h1>
          <p className="text-lg text-gray-500">
            萌牛AI对教师的承诺：认真用，不满意，全额退款。
          </p>
        </div>

        {/* 条件表格 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">退款门槛（需同时满足）</h2>
          <div className="space-y-3">
            {[
              {
                condition: "有效使用 ≥ 50次",
                desc: "AI生成结果，且停留 ≥ 3分钟计为1次有效使用",
                icon: "⚡",
              },
              {
                condition: "连续使用 ≥ 30天",
                desc: "按自然日统计，中断后重新计算",
                icon: "📅",
              },
              {
                condition: "至少使用 3个工具模块",
                desc: "备课/出题/批改/PPT任意3个",
                icon: "🧰",
              },
              {
                condition: "单次 ≥ 3分钟记录 ≥ 30条",
                desc: "每次会话时长须超过3分钟才计为有效",
                icon: "⏱️",
              },
            ].map((item) => (
              <div
                key={item.condition}
                className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {item.condition}
                  </div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 退款流程 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">申请流程</h2>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "发起申请",
                desc: '在"我的使用记录"页面点击"申请退款"',
              },
              {
                step: "2",
                title: "系统自动核查",
                desc: "30秒内完成使用次数、天数、工具广度验证",
              },
              {
                step: "3",
                title: "填写自评问卷",
                desc: "5道题了解真实使用情况（必填）",
              },
              {
                step: "4",
                title: "72小时到账",
                desc: "通过核查后极速退款到原支付方式",
              },
            ].map((step) => (
              <div key={step.step} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {step.step}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 截止时间与申诉 */}
        <div className="bg-gray-900 text-white rounded-2xl p-6 mb-8">
          <h2 className="font-bold mb-3">重要说明</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• 申请期限：购买专业版后 60 天内有效</li>
            <li>• 超过 60 天视为认可产品效果，不再受理</li>
            <li>• 仅专业版（对赌版）享有此政策，基础版和免费版不适用</li>
            <li>• 若对核查结果有异议，可提交申诉，客服3个工作日内人工审核</li>
            <li>• 同一账号仅限申请一次退款</li>
          </ul>
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
          >
            开始7天免费体验 →
          </Link>
          <p className="text-sm text-gray-400 mt-3">无需绑卡，注册即可使用</p>
        </div>
      </div>
    </div>
  );
}
