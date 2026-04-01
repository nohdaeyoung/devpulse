import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevPulse — AI 개발 대시보드",
  description:
    "Claude Code로 만든 프로젝트들의 실시간 현황과 AI 자동 생성 개발 블로그",
};

function TodayDate() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const day = dayNames[now.getDay()];
  return (
    <span className="text-sm text-text-muted tabular-nums">
      {month}월 {date}일 {day}요일
    </span>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <header className="border-b border-border px-6 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <a href="/" className="text-base font-semibold tracking-tight py-2 -my-2">
              DevPulse
            </a>
            <TodayDate />
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border px-6 py-3 text-center text-xs text-text-muted">
          Built with Claude Code
        </footer>
      </body>
    </html>
  );
}
