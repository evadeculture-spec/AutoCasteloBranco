import { ImageResponse } from "next/og";

export const alt = "Castelo Branco Auto — Viaturas usadas e oficina em Castelo Branco";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de partilha (Open Graph) gerada a partir da identidade, sem fotografias. */
export default function OpengraphImage() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="56" height="56" viewBox="0 0 28 28">
            <path d="M3 25V6h4.5v3.5h4V6h5v3.5h4V6H25v19z" fill="none" stroke="#f3f0eb" strokeWidth="2" />
            <path d="M10 25v-7.5h8V25" fill="#a51e22" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: 1 }}>CASTELO BRANCO</span>
            <span style={{ fontSize: 18, letterSpacing: 10, color: "#9a9fa4" }}>AUTO</span>
          </div>
        </div>
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
