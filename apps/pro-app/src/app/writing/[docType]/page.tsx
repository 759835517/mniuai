"use client";

import { useState } from "react";

const CONFIG: Record<string, {
  title: string;
  fields: { name: string; label: string; placeholder: string; textarea?: boolean }[];
  prompt: string;
}> = {
  prd: {
    title: "PRD 产品需求文档",
    fields: [
      { name: "name", label: "产品/功能名称", placeholder: "如：用户积分体系" },
      { name: "background", label: "背景与问题", placeholder: "描述当前问题和业务背景", textarea: true },
      { name: "goal", label: "产品目标", placeholder: "如：提升用户活跃度30%，增加复购率" },
      { name: "features", label: "核心功能（每行一个）", placeholder: "1. 积分获取规则\n2. 积分兑换商城\n3. 等级体系", textarea: true },
    ],
    prompt: "PRD",
  },
  report: {
    title: "工作报告",
    fields: [
      { name: "period", label: "报告周期", placeholder: "如：2026年6月" },
      { name: "done", label: "本期完成工作", placeholder: "列出主要完成事项", textarea: true },
      { name: "data", label: "关键数据/成果", placeholder: "如：DAU增长15%，完成3个需求上线" },
      { name: "next", label: "下期计划", placeholder: "列出下期重点工作", textarea: true },
    ],
    prompt: "工作报告",
  },
  email: {
    title: "商务邮件",
    fields: [
      { name: "to", label: "收件人（角色）", placeholder: "如：合作方商务总监" },
      { name: "purpose", label: "邮件目的", placeholder: "如：邀请合作，洽谈代理协议" },
      { name: "keyInfo", label: "关键信息", placeholder: "核心诉求、时间安排、联系方式", textarea: true },
      { name: "tone", label: "语气风格", placeholder: "正式 / 友好 / 简洁" },
    ],
    prompt: "商务邮件",
  },
  plan: {
    title: "项目方案",
    fields: [
      { name: "projectName", label: "项目名称", placeholder: "如：2026年Q3品牌推广项目" },
      { name: "objective", label: "项目目标", placeholder: "如：提升品牌知名度，获取5000条线索" },
      { name: "background", label: "项目背景", placeholder: "为什么要做这个项目", textarea: true },
      { name: "resources", label: "可用资源（预算/人力）", placeholder: "如：预算20万，2名运营，1名设计" },
      { name: "timeline", label: "时间安排", placeholder: "如：7月启动，9月底完成" },
    ],
    prompt: "项目方案",
  },
};

const MOCK_OUTPUT: Record<string, string> = {
  prd: `# PRD：用户积分体系

## 一、背景与目标
提升用户活跃度30%，增加复购率。解决用户粘性不足问题。

## 二、用户故事
- 作为普通用户，我希望通过购买/签到获得积分，以便兑换优惠券
- 作为高价值用户，我希望有专属等级权益，以体现我的价值

## 三、功能需求

### 3.1 积分获取规则
| 行为 | 积分 | 说明 |
|---|---|---|
| 购买 | 1元=1分 | 实付金额计算 |
| 签到 | 5分/天 | 每日上限 |

### 3.2 积分兑换商城
- 兑换比例：100分 = 1元优惠券
- 有效期：积分180天有效

### 3.3 等级体系
普通→银牌→金牌→钻石，按月累计积分晋级

## 四、验收标准
- [ ] 积分实时更新，误差≤5分钟
- [ ] 兑换操作3步内完成
- [ ] 等级变化推送通知`,
  report: `# 工作报告 · 2026年6月

## 一、本期完成工作
**已完成事项（100%完成率）**
1. 完成用户增长专项活动，DAU提升15%，超目标5%
2. 上线新版首页改版，转化率提升8%
3. 完成Q2数据复盘报告，提交管理层

## 二、关键数据
- DAU：从12万 → 13.8万（+15%）
- 付费转化率：从3.2% → 3.5%（+0.3pp）
- 3个需求按时上线，0延期

## 三、下期计划
1. 推进积分体系需求落地（7月15日上线）
2. 完成Q3活动策划方案
3. 启动新用户召回专项`,
  email: `主题：关于合作意向的邀请函

尊敬的 [姓名] 总监，

您好！我是萌牛AI的商务负责人，在此诚挚邀请贵方就代理合作事宜进行洽谈。

【合作背景】
萌牛AI目前服务超过50,000名职场用户，覆盖产品/运营/市场等核心岗位。我们希望通过代理合作，共同覆盖更广泛的企业客户群体。

【合作方向】
- 区域代理授权
- 联合营销活动
- 渠道分成机制

如您有意向，烦请于本周内回复，我们可安排线上或线下会面。

期待您的回复！

祝商祺，
[你的姓名]`,
  plan: `# 2026年Q3品牌推广项目方案

## 一、项目目标
提升品牌知名度，获取5000条有效线索，ROI≥300%

## 二、策略规划

### 核心渠道
| 渠道 | 预算 | 预期线索 |
|---|---|---|
| 小红书KOL | 8万 | 2000条 |
| 搜索广告SEM | 7万 | 2500条 |
| 行业峰会赞助 | 5万 | 500条 |

## 三、执行时间线
- 7月1日：启动KOL筛选和素材制作
- 7月15日：小红书投放上线
- 8月1日：SEM广告启动
- 9月30日：数据复盘，提交结案报告

## 四、风险预案
- 线索量不达标：追加SEM预算
- KOL效果不佳：启动备选达人`,
};

export default function WritingDocPage({ params }: { params: { docType: string } }) {
  const cfg = CONFIG[params.docType] || CONFIG.prd;
  const [fields, setFields] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setOutput(MOCK_OUTPUT[params.docType] || MOCK_OUTPUT.prd);
    setLoading(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{cfg.title}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧表单 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">填写核心信息</h2>
            <div className="space-y-4">
              {cfg.fields.map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  {f.textarea ? (
                    <textarea
                      value={fields[f.name] || ""}
                      onChange={(e) => setFields({ ...fields, [f.name]: e.target.value })}
                      placeholder={f.placeholder}
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  ) : (
                    <input
                      type="text"
                      value={fields[f.name] || ""}
                      onChange={(e) => setFields({ ...fields, [f.name]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? "AI生成中..." : "生成文档"}
            </button>
          </div>

          {/* 右侧输出 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">生成结果</h2>
              {output && (
                <button
                  onClick={handleCopy}
                  className="text-sm text-green-600 hover:underline"
                >
                  {copied ? "已复制！" : "复制全文"}
                </button>
              )}
            </div>
            {output ? (
              <textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                className="w-full h-80 border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 font-mono"
              />
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-300 text-sm border border-dashed border-gray-200 rounded-xl">
                填写左侧信息后点击"生成文档"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
