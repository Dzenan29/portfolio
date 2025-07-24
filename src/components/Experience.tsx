import { Calendar, MapPin, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const experiences = [
  {
    id: 1,
    title: "IT Systems Administrator & Developer",
    company: "Ruhr-Universität Bochum – Chemistry Research Group",
    location: "Bochum, Germany",
    period: "2023 – Present",
    type: "Full-time",
    highlights: [
      "Managing Active Directory and internal user administration across multiple lab systems",
      "Supporting scientific workflows through IT infrastructure improvements and user access management",
      "Developing Docker-based services for automation and digital monitoring of lab equipment",
      "Designing custom sensor solutions for temperature, pressure, and gas flow with MQTT and HTTP integrations",
    ],
    technologies: [
      "Active Directory",
      "Docker",
      "Linux",
      "ESP32",
      "MQTT",
      "Python",
      "Proxmox",
    ],
  },
  {
    id: 2,
    title: "Freelance Web Developer & Logistics Assistant",
    company: "Self-employed / Part-time Warehouse Work",
    location: "Dortmund, Germany",
    period: "2020 – 2022",
    type: "Part-time / Freelance",
    highlights: [
      "Worked in logistics while relocating to Germany and intensively studying German language",
      "Founded a small freelance business building websites for local businesses at competitive rates",
      "Delivered end-to-end solutions including custom WordPress themes, hosting setup, and client training",
    ],
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "WordPress",
      "German Language B2+",
      "Client Communication",
    ],
  },
  {
    id: 3,
    title: "IT System Administrator",
    company: "Dainese S.r.l.",
    location: "Buonconvento, Italy",
    period: "2019 – 2020",
    type: "Full-time",
    highlights: [
      "Provided direct IT support to internal teams and client-facing departments",
      "Maintained network infrastructure, workstations, and VoIP systems",
      "Diagnosed and resolved hardware, software, and connectivity issues in real time",
    ],
    technologies: [
      "Windows Server",
      "Networking",
      "Hardware Repair",
      "Client Support",
      "VPN",
    ],
  },
  {
    id: 4,
    title: "IT Systems Manager",
    company: "ADLER Spa Resort THERMAE",
    location: "Bagnovignoni, Italy",
    period: "2018 – 2019",
    type: "Full-time",
    highlights: [
      "Oversaw IT infrastructure across the hotel’s network, servers, and guest services systems",
      "Resolved infrastructure-related incidents across networking, printing, telephony, and access systems",
      "Coordinated with vendors and directly supported hotel management and VIP clients",
    ],
    technologies: [
      "Networking",
      "Windows Server",
      "Cisco",
      "Infrastructure Management",
      "Customer Service",
    ],
  },
  {
    id: 5,
    title: "Junior Backend Developer (Internship & Placement)",
    company: "Banca Monte dei Paschi di Siena – R&D Department",
    location: "Siena, Italy",
    period: "2018",
    type: "Internship",
    highlights: [
      "Completed internship followed by placement during final year of high school (Abitur)",
      "Worked on backend logic to implement R&D concepts into functional software components",
      "Collaborated with analysts and researchers to prototype and deliver internal applications",
    ],
    technologies: ["Java", "SQL", "REST APIs", "Backend Development", "Agile"],
  },
];

export function Experience() {
  const { t } = useLanguage();
  return (
    <section id="experience" className="py-20 px-6 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            {t("experience.title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-8" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("experience.description")}
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary-glow" />

          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className={`relative mb-12 ${
                index % 2 === 0
                  ? "md:text-right md:pr-1/2"
                  : "md:pl-1/2 md:ml-8"
              } animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-glow-pulse">
                <div className="w-3 h-3 bg-background rounded-full" />
              </div>

              {/* Content Card */}
              <div
                className={`ml-12 md:ml-0 glass-card p-6 hover:bg-surface-hover transition-all duration-300 ${
                  index % 2 === 0 ? "md:mr-8" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {exp.title}
                    </h3>
                    <h4 className="text-lg font-semibold text-accent mb-2">
                      {exp.company}
                    </h4>
                  </div>
                  <div className="flex flex-col text-sm text-muted-foreground">
                    <div className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 mr-2 text-accent" />
                      {exp.period}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-accent" />
                      {exp.location}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-semibold text-foreground mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-primary-glow" />
                    {t("experience.achievements")}
                  </h5>
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="text-muted-foreground flex items-start"
                      >
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-surface/80 text-accent-light text-xs rounded-full border border-accent/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
