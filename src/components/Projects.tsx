import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const projects = [
  {
    id: 1,
    title: "ESP32-CAM Gauge Reader",
    description:
      "ESP32-CAM project to detect analog gauge values (e.g. pressure, bar levels) from manometers using image processing. Sends data via MQTT/HTTP to InfluxDB or Home Assistant. Developed for industrial environments where no viable commercial or open-source solution existed.",
    category: "ESP32",
    tags: [
      "ESP32-CAM",
      "MQTT",
      "InfluxDB",
      "Home Assistant",
      "Computer Vision",
    ],
    image: `${import.meta.env.BASE_URL}manometer-rec.png`,
    github: "https://github.com/dzenankusi/esp32-cam-gauge-reader",
    demo: "#",
  },
  {
    id: 2,
    title: "Custom Tasmota-like ESP32 Firmware",
    description:
      "Custom firmware for ESP32 devices inspired by Tasmota, but more modular and secure. Includes enhanced Wi-Fi fallback mechanisms, access point encryption, and full customization of device behavior for home and industrial automation.",
    category: "ESP32",
    tags: ["ESP32", "Firmware", "Wi-Fi", "Security", "Tasmota"],
    image: `${import.meta.env.BASE_URL}oc1g-firm.png`,
    github: "https://github.com/dzenankusi/custom-esp32-firmware",
    demo: "#",
  },
  {
    id: 3,
    title: "N2 Generator Monitoring Dashboard",
    description:
      "Grafana dashboard for monitoring nitrogen (N₂) generator systems with integrated alerting. Tracks pressure, flow rates, and other key metrics in real time for predictive maintenance and operational safety.",
    category: "Monitoring Dashboards",
    tags: ["Grafana", "InfluxDB", "Alerts", "Sensors", "N₂ Monitoring"],
    image: `${import.meta.env.BASE_URL}grafanaN2.png`,
    github: "https://github.com/dzenankusi/n2-monitoring-dashboard",
    demo: "#",
  },
  {
    id: 4,
    title: "Helium Consumption Tracker",
    description:
      "Grafana-based dashboard that calculates helium consumption by reading five different gas meters. Enables trend analysis, leak detection, and predictive maintenance in scientific and industrial environments.",
    category: "Monitoring Dashboards",
    tags: ["Grafana", "InfluxDB", "Helium", "Gas Meters", "Leak Detection"],
    image: `${import.meta.env.BASE_URL}grafanaHe.png`,
    github: "https://github.com/dzenankusi/helium-usage-dashboard",
    demo: "#",
  },
  {
    id: 5,
    title: "Proxmox Homelab with Docker Services",
    description:
      "Complete Proxmox homelab setup with multiple VMs hosting containerized services. Features self-hosted MediaWiki, SQL databases, Nginx Proxy Manager, and secure reverse proxy architecture for various apps and internal tools.",
    category: "DevOps",
    tags: ["Proxmox", "Docker", "VMs", "Nginx Proxy", "Self-Hosting"],
    image: `${import.meta.env.BASE_URL}docker.png`,
    github: "https://github.com/dzenankusi/proxmox-homelab",
    demo: "#",
  },
  {
    id: 6,
    title: "3D Printed Enclosures for IoT Projects",
    description:
      "Collection of self-designed and 3D printed enclosures tailored for various ESP32 and sensor-based projects. Custom mounts and housings for different use cases, emphasizing practical everyday utility.",
    category: "3D Printing",
    tags: [
      "Fusion 360",
      "3D Printing",
      "ESP32",
      "Custom Mounts",
      "CAD Inventor",
    ],
    image: `${import.meta.env.BASE_URL}3dprint.png`,
    github: "https://github.com/dzenankusi/iot-enclosures",
    demo: "#",
  },
];

const categories = [
  "All",
  "DevOps",
  "ESP32",
  "Docker Setups",
  "Monitoring Dashboards",
  "3D Printing",
];

export function Projects() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleProjects, setVisibleProjects] = useState(projects);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === "All") {
      setVisibleProjects(projects);
    } else {
      setVisibleProjects(
        projects.filter((project) => project.category === category)
      );
    }
  };

  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            {t("projects.title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-8" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("projects.description")}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryChange(category)}
              className={`${
                activeCategory === category
                  ? "hero-button text-sm"
                  : "glass-card hover:bg-surface-hover border-accent/30 text-sm"
              } transition-all duration-300`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProjects.map((project, index) => (
            <Card
              key={project.id}
              className="glass-card hover:bg-surface-hover transition-all duration-300 hover:scale-105 group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="aspect-video bg-surface/50 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardTitle className="text-xl group-hover:text-accent transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-surface/80 text-accent-light border-accent/20 hover:bg-accent/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3">
                  {/* GitHub Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    className={`glass-card hover:bg-surface-hover border-accent/30 ${
                      project.github === "#"
                        ? "cursor-not-allowed opacity-50 pointer-events-none"
                        : ""
                    }`}
                    onClick={() => {
                      if (project.github !== "#")
                        window.open(project.github, "_blank");
                    }}
                  >
                    <Github className="h-4 w-4 mr-2" />
                    {t("projects.github")}
                  </Button>

                  {/* Demo Button */}
                  <Button
                    size="sm"
                    className={`hero-button ${
                      project.demo === "#"
                        ? "cursor-not-allowed opacity-50 pointer-events-none"
                        : ""
                    }`}
                    onClick={() => {
                      if (project.demo !== "#")
                        window.open(project.demo, "_blank");
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t("projects.demo")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
