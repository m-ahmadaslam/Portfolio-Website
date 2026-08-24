import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 600,
            letterSpacing: -3,
            color: "#ececf2",
          }}
        >
          MA
        </div>
        <div
          style={{
            marginTop: 8,
            width: 62,
            height: 8,
            borderRadius: 4,
            background: "#7c5cff",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
