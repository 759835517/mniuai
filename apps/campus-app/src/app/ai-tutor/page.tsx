import { AiTutorChat } from "@/components/ai-tutor/AiTutorChat";

export const metadata = {
  title: "AI 编程助教",
  description: "AI 编程助教随时为你解答编程问题",
};

export default function AiTutorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">AI 编程助教</h1>
          <p className="text-gray-600 mt-2">
            遇到编程问题？AI 助教帮你理解概念、解决报错、检查代码
          </p>
        </div>
        <AiTutorChat />
      </div>
    </div>
  );
}
