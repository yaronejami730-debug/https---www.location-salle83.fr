import type { MetadataRoute } from "next";
import { siteConfig, navItems } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return navItems.map((item) => ({
    url: `${siteConfig.domain}${item.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
