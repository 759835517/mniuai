import { HeroSection } from "@/components/home/HeroSection";
import { UserGroupGrid } from "@/components/home/UserGroupGrid";
import { GuaranteeStrip } from "@/components/home/GuaranteeStrip";
import { HotCourses } from "@/components/home/HotCourses";
import { SuccessCarousel } from "@/components/home/SuccessCarousel";
import { TrustBadges } from "@/components/home/TrustBadges";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "萌牛AI - AI赋能全社会，让每个人用AI提升工作与生活",
  description:
    "萌牛AI服务程序员、少儿、大学生、教师、自媒体等多个社会群体，对赌协议保障学习效果，学不会全额退款。",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <UserGroupGrid />
      <GuaranteeStrip />
      <HotCourses />
      <SuccessCarousel />
    </>
  );
}
