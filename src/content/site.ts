/**
 * Personal and contact configuration. Edit here - every page reads from this file.
 * Leave a value as `null` to hide the corresponding link everywhere (no broken links).
 */
export const site = {
  name: "Dzenan Kusi",
  location: { en: "Dortmund, Germany", de: "Dortmund, Deutschland" },
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://dzenan29.github.io/portfolio").replace(/\/$/, ""),
  contact: {
    email: "dzenankusi00@gmail.com" as string | null,
    github: "https://github.com/Dzenan29" as string | null,
    linkedin: "https://de.linkedin.com/in/dzenan-kusi-752a98217" as string | null,
    /** Path inside /public. REVIEW: the PDF predates this redesign - replace it with a current CV. */
    resume: null as string | null,
  },
  /** Optional form-delivery endpoint (see .env.example). No endpoint = no form is shown. */
  contactFormEndpoint: process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT || null,
} as const;
