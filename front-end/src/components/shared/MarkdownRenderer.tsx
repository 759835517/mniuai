"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils/cn";
import CodeBlock from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-invert max-w-none text-sm leading-relaxed", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || "");
            const isInline = !match && !codeClassName;

            if (isInline) {
              return (
                <code
                  className="rounded bg-[#1C2128] px-1.5 py-0.5 text-[#F0F6FC]"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                code={String(children).replace(/\n$/, "")}
                language={match?.[1]}
              />
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
          p({ children }) {
            return <p className="mb-3 text-[#F0F6FC]">{children}</p>;
          },
          h1({ children }) {
            return <h1 className="mb-4 text-xl font-bold text-[#F0F6FC]">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="mb-3 text-lg font-semibold text-[#F0F6FC]">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="mb-2 text-base font-semibold text-[#F0F6FC]">{children}</h3>;
          },
          ul({ children }) {
            return <ul className="mb-3 list-disc pl-6 text-[#F0F6FC]">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="mb-3 list-decimal pl-6 text-[#F0F6FC]">{children}</ol>;
          },
          li({ children }) {
            return <li className="mb-1">{children}</li>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-[#3B82F6] pl-4 italic text-[#8B949E]">
                {children}
              </blockquote>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3B82F6] underline-offset-2 hover:underline"
              >
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="my-3 overflow-x-auto">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border border-[#30363D] bg-[#1C2128] px-3 py-2 text-left font-medium">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-[#30363D] px-3 py-2">{children}</td>
            );
          },
          hr() {
            return <hr className="my-6 border-[#30363D]" />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
