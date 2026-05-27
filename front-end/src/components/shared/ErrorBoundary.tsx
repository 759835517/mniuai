"use client";

import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="rounded-lg border border-[#30363D] bg-[#161B22] p-6 text-center">
          <p className="mb-2 text-sm font-medium text-[#F0F6FC]">组件加载失败</p>
          <p className="mb-4 text-xs text-[#8B949E]">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="rounded-md bg-[#3B82F6] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2563EB]"
          >
            重试
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
