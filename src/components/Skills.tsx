import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const skillCategories = {
  All: [],
  DevOps: [
    "Proxmox",
    "Docker",
    "Kubernetes",
    "QEMU/KVM",
    "VirtualBox",
    "Portainer",
  ],
  Systems: [
    "Ubuntu Server",
    "Debian",
    "Windows Server",
    "Active Directory",
    "Bash",
    "Network Config",
  ],
  Monitoring: [
    "Grafana",
    "InfluxDB",
    "Node-RED",
    "MQTT",
    "Prometheus",
    "SQL",
    "SQLite",
  ],
  Programming: ["Python", "C++", "Bash", "JavaScript", "HTML/CSS", "Arduino/C"],
  IoT: [
    "ESP32",
    "ESP8266",
    "Microcontrollers",
    "Sensors",
    "GPIO",
    "OTA Updates",
    "Web UI",
  ],
  Automation: [
    "Bash Scripts",
    "Python Scripts",
    "Cron Jobs",
    "Backup Strategies",
    "System Tasks",
  ],
  "3D & Design": [
    "Blender",
    "Fusion 360",
    "3D Printing",
    "STL Optimization",
    "FDM AutoDesk Inventor",
  ],
  Tools: ["Git", "GitHub", "VS Code", "Home Assistant", "Linux CLI"],
};

const allSkills = Object.values(skillCategories)
  .flat()
  .filter((skill) => skill !== "");

export function Skills() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleSkills, setVisibleSkills] = useState(allSkills);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === "All") {
      setVisibleSkills(allSkills);
    } else {
      setVisibleSkills(
        skillCategories[category as keyof typeof skillCategories]
      );
    }
  };

  return (
    <section id="skills" className="py-20 px-6 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            {t("skills.title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-8" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("skills.description")}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Object.keys(skillCategories).map((category) => {
            const getCategoryTranslation = (cat: string) => {
              const categoryMap: { [key: string]: string } = {
                All: t("skills.all"),
                DevOps: "DevOps",
                Systems: t("skills.systems"),
                Monitoring: "Monitoring",
                Programming: "Programming",
                IoT: "IoT",
                Automation: t("skills.automation"),
                "3D & Design": "3D & Design",
                Tools: t("skills.tools"),
              };
              return categoryMap[cat] || cat;
            };

            return (
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
                {getCategoryTranslation(category)}
              </Button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-in">
          {visibleSkills.map((skill, index) => (
            <div
              key={skill}
              className="skill-tag animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {skill}
            </div>
          ))}
        </div>

        {/* Skill Categories Overview */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 hover:bg-surface-hover transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-primary-glow rounded-full mr-3 animate-glow-pulse" />
              <h3 className="text-xl font-semibold">Infrastructure & DevOps</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Containerization, orchestration, virtualization, and cloud-native
              solutions for scalable systems.
            </p>
          </div>

          <div className="glass-card p-6 hover:bg-surface-hover transition-all duration-300">
            <div className="flex items-center mb-4">
              <div
                className="w-3 h-3 bg-accent rounded-full mr-3 animate-glow-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <h3 className="text-xl font-semibold">Embedded & IoT</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Microcontroller programming, sensor integration, and IoT device
              development with ESP32/ESP8266.
            </p>
          </div>

          <div className="glass-card p-6 hover:bg-surface-hover transition-all duration-300">
            <div className="flex items-center mb-4">
              <div
                className="w-3 h-3 bg-accent-light rounded-full mr-3 animate-glow-pulse"
                style={{ animationDelay: "1s" }}
              />
              <h3 className="text-xl font-semibold">Monitoring & Analytics</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Real-time monitoring, data visualization, and analytics with
              Grafana, InfluxDB, and custom dashboards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
