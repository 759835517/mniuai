"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const LANGUAGE_MAP: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  java: "java",
  python: "python",
  go: "go",
  rust: "rust",
  cpp: "cpp",
  c: "c",
  csharp: "csharp",
  ruby: "ruby",
  php: "php",
  swift: "swift",
  kotlin: "kotlin",
  scala: "scala",
  sql: "sql",
  html: "xml",
  css: "css",
  scss: "scss",
  less: "less",
  json: "json",
  yaml: "yaml",
  xml: "xml",
  bash: "bash",
  shell: "bash",
  powershell: "powershell",
  dockerfile: "dockerfile",
  markdown: "markdown",
  graphql: "graphql",
  toml: "ini",
  ini: "ini",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LANG_MODULES: Record<string, () => Promise<{ default: (hljs: any) => void }>> = {
  javascript: () => import("highlight.js/lib/languages/javascript"),
  typescript: () => import("highlight.js/lib/languages/typescript"),
  java: () => import("highlight.js/lib/languages/java"),
  python: () => import("highlight.js/lib/languages/python"),
  go: () => import("highlight.js/lib/languages/go"),
  rust: () => import("highlight.js/lib/languages/rust"),
  cpp: () => import("highlight.js/lib/languages/cpp"),
  c: () => import("highlight.js/lib/languages/c"),
  csharp: () => import("highlight.js/lib/languages/csharp"),
  ruby: () => import("highlight.js/lib/languages/ruby"),
  php: () => import("highlight.js/lib/languages/php"),
  swift: () => import("highlight.js/lib/languages/swift"),
  kotlin: () => import("highlight.js/lib/languages/kotlin"),
  scala: () => import("highlight.js/lib/languages/scala"),
  sql: () => import("highlight.js/lib/languages/sql"),
  xml: () => import("highlight.js/lib/languages/xml"),
  css: () => import("highlight.js/lib/languages/css"),
  scss: () => import("highlight.js/lib/languages/scss"),
  json: () => import("highlight.js/lib/languages/json"),
  yaml: () => import("highlight.js/lib/languages/yaml"),
  bash: () => import("highlight.js/lib/languages/bash"),
  powershell: () => import("highlight.js/lib/languages/powershell"),
  dockerfile: () => import("highlight.js/lib/languages/dockerfile"),
  markdown: () => import("highlight.js/lib/languages/markdown"),
  graphql: () => import("highlight.js/lib/languages/graphql"),
  ini: () => import("highlight.js/lib/languages/ini"),
};

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export default function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const highlightedRef = useRef(false);

  useEffect(() => {
    if (!codeRef.current || !language) return;
    const normalizedLang = LANGUAGE_MAP[language.toLowerCase()] || language.toLowerCase();
    const langLoader = LANG_MODULES[normalizedLang];
    if (!langLoader) return;

    import("highlight.js/lib/core").then((hljsModule) => {
      const hljs = hljsModule.default;
      langLoader().then((langModule) => {
        if (!hljs.getLanguage(normalizedLang)) {
          hljs.registerLanguage(normalizedLang, langModule.default as Parameters<typeof hljs.registerLanguage>[1]);
        }
        if (codeRef.current) {
          codeRef.current.removeAttribute("data-highlighted");
          hljs.highlightElement(codeRef.current);
          highlightedRef.current = true;
        }
      }).catch(() => {});
    });
  }, [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("group relative rounded-lg border border-[#30363D] bg-[#0D1117]", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363D] px-4 py-2">
        {language && (
          <span className="text-xs font-medium text-[#8B949E] uppercase">{language}</span>
        )}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[#8B949E] transition-colors hover:bg-[#1C2128] hover:text-[#F0F6FC]"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>已复制</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-auto mniu-scrollbar" style={{ maxHeight: 520 }}>
        <pre className="p-4 text-sm leading-relaxed">
          <code ref={codeRef} className={`language-${language || "text"} text-[#F0F6FC]`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
