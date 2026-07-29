"use client";

import { useState } from "react";
import Link from "next/link";

export default function PracticeTaskPage() {
  const [code, setCode] = useState(
    "// 在此修改代码\npublic User login(String email, String password) {\n  User user = userMapper.findByEmail(email);\n  // TODO: 处理 user 为 null 的情况\n  if (!user.getPassword().equals(hash(password))) {\n    throw new AuthException(\"密码错误\");\n  }\n  return user;\n}"
  );
  const [chat, setChat] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);

  const ask = () => {
    if (!input.trim()) return;
    setChat((c) => [
      ...c,
      { role: "user", text: input },
      {
        role: "ai",
        text: "提示：先判断 findByEmail 的返回值是否为 null，再访问其属性。空指针通常发生在用户不存在时直接调用 getPassword()。",
      },
    ]);
    setInput("");
  };

  const run = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 1200);
  };

  return (
    <div className="pt-16 h-screen flex flex-col bg-gray-900">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 text-white border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Link href="/practice" className="text-gray-400 hover:text-white text-sm">
            ← 返回
          </Link>
          <span className="font-semibold text-sm">修复用户登录接口的空指针异常</span>
          <span className="text-xs px-2 py-0.5 rounded bg-green-600">简单</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={run}
            disabled={running}
            className="text-sm bg-orange-500 hover:bg-orange-600 px-4 py-1.5 rounded-lg disabled:opacity-50"
          >
            {running ? "运行中…" : "▶ 运行测试"}
          </button>
          <button className="text-sm bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded-lg">
            提交
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        <div className="lg:col-span-2 flex flex-col border-r border-gray-700">
          <div className="px-4 py-2 bg-gray-800 text-xs text-gray-400 border-b border-gray-700">
            AuthService.java
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 bg-gray-900 text-gray-100 font-mono text-sm p-4 resize-none outline-none leading-relaxed"
          />
          <div className="h-40 bg-black text-gray-300 font-mono text-xs p-4 overflow-auto border-t border-gray-700">
            <div className="text-gray-500 mb-1">// 测试输出</div>
            {running ? (
              <div className="text-yellow-400">运行测试用例中…</div>
            ) : (
              <>
                <div className="text-red-400">✗ testLoginWithNonExistUser: NullPointerException</div>
                <div className="text-green-400">✓ testLoginSuccess</div>
                <div className="text-gray-500 mt-1">1 passed, 1 failed</div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col bg-gray-800">
          <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
            🤖 AI 编程助手（Cmd+K）
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {chat.length === 0 && (
              <p className="text-gray-500 text-sm">
                向 AI 提问获取逐步提示，AI 不会直接给出完整答案，而是引导你思考。
              </p>
            )}
            {chat.map((m, i) => (
              <div
                key={i}
                className={`text-sm rounded-lg p-3 ${
                  m.role === "user"
                    ? "bg-orange-500/20 text-orange-100 ml-6"
                    : "bg-gray-700 text-gray-200 mr-6"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-700 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              placeholder="描述你的问题…"
              className="flex-1 bg-gray-900 text-gray-100 text-sm rounded-lg px-3 py-2 outline-none"
            />
            <button
              onClick={ask}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 rounded-lg"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
