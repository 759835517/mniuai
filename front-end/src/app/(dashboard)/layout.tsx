"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0D1117]">
        <Sidebar />
        <div className="lg:pl-64">
          <Header />
          <main className="px-4 py-6 pb-20 sm:px-6 lg:px-8 lg:pb-6">
            {children}
          </main>
          <MobileNav />
        </div>
      </div>
    </AuthGuard>
  );
}
