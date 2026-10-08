"use client";
import { DispatcherLayout } from "@/components/layout/DispatcherLayout";

export default function DispatcherRootLayout({ children }: { children: React.ReactNode }) {
  return <DispatcherLayout>{children}</DispatcherLayout>;
}
