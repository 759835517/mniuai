"use client";

import { Card } from "@/components/ui/card";
import { formatPercent, formatDateTime } from "@/lib/utils/format";
import type { Project } from "@/lib/types/project";
import { PROJECT_TYPE_META } from "@/lib/utils/constants";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProjectDashboardProps {
  projects: Project[];
  loading: boolean;
}

export default function ProjectDashboard({ projects, loading }: ProjectDashboardProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg border border-[#30363D] bg-[#161B22]" />
        ))}
      </div>
    );
  }

  if (projects.length === 0) return null;

  return (
    <div className="space-y-3">
      {projects.map((project) => {
        const meta = PROJECT_TYPE_META[project.type];
        return (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="cursor-pointer border-[#30363D] bg-[#161B22] p-4 transition-all hover:border-[#3B82F6]/30">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#3B82F6]/20 px-2 py-0.5 text-xs font-medium text-[#3B82F6]">
                      {meta?.label || project.type}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        project.status === "ACTIVE"
                          ? "bg-green-500/10 text-green-400"
                          : project.status === "COMPLETED"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-[#30363D] text-[#8B949E]"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <h3 className="mt-2 truncate font-medium">{project.projectName || "未命名项目"}</h3>
                  <p className="mt-1 text-xs text-[#8B949E]">{formatDateTime(project.updatedAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatPercent(project.completionRate)}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#484F58]" />
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
