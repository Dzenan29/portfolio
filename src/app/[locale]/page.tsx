import type { Metadata } from "next";
import {
  AboutTeaser,
  ContactCta,
  EndToEnd,
  EngineeringDomains,
  EngineeringHero,
  ExperienceTeaser,
  FeaturedWork,
  InfrastructureSection,
} from "@/components/home/HomeSections";
import { site } from "@/content/site";
import { getDictionary } from "@/i18n";
import { type Locale, localePath } from "@/i18n/config";
import { absoluteUrl, buildMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/", type: "profile" });
}

export default async function HomePage({ params }: Params) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const sameAs = [site.contact.github, site.contact.linkedin].filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: absoluteUrl(localePath(locale, "/")),
    jobTitle: locale === "de" ? "IT-Systems- & Software-Engineer" : "IT Systems & Software Engineer",
    address: { "@type": "PostalAddress", addressLocality: "Dortmund", addressCountry: "DE" },
    knowsAbout: ["Embedded Systems", "Industrial IoT", "ESP32", "Linux Administration", "DevOps", "Monitoring", "Research IT"],
    knowsLanguage: ["de", "en", "it", "bs"],
    sameAs,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EngineeringHero locale={locale} dict={dict} />
      <EngineeringDomains locale={locale} dict={dict} />
      <FeaturedWork locale={locale} dict={dict} />
      <EndToEnd locale={locale} dict={dict} />
      <InfrastructureSection locale={locale} dict={dict} />
      <AboutTeaser locale={locale} dict={dict} />
      <ExperienceTeaser locale={locale} dict={dict} />
      <ContactCta locale={locale} dict={dict} />
    </>
  );
}
