import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "문장 사이 · 나의 독서",
  description: "기록과 질문으로 이어지는 나만의 독서 공간",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}

