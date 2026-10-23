import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getVehicles } from "@/lib/inventory";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/viaturas", "/oficina", "/sobre-nos", "/contactos", "/privacidade"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "/viaturas" ? ("daily" as const) : ("monthly" as const),
    priority: path === "" ? 1 : path === "/viaturas" ? 0.9 : 0.6,
  }));
  const vehicles = getVehicles().map((v) => ({
    url: `${site.url}/viaturas/${v.slug}`,
    lastModified: v.listedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  return [...pages, ...vehicles];
}
