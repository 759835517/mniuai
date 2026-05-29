"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/lib/stores/authStore";
import { loginSchema, type LoginFormData } from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const { login, loading, error, isAuthenticated, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      console.log('[LoginForm] isAuthenticated=true, redirecting to:', redirect);
      router.replace(redirect);
    }
  }, [isAuthenticated, redirect, router]);

  const onSubmit = async (data: LoginFormData) => {
    console.log('[LoginForm] onSubmit called with:', { email: data.email });
    try {
      await login(data);
      console.log('[LoginForm] login() completed successfully');
    } catch (e) {
      console.log('[LoginForm] login() failed:', (e as Error).message);
    }
  };

  return (
    <Card className="w-full max-w-md border-[#30363D] bg-[#161B22]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">登录</CardTitle>
        <CardDescription className="text-[#8B949E]">登录你的 MNIU AI Camp 账户</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <div className="rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#F0F6FC]">邮箱</Label>
            <Input id="email" type="email" placeholder="your@email.com"
              className="border-[#30363D] bg-[#0D1117] text-[#F0F6FC] placeholder:text-[#484F58]"
              {...register("email")} onFocus={clearError} />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#F0F6FC]">密码</Label>
            <Input id="password" type="password" placeholder="至少 8 位"
              className="border-[#30363D] bg-[#0D1117] text-[#F0F6FC] placeholder:text-[#484F58]"
              {...register("password")} onFocus={clearError} />
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">
            {loading ? "登录中..." : "登录"}
          </Button>
          <p className="text-center text-sm text-[#8B949E]">
            还没有账户？ <Link href="/register" className="text-[#3B82F6] hover:underline">注册</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D1117] px-4">
      <Suspense fallback={<div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
