"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {Icon && <Icon className="mb-4 h-12 w-12 text-[#30363D]" />}
      <h3 className="text-lg font-semibold text-[#F0F6FC]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-[#8B949E]">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
