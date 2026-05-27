"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SKILL_PRESETS } from "@/lib/utils/constants";
import { roadmapGenerateSchema } from "@/lib/utils/validation";
import type { LearningGoal } from "@/lib/types/user";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const GOALS: { value: LearningGoal; label: string }[] = [
  { value: "RAG", label: "RAG 应用" },
  { value: "Agent", label: "Agent 应用" },
  { value: "AI_SaaS", label: "AI SaaS" },
  { value: "MCP_SERVER", label: "MCP Server" },
];

interface RoadmapFormProps {
  generating: boolean;
  onSubmit: (payload: { skills: string[]; goal: LearningGoal; hours: number; durationWeeks?: number }) => Promise<void>;
}

export default function RoadmapForm({ generating, onSubmit }: RoadmapFormProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [goal, setGoal] = useState<LearningGoal>("RAG");
  const [hours, setHours] = useState(10);
  const [durationWeeks, setDurationWeeks] = useState(12);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
  };

  const handleSubmit = async () => {
    const result = roadmapGenerateSchema.safeParse({ skills: selectedSkills, goal, hours, durationWeeks });
    if (!result.success) return;
    await onSubmit(result.data);
  };

  return (
    <Card className="border-[#30363D] bg-[#161B22] p-6">
      <h2 className="mb-4 text-lg font-semibold">配置学习计划</h2>
      <div className="space-y-4">
        <div>
          <Label className="mb-2 block text-[#F0F6FC]">技能基础</Label>
          <div className="flex flex-wrap gap-2">
            {SKILL_PRESETS.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedSkills.includes(skill)
                    ? "bg-[#3B82F6] text-white"
                    : "border border-[#30363D] bg-[#0D1117] text-[#8B949E] hover:border-[#3B82F6]/50"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block text-[#F0F6FC]">学习目标</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {GOALS.map((g) => (
              <button
                key={g.value}
                onClick={() => setGoal(g.value)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  goal === g.value
                    ? "bg-[#3B82F6] text-white"
                    : "border border-[#30363D] bg-[#0D1117] text-[#8B949E] hover:border-[#3B82F6]/50"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block text-[#F0F6FC]">每周可用小时数</Label>
            <input
              type="range"
              min={1}
              max={40}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full accent-[#3B82F6]"
            />
            <p className="mt-1 text-center text-sm text-[#8B949E]">{hours} 小时/周</p>
          </div>
          <div>
            <Label className="mb-2 block text-[#F0F6FC]">学习周期（周）</Label>
            <input
              type="range"
              min={4}
              max={24}
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
              className="w-full accent-[#3B82F6]"
            />
            <p className="mt-1 text-center text-sm text-[#8B949E]">{durationWeeks} 周</p>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={generating || selectedSkills.length === 0}
          className="w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]"
        >
          {generating ? "生成中..." : "生成学习路线图"}
        </Button>
      </div>
    </Card>
  );
}

// Re-export for backward compat icons
export { CheckCircle2, Circle, Clock };
