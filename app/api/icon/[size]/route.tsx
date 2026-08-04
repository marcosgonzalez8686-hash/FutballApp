import { ImageResponse } from "next/og";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size } = await params;
  const s = parseInt(size, 10) || 192;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#15803d",
          color: "white",
          fontWeight: 700,
          fontFamily: "sans-serif",
          fontSize: Math.round(s * 0.42),
        }}
      >
        CF
      </div>
    ),
    { width: s, height: s }
  );
}
