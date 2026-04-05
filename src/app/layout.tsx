import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { ScrollProgress } from "@/components/ScrollProgress";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://devpulse-ebon.vercel.app"),
  title: "노대영 | AI-Native Developer",
  description:
    "23개 프로젝트를 Claude Code로 개발하는 솔로 개발자의 살아있는 포트폴리오",
};

function TodayDate() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const month = kst.getUTCMonth() + 1;
  const date = kst.getUTCDate();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const day = dayNames[kst.getUTCDay()];
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
      style={{ colorScheme: "dark" }}
      className={`${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <ScrollProgress />
        <header className="sticky top-0 z-50 border-b border-border backdrop-blur-md bg-bg-primary/80 px-6 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between h-6">
            <a href="/" className="text-base font-semibold tracking-tight py-2 -my-2">
              DevPulse
            </a>
            <TodayDate />
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border px-6 py-6 text-center text-xs text-text-muted">
          Built with Claude Code
        </footer>
      </body>
    </html>
  );
}
