import type { Metadata } from "next";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";
import { Container, PageHeader } from "@/components/ui/primitives";
import { publishedProjects } from "@/content/projects";
import { getDictionary } from "@/i18n";
import { type Locale, routes } from "@/i18n/config";
import { buildMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const m = getDictionary(locale).meta.pages.projects;
  return buildMetadata({ locale, path: routes.projects, title: m.title, description: m.description });
}

export default async function ProjectsPage({ params }: Params) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return (
    <>
      <PageHeader eyebrow={dict.nav.projects} title={dict.projects.title} lead={dict.projects.lead} />
      <Container className="pb-28">
        <ProjectExplorer
          projects={publishedProjects}
          locale={locale}
          labels={{
            categories: dict.categories,
            status: dict.status,
            common: dict.common,
            sections: {
              flagship: dict.projects.flagship,
              supporting: dict.projects.supporting,
              inDevelopment: dict.projects.inDevelopment,
              inDevelopmentLead: dict.projects.inDevelopmentLead,
              planned: dict.projects.planned,
            },
            filterLabel: dict.projects.filterLabel,
            techFilterLabel: dict.projects.techFilterLabel,
            anyTech: dict.projects.anyTech,
            noResults: dict.projects.noResults,
            countOne: locale === "de" ? "Projekt" : "project",
            countMany: locale === "de" ? "Projekte" : "projects",
          }}
        />
      </Container>
    </>
  );
}
