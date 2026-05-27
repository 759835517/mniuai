"use client";

import { cn } from "@/lib/utils/cn";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const sizeMap = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export default function Loading({ size = "md", text, className }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-[#30363D] border-t-[#3B82F6]",
          sizeMap[size]
        )}
      />
      {text && <p className="text-sm text-[#8B949E]">{text}</p>}
    </div>
  );
}
