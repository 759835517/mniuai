"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminLessonsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">章节管理</h1>
        <Button className="bg-[#3B82F6]">
          <Plus className="mr-2 h-4 w-4" />
          新建章节
        </Button>
      </div>

      <Card className="border-[#30363D] bg-[#161B22] p-6">
        <p className="text-center text-[#8B949E]">请先选择一个课程管理其章节</p>
      </Card>
    </div>
  );
}
