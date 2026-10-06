import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudioFlow — Tối ưu Prompt & Prompt Repair",
  description: "Tối ưu prompt theo nhiều lĩnh vực, sao chép để dùng với AI và cải thiện bằng Prompt Repair Loop.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
