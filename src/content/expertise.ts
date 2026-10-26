import type { Domain, SkillGroup } from "./types";

const l = (en: string, de: string) => ({ en, de });

/** The six domains on the homepage. */
export const domains: Domain[] = [
  {
    id: "embedded",
    glyph: "chip",
    title: l("Embedded Systems & Industrial IoT", "Embedded Systems & Industrial IoT"),
    description: l(
      "Sensors, microcontrollers and firmware that make physical equipment observable.",
      "Sensoren, Mikrocontroller und Firmware, die physische Geräte beobachtbar machen.",
    ),
    technologies: ["ESP32", "C/C++", "PlatformIO", "Modbus TCP", "Sensors"],
    projects: ["esp32-analog-gauge-reader", "glovebox-monitoring"],
  },
  {
    id: "infrastructure",
    glyph: "stack",
    title: l("Infrastructure & DevOps", "Infrastruktur & DevOps"),
    description: l(
      "Virtualization, containers, reverse proxies and backups - operated, not just installed.",
      "Virtualisierung, Container, Reverse Proxies und Backups - betrieben, nicht nur installiert.",
    ),
    technologies: ["Proxmox", "Docker", "Nginx", "Linux", "rsync"],
    projects: ["proxmox-self-hosted-infrastructure"],
  },
  {
    id: "monitoring",
    glyph: "pulse",
    title: l("Monitoring & Automation", "Monitoring & Automatisierung"),
    description: l(
      "Dashboards, workflows and alerts that people actually want to receive.",
      "Dashboards, Workflows und Alarme, die Menschen tatsächlich bekommen wollen.",
    ),
    technologies: ["Grafana", "Node-RED", "Health checks", "Python", "Bash"],
    projects: ["monitoring-automation", "lab-gas-monitoring"],
  },
  {
    id: "software",
    glyph: "code",
    title: l("Software & Research IT", "Software & Forschungs-IT"),
    description: l(
      "Tools, data pipelines and documentation for a scientific environment.",
      "Werkzeuge, Datenpipelines und Dokumentation für ein wissenschaftliches Umfeld.",
    ),
    technologies: ["Python", "JSON", "Git", "MediaWiki", "APIs"],
    projects: ["labjournal-data-pipeline", "technical-knowledge-base"],
  },
  {
    id: "hpc-ai",
    glyph: "cluster",
    title: l("HPC & Applied AI", "HPC & angewandte KI"),
    description: l(
      "Compute environments for chemistry and first steps toward local, private AI.",
      "Rechenumgebungen für die Chemie und erste Schritte zu lokaler, privater KI.",
    ),
    technologies: ["Slurm", "ORCA", "xTB", "GPU", "RAG"],
    projects: ["hpc-scientific-computing", "local-ai-rag"],
  },
  {
    id: "operations",
    glyph: "shield",
    title: l("Technical Operations & Reliability", "Technischer Betrieb & Zuverlässigkeit"),
    description: l(
      "Endpoint management, patching and calm, evidence-based incident work.",
      "Client-Verwaltung, Patches und ruhige, beweisorientierte Störungsarbeit.",
    ),
    technologies: ["OPSI", "Active Directory", "GlassFish", "systemd", "TLS"],
    projects: ["lab-systems-reliability", "centralized-software-deployment"],
  },
];

