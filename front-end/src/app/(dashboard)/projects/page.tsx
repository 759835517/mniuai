"use client";

import { useEffect, useState } from "react";
import { useProjectStore } from "@/lib/stores/projectStore";
import { toast } from "sonner";
import ProjectTypeCards from "@/components/project/ProjectTypeCards";
import ProjectDashboard from "@/components/project/ProjectDashboard";
import Loading from "@/components/shared/Loading";
import EmptyState from "@/components/shared/EmptyState";
import type { ProjectType } from "@/lib/types/project";
import { FolderKanban } from "lucide-react";

export default function ProjectsPage() {
  const { projects, loading, creating, fetchProjects, createProject } = useProjectStore();
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async (type: ProjectType) => {
    setSelectedType(type);
    try {
      const project = await createProject({ type });
      toast.success("项目创建成功！");
      window.location.href = `/projects/${project.id}`;
    } catch (e) {
      setSelectedType(null);
      toast.error("创建失败: " + (e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">项目实战</h1>
        <p className="mt-1 text-sm text-[#8B949E]">创建 AI 项目，在实践中学习</p>
      </div>

      <ProjectTypeCards
        creating={creating}
        selectedType={selectedType}
        onSelect={handleCreate}
      />

      {loading && <Loading text="加载项目列表..." />}

      {!loading && projects.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="还没有项目"
          description="选择上方的项目类型开始创建"
        />
      )}

      {!loading && projects.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">我的项目</h2>
          <ProjectDashboard projects={projects} loading={false} />
        </div>
      )}
    </div>
  );
}
