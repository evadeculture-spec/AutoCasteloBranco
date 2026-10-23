import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Auto Castelo Branco — Viaturas usadas e oficina em Castelo Branco";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de partilha (Open Graph) gerada a partir da identidade, sem fotografias. */
export default async function OpengraphImage() {
  const png = await readFile(join(process.cwd(), "public/brand/logo-light.png"));
  const logo = `data:image/png;base64,${png.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(180deg, #111213 0%, #1e2124 100%)",
          color: "#f3f0eb",
          fontFamily: "sans-serif",
        }}
      >
        <img src={logo} alt="" width={520} height={102} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.02 }}>Confiança na estrada.</span>
          <span style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.02, color: "#9a9fa4" }}>Rigor em cada detalhe.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#cfcbc4" }}>
          <span>Viaturas usadas · Oficina</span>
          <span>Castelo Branco, Portugal</span>
        </div>
      </div>
    ),
    size,
  );
}
