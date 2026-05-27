"use client";

import { DatabaseZap, Bot, PanelsTopLeft, PlugZap } from "lucide-react";
import type { ProjectType } from "@/lib/types/project";
import { Card } from "@/components/ui/card";
import { PROJECT_TYPE_META } from "@/lib/utils/constants";

const iconMap: Record<string, React.ElementType> = {
  DatabaseZap,
  Bot,
  PanelsTopLeft,
  PlugZap,
};

interface ProjectTypeCardsProps {
  creating: boolean;
  selectedType: ProjectType | null;
  onSelect: (type: ProjectType) => void;
}

export default function ProjectTypeCards({ creating, selectedType, onSelect }: ProjectTypeCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {(Object.entries(PROJECT_TYPE_META) as [ProjectType, (typeof PROJECT_TYPE_META)[ProjectType]][]).map(
        ([type, meta]) => {
          const Icon = iconMap[meta.icon] || DatabaseZap;
          return (
            <Card
              key={type}
              className="group cursor-pointer border-[#30363D] bg-[#161B22] p-5 transition-all hover:border-[#3B82F6]/30"
              onClick={() => onSelect(type)}
            >
              <div className="flex flex-col items-start gap-3">
                <Icon className="h-8 w-8 text-[#3B82F6]" />
                <div>
                  <h3 className="font-semibold">{meta.label}</h3>
                  <p className="mt-1 text-xs text-[#8B949E]">{meta.description}</p>
                </div>
                {creating && selectedType === type ? (
                  <span className="text-xs text-[#3B82F6]">创建中...</span>
                ) : (
                  <span className="text-xs text-[#3B82F6] opacity-0 transition-opacity group-hover:opacity-100">
                    点击创建
                  </span>
                )}
              </div>
            </Card>
          );
        }
      )}
    </div>
  );
}
