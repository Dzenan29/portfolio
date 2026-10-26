import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/metadata";

export const dynamic = "force-static";

// Note: on GitHub Pages project sites (user.github.io/portfolio) crawlers only read
// robots.txt from the domain root. This file takes effect once the site runs on its own domain;
// the sitemap is also referenced from every page via <link rel="alternate">.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