/** Expertise page: grouped by domain, each technology tagged with the kind of evidence behind it. */
export const skillGroups: SkillGroup[] = [
  {
    id: "embedded",
    title: l("Embedded & IoT", "Embedded & IoT"),
    description: l(
      "From choosing a sensor to the firmware that reads it and the network it reports to.",
      "Von der Sensorauswahl über die Firmware, die ihn ausliest, bis zum Netzwerk, an das er meldet.",
    ),
    items: [
      { name: "ESP32", level: "professional" },
      { name: "ESP32-CAM", level: "professional" },
      { name: "C/C++", level: "professional" },
      { name: "PlatformIO", level: "professional" },
      { name: "Sensor integration", level: "professional" },
      { name: "Embedded web interfaces", level: "professional" },
      { name: "ESP32-C3 + Ethernet", level: "project" },
      { name: "DS18B20 / 1-Wire", level: "project" },
      { name: "Modbus TCP", level: "exploring" },
    ],
    projects: ["esp32-analog-gauge-reader", "embedded-firmware", "esp32-temperature-monitoring", "glovebox-monitoring"],
  },
  {
    id: "software",
    title: l("Software Development", "Softwareentwicklung"),
    description: l(
      "Practical software: scripts, integrations, data processing and small web interfaces.",
      "Praktische Software: Skripte, Integrationen, Datenverarbeitung und kleine Weboberflächen.",
    ),
    items: [
      { name: "Python", level: "professional" },
      { name: "Bash", level: "professional" },
      { name: "JSON / data transformation", level: "professional" },
      { name: "Git / GitLab", level: "professional" },
      { name: "HTML / CSS / JavaScript", level: "project" },
      { name: "TypeScript", level: "project" },
      { name: "API integration", level: "exploring" },
    ],
    projects: ["automation-scripting", "labjournal-data-pipeline", "git-workflows"],
  },
  {
    id: "infrastructure",
    title: l("Infrastructure", "Infrastruktur"),
    description: l(
      "Servers, virtualization, directories and deployment for a working research group.",
      "Server, Virtualisierung, Verzeichnisdienste und Softwareverteilung für eine arbeitende Forschungsgruppe.",
    ),
    items: [
      { name: "Linux (Ubuntu)", level: "professional" },
      { name: "Windows", level: "professional" },
      { name: "Proxmox VE", level: "professional" },
      { name: "Docker / Compose", level: "professional" },
      { name: "Nginx / Nginx Proxy Manager", level: "professional" },
      { name: "DNS / DHCP / VPN", level: "professional" },
      { name: "Active Directory / GPO", level: "professional" },
      { name: "OPSI", level: "professional" },
      { name: "QNAP / TrueNAS / rsync", level: "professional" },
    ],
    projects: ["proxmox-self-hosted-infrastructure", "centralized-software-deployment", "network-systems-administration"],
  },
  {
    id: "monitoring",
    title: l("Monitoring & Automation", "Monitoring & Automatisierung"),
    description: l(
      "Making systems observable and letting them speak up at the right moment.",
      "Systeme beobachtbar machen und sie im richtigen Moment zu Wort kommen lassen.",
    ),
    items: [
      { name: "Grafana", level: "professional" },
      { name: "Node-RED", level: "professional" },
      { name: "HTTP health checks", level: "professional" },
      { name: "Alerting design", level: "professional" },
      { name: "cron / systemd timers", level: "professional" },
      { name: "GlassFish / JVM diagnostics", level: "professional" },
    ],
    projects: ["monitoring-automation", "lab-gas-monitoring", "lab-systems-reliability"],
  },
  {
    id: "research",
    title: l("Research Computing", "Wissenschaftliches Rechnen"),
    description: l(
      "Supporting the infrastructure that computational chemistry runs on.",
      "Unterstützung der Infrastruktur, auf der Computerchemie läuft.",
    ),
    items: [
      { name: "Slurm", level: "professional" },
      { name: "ORCA", level: "professional" },
      { name: "xTB", level: "professional" },
      { name: "Research data integration", level: "project" },
    ],
    projects: ["hpc-scientific-computing", "labjournal-data-pipeline"],
  },
  {
    id: "ai",
    title: l("Applied AI", "Angewandte KI"),
    description: l(
      "AI as an engineering tool - locally hosted where data must stay in-house.",
      "KI als Engineering-Werkzeug - lokal betrieben, wo Daten im Haus bleiben müssen.",
    ),
    items: [
      { name: "AI-assisted development", level: "professional" },
      { name: "Local LLM infrastructure", level: "exploring" },
      { name: "Retrieval-augmented generation", level: "exploring" },
      { name: "GPU workstation planning", level: "exploring" },
    ],
    projects: ["local-ai-rag", "gpu-ai-workstation"],
  },
];
