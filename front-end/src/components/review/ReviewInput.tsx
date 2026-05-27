"use client";

import { useState } from "react";
import { repoReviewSchema, snippetReviewSchema } from "@/lib/utils/validation";
import { REVIEW_LANGUAGES } from "@/lib/utils/constants";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SubmitReviewRequest } from "@/lib/types/review";
import { toast } from "sonner";

type ReviewTab = "repo" | "snippet";

interface ReviewInputProps {
  submitting: boolean;
  onSubmit: (payload: SubmitReviewRequest) => Promise<void>;
}

export default function ReviewInput({ submitting, onSubmit }: ReviewInputProps) {
  const [activeTab, setActiveTab] = useState<ReviewTab>("repo");
  const [error, setError] = useState<string | null>(null);

  // Repo form
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [repoLanguage, setRepoLanguage] = useState("");

  // Snippet form
  const [code, setCode] = useState("");
  const [snippetLanguage, setSnippetLanguage] = useState("TypeScript");

  const handleSubmit = async () => {
    setError(null);
    let payload: SubmitReviewRequest;

    if (activeTab === "repo") {
      const result = repoReviewSchema.safeParse({
        sourceRef: repoUrl,
        branch: branch || undefined,
        language: repoLanguage || undefined,
      });
      if (!result.success) {
        setError(result.error.issues[0]?.message ?? "参数校验失败");
        return;
      }
      payload = { sourceType: "REPO", sourceRef: result.data.sourceRef, branch: result.data.branch, language: result.data.language };
    } else {
      const result = snippetReviewSchema.safeParse({ code, language: snippetLanguage });
      if (!result.success) {
        setError(result.error.issues[0]?.message ?? "参数校验失败");
        return;
      }
      payload = { sourceType: "SNIPPET", code: result.data.code, language: result.data.language };
    }

    try {
      await onSubmit(payload);
    } catch (e) {
      setError((e as Error).message);
      toast.error("提交失败: " + (e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#30363D]">
        {(["repo", "snippet"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-[#3B82F6] text-[#3B82F6]"
                : "border-transparent text-[#8B949E] hover:text-[#F0F6FC]"
            }`}
          >
            {tab === "repo" ? "GitHub 仓库" : "代码片段"}
          </button>
        ))}
      </div>

      {/* Repo Tab */}
      {activeTab === "repo" && (
        <Card className="border-[#30363D] bg-[#161B22] p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#F0F6FC]">GitHub 仓库 URL</Label>
              <Input
                placeholder="https://github.com/user/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="border-[#30363D] bg-[#0D1117] text-[#F0F6FC] placeholder:text-[#484F58]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#F0F6FC]">分支（可选）</Label>
                <Input
                  placeholder="main"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="border-[#30363D] bg-[#0D1117] text-[#F0F6FC] placeholder:text-[#484F58]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#F0F6FC]">语言（可选）</Label>
                <select
                  value={repoLanguage}
                  onChange={(e) => setRepoLanguage(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-[#30363D] bg-[#0D1117] px-3 py-2 text-sm text-[#F0F6FC]"
                >
                  <option value="">自动检测</option>
                  {REVIEW_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Snippet Tab */}
      {activeTab === "snippet" && (
        <Card className="border-[#30363D] bg-[#161B22] p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#F0F6FC]">语言</Label>
              <select
                value={snippetLanguage}
                onChange={(e) => setSnippetLanguage(e.target.value)}
                className="flex h-10 w-full rounded-md border border-[#30363D] bg-[#0D1117] px-3 py-2 text-sm text-[#F0F6FC]"
              >
                {REVIEW_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[#F0F6FC]">代码</Label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="粘贴你的代码..."
                rows={16}
                className="w-full resize-y rounded-md border border-[#30363D] bg-[#0D1117] p-3 font-mono text-sm text-[#F0F6FC] placeholder:text-[#484F58] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                style={{ minHeight: 200, maxHeight: 600 }}
              />
            </div>
          </div>
        </Card>
      )}

      {error && (
        <div className="rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]"
      >
        {submitting ? "提交审查中..." : "提交审查"}
      </Button>
    </div>
  );
}
