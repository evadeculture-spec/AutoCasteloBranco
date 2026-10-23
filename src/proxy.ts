import { NextResponse, type NextRequest } from "next/server";
import { vehicles } from "@/data/vehicles";

/**
 * Responde 404 a viaturas inexistentes antes de a página começar a ser
 * transmitida (dentro do streaming, o código já não pode passar a 404).
 * Ao ligar o inventário a uma base de dados, trocar esta verificação por
 * uma consulta leve (ou cache de slugs).
 */
const slugs = new Set(vehicles.map((v) => v.slug));

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !slugs.has(decodeURIComponent(slug))) {
    // Reescrever para um caminho sem rota (página 404) e impor o estado 404 explicitamente:
    // na Vercel, a página 404 pré-renderizada seria servida com 200 sem esta indicação.
    return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/viaturas/:slug",
};
