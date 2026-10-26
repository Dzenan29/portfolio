import type { Project } from "./types";

const l = (en: string, de: string) => ({ en, de });

/**
 * Project inventory.
 *
 * Rules for editing:
 * - `publish: false` keeps an entry completely off the website.
 * - `verification: "needs-review"` marks text drafted from the brief that Dzenan still has to
 *   read and confirm. See VERIFICATION.md for the open points.
 * - Never put real hostnames, IPs, internal URLs, colleague names or confidential data here.
 */
export const projects: Project[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // Flagship case studies
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "A1",
    slug: "esp32-analog-gauge-reader",
    tier: "flagship",
    category: "embedded",
    status: "completed",
    verification: "needs-review",
    publish: true,
    featured: true,
    context: "professional",
    title: l("ESP32 Analog Gauge Digitization", "Digitalisierung analoger Manometer mit ESP32"),
    summary: l(
      "A camera-based reader that turns the needle of an analog pressure gauge into a digital value - on a microcontroller, without replacing the gauge.",
      "Ein kamerabasierter Leser, der den Zeiger eines analogen Manometers in einen digitalen Wert übersetzt - auf einem Mikrocontroller, ohne das Manometer zu tauschen.",
    ),
    problem: l(
      "Important pressures were only visible on analog dials. Someone had to walk by and look.",
      "Wichtige Drücke waren nur auf analogen Zeigern sichtbar. Jemand musste vorbeigehen und nachsehen.",
    ),
    solution: l(
      "An ESP32-CAM reads the dial, estimates the needle angle and publishes a calibrated value over the network.",
      "Eine ESP32-CAM liest die Skala, schätzt den Zeigerwinkel und stellt einen kalibrierten Wert im Netzwerk bereit.",
    ),
    role: l("Concept, firmware, web interface, integration", "Konzept, Firmware, Weboberfläche, Integration"),
    technologies: ["ESP32-CAM", "C/C++", "PlatformIO", "Image processing", "HTTP", "Embedded web UI", "Grafana"],
    challenge: l(
      "Many pieces of laboratory and industrial equipment still report their state through analog gauges. Replacing them with digital transmitters means opening pressurized lines, buying certified parts and planning downtime. The question was whether the existing gauge could stay exactly where it is - and simply be read by a machine instead of a person. Commercial camera readers exist, but they were either oversized for the job or too closed to integrate with the monitoring that was already running.",
      "Viele Labor- und Industriegeräte zeigen ihren Zustand noch über analoge Manometer an. Sie durch digitale Transmitter zu ersetzen bedeutet: Druckleitungen öffnen, zertifizierte Teile beschaffen, Stillstand planen. Die Frage war, ob das vorhandene Manometer genau dort bleiben kann, wo es ist - und einfach von einer Maschine statt von einem Menschen abgelesen wird. Kommerzielle Kameraleser gibt es, aber sie waren entweder überdimensioniert oder zu geschlossen, um sie in das bestehende Monitoring einzubinden.",
    ),
    approach: [
      l(
        "Keep the gauge, add a camera. The ESP32-CAM is cheap, small and has Wi-Fi - enough to capture an image, process it locally and send a single number instead of a video stream.",
        "Manometer behalten, Kamera ergänzen. Die ESP32-CAM ist günstig, klein und hat WLAN - genug, um ein Bild aufzunehmen, lokal zu verarbeiten und eine einzelne Zahl statt eines Videostreams zu senden.",
      ),
      l(
        "Measure an angle, not a number. The firmware locates the needle by sampling the image along concentric arcs around the dial centre within a configurable view area. The result is an angle, which is independent of the gauge's printed scale.",
        "Einen Winkel messen, keine Zahl. Die Firmware findet den Zeiger, indem sie das Bild entlang konzentrischer Bögen um die Skalenmitte in einem konfigurierbaren Bildausschnitt abtastet. Das Ergebnis ist ein Winkel - unabhängig von der aufgedruckten Skala.",
      ),
      l(
        "Calibrate per gauge. Two reference angles are mapped to known values; readings in between are interpolated linearly. The same firmware therefore works for different ranges and units.",
        "Pro Manometer kalibrieren. Zwei Referenzwinkel werden bekannten Werten zugeordnet; dazwischen wird linear interpoliert. Dieselbe Firmware funktioniert so für verschiedene Messbereiche und Einheiten.",
      ),
      l(
        "Make it configurable in the field. A small embedded web interface handles camera setup, the view area, Wi-Fi and persistent settings, so nobody needs to reflash the device to mount it somewhere new.",
        "Vor Ort konfigurierbar machen. Eine kleine Embedded-Weboberfläche übernimmt Kamera-Setup, Bildausschnitt, WLAN und dauerhaft gespeicherte Einstellungen - niemand muss das Gerät neu flashen, um es woanders zu montieren.",
      ),
    ],
    architecture: [
      { id: "gauge", kind: "hardware", label: l("Analog gauge", "Analoges Manometer"), detail: l("Unmodified pressure gauge", "Unverändertes Manometer") },
      { id: "camera", kind: "hardware", label: l("Camera", "Kamera"), detail: l("ESP32-CAM module", "ESP32-CAM-Modul") },
      { id: "detect", kind: "firmware", label: l("Image processing", "Bildverarbeitung"), detail: l("Needle angle estimation on-device", "Zeigerwinkel-Schätzung auf dem Gerät") },
      { id: "calibrate", kind: "firmware", label: l("Calibration", "Kalibrierung"), detail: l("Angle → value, per gauge", "Winkel → Wert, pro Manometer") },
      { id: "publish", kind: "network", label: l("Digital reading", "Digitaler Messwert"), detail: l("Exposed over HTTP", "Bereitgestellt über HTTP") },
      { id: "monitor", kind: "ui", label: l("Monitoring", "Monitoring"), detail: l("Dashboards and alert rules", "Dashboards und Alarmregeln") },
    ],
    implementation: [
      {
        title: l("Hardware", "Hardware"),
        items: [
          l("ESP32-CAM module mounted in front of the existing gauge", "ESP32-CAM-Modul vor dem vorhandenen Manometer montiert"),
          l("No modification to the pressurized system", "Keine Änderung am druckführenden System"),
        ],
      },
      {
        title: l("Firmware", "Firmware"),
        items: [
          l("Embedded C/C++, built with PlatformIO", "Embedded C/C++, gebaut mit PlatformIO"),
          l("Image capture and needle detection within the RAM limits of the module", "Bildaufnahme und Zeigererkennung innerhalb der RAM-Grenzen des Moduls"),
          l("Angle-to-value calibration stored in persistent settings", "Winkel-Wert-Kalibrierung in dauerhaft gespeicherten Einstellungen"),
        ],
      },
      {
        title: l("Interfaces", "Schnittstellen"),
        items: [
          l("Embedded web UI: camera setup, view area, Wi-Fi configuration, store/reset settings", "Embedded-Weboberfläche: Kamera-Setup, Bildausschnitt, WLAN-Konfiguration, Einstellungen speichern/zurücksetzen"),
          l("Current angle and value available over HTTP for monitoring services", "Aktueller Winkel und Wert per HTTP für Monitoring-Dienste abrufbar"),
        ],
      },
    ],
    challenges: [
      l(
        "Light is the real enemy. Reflections on the gauge glass and changing ambient light affect detection more than any algorithm detail. Mounting and illumination are part of the design, not an afterthought.",
        "Licht ist der eigentliche Gegner. Spiegelungen im Manometerglas und wechselndes Umgebungslicht beeinflussen die Erkennung stärker als jedes Algorithmusdetail. Montage und Beleuchtung sind Teil des Designs, kein Nachgedanke.",
      ),
      l(
        "A microcontroller forces discipline. Image buffers compete for memory with the web server and networking; the processing has to stay simple and predictable.",
        "Ein Mikrocontroller zwingt zur Disziplin. Bildpuffer konkurrieren mit Webserver und Netzwerk um Speicher; die Verarbeitung muss einfach und vorhersehbar bleiben.",
      ),
      l(
        "A reading is only as good as its calibration. Linear interpolation assumes a linear scale, and the result can never be more precise than the gauge itself. No accuracy figure is claimed here without a documented test series.",
        "Ein Messwert ist nur so gut wie seine Kalibrierung. Lineare Interpolation setzt eine lineare Skala voraus, und das Ergebnis kann nie genauer sein als das Manometer selbst. Ohne dokumentierte Testreihe wird hier keine Genauigkeit behauptet.",
      ),
    ],
    outcomes: [
      l("Analog gauges can be observed remotely without replacing them.", "Analoge Manometer lassen sich aus der Ferne beobachten, ohne sie zu ersetzen."),
      l("Readings feed into the same dashboards and alerting as other sensors.", "Messwerte fließen in dieselben Dashboards und Alarmierungen wie andere Sensoren."),
    ],
    images: [
      {
        src: "/gauge-reader-ui.webp",
        width: 880,
        height: 430,
        alt: l(
          "Embedded web interface of the gauge reader: camera image of a pressure gauge with green sampling arcs and a red line marking the detected needle, above buttons for camera setup, view area, Wi-Fi, store and reset settings.",
          "Embedded-Weboberfläche des Manometerlesers: Kamerabild eines Manometers mit grünen Abtastbögen und roter Linie für den erkannten Zeiger, darüber Schaltflächen für Kamera-Setup, Bildausschnitt, WLAN, Speichern und Zurücksetzen.",
        ),
        caption: l(
          "The device's own web interface. Green arcs: sampling paths; red line: detected needle.",
          "Die Weboberfläche des Geräts. Grüne Bögen: Abtastpfade; rote Linie: erkannter Zeiger.",
        ),
      },
    ],
    demo: "gauge",
    related: ["lab-gas-monitoring", "monitoring-automation", "embedded-firmware"],
    reviewNote:
      "Confirm: professional vs. independent context; whether MQTT is used in this implementation (currently not claimed); permission to publish the screenshot.",
  },
  {
    id: "A2",
    slug: "lab-gas-monitoring",
    tier: "flagship",
    category: "embedded",
    status: "completed",
    verification: "needs-review",
    publish: true,
    featured: true,
    context: "professional",
    title: l("Laboratory Gas Monitoring & Alerting", "Monitoring & Alarmierung der Laborgase"),
    summary: l(
      "Continuous observation of helium and nitrogen supply in a research laboratory: readings, trends, thresholds and automatic notifications.",
      "Kontinuierliche Überwachung der Helium- und Stickstoffversorgung in einem Forschungslabor: Messwerte, Verläufe, Schwellen und automatische Benachrichtigungen.",
    ),
    problem: l(
      "Running low on helium or nitrogen was noticed late - often when an experiment was already affected.",
      "Ein knapper Helium- oder Stickstoffvorrat fiel spät auf - oft erst, wenn ein Experiment schon betroffen war.",
    ),
    solution: l(
      "Gas pressures are read automatically, visualized as trends and checked against thresholds that trigger notifications.",
      "Gasdrücke werden automatisch erfasst, als Verlauf dargestellt und gegen Schwellen geprüft, die Benachrichtigungen auslösen.",
    ),
    role: l("Sensor integration, data flow, dashboards, alert logic", "Sensorintegration, Datenfluss, Dashboards, Alarmlogik"),
    technologies: ["ESP32", "Gauge digitization", "Node-RED", "Grafana", "Threshold alerting", "Linux services"],
    challenge: l(
      "Helium and nitrogen are part of daily work in a chemistry lab. Their supply is visible on gauges and meters, but those don't tell anyone when they cross a critical level. The goal was simple to state: the right people should know early - without staring at a dashboard all day, and without being flooded by alarms.",
      "Helium und Stickstoff gehören im Chemielabor zum Alltag. Ihr Vorrat ist an Manometern und Zählern sichtbar, aber die sagen niemandem Bescheid, wenn ein kritischer Wert unterschritten wird. Das Ziel war einfach formuliert: Die richtigen Leute sollen es früh wissen - ohne den ganzen Tag auf ein Dashboard zu schauen und ohne von Alarmen überflutet zu werden.",
    ),
    approach: [
      l(
        "Reuse what is there. Where gauges are analog, the camera-based reader digitizes them; values from existing instruments are collected where they are available.",
        "Vorhandenes nutzen. Wo Manometer analog sind, digitalisiert sie der kamerabasierte Leser; Werte vorhandener Geräte werden übernommen, wo sie verfügbar sind.",
      ),
      l(
        "Separate observation from decision. Data collection, threshold evaluation and notification are distinct steps, so each can be changed without touching the others.",
        "Beobachtung und Entscheidung trennen. Datenerfassung, Schwellwertprüfung und Benachrichtigung sind eigene Schritte - jeder lässt sich ändern, ohne die anderen anzufassen.",
      ),
      l(
        "Design alerts for humans. Persistent conditions alert, short spikes don't; recovery is reported too, so nobody has to guess whether a problem is still open.",
        "Alarme für Menschen gestalten. Anhaltende Zustände alarmieren, kurze Ausreißer nicht; auch die Entwarnung wird gemeldet, damit niemand raten muss, ob ein Problem noch offen ist.",
      ),
    ],
    architecture: [
      { id: "supply", kind: "hardware", label: l("Gas supply", "Gasversorgung"), detail: l("Pressure indicators on He / N₂", "Druckanzeigen an He / N₂") },
      { id: "reader", kind: "firmware", label: l("Embedded reader", "Embedded-Leser"), detail: l("ESP32-based acquisition", "Erfassung per ESP32") },
      { id: "flow", kind: "service", label: l("Processing", "Verarbeitung"), detail: l("Node-RED flows: validate, evaluate", "Node-RED-Flows: prüfen, bewerten") },
      { id: "store", kind: "data", label: l("Time series", "Zeitreihen"), detail: l("Stored for trends", "Gespeichert für Verläufe") },
      { id: "dash", kind: "ui", label: l("Dashboards", "Dashboards"), detail: l("Grafana panels", "Grafana-Panels") },
      { id: "alert", kind: "ops", label: l("Notifications", "Benachrichtigungen"), detail: l("Threshold alerts and recovery", "Schwellwertalarm und Entwarnung") },
    ],
    implementation: [
      {
        title: l("Data acquisition", "Datenerfassung"),
        items: [
          l("Pressure readings collected automatically at regular intervals", "Druckwerte werden automatisch in regelmäßigen Abständen erfasst"),
          l("Analog indicators digitized with the ESP32 gauge reader", "Analoge Anzeigen mit dem ESP32-Manometerleser digitalisiert"),
        ],
      },
      {
        title: l("Evaluation & alerting", "Bewertung & Alarmierung"),
        items: [
          l("Threshold rules per gas supply", "Schwellwertregeln je Gasversorgung"),
          l("Notifications on threshold crossing and on recovery", "Benachrichtigung bei Überschreitung und bei Entwarnung"),
        ],
      },
      {
        title: l("Visualization", "Visualisierung"),
        items: [
          l("Grafana dashboards for current values and longer-term trends", "Grafana-Dashboards für aktuelle Werte und längerfristige Verläufe"),
          l("Trend view supports planning of refills and spotting unusual consumption", "Verlaufsansicht unterstützt die Planung von Nachfüllungen und das Erkennen ungewöhnlichen Verbrauchs"),
        ],
      },
    ],
    challenges: [
      l(
        "Thresholds are a conversation, not a constant. Useful limits come from the people who work with the gas every day - the system just has to make them easy to change.",
        "Schwellen sind ein Gespräch, keine Konstante. Sinnvolle Grenzen kommen von den Menschen, die täglich mit dem Gas arbeiten - das System muss sie nur leicht änderbar machen.",
      ),
      l(
        "Too many alerts are as bad as none. Filtering short spikes and reporting recovery mattered more than adding channels.",
        "Zu viele Alarme sind so schlecht wie keine. Kurze Ausreißer zu filtern und Entwarnungen zu melden war wichtiger als weitere Kanäle.",
      ),
    ],
    outcomes: [
      l("Gas supply levels are visible remotely, including their history.", "Füllstände der Gasversorgung sind aus der Ferne sichtbar, inklusive Verlauf."),
      l("Low levels are reported automatically instead of being discovered by chance.", "Niedrige Stände werden automatisch gemeldet, statt zufällig entdeckt zu werden."),
    ],
    demo: "iot",
    related: ["esp32-analog-gauge-reader", "monitoring-automation", "glovebox-monitoring"],
    reviewNote: "Confirm which readings are ESP32-based vs. taken from existing instruments, and which notification channel is used (not named on the site).",
  },
  {
    id: "B1",
    slug: "proxmox-self-hosted-infrastructure",
    tier: "flagship",
    category: "infrastructure",
    status: "completed",
    verification: "needs-review",
    publish: true,
    featured: true,
    context: "professional",
    title: l("Proxmox & Self-Hosted Infrastructure", "Proxmox & selbst betriebene Infrastruktur"),
    summary: l(
      "Administration of a three-node Proxmox environment with Linux servers, containerized services, reverse proxy, HTTPS and backups to NAS storage.",
      "Administration einer Proxmox-Umgebung mit drei Knoten: Linux-Server, containerisierte Dienste, Reverse Proxy, HTTPS und Backups auf NAS-Speicher.",
    ),
    problem: l(
      "Useful internal services need somewhere reliable to run - and someone who keeps them patched, reachable and backed up.",
      "Nützliche interne Dienste brauchen einen verlässlichen Ort - und jemanden, der sie aktuell, erreichbar und gesichert hält.",
    ),
    solution: l(
      "Virtual machines on Proxmox host Docker-based services, published through a reverse proxy with TLS and copied to NAS storage.",
      "Virtuelle Maschinen auf Proxmox betreiben Docker-Dienste, veröffentlicht über einen Reverse Proxy mit TLS und gesichert auf NAS-Speicher.",
    ),
    role: l("Operation, deployment, maintenance, troubleshooting", "Betrieb, Bereitstellung, Wartung, Fehlersuche"),
    technologies: ["Proxmox VE", "Linux", "Docker", "Docker Compose", "Nginx Proxy Manager", "TLS", "DNS", "rsync", "QNAP", "TrueNAS"],
    challenge: l(
      "A research group needs more than workstations: a wiki for knowledge, dashboards for equipment, document management, remote support tools. Each service on its own is easy to start. Keeping a dozen of them updated, reachable under clean HTTPS addresses and recoverable after a failure is the actual work.",
      "Eine Forschungsgruppe braucht mehr als Arbeitsplatzrechner: ein Wiki für Wissen, Dashboards für Geräte, Dokumentenverwaltung, Fernwartung. Jeder Dienst für sich ist schnell gestartet. Ein Dutzend davon aktuell zu halten, unter sauberen HTTPS-Adressen erreichbar zu machen und nach einem Ausfall wiederherstellen zu können - das ist die eigentliche Arbeit.",
    ),
    approach: [
      l(
        "Virtualize the hosts, containerize the applications. Proxmox provides isolated Linux VMs; inside them, Docker Compose describes each service so that upgrades and moves are reproducible.",
        "Hosts virtualisieren, Anwendungen containerisieren. Proxmox stellt isolierte Linux-VMs bereit; darin beschreibt Docker Compose jeden Dienst, sodass Upgrades und Umzüge reproduzierbar sind.",
      ),
      l(
        "One entry point. A reverse proxy terminates TLS and routes requests by name, so services don't each need their own certificates and open ports.",
        "Ein Eingangspunkt. Ein Reverse Proxy terminiert TLS und leitet Anfragen nach Namen weiter - Dienste brauchen keine eigenen Zertifikate und offenen Ports.",
      ),
      l(
        "Treat backups as their own system. Data is copied to separate NAS storage on a schedule. Mirrored copies and versioned backups are deliberately distinguished, because a mirror also copies a mistake.",
        "Backups als eigenes System behandeln. Daten werden planmäßig auf separaten NAS-Speicher kopiert. Gespiegelte Kopien und versionierte Backups werden bewusst unterschieden, denn ein Spiegel kopiert auch einen Fehler.",
      ),
    ],
    architecture: [
      { id: "users", kind: "ui", label: l("Users", "Nutzer"), detail: l("Browser access by name", "Browserzugriff per Name") },
      { id: "dns", kind: "network", label: l("DNS", "DNS"), detail: l("Names → proxy", "Namen → Proxy") },
      { id: "proxy", kind: "network", label: l("Reverse proxy", "Reverse Proxy"), detail: l("TLS termination, routing", "TLS-Terminierung, Routing") },
      { id: "vms", kind: "service", label: l("Linux VMs", "Linux-VMs"), detail: l("Docker Compose services", "Docker-Compose-Dienste") },
      { id: "pve", kind: "hardware", label: l("Proxmox cluster", "Proxmox-Cluster"), detail: l("Three hypervisor nodes", "Drei Hypervisor-Knoten") },
      { id: "nas", kind: "data", label: l("NAS backups", "NAS-Backups"), detail: l("Scheduled rsync copies", "Geplante rsync-Kopien") },
    ],
    implementation: [
      {
        title: l("Virtualization", "Virtualisierung"),
        items: [
          l("Operation of a three-node Proxmox VE environment: VMs, resources, storage and network integration", "Betrieb einer Proxmox-VE-Umgebung mit drei Knoten: VMs, Ressourcen, Speicher- und Netzwerkanbindung"),
          l("Host maintenance and updates", "Wartung und Updates der Hosts"),
        ],
      },
      {
        title: l("Services", "Dienste"),
        items: [
          l("Docker / Compose deployments, upgrades and troubleshooting of services such as MediaWiki, Grafana, RustDesk, Paperless-ngx, Immich, Home Assistant and Dockhand", "Docker-/Compose-Bereitstellung, Upgrades und Fehlersuche für Dienste wie MediaWiki, Grafana, RustDesk, Paperless-ngx, Immich, Home Assistant und Dockhand"),
        ],
      },
      {
        title: l("Access & security", "Zugriff & Sicherheit"),
        items: [
          l("Nginx Proxy Manager with HTTPS/TLS certificates", "Nginx Proxy Manager mit HTTPS/TLS-Zertifikaten"),
          l("Domain and DNS configuration for internal service publication", "Domain- und DNS-Konfiguration für die interne Bereitstellung"),
        ],
      },
      {
        title: l("Backup", "Backup"),
        items: [
          l("Scheduled rsync jobs to QNAP and TrueNAS storage", "Geplante rsync-Jobs auf QNAP- und TrueNAS-Speicher"),
          l("Ongoing work on retention and integrity checks", "Laufende Arbeit an Aufbewahrung und Integritätsprüfungen"),
        ],
      },
    ],
    challenges: [
      l(
        "A backup is a hypothesis until a restore proves it. Regular, documented restore tests are the next step - they are not claimed as done.",
        "Ein Backup ist eine Hypothese, bis eine Wiederherstellung sie bestätigt. Regelmäßige, dokumentierte Restore-Tests sind der nächste Schritt - sie werden hier nicht als erledigt behauptet.",
      ),
      l(
        "Three nodes are not automatically high availability. The environment is described as what it is: virtualization with shared operation, not guaranteed failover.",
        "Drei Knoten sind nicht automatisch Hochverfügbarkeit. Die Umgebung wird beschrieben, wie sie ist: Virtualisierung mit gemeinsamem Betrieb, kein garantiertes Failover.",
      ),
    ],
    outcomes: [
      l("Internal services run on a consistent, documented platform.", "Interne Dienste laufen auf einer einheitlichen, dokumentierten Plattform."),
      l("Services are reachable under HTTPS names instead of IP addresses and ports.", "Dienste sind unter HTTPS-Namen statt über IP-Adressen und Ports erreichbar."),
    ],
    demo: "infra",
    related: ["monitoring-automation", "lab-systems-reliability", "security-hardening"],
    reviewNote: "Confirm which services run in the professional environment vs. a personal homelab, and that naming them is fine.",
  },
  {
    id: "C1",
    slug: "monitoring-automation",
    tier: "flagship",
    category: "monitoring",
    status: "completed",
    verification: "needs-review",
    publish: true,
    featured: true,
    context: "professional",
    title: l("Monitoring & Automation Systems", "Monitoring- & Automatisierungssysteme"),
    summary: l(
      "Grafana dashboards, Node-RED workflows and HTTP availability checks that turn raw signals into useful, low-noise notifications.",
      "Grafana-Dashboards, Node-RED-Workflows und HTTP-Verfügbarkeitsprüfungen, die aus Rohsignalen nützliche, ruhige Benachrichtigungen machen.",
    ),
    problem: l(
      "Outages of lab services were noticed by users first. Naive monitoring would have replaced that with alarm fatigue.",
      "Ausfälle von Labordiensten bemerkten zuerst die Nutzer. Naives Monitoring hätte das durch Alarmmüdigkeit ersetzt.",
    ),
    solution: l(
      "Health checks with persistent-failure detection, recovery notifications and quiet hours - plus dashboards for context.",
      "Health-Checks mit Erkennung anhaltender Ausfälle, Entwarnungen und Ruhezeiten - plus Dashboards für den Kontext.",
    ),
    role: l("Design and implementation of flows, checks and dashboards", "Entwurf und Umsetzung von Flows, Checks und Dashboards"),
    technologies: ["Node-RED", "Grafana", "HTTP health checks", "Python", "Bash", "cron", "systemd"],
    challenge: l(
      "Monitoring is easy to switch on and hard to make useful. A check that fires on every timeout trains people to ignore it. The laboratory journal - a web application used throughout the day - needed availability monitoring that alerts when something is really wrong, says when it's fixed, and stays quiet at 3 a.m. unless it matters.",
      "Monitoring ist schnell eingeschaltet und schwer nützlich zu machen. Ein Check, der bei jedem Timeout auslöst, erzieht Menschen dazu, ihn zu ignorieren. Das Laborjournal - eine Webanwendung, die den ganzen Tag genutzt wird - brauchte eine Verfügbarkeitsüberwachung, die bei echten Problemen alarmiert, Entwarnung gibt und um 3 Uhr nachts ruhig bleibt, solange es nicht wichtig ist.",
    ),
    approach: [
      l(
        "Count, don't react. A single failed request is noise; several consecutive failures are a signal. The alert fires once, when the threshold is crossed.",
        "Zählen statt reagieren. Eine einzelne fehlgeschlagene Anfrage ist Rauschen; mehrere aufeinanderfolgende Fehler sind ein Signal. Der Alarm löst einmal aus, wenn die Schwelle überschritten wird.",
      ),
      l(
        "Close the loop. When the service answers again after an alert, a recovery message follows, so the open/closed state is never ambiguous.",
        "Den Kreis schließen. Antwortet der Dienst nach einem Alarm wieder, folgt eine Entwarnung - offen oder erledigt ist nie unklar.",
      ),
      l(
        "Respect time. Notifications can be restricted to defined hours, while the state is still tracked in the background.",
        "Zeit respektieren. Benachrichtigungen lassen sich auf festgelegte Zeiten beschränken, während der Zustand im Hintergrund weiter verfolgt wird.",
      ),
    ],
    architecture: [
      { id: "check", kind: "network", label: l("HTTP check", "HTTP-Check"), detail: l("Scheduled request", "Geplante Anfrage") },
      { id: "count", kind: "service", label: l("Failure counter", "Fehlerzähler"), detail: l("Consecutive failures", "Aufeinanderfolgende Fehler") },
      { id: "state", kind: "service", label: l("State", "Zustand"), detail: l("OK / alerting / recovered", "OK / Alarm / erholt") },
      { id: "window", kind: "service", label: l("Time filter", "Zeitfilter"), detail: l("Notification hours", "Benachrichtigungszeiten") },
      { id: "notify", kind: "ops", label: l("Notification", "Benachrichtigung"), detail: l("Alert or recovery", "Alarm oder Entwarnung") },
      { id: "grafana", kind: "ui", label: l("Dashboards", "Dashboards"), detail: l("Context and history", "Kontext und Verlauf") },
    ],
    implementation: [
      {
        title: l("Availability monitoring", "Verfügbarkeitsüberwachung"),
        items: [
          l("Automated HTTP health checks of the laboratory journal", "Automatisierte HTTP-Health-Checks des Laborjournals"),
          l("Persistent-failure detection and recovery detection", "Erkennung anhaltender Ausfälle und der Wiederherstellung"),
          l("Time-based notification restrictions to reduce avoidable alarms", "Zeitbasierte Benachrichtigungsregeln gegen vermeidbare Alarme"),
        ],
      },
      {
        title: l("Node-RED automation", "Node-RED-Automatisierung"),
        items: [
          l("Threshold-based alerts and event filtering", "Schwellwertalarme und Ereignisfilterung"),
          l("System health checks and recovery notifications", "System-Health-Checks und Entwarnungen"),
          l("Glue between sensors, services and notifications", "Bindeglied zwischen Sensoren, Diensten und Benachrichtigungen"),
        ],
      },
      {
        title: l("Dashboards", "Dashboards"),
        items: [
          l("Grafana dashboards for gas pressure, lab sensors, equipment health and infrastructure metrics", "Grafana-Dashboards für Gasdruck, Laborsensoren, Gerätezustand und Infrastrukturmetriken"),
        ],
      },
      {
        title: l("Scripting", "Skripte"),
        items: [
          l("Python and Bash helpers for maintenance, scheduled jobs and data processing", "Python- und Bash-Helfer für Wartung, geplante Jobs und Datenverarbeitung"),
        ],
      },
    ],
    challenges: [
      l(
        "The hardest parameter is the threshold for 'persistent'. Too low and the alert is noisy, too high and it is late. It is a trade-off that should be revisited with real experience, not set once.",
        "Der schwierigste Parameter ist die Schwelle für 'anhaltend'. Zu niedrig, und der Alarm ist laut; zu hoch, und er kommt zu spät. Ein Kompromiss, der mit Erfahrung nachjustiert werden sollte.",
      ),
    ],
    outcomes: [
      l("Outages are reported by the system, and so are recoveries.", "Ausfälle meldet das System - und ebenso die Wiederherstellung."),
      l("Fewer avoidable notifications thanks to failure counting and time windows.", "Weniger vermeidbare Benachrichtigungen dank Fehlerzählung und Zeitfenstern."),
    ],
    demo: "flow",
    related: ["lab-gas-monitoring", "lab-systems-reliability", "automation-scripting"],
  },
  {
    id: "B5",
    slug: "centralized-software-deployment",
    tier: "flagship",
    category: "infrastructure",
    status: "completed",
    verification: "needs-review",
    publish: true,
    featured: true,
    context: "professional",
    title: l("Centralized Software Deployment", "Zentrale Softwareverteilung"),
    summary: l(
      "From installing software machine by machine to managing Windows endpoints centrally with OPSI, Active Directory and Group Policy.",
      "Vom Installieren Rechner für Rechner zur zentralen Verwaltung von Windows-Clients mit OPSI, Active Directory und Gruppenrichtlinien.",
    ),
    problem: l(
      "Each workstation was set up by hand. Results differed, and updates depended on someone remembering them.",
      "Jeder Arbeitsplatz wurde von Hand eingerichtet. Die Ergebnisse unterschieden sich, und Updates hingen davon ab, dass jemand daran dachte.",
    ),
    solution: l(
      "Software is packaged and deployed centrally with OPSI; configuration follows Active Directory groups and Group Policy, piloted first.",
      "Software wird mit OPSI paketiert und zentral verteilt; die Konfiguration folgt AD-Gruppen und Gruppenrichtlinien - zuerst im Pilotbetrieb.",
    ),
    role: l("Setup, packaging, client integration, troubleshooting", "Einrichtung, Paketierung, Client-Anbindung, Fehlersuche"),
    technologies: ["OPSI", "Windows", "Active Directory", "Group Policy", "Certificates"],
    challenge: l(
      "In a lab, workstations are tools. When one behaves differently from the next because it was installed on a different day, people lose time. Manual provisioning doesn't scale and leaves no record of what was installed where.",
      "Im Labor sind Arbeitsplätze Werkzeuge. Verhält sich einer anders als der nächste, weil er an einem anderen Tag installiert wurde, kostet das Zeit. Manuelle Einrichtung skaliert nicht und hinterlässt keine Übersicht, was wo installiert ist.",
    ),
    approach: [
      l(
        "Describe instead of click. Software installation is captured in OPSI packages, so every client receives the same, repeatable result.",
        "Beschreiben statt klicken. Installationen werden in OPSI-Paketen festgehalten - jeder Client erhält dasselbe, wiederholbare Ergebnis.",
      ),
      l(
        "Let structure carry configuration. Users, groups and access are organized in Active Directory; Group Policy applies settings by group membership.",
        "Struktur trägt die Konfiguration. Nutzer, Gruppen und Rechte sind im Active Directory organisiert; Gruppenrichtlinien wirken über die Gruppenzugehörigkeit.",
      ),
      l(
        "Pilot first. New policies go to a pilot group before anything wider - a rollout is a decision, not a side effect.",
        "Erst pilotieren. Neue Richtlinien gehen zuerst an eine Pilotgruppe - ein Rollout ist eine Entscheidung, keine Nebenwirkung.",
      ),
    ],
    architecture: [
      { id: "manual", kind: "ops", label: l("Before: manual", "Vorher: manuell"), detail: l("Per-machine installs", "Installation pro Rechner") },
      { id: "pkg", kind: "service", label: l("Packages", "Pakete"), detail: l("OPSI product definitions", "OPSI-Produktdefinitionen") },
      { id: "server", kind: "service", label: l("Deployment server", "Verteilserver"), detail: l("OPSI depot & config", "OPSI-Depot & Konfiguration") },
      { id: "ad", kind: "service", label: l("Directory", "Verzeichnis"), detail: l("AD groups, pilot GPOs", "AD-Gruppen, Pilot-GPOs") },
      { id: "clients", kind: "hardware", label: l("Endpoints", "Clients"), detail: l("Consistent Windows workstations", "Einheitliche Windows-Arbeitsplätze") },
    ],
    implementation: [
      {
        title: l("OPSI", "OPSI"),
        items: [
          l("Client integration and configuration", "Client-Anbindung und -Konfiguration"),
          l("Package deployment and software installation", "Paketverteilung und Softwareinstallation"),
          l("Certificate troubleshooting and operating-system integration", "Fehlersuche bei Zertifikaten und Betriebssystemintegration"),
        ],
      },
      {
        title: l("Active Directory & Group Policy", "Active Directory & Gruppenrichtlinien"),
        items: [
          l("User and group management, access control", "Nutzer- und Gruppenverwaltung, Zugriffsrechte"),
          l("Policy planning and pilot deployment groups", "Richtlinienplanung und Pilotgruppen"),
          l("Centralized endpoint configuration within the pilot scope", "Zentrale Client-Konfiguration im Pilotumfang"),
        ],
      },
    ],
    challenges: [
      l(
        "Certificates and trust are where central management usually breaks first. Understanding the chain end to end saved more time than any workaround.",
        "Zertifikate und Vertrauensketten sind meist das Erste, woran zentrale Verwaltung scheitert. Die Kette Ende-zu-Ende zu verstehen sparte mehr Zeit als jeder Workaround.",
      ),
    ],
    outcomes: [
      l("Software installation became repeatable and documented.", "Softwareinstallation wurde wiederholbar und dokumentiert."),
      l("Group-based configuration is in place for the pilot group.", "Gruppenbasierte Konfiguration ist für die Pilotgruppe umgesetzt."),
    ],
    related: ["network-systems-administration", "security-hardening", "lab-systems-reliability"],
    reviewNote: "MDT work intentionally omitted until scope is confirmed (see entry B6). No numbers or time savings are claimed.",
  },
  {
    id: "C4",
    slug: "lab-systems-reliability",
    tier: "flagship",
    category: "monitoring",
    status: "operational",
    verification: "needs-review",
    publish: true,
    featured: true,
    context: "professional",
    title: l("Laboratory Systems Reliability & Operations", "Zuverlässigkeit & Betrieb von Laborsystemen"),
    summary: l(
      "Operating and troubleshooting a Java-based laboratory information system and the Linux servers around it - with a disciplined, evidence-first approach to incidents.",
      "Betrieb und Fehlersuche eines Java-basierten Laborinformationssystems und der Linux-Server darum - mit einem disziplinierten, beweisorientierten Vorgehen bei Störungen.",
    ),
    problem: l(
      "When a lab application stops responding, the pressure is to restart and move on - and the cause stays hidden.",
      "Reagiert eine Laboranwendung nicht mehr, ist der Druck groß, neu zu starten und weiterzumachen - die Ursache bleibt verborgen.",
    ),
    solution: l(
      "Restore service first, but collect evidence on the way: logs, resources, thread dumps, network - then test hypotheses.",
      "Zuerst den Dienst wiederherstellen, dabei aber Belege sichern: Logs, Ressourcen, Thread-Dumps, Netzwerk - dann Hypothesen prüfen.",
    ),
    role: l("Operation, incident response, investigation", "Betrieb, Störungsbehebung, Analyse"),
    technologies: ["GlassFish", "Java", "Nginx", "Linux", "systemd", "Bash", "Thread dumps", "Log analysis"],
    challenge: l(
      "A laboratory information system is used all day and nobody notices it until it stops. It runs on GlassFish behind Nginx on Linux - several layers, each of which can be the reason a request hangs. Good operations here means short outages and, over time, fewer of them.",
      "Ein Laborinformationssystem wird den ganzen Tag genutzt - und niemand bemerkt es, bis es stehen bleibt. Es läuft auf GlassFish hinter Nginx unter Linux: mehrere Schichten, und jede kann der Grund sein, warum eine Anfrage hängt. Guter Betrieb heißt hier: kurze Ausfälle und mit der Zeit weniger davon.",
    ),
    approach: [
      l("Evidence before action: capture logs, resource usage and thread states before a restart erases them.", "Belege vor Handlung: Logs, Ressourcennutzung und Thread-Zustände sichern, bevor ein Neustart sie löscht."),
      l("Narrow down by layer: proxy, application server, JVM, operating system, network.", "Nach Schichten eingrenzen: Proxy, Applikationsserver, JVM, Betriebssystem, Netzwerk."),
      l("Write hypotheses down and test them one at a time. 'Probably' is not a root cause.", "Hypothesen aufschreiben und einzeln prüfen. 'Wahrscheinlich' ist keine Ursache."),
      l("Turn findings into prevention: monitoring, runbooks, configuration changes.", "Erkenntnisse in Vorbeugung übersetzen: Monitoring, Runbooks, Konfigurationsänderungen."),
    ],
    architecture: [
      { id: "client", kind: "ui", label: l("Lab users", "Laborteam"), detail: l("Browser", "Browser") },
      { id: "nginx", kind: "network", label: l("Nginx", "Nginx"), detail: l("Reverse proxy", "Reverse Proxy") },
      { id: "gf", kind: "service", label: l("GlassFish", "GlassFish"), detail: l("Java application server", "Java-Applikationsserver") },
      { id: "jvm", kind: "service", label: l("JVM", "JVM"), detail: l("Threads, memory", "Threads, Speicher") },
      { id: "os", kind: "hardware", label: l("Linux host", "Linux-Host"), detail: l("systemd, logs, resources", "systemd, Logs, Ressourcen") },
      { id: "watch", kind: "ops", label: l("Monitoring", "Monitoring"), detail: l("Availability checks", "Verfügbarkeitsprüfungen") },
    ],
    implementation: [
      {
        title: l("Investigation toolkit", "Werkzeuge der Analyse"),
        items: [
          l("Log investigation across Nginx, GlassFish and system journals", "Log-Analyse über Nginx, GlassFish und System-Journale"),
          l("Thread dumps to understand blocked or waiting application threads", "Thread-Dumps, um blockierte oder wartende Threads zu verstehen"),
          l("Resource and process diagnostics on the host", "Ressourcen- und Prozessdiagnose auf dem Host"),
          l("Service checks and network investigation", "Dienstprüfungen und Netzwerkanalyse"),
        ],
      },
      {
        title: l("Linux operations", "Linux-Betrieb"),
        items: [
          l("Ubuntu servers: packages, kernel updates, systemd services, cron", "Ubuntu-Server: Pakete, Kernel-Updates, systemd-Dienste, cron"),
          l("SSH-based administration and service recovery", "SSH-basierte Administration und Dienstwiederherstellung"),
        ],
      },
    ],
    challenges: [
      l(
        "Not every investigation ends with a conclusive root cause - some are still open. Saying so honestly is part of the method, and is why monitoring and recovery procedures matter as much as the analysis.",
        "Nicht jede Analyse endet mit einer eindeutigen Ursache - manche sind noch offen. Das ehrlich zu sagen gehört zur Methode, und deshalb sind Monitoring und Wiederherstellungsabläufe so wichtig wie die Analyse.",
      ),
    ],
    outcomes: [
      l("Faster, more structured recovery when the application misbehaves.", "Schnellere, strukturiertere Wiederherstellung bei Störungen."),
      l("Availability monitoring covers the application, so outages are noticed early.", "Verfügbarkeitsmonitoring deckt die Anwendung ab - Ausfälle fallen früh auf."),
    ],
    related: ["monitoring-automation", "proxmox-self-hosted-infrastructure", "network-systems-administration"],
    reviewNote: "Incidents are described generically on purpose. Do not add real dates, hostnames or incident details.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Supporting projects & capabilities
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "A5",
    slug: "embedded-firmware",
    tier: "capability",
    category: "embedded",
    status: "completed",
    verification: "needs-review",
    publish: true,
    context: "professional",
    title: l("Custom Embedded Firmware & Interfaces", "Eigene Embedded-Firmware & Schnittstellen"),
    summary: l(
      "C/C++ firmware for ESP32-based devices: embedded web servers, Wi-Fi connectivity, telemetry and software that respects tight memory budgets.",
      "C/C++-Firmware für ESP32-Geräte: Embedded-Webserver, WLAN-Anbindung, Telemetrie und Software, die mit knappem Speicher auskommt.",
    ),
    technologies: ["ESP32", "C/C++", "PlatformIO", "Arduino framework", "Wi-Fi", "HTTP", "JSON"],
    implementation: [
      {
        title: l("What this covers", "Was dazugehört"),
        items: [
          l("Device firmware in C/C++ with PlatformIO", "Geräte-Firmware in C/C++ mit PlatformIO"),
          l("Embedded web interfaces for setup and status", "Embedded-Weboberflächen für Einrichtung und Status"),
          l("Wi-Fi connectivity and configuration without reflashing", "WLAN-Anbindung und Konfiguration ohne Neu-Flashen"),
          l("Telemetry endpoints (HTTP/JSON) for monitoring systems", "Telemetrie-Endpunkte (HTTP/JSON) für Monitoring-Systeme"),
          l("Persistent device settings", "Dauerhaft gespeicherte Geräteeinstellungen"),
        ],
      },
    ],
    related: ["esp32-analog-gauge-reader", "esp32-temperature-monitoring"],
  },
  {
    id: "B8",
    slug: "network-systems-administration",
    tier: "capability",
    category: "infrastructure",
    status: "completed",
    verification: "needs-review",
    publish: true,
    context: "professional",
    title: l("Network & Systems Administration", "Netzwerk- & Systemadministration"),
    summary: l(
      "Day-to-day administration of Windows and Linux systems and the network they depend on - from DNS and DHCP to VPN access and connectivity troubleshooting.",
      "Tägliche Administration von Windows- und Linux-Systemen und dem Netzwerk, von dem sie abhängen - von DNS und DHCP bis zu VPN-Zugängen und Verbindungsfehlersuche.",
    ),
    technologies: ["Windows", "Ubuntu", "Xubuntu", "LAN", "DNS", "DHCP", "VPN", "Firewall", "SSH", "Bash"],
    implementation: [
      {
        title: l("Scope", "Umfang"),
        items: [
          l("Workstation and server administration across Windows and Linux", "Administration von Arbeitsplätzen und Servern unter Windows und Linux"),
          l("DNS, DHCP and LAN configuration, VPN and firewall-related administration", "DNS-, DHCP- und LAN-Konfiguration, VPN- und Firewall-Administration"),
          l("Network diagnostics, access and connectivity troubleshooting", "Netzwerkdiagnose, Fehlersuche bei Zugriff und Verbindungen"),
          l("Logs, performance analysis and process diagnostics on Linux", "Logs, Performanceanalyse und Prozessdiagnose unter Linux"),
        ],
      },
    ],
    related: ["centralized-software-deployment", "lab-systems-reliability"],
    reviewNote: "VLAN work intentionally not mentioned until personally verified.",
  },
  {
    id: "B10",
    slug: "security-hardening",
    tier: "capability",
    category: "infrastructure",
    status: "completed",
    verification: "needs-review",
    publish: true,
    context: "professional",
    title: l("Operational Security & Hardening", "Betriebssicherheit & Härtung"),
    summary: l(
      "Security as part of daily operations: patching, TLS, certificates, access control and secure remote access. Practical hygiene - not penetration testing or audit credentials.",
      "Sicherheit als Teil des Betriebs: Patches, TLS, Zertifikate, Zugriffsrechte und sicherer Fernzugriff. Praktische Hygiene - keine Penetrationstests oder Audit-Zertifizierungen.",
    ),
    technologies: ["Patch management", "TLS", "Certificates", "Access control", "SSH", "VPN"],
    implementation: [
      {
        title: l("Practices", "Praktiken"),
        items: [
          l("Regular patching of servers and clients", "Regelmäßiges Patchen von Servern und Clients"),
          l("HTTPS/TLS for internal services, certificate administration", "HTTPS/TLS für interne Dienste, Zertifikatsverwaltung"),
          l("Least-privilege access via directory groups", "Minimale Rechte über Verzeichnisgruppen"),
          l("Secure remote access and server maintenance", "Sicherer Fernzugriff und Serverwartung"),
        ],
      },
    ],
    related: ["proxmox-self-hosted-infrastructure", "centralized-software-deployment"],
  },
  {
    id: "C6",
    slug: "automation-scripting",
    tier: "capability",
    category: "monitoring",
    status: "completed",
    verification: "needs-review",
    publish: true,
    context: "professional",
    title: l("Python & Bash Automation", "Automatisierung mit Python & Bash"),
    summary: l(
      "Small tools that remove repetitive work: administrative scripts, maintenance helpers, scheduled jobs, data processing and backup workflows.",
      "Kleine Werkzeuge gegen wiederkehrende Arbeit: Administrationsskripte, Wartungshelfer, geplante Jobs, Datenverarbeitung und Backup-Abläufe.",
    ),
    technologies: ["Python", "Bash", "cron", "systemd timers", "rsync", "JSON"],
    implementation: [
      {
        title: l("Typical work", "Typische Arbeiten"),
        items: [
          l("Maintenance and housekeeping scripts for Linux servers", "Wartungsskripte für Linux-Server"),
          l("Scheduled jobs with cron and systemd", "Geplante Jobs mit cron und systemd"),
          l("Scripts for scientific and administrative data processing", "Skripte für wissenschaftliche und administrative Datenverarbeitung"),
          l("Backup and synchronization workflows", "Backup- und Synchronisationsabläufe"),
        ],
      },
    ],
    related: ["monitoring-automation", "proxmox-self-hosted-infrastructure"],
  },
  {
    id: "D5",
    slug: "technical-knowledge-base",
    tier: "supporting",
    category: "software",
    status: "completed",
    verification: "needs-review",
    publish: true,
    context: "professional",
    title: l("Technical Knowledge Base", "Technische Wissensdatenbank"),
    summary: l(
      "A self-hosted MediaWiki for operational documentation and runbooks - so knowledge about systems doesn't live in one person's head.",
      "Ein selbst betriebenes MediaWiki für Betriebsdokumentation und Runbooks - damit Wissen über Systeme nicht nur in einem Kopf steckt.",
    ),
    technologies: ["MediaWiki", "Docker", "Documentation", "Runbooks"],
    implementation: [
      {
        title: l("What it includes", "Was dazugehört"),
        items: [
          l("Deployment and maintenance of MediaWiki", "Bereitstellung und Wartung von MediaWiki"),
          l("Structure for operational documentation and technical runbooks", "Struktur für Betriebsdokumentation und technische Runbooks"),
        ],
      },
    ],
    related: ["proxmox-self-hosted-infrastructure", "local-ai-rag"],
  },
  {
    id: "D6",
    slug: "git-workflows",
    tier: "capability",
    category: "software",
    status: "completed",
    verification: "needs-review",
    publish: true,
    context: "professional",
    title: l("Git & Collaborative Development", "Git & kollaborative Entwicklung"),
    summary: l(
      "Version-controlled development with Git and GitLab: repository management, branching, documentation and AI-assisted coding as a tool, not a replacement for judgment.",
      "Versionierte Entwicklung mit Git und GitLab: Repository-Verwaltung, Branching, Dokumentation und KI-gestütztes Programmieren als Werkzeug, nicht als Ersatz für Urteilsvermögen.",
    ),
    technologies: ["Git", "GitLab", "GitHub", "AI coding assistants"],
    implementation: [
      {
        title: l("Practices", "Praktiken"),
        items: [
          l("Repository management and branching workflows", "Repository-Verwaltung und Branching-Workflows"),
          l("Documentation alongside code", "Dokumentation direkt beim Code"),
          l("AI development tools used for drafting and review, with every change understood and tested", "KI-Werkzeuge für Entwürfe und Reviews - jede Änderung wird verstanden und getestet"),
        ],
      },
    ],
    related: ["automation-scripting"],
  },
  {
    id: "E1",
    slug: "hpc-scientific-computing",
    tier: "supporting",
    category: "hpc-ai",
    status: "operational",
    verification: "needs-review",
    publish: true,
    context: "professional",
    title: l("HPC & Scientific Computing Support", "Unterstützung für HPC & wissenschaftliches Rechnen"),
    summary: l(
      "Keeping computational chemistry running: Slurm-based Linux clusters and software environments for ORCA and xTB. Infrastructure support - the simulation science belongs to the researchers.",
      "Damit Computerchemie läuft: Slurm-basierte Linux-Cluster und Softwareumgebungen für ORCA und xTB. Infrastruktur-Unterstützung - die Simulationswissenschaft gehört den Forschenden.",
    ),
    technologies: ["Slurm", "Linux clusters", "ORCA", "xTB", "Research software"],
    implementation: [
      {
        title: l("Scope", "Umfang"),
        items: [
          l("Support for Slurm-managed Linux compute environments", "Unterstützung Slurm-verwalteter Linux-Rechenumgebungen"),
          l("Installation and support of scientific software such as ORCA and xTB", "Installation und Betreuung wissenschaftlicher Software wie ORCA und xTB"),
          l("Helping researchers get jobs running and environments consistent", "Forschende dabei unterstützen, Jobs zum Laufen zu bringen und Umgebungen konsistent zu halten"),
        ],
      },
    ],
    related: ["gpu-ai-workstation"],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // In development
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "A3",
    slug: "glovebox-monitoring",
    tier: "supporting",
    category: "embedded",
    status: "in-development",
    verification: "needs-review",
    publish: true,
    context: "professional",
    title: l("Glovebox Equipment Monitoring", "Monitoring von Gloveboxen"),
    summary: l(
      "Investigating and integrating the signals of laboratory gloveboxes - oxygen, moisture, pressure - into monitoring. Data acquisition only; not a safety or control system.",
      "Untersuchung und Integration der Signale von Labor-Gloveboxen - Sauerstoff, Feuchte, Druck - ins Monitoring. Reine Datenerfassung; kein Sicherheits- oder Steuerungssystem.",
    ),
    role: l("Interface investigation, I/O diagnostics, integration work", "Schnittstellenanalyse, I/O-Diagnose, Integrationsarbeit"),
    technologies: ["Modbus TCP", "I/O diagnostics", "Industrial controllers", "Data acquisition", "Grafana"],
    challenge: l(
      "Gloveboxes keep an inert atmosphere; their controllers know oxygen and moisture levels, but that knowledge usually stays on the device display. Making it visible elsewhere means understanding industrial interfaces first.",
      "Gloveboxen halten eine inerte Atmosphäre; ihre Steuerungen kennen Sauerstoff- und Feuchtewerte, doch dieses Wissen bleibt meist auf dem Display. Es anderswo sichtbar zu machen heißt, zuerst industrielle Schnittstellen zu verstehen.",
    ),
    architecture: [
      { id: "gb", kind: "hardware", label: l("Glovebox", "Glovebox"), detail: l("O₂, H₂O, pressure sensors", "O₂-, H₂O-, Drucksensoren") },
      { id: "ctrl", kind: "hardware", label: l("Controller", "Steuerung"), detail: l("Equipment I/O", "Geräte-I/O") },
      { id: "modbus", kind: "network", label: l("Modbus TCP", "Modbus TCP"), detail: l("Read-only acquisition", "Nur lesende Erfassung") },
      { id: "ingest", kind: "service", label: l("Ingestion", "Erfassung"), detail: l("Polling & storage", "Abfrage & Speicherung"), planned: true },
      { id: "dash", kind: "ui", label: l("Dashboards", "Dashboards"), detail: l("Trends & alerts", "Verläufe & Alarme"), planned: true },
    ],
    implementation: [
      {
        title: l("Current work", "Aktuelle Arbeit"),
        items: [
          l("Controller and sensor investigation, I/O diagnostics", "Untersuchung von Steuerung und Sensorik, I/O-Diagnose"),
          l("Modbus TCP integration work", "Integrationsarbeit mit Modbus TCP"),
        ],
      },
      {
        title: l("Next steps", "Nächste Schritte"),
        planned: true,
        items: [
          l("Continuous data acquisition of O₂, moisture and pressure", "Kontinuierliche Erfassung von O₂, Feuchte und Druck"),
          l("Dashboards and non-critical notifications", "Dashboards und nicht-kritische Benachrichtigungen"),
        ],
      },
    ],
    demo: "iot",
    related: ["lab-gas-monitoring", "esp32-temperature-monitoring"],
    reviewNote: "Manufacturer (MBRAUN) intentionally not named on the site until confirmed OK. Confirm which stages are already implemented.",
  },
  {
    id: "A4",
    slug: "esp32-temperature-monitoring",
    tier: "supporting",
    category: "embedded",
    status: "in-development",
    verification: "needs-review",
    publish: true,
    context: "professional",
    title: l("ESP32 Temperature Monitoring", "Temperaturüberwachung mit ESP32"),
    summary: l(
      "A wired, network-attached temperature sensor node: ESP32-C3 with Ethernet and DS18B20 probes, configurable thresholds and integration into monitoring.",
      "Ein kabelgebundener, netzwerkfähiger Temperatursensor: ESP32-C3 mit Ethernet und DS18B20-Fühlern, einstellbaren Schwellen und Monitoring-Anbindung.",
    ),
    technologies: ["ESP32-C3", "Ethernet", "DS18B20", "1-Wire", "C/C++", "PlatformIO"],
    challenge: l(
      "Wi-Fi isn't always welcome or reliable near lab equipment. A wired sensor node with Ethernet is predictable, and DS18B20 probes are robust and easy to replace.",
      "WLAN ist in der Nähe von Laborgeräten nicht immer erwünscht oder zuverlässig. Ein kabelgebundener Sensorknoten mit Ethernet ist berechenbar, und DS18B20-Fühler sind robust und leicht zu tauschen.",
    ),
    architecture: [
      { id: "probe", kind: "hardware", label: l("DS18B20", "DS18B20"), detail: l("1-Wire temperature probes", "1-Wire-Temperaturfühler") },
      { id: "mcu", kind: "firmware", label: l("ESP32-C3", "ESP32-C3"), detail: l("Firmware, thresholds", "Firmware, Schwellen") },
      { id: "eth", kind: "network", label: l("Ethernet", "Ethernet"), detail: l("Wired telemetry", "Kabelgebundene Telemetrie") },
      { id: "mon", kind: "ui", label: l("Monitoring", "Monitoring"), detail: l("Dashboards & alerts", "Dashboards & Alarme") },
    ],
    implementation: [
      {
        title: l("Target feature set", "Geplanter Funktionsumfang"),
        items: [
          l("DS18B20 integration and temperature observation", "DS18B20-Anbindung und Temperaturerfassung"),
          l("Ethernet connectivity on ESP32-C3", "Ethernet-Anbindung am ESP32-C3"),
          l("Configurable thresholds and remote telemetry", "Einstellbare Schwellen und Fern-Telemetrie"),
          l("Integration into the existing monitoring", "Einbindung in das bestehende Monitoring"),
        ],
      },
    ],
    demo: "iot",
    related: ["embedded-firmware", "glovebox-monitoring"],
    reviewNote: "Mark individual architecture stages as planned/implemented once confirmed.",
  },
  {
    id: "D2",
    slug: "labjournal-data-pipeline",
    tier: "supporting",
    category: "software",
    status: "in-development",
    verification: "needs-review",
    publish: true,
    context: "professional",
    title: l("Lab Journal to Research Data Platform", "Laborjournal zur Forschungsdatenplattform"),
    summary: l(
      "Transforming laboratory journal data so it can be prepared for scientific data platforms (PMD / MENAP 2.0): export, JSON transformation, metadata and preview.",
      "Aufbereitung von Laborjournal-Daten für wissenschaftliche Datenplattformen (PMD / MENAP 2.0): Export, JSON-Transformation, Metadaten und Vorschau.",
    ),
    technologies: ["Python", "JSON", "Data transformation", "Metadata", "APIs"],
    architecture: [
      { id: "lj", kind: "data", label: l("Lab journal", "Laborjournal"), detail: l("Export", "Export") },
      { id: "tx", kind: "service", label: l("Transform", "Transformation"), detail: l("JSON processing", "JSON-Verarbeitung") },
      { id: "meta", kind: "service", label: l("Metadata", "Metadaten"), detail: l("Preparation & preview", "Aufbereitung & Vorschau") },
      { id: "api", kind: "network", label: l("Platform API", "Plattform-API"), detail: l("Integration work", "Integrationsarbeit"), planned: true },
    ],
    implementation: [
      {
        title: l("Work areas", "Arbeitsbereiche"),
        items: [
          l("Export handling and JSON transformation", "Export und JSON-Transformation"),
          l("Data preview and metadata preparation", "Datenvorschau und Metadatenaufbereitung"),
          l("API integration work (in progress)", "API-Integration (in Arbeit)"),
        ],
      },
    ],
    related: ["technical-knowledge-base"],
    reviewNote: "No production deployment is claimed.",
  },
  {
    id: "E2",
    slug: "gpu-ai-workstation",
    tier: "supporting",
    category: "hpc-ai",
    status: "in-development",
    verification: "needs-review",
    publish: true,
    context: "professional",
    title: l("GPU Workstation & Local AI Infrastructure", "GPU-Workstation & lokale KI-Infrastruktur"),
    summary: l(
      "Planning and building a GPU workstation (NVIDIA RTX 6000 Ada) for running AI models locally - keeping research data in-house.",
      "Planung und Aufbau einer GPU-Workstation (NVIDIA RTX 6000 Ada), um KI-Modelle lokal zu betreiben - Forschungsdaten bleiben im Haus.",
    ),
    technologies: ["NVIDIA RTX 6000 Ada", "Linux", "Local LLMs", "Resource planning"],
    implementation: [
      {
        title: l("In progress", "In Arbeit"),
        items: [
          l("Workstation design and resource planning", "Workstation-Design und Ressourcenplanung"),
          l("Linux setup for local model execution", "Linux-Einrichtung für lokale Modellausführung"),
        ],
      },
      {
        title: l("Planned", "Geplant"),
        planned: true,
        items: [l("Shared access for the group and integration with the knowledge base", "Gemeinsamer Zugriff für die Gruppe und Anbindung an die Wissensdatenbank")],
      },
    ],
    related: ["local-ai-rag", "hpc-scientific-computing"],
    reviewNote: "Confirm which hardware is installed vs. planned.",
  },
  {
    id: "E3",
    slug: "local-ai-rag",
    tier: "supporting",
    category: "hpc-ai",
    status: "in-development",
    verification: "needs-review",
    publish: true,
    context: "professional",
    title: l("Local AI & Retrieval over the Wiki", "Lokale KI & Retrieval über das Wiki"),
    summary: l(
      "Experimenting with retrieval-augmented generation over internal documentation, using locally hosted models so that questions can be answered from the group's own knowledge.",
      "Experimente mit Retrieval-Augmented Generation über interne Dokumentation, mit lokal betriebenen Modellen - damit Fragen aus dem eigenen Wissen der Gruppe beantwortet werden.",
    ),
    technologies: ["RAG", "Local LLMs", "Document retrieval", "MediaWiki", "Python"],
    architecture: [
      { id: "wiki", kind: "data", label: l("Wiki pages", "Wiki-Seiten"), detail: l("Source documents", "Quelldokumente") },
      { id: "index", kind: "service", label: l("Retrieval index", "Retrieval-Index"), detail: l("Chunking & search", "Aufteilung & Suche") },
      { id: "llm", kind: "service", label: l("Local model", "Lokales Modell"), detail: l("Answer with sources", "Antwort mit Quellen") },
      { id: "ui", kind: "ui", label: l("Interface", "Oberfläche"), detail: l("Ask questions", "Fragen stellen"), planned: true },
    ],
    implementation: [
      {
        title: l("Exploration", "Erkundung"),
        items: [
          l("Document retrieval over wiki content", "Dokumentensuche über Wiki-Inhalte"),
          l("Local model integration", "Anbindung lokaler Modelle"),
        ],
      },
    ],
    related: ["gpu-ai-workstation", "technical-knowledge-base"],
    reviewNote: "Experimental. No accuracy or production readiness claimed.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Planned
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "D7",
    slug: "cv-editor",
    tier: "supporting",
    category: "software",
    status: "planned",
    verification: "needs-review",
    publish: true,
    context: "independent",
    title: l("CV Editor Web Application", "Lebenslauf-Editor als Webanwendung"),
    summary: l(
      "An independent side project: a web application for writing and laying out CVs with structured content and clean exports.",
      "Ein eigenes Nebenprojekt: eine Webanwendung zum Schreiben und Gestalten von Lebensläufen mit strukturierten Inhalten und sauberem Export.",
    ),
    technologies: ["TypeScript", "Web"],
    related: [],
    reviewNote: "Listed as planned per brief. Update status if it should be shown as in development.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Not published - waiting for verification
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "A6",
    slug: "3d-printed-enclosures",
    tier: "supporting",
    category: "embedded",
    status: "verification-required",
    verification: "needs-review",
    publish: false,
    context: "independent",
    title: l("Custom 3D-Printed Enclosures", "Eigene 3D-gedruckte Gehäuse"),
    summary: l("Enclosures and mounts for sensor devices.", "Gehäuse und Halterungen für Sensorgeräte."),
    technologies: ["Fusion 360", "Autodesk Inventor", "FDM printing"],
    reviewNote: "Publish once real designs/photos and personal contribution are available.",
  },
  {
    id: "B6",
    slug: "windows-mdt-deployment",
    tier: "supporting",
    category: "infrastructure",
    status: "verification-required",
    verification: "needs-review",
    publish: false,
    context: "professional",
    title: l("Windows MDT Deployment", "Windows-Bereitstellung mit MDT"),
    summary: l("Deployment shares and automated Windows installation workflows.", "Deployment-Shares und automatisierte Windows-Installationen."),
    technologies: ["MDT", "Windows"],
    reviewNote: "Confirm personal implementation scope before publishing.",
  },
  {
    id: "D1",
    slug: "balance-stream",
    tier: "supporting",
    category: "software",
    status: "verification-required",
    verification: "needs-review",
    publish: false,
    context: "professional",
    title: l("Balance Stream", "Balance Stream"),
    summary: l("Python-based handling of measurement data from laboratory balances.", "Python-basierte Verarbeitung von Messdaten aus Laborwaagen."),
    technologies: ["Python"],
    reviewNote: "Verify technical scope and supported interfaces before writing details.",
  },
  {
    id: "D3",
    slug: "labjournal-connector",
    tier: "supporting",
    category: "software",
    status: "verification-required",
    verification: "needs-review",
    publish: false,
    context: "professional",
    title: l("Laboratory Journal Connector", "Laborjournal-Connector"),
    summary: l("Research-software integration work.", "Integrationsarbeit für Forschungssoftware."),
    technologies: [],
    reviewNote: "Confirm responsibilities and functionality.",
  },
  {
    id: "D4",
    slug: "research-group-website",
    tier: "supporting",
    category: "software",
    status: "verification-required",
    verification: "needs-review",
    publish: false,
    context: "professional",
    title: l("Research Group Website", "Website der Forschungsgruppe"),
    summary: l("Website modernization and responsive frontend.", "Modernisierung der Website und responsives Frontend."),
    technologies: ["HTML", "CSS", "CMS"],
    reviewNote: "Needs authorization; no internal screenshots.",
  },
];

export const publishedProjects = projects.filter((p) => p.publish);

export function getProject(slug: string): Project | undefined {
  return publishedProjects.find((p) => p.slug === slug);
}

export function getRelated(project: Project): Project[] {
  return (project.related ?? [])
    .map((slug) => getProject(slug))
    .filter((p): p is Project => !!p);
}
