import { ImageResponse } from "next/og";

export const alt = "노대영 | AI-Native Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0c0c0f",
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
              background: "#7c6cfc",
              boxShadow: "0 0 20px #7c6cfc",
            }}
          />
          <span style={{ fontSize: 48, fontWeight: 800, color: "#e8e8f0", letterSpacing: "-0.02em" }}>
            노대영
          </span>
        </div>
        <p style={{ fontSize: 28, color: "#9898b8", margin: 0, lineHeight: 1.4 }}>
          AI-Native Developer
        </p>
        <p style={{ fontSize: 22, color: "#6868a0", margin: "8px 0 0 0", lineHeight: 1.4 }}>
          Claude Code로 만드는 23개의 살아있는 프로젝트
        </p>
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "48px",
            fontSize: 18,
            color: "#6868a0",
          }}
        >
          <span>23 Projects</span>
          <span style={{ color: "#7c6cfc" }}>●</span>
          <span>Daily Pipeline</span>
          <span style={{ color: "#2dd4bf" }}>●</span>
          <span>AI Summaries</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
