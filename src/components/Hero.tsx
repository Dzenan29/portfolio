import { Button } from "@/components/ui/button";
import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

export function Hero() {
  const { t } = useLanguage();

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-primary-glow rounded-full animate-float opacity-60" />
      <div
        className="absolute top-40 right-32 w-1 h-1 bg-accent rounded-full animate-float opacity-80"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-32 left-16 w-3 h-3 bg-accent-light rounded-full animate-float opacity-40"
        style={{ animationDelay: "2s" }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 animate-fade-in">
        <div
          className="mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
            Dzenan Kusi
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground/90 mb-4">
            {t("hero.title")}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Button className="hero-button group" onClick={scrollToAbout}>
            {t("hero.explore")}
            <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
          </Button>
          <a
            href={`${import.meta.env.BASE_URL}Dzenan-Kusi-Lebenslauf.pdf`}
            download="Dzenan-Kusi-CV.pdf"
            className="glass-card hover:bg-surface-hover border-accent/30 inline-flex items-center px-4 py-2 rounded-md transition-all duration-300"
          >
            <Download className="mr-2 h-4 w-4" />
            {t("hero.resume")}
          </a>
        </div>

        {/* Social Links */}
        <div
          className="flex justify-center space-x-6 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <a
            href="https://github.com/Dzenan29"
            className="p-3 glass-card hover:bg-surface-hover transition-all duration-300 hover:scale-110 hover:text-accent"
            aria-label={t("contact.github")}
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://de.linkedin.com/in/dzenan-kusi-752a98217"
            className="p-3 glass-card hover:bg-surface-hover transition-all duration-300 hover:scale-110 hover:text-accent"
            aria-label={t("contact.linkedin")}
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="mailto:dzenankusi00@gmail.com"
            className="p-3 glass-card hover:bg-surface-hover transition-all duration-300 hover:scale-110 hover:text-accent"
            aria-label={t("contact.emailContact")}
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-accent opacity-60" />
      </div>
    </section>
  );
}
