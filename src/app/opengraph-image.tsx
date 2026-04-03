import { ImageResponse } from "next/og";

export const alt = "DevPulse — AI 개발 대시보드";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 20px #10b981",
            }}
          />
          <span style={{ fontSize: 48, fontWeight: 700, color: "#fafafa", letterSpacing: "-0.02em" }}>
            DevPulse
          </span>
        </div>
        <p style={{ fontSize: 28, color: "#a3a3a3", margin: 0, lineHeight: 1.4 }}>
          Claude Code로 만든 프로젝트들의 실시간 현황과
        </p>
        <p style={{ fontSize: 28, color: "#a3a3a3", margin: 0, lineHeight: 1.4 }}>
          AI 자동 생성 개발 블로그
        </p>
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "48px",
            fontSize: 18,
            color: "#737373",
          }}
        >
          <span>20+ Projects</span>
          <span style={{ color: "#10b981" }}>●</span>
          <span>Daily Pipeline</span>
          <span style={{ color: "#10b981" }}>●</span>
          <span>AI Summaries</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
