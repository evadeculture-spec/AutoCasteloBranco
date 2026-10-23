import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { MobileContactBar } from "@/components/layout/MobileContactBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/config/site";
import { organizationJsonLd } from "@/lib/seo";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Viaturas usadas e oficina em Castelo Branco`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  // Em modo de demonstração o site não deve ser indexado.
  robots: site.demoMode ? { index: false, follow: false } : { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#111213",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = organizationJsonLd();
  return (
    <html lang="pt-PT" className={`${archivo.variable} ${instrument.variable} ${plexMono.variable}`}>
      <body className="flex min-h-svh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-[100] bg-accent px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Saltar para o conteúdo
        </a>
        <DemoBanner />
        <SiteHeader />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <MobileContactBar />
        {jsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        )}
      </body>
    </html>
  );
}
