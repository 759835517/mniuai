"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/lib/stores/authStore";
import { registerSchema, type RegisterFormData } from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, loading, error, isAuthenticated, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      router.replace("/dashboard");
    } catch {
      // error is set in store
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D1117] px-4">
      <Card className="w-full max-w-md border-[#30363D] bg-[#161B22]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">注册</CardTitle>
          <CardDescription className="text-[#8B949E]">
            创建你的 MNIU AI Camp 账户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-[#F0F6FC]">昵称</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="你的昵称"
                className="border-[#30363D] bg-[#0D1117] text-[#F0F6FC] placeholder:text-[#484F58]"
                {...register("nickname")}
                onFocus={clearError}
              />
              {errors.nickname && (
                <p className="text-xs text-red-400">{errors.nickname.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F0F6FC]">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="border-[#30363D] bg-[#0D1117] text-[#F0F6FC] placeholder:text-[#484F58]"
                {...register("email")}
                onFocus={clearError}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#F0F6FC]">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="至少 8 位，包含字母和数字"
                className="border-[#30363D] bg-[#0D1117] text-[#F0F6FC] placeholder:text-[#484F58]"
                {...register("password")}
                onFocus={clearError}
              />
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]"
            >
              {loading ? "注册中..." : "注册"}
            </Button>

            <p className="text-center text-sm text-[#8B949E]">
              已有账户？{" "}
              <Link href="/login" className="text-[#3B82F6] hover:underline">
                登录
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
