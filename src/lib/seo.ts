import type { Metadata } from "next";
import { site } from "@/config/site";

/** Metadados por página, com Open Graph e URL canónico coerentes. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string | { absolute: string };
  description: string;
  path: string;
}): Metadata {
  const full = typeof title === "string" ? `${title} · ${site.name}` : title.absolute;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: full, description, url: path, type: "website", locale: site.locale, siteName: site.name },
    twitter: { card: "summary_large_image", title: full, description },
  };
}

/**
 * Dados estruturados de negócio local — APENAS com dados reais.
 * Só é gerado quando o site não está em demonstração e existem morada
 * validada e pelo menos um contacto. Nunca inclui avaliações.
 */
export function organizationJsonLd() {
  if (site.demoMode || !site.address.isValidated || !(site.contact.phone || site.contact.email)) return null;
  return {
    "@context": "https://schema.org",
    "@type": ["AutoDealer", "AutoRepair"],
    name: site.name,
    url: site.url,
    ...(site.contact.phone && { telephone: site.contact.phone }),
    ...(site.contact.email && { email: site.contact.email }),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode ?? undefined,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: { "@type": "City", name: "Castelo Branco" },
  };
}
