import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Em modo de demonstração nada deve ser indexado.
  if (site.demoMode) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
