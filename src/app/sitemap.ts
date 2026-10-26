import type { MetadataRoute } from "next";
import { publishedProjects } from "@/content/projects";
import { localePath, locales, routes } from "@/i18n/config";
import { absoluteUrl } from "@/lib/metadata";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    routes.home,
    routes.projects,
    routes.expertise,
    routes.about,
    routes.experience,
    routes.lab,
    routes.contact,
    ...publishedProjects.map((p) => routes.project(p.slug)),
  ];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(localePath(l, path))])),
      },
      priority: path === "/" ? 1 : path.startsWith("/projects/") && path !== "/projects/" ? 0.7 : 0.8,
    })),
  );
}
