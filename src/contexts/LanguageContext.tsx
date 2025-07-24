import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Hero
    'hero.title': 'Full-Stack DevOps & Embedded Systems Engineer',
    'hero.subtitle': 'Automating infrastructures, connecting devices, and building smart systems – from cloud to sensor.',
    'hero.explore': 'Explore My Work',
    'hero.resume': 'Download Resume',
    'hero.scroll': 'Scroll to explore',

    // About
    'about.title': 'About Me',
    'about.description': 'I am a passionate DevOps and Embedded Systems Engineer with extensive experience in system administration, automation, and IoT development. Based in Dortmund, Germany, I specialize in building robust infrastructures, developing smart embedded solutions, and creating seamless automation workflows. My expertise spans from cloud technologies to microcontroller programming, always focusing on efficient, scalable solutions. In my spare time, I enjoy designing and 3D printing practical everyday tools and custom enclosures for my projects.',
    'about.devops': 'DevOps & Cloud',
    'about.devops.desc': 'Infrastructure automation, containerization, and cloud orchestration',
    'about.programming': 'Programming',
    'about.programming.desc': 'Full-stack development with modern languages and frameworks',
    'about.iot': 'IoT & Embedded',
    'about.iot.desc': 'Microcontroller programming and sensor integration',
    'about.design': '3D Design',
    'about.design.desc': 'CAD modeling and 3D printing for practical solutions',

    // Skills
    'skills.title': 'Technical Skills',
    'skills.description': 'A comprehensive overview of my technical expertise across different domains',
    'skills.all': 'All',
    'skills.systems': 'Systems',
    'skills.automation': 'Automation',
    'skills.tools': 'Tools',

    // Projects
    'projects.title': 'Featured Projects',
    'projects.description': 'A showcase of my work across DevOps, embedded systems, and automation',
    'projects.all': 'All Projects',
    'projects.docker': 'Docker Setups',
    'projects.esp32': 'ESP32 Projects',
    'projects.monitoring': 'Monitoring',
    'projects.3dprinting': '3D Printing',
    'projects.github': 'View on GitHub',
    'projects.demo': 'Live Demo',

    // Experience
    'experience.title': 'Professional Experience',
    'experience.present': 'Present',
    'experience.description': 'A progressive journey through system administration, DevOps automation, and embedded systems development',
    'experience.achievements': 'Key Achievements',

    // Languages
    'languages.title': 'Languages',
    'languages.description': 'I am passionate about multilingual communication and thrive in international environments.',
    'languages.italian': 'Italian',
    'languages.bosnian': 'Bosnian, Serbo-Croatian',
    'languages.english': 'English',
    'languages.german': 'German',
    'languages.native': 'Native',
    'languages.fluent': 'Fluent',
    'languages.c1': 'C1 Advanced',

    // Contact
    'contact.title': 'Get In Touch',
    'contact.description': 'Ready to collaborate or discuss your next project? Feel free to reach out.',
    'contact.name': 'Your Name',
    'contact.email': 'Your Email',
    'contact.subject': 'Subject',
    'contact.message': 'Your Message',
    'contact.send': 'Send Message',
    'contact.sendTitle': 'Send a Message',
    'contact.sendDesc': 'Fill out the form below and I\'ll respond within 24 hours',
    'contact.location': 'Location',
    'contact.basedIn': 'Based in Dortmund, Germany',
    'contact.resume': 'Download Resume',
    'contact.github': 'GitHub Profile',
    'contact.linkedin': 'LinkedIn Profile',
    'contact.emailContact': 'Email Contact',
  },
  de: {
    // Hero
    'hero.title': 'Full-Stack DevOps & Embedded Systems Ingenieur',
    'hero.subtitle': 'Automatisierung von Infrastrukturen, Verbindung von Geräten und Aufbau intelligenter Systeme – von der Cloud bis zum Sensor.',
    'hero.explore': 'Meine Arbeit erkunden',
    'hero.resume': 'Lebenslauf herunterladen',
    'hero.scroll': 'Scrollen zum Erkunden',

    // About
    'about.title': 'Über mich',
    'about.description': 'Ich bin ein leidenschaftlicher DevOps- und Embedded Systems-Ingenieur mit umfangreicher Erfahrung in Systemadministration, Automatisierung und IoT-Entwicklung. Mit Sitz in Dortmund, Deutschland, spezialisiere ich mich auf den Aufbau robuster Infrastrukturen, die Entwicklung intelligenter eingebetteter Lösungen und die Erstellung nahtloser Automatisierungs-Workflows. Meine Expertise reicht von Cloud-Technologien bis zur Mikrocontroller-Programmierung, wobei ich stets auf effiziente, skalierbare Lösungen fokussiert bin. In meiner Freizeit entwerfe und drucke ich gerne praktische Alltagsgegenstände und maßgeschneiderte Gehäuse für meine Projekte.',
    'about.devops': 'DevOps & Cloud',
    'about.devops.desc': 'Infrastruktur-Automatisierung, Containerisierung und Cloud-Orchestrierung',
    'about.programming': 'Programmierung',
    'about.programming.desc': 'Full-Stack-Entwicklung mit modernen Sprachen und Frameworks',
    'about.iot': 'IoT & Embedded',
    'about.iot.desc': 'Mikrocontroller-Programmierung und Sensor-Integration',
    'about.design': '3D-Design',
    'about.design.desc': 'CAD-Modellierung und 3D-Druck für praktische Lösungen',

    // Skills
    'skills.title': 'Technische Fähigkeiten',
    'skills.description': 'Ein umfassender Überblick über meine technische Expertise in verschiedenen Bereichen',
    'skills.all': 'Alle',
    'skills.systems': 'Systeme',
    'skills.automation': 'Automatisierung',
    'skills.tools': 'Werkzeuge',

    // Projects
    'projects.title': 'Ausgewählte Projekte',
    'projects.description': 'Eine Präsentation meiner Arbeit in DevOps, eingebetteten Systemen und Automatisierung',
    'projects.all': 'Alle Projekte',
    'projects.docker': 'Docker-Setups',
    'projects.esp32': 'ESP32-Projekte',
    'projects.monitoring': 'Monitoring',
    'projects.3dprinting': '3D-Druck',
    'projects.github': 'Auf GitHub ansehen',
    'projects.demo': 'Live-Demo',

    // Experience
    'experience.title': 'Berufserfahrung',
    'experience.present': 'Heute',
    'experience.description': 'Ein progressiver Werdegang durch Systemadministration, DevOps-Automatisierung und Entwicklung eingebetteter Systeme',
    'experience.achievements': 'Wichtige Erfolge',

    // Languages
    'languages.title': 'Sprachen',
    'languages.description': 'Ich bin leidenschaftlich für mehrsprachige Kommunikation und gedeihe in internationalen Umgebungen.',
    'languages.italian': 'Italienisch',
    'languages.bosnian': 'Bosnisch, Serbokroatisch',
    'languages.english': 'Englisch',
    'languages.german': 'Deutsch',
    'languages.native': 'Muttersprache',
    'languages.fluent': 'Fließend',
    'languages.c1': 'C1 Fortgeschritten',

    // Contact
    'contact.title': 'Kontakt aufnehmen',
    'contact.description': 'Bereit für eine Zusammenarbeit oder möchten Sie Ihr nächstes Projekt besprechen? Zögern Sie nicht, mich zu kontaktieren.',
    'contact.name': 'Ihr Name',
    'contact.email': 'Ihre E-Mail',
    'contact.subject': 'Betreff',
    'contact.message': 'Ihre Nachricht',
    'contact.send': 'Nachricht senden',
    'contact.sendTitle': 'Nachricht senden',
    'contact.sendDesc': 'Füllen Sie das untenstehende Formular aus und ich antworte innerhalb von 24 Stunden',
    'contact.location': 'Standort',
    'contact.basedIn': 'Ansässig in Dortmund, Deutschland',
    'contact.resume': 'Lebenslauf herunterladen',
    'contact.github': 'GitHub-Profil',
    'contact.linkedin': 'LinkedIn-Profil',
    'contact.emailContact': 'E-Mail-Kontakt',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};