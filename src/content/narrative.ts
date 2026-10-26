const l = (en: string, de: string) => ({ en, de });

/** SENSE → OPERATE */
export const pipeline = [
  {
    id: "sense",
    verb: l("Sense", "Erfassen"),
    text: l(
      "Choosing and interfacing sensors - or reading the gauge that's already there.",
      "Sensoren auswählen und anbinden - oder das Manometer lesen, das schon da ist.",
    ),
    tech: ["Sensors", "ESP32-CAM", "DS18B20", "Modbus TCP"],
  },
  {
    id: "process",
    verb: l("Process", "Verarbeiten"),
    text: l(
      "Firmware that filters, calibrates and turns signals into values with units.",
      "Firmware, die filtert, kalibriert und Signale in Werte mit Einheit verwandelt.",
    ),
    tech: ["C/C++", "PlatformIO", "Calibration"],
  },
  {
    id: "connect",
    verb: l("Connect", "Verbinden"),
    text: l(
      "Getting data off the device reliably: Wi-Fi or Ethernet, HTTP or MQTT.",
      "Daten zuverlässig vom Gerät holen: WLAN oder Ethernet, HTTP oder MQTT.",
    ),
    tech: ["HTTP", "MQTT", "Ethernet", "DNS"],
  },
  {
    id: "automate",
    verb: l("Automate", "Automatisieren"),
    text: l(
      "Rules and workflows that decide, notify and recover without a human in the loop.",
      "Regeln und Workflows, die entscheiden, benachrichtigen und sich erholen - ohne Mensch dazwischen.",
    ),
    tech: ["Node-RED", "Python", "Bash", "cron"],
  },
  {
    id: "visualize",
    verb: l("Visualize", "Visualisieren"),
    text: l(
      "Dashboards that show the trend, not just the number.",
      "Dashboards, die den Verlauf zeigen, nicht nur die Zahl.",
    ),
    tech: ["Grafana", "Time series"],
  },
  {
    id: "operate",
    verb: l("Operate", "Betreiben"),
    text: l(
      "The servers, containers, backups and updates underneath - kept running.",
      "Die Server, Container, Backups und Updates darunter - am Laufen gehalten.",
    ),
    tech: ["Proxmox", "Docker", "Linux", "rsync"],
  },
];

export const infraCapabilities = [
  { title: l("Virtualization", "Virtualisierung"), text: l("Three-node Proxmox environment, Linux VMs", "Proxmox mit drei Knoten, Linux-VMs") },
  { title: l("Containers", "Container"), text: l("Docker Compose deployments, upgrades, troubleshooting", "Docker-Compose-Bereitstellung, Upgrades, Fehlersuche") },
  { title: l("Backups", "Backups"), text: l("Scheduled rsync to NAS; mirrors vs. versions", "Geplantes rsync auf NAS; Spiegel vs. Versionen") },
  { title: l("Deployment", "Softwareverteilung"), text: l("OPSI packages, AD groups, pilot GPOs", "OPSI-Pakete, AD-Gruppen, Pilot-GPOs") },
  { title: l("Monitoring", "Monitoring"), text: l("Grafana dashboards, HTTP health checks", "Grafana-Dashboards, HTTP-Health-Checks") },
  { title: l("Alerting", "Alarmierung"), text: l("Persistent-failure detection, recovery notices", "Erkennung anhaltender Ausfälle, Entwarnungen") },
  { title: l("Secure access", "Sicherer Zugriff"), text: l("Reverse proxy, TLS, DNS, VPN", "Reverse Proxy, TLS, DNS, VPN") },
];

