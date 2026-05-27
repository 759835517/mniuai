"use client";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
};

export default function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] font-bold text-white ${sizeClasses[size]}`}
    >
      {level}
    </div>
  );
}
