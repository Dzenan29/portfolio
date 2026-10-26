import type { ExperienceEntry } from "./types";

const l = (en: string, de: string) => ({ en, de });

/**
 * Professional positions, most recent first.
 * Entries marked "needs-review" use details from the previous version of the portfolio and
 * must be confirmed (title, employer, dates) - see VERIFICATION.md.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "rub",
    role: l("IT Administration / Research IT", "IT-Administration / Forschungs-IT"),
    organization: l(
      "Ruhr-Universität Bochum · organic chemistry research group",
      "Ruhr-Universität Bochum · Arbeitsgruppe Organische Chemie",
    ),
    location: l("Bochum, Germany", "Bochum"),
    start: "2022-11",
    end: null,
    focus: [
      l("Administration of Windows and Linux workstations and servers", "Administration von Windows- und Linux-Arbeitsplätzen und -Servern"),
      l("IT for research equipment and support of scientific applications", "IT für Forschungsgeräte und Betreuung wissenschaftlicher Anwendungen"),
      l("Virtualization, containerized services, deployment and backups", "Virtualisierung, containerisierte Dienste, Softwareverteilung und Backups"),
      l("Monitoring, automation and sensor integration for lab infrastructure", "Monitoring, Automatisierung und Sensorintegration für die Laborinfrastruktur"),
      l("Troubleshooting and technical documentation", "Fehlersuche und technische Dokumentation"),
    ],
    technologies: ["Linux", "Windows", "Proxmox", "Docker", "Active Directory", "OPSI", "Grafana", "Node-RED", "ESP32", "Python"],
    verification: "needs-review",
    reviewNote: "Start date per brief (Nov 2022); the previous site said 2023. Group-wide work is phrased as contribution, not sole ownership.",
  },
  {
    id: "freelance",
    role: l("Freelance Web Developer & Logistics", "Freiberuflicher Webentwickler & Logistik"),
    organization: l("Self-employed · part-time warehouse work", "Selbstständig · Teilzeit in der Logistik"),
    location: l("Dortmund, Germany", "Dortmund"),
    start: "2020",
    end: "2022",
    focus: [
      l("Relocated to Germany and studied German intensively alongside work", "Umzug nach Deutschland und intensives Deutschlernen neben der Arbeit"),
      l("Websites for local businesses: themes, hosting setup, client handover", "Websites für lokale Unternehmen: Themes, Hosting-Einrichtung, Übergabe an Kunden"),
    ],
    technologies: ["HTML", "CSS", "JavaScript", "WordPress"],
    verification: "needs-review",
    reviewNote: "Taken from the previous site; not part of the brief. Confirm or remove.",
  },
  {
    id: "dainese",
    role: l("IT System Administrator", "IT-Systemadministrator"),
    organization: l("Dainese", "Dainese"),
    location: l("Italy", "Italien"),
    start: "2019",
    end: "2020",
    focus: [
      l("IT support for internal teams and client-facing departments", "IT-Support für interne Teams und kundennahe Abteilungen"),
      l("Network infrastructure, workstations and VoIP", "Netzwerkinfrastruktur, Arbeitsplätze und VoIP"),
    ],
    verification: "needs-review",
    reviewNote: "Title, dates and legal entity from the previous site. Confirm.",
  },
  {
    id: "hotel",
    role: l("IT Systems Manager", "IT-Systemverantwortlicher"),
    organization: l("Hotel & spa resort", "Hotel- & Spa-Resort"),
    location: l("Tuscany, Italy", "Toskana, Italien"),
    start: "2018",
    end: "2019",
    focus: [
      l("Network, servers and guest-service systems of the hotel", "Netzwerk, Server und Gästesysteme des Hotels"),
      l("Incidents across networking, printing, telephony and access systems", "Störungen in Netzwerk, Druck, Telefonie und Zugangssystemen"),
      l("Coordination with vendors", "Abstimmung mit Dienstleistern"),
    ],
    verification: "needs-review",
    reviewNote: "Employer name intentionally generic until confirmed (previous site: ADLER Spa Resort THERMAE, 2018-2019).",
  },
  {
    id: "bank",
    role: l("Junior Backend Developer · internship", "Junior-Backend-Entwickler · Praktikum"),
    organization: l("Banking sector · R&D department", "Bankensektor · Forschung & Entwicklung"),
    location: l("Siena, Italy", "Siena, Italien"),
    start: "2018",
    end: "2018",
    focus: [
      l("Backend logic for internal R&D prototypes", "Backend-Logik für interne F&E-Prototypen"),
      l("Collaboration with analysts and researchers", "Zusammenarbeit mit Analysten und Forschenden"),
    ],
    verification: "needs-review",
    reviewNote: "Employer and stack intentionally not named until confirmed.",
  },
];

export const education = {
  title: l("Computer Science (studies in progress)", "Informatik (Studium laufend)"),
  institution: l("Fachhochschule Dortmund", "Fachhochschule Dortmund"),
  location: l("Dortmund, Germany", "Dortmund"),
};

export const languages = [
  { name: l("German", "Deutsch"), level: l("Professional working proficiency (C1)", "Verhandlungssicher (C1)") },
  { name: l("English", "Englisch"), level: l("Fluent", "Fließend") },
  { name: l("Italian", "Italienisch"), level: l("Native", "Muttersprache") },
  { name: l("Bosnian / Serbo-Croatian", "Bosnisch / Serbokroatisch"), level: l("Native", "Muttersprache") },
];