export const processSteps = [
  { verb: l("Understand", "Verstehen"), text: l("Talk to the people with the problem. Look at the equipment.", "Mit den Betroffenen sprechen. Das Gerät ansehen.") },
  { verb: l("Design", "Entwerfen"), text: l("Draw the boundaries: what is measured, where it goes, who acts.", "Grenzen ziehen: Was wird gemessen, wohin geht es, wer handelt.") },
  { verb: l("Prototype", "Prototyp"), text: l("Build the smallest thing that proves the idea.", "Das Kleinste bauen, das die Idee beweist.") },
  { verb: l("Integrate", "Integrieren"), text: l("Connect it to the systems that already exist.", "An die Systeme anbinden, die es schon gibt.") },
  { verb: l("Validate", "Prüfen"), text: l("Compare against reality. Write down what was not tested.", "Mit der Realität abgleichen. Festhalten, was nicht getestet wurde.") },
  { verb: l("Operate", "Betreiben"), text: l("Monitor it, document it, keep it updated.", "Überwachen, dokumentieren, aktuell halten.") },
];

export const about = {
  intro: l(
    "I'm Dzenan. I work where hardware, software and infrastructure meet.",
    "Ich bin Dzenan. Ich arbeite dort, wo Hardware, Software und Infrastruktur aufeinandertreffen.",
  ),
  paragraphs: [
    l(
      "Since November 2022 I've been part of the IT side of an organic chemistry research group at Ruhr-Universität Bochum. Next to that, I study Computer Science at FH Dortmund. The work is wonderfully broad: one day it's a Proxmox host or a GlassFish thread dump, the next it's an ESP32 with a camera pointed at a pressure gauge.",
      "Seit November 2022 bin ich auf der IT-Seite einer Arbeitsgruppe für Organische Chemie an der Ruhr-Universität Bochum tätig. Daneben studiere ich Informatik an der FH Dortmund. Die Arbeit ist herrlich breit: An einem Tag ist es ein Proxmox-Host oder ein GlassFish-Thread-Dump, am nächsten eine ESP32 mit Kamera vor einem Manometer.",
    ),
    l(
      "My path wasn't a straight line. I started in IT support and system administration in Italy, moved to Germany, learned the language and built websites before landing in research IT. What connects all of it is curiosity about how systems actually work - down to the signal on the wire.",
      "Mein Weg war keine gerade Linie. Ich habe in Italien mit IT-Support und Systemadministration begonnen, bin nach Deutschland gezogen, habe die Sprache gelernt und Websites gebaut, bevor ich in der Forschungs-IT angekommen bin. Was alles verbindet, ist Neugier darauf, wie Systeme wirklich funktionieren - bis hinunter zum Signal auf der Leitung.",
    ),
    l(
      "In practice that means: when a gauge can only be read by walking past it, I build a reader. When a service fails at night, I want to know why. And when something works, I document it so it keeps working without me.",
      "In der Praxis heißt das: Wenn ein Manometer nur im Vorbeigehen ablesbar ist, baue ich einen Leser. Wenn ein Dienst nachts ausfällt, will ich wissen, warum. Und wenn etwas funktioniert, dokumentiere ich es, damit es auch ohne mich weiter funktioniert.",
    ),
  ],
  principles: [
    { title: l("Understand before building", "Verstehen vor Bauen"), text: l("The best solution often starts with a better question.", "Die beste Lösung beginnt oft mit einer besseren Frage.") },
    { title: l("Simple beats clever", "Einfach schlägt raffiniert"), text: l("A system someone else can maintain is worth more than an elegant one nobody understands.", "Ein System, das jemand anderes warten kann, ist mehr wert als ein elegantes, das niemand versteht.") },
    { title: l("Measure, don't assume", "Messen statt annehmen"), text: l("Logs, numbers and tests before opinions - and honesty about what wasn't measured.", "Logs, Zahlen und Tests vor Meinungen - und Ehrlichkeit darüber, was nicht gemessen wurde.") },
    { title: l("Leave it documented", "Dokumentiert hinterlassen"), text: l("Runbooks and wikis turn individual knowledge into team knowledge.", "Runbooks und Wikis machen aus Einzelwissen Teamwissen.") },
  ],
  beyond: l(
    "Outside of work I design and 3D-print practical things - mounts, enclosures and small everyday tools.",
    "Außerhalb der Arbeit konstruiere und drucke ich praktische Dinge in 3D - Halterungen, Gehäuse und kleine Alltagshelfer.",
  ),
};
