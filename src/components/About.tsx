import { MapPin, Wrench, Code, Server } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function About() {
  const { t } = useLanguage();
  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            {t('about.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-in-left">
            <div className="glass-card p-8 hover:bg-surface-hover transition-all duration-300">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-accent mr-3" />
                <span className="text-lg font-semibold">{t('contact.basedIn')}</span>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                {t('about.description')}
              </p>
            </div>
          </div>

          <div className="space-y-6 animate-slide-in-right">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 text-center hover:bg-surface-hover transition-all duration-300 hover:scale-105">
                <Server className="h-12 w-12 text-primary-glow mx-auto mb-4 animate-glow-pulse" />
                <h3 className="font-semibold text-lg mb-2">{t('about.devops')}</h3>
                <p className="text-sm text-muted-foreground">{t('about.devops.desc')}</p>
              </div>

              <div className="glass-card p-6 text-center hover:bg-surface-hover transition-all duration-300 hover:scale-105">
                <Code className="h-12 w-12 text-accent mx-auto mb-4 animate-glow-pulse" style={{ animationDelay: '0.5s' }} />
                <h3 className="font-semibold text-lg mb-2">{t('about.programming')}</h3>
                <p className="text-sm text-muted-foreground">{t('about.programming.desc')}</p>
              </div>

              <div className="glass-card p-6 text-center hover:bg-surface-hover transition-all duration-300 hover:scale-105">
                <Wrench className="h-12 w-12 text-accent-light mx-auto mb-4 animate-glow-pulse" style={{ animationDelay: '1s' }} />
                <h3 className="font-semibold text-lg mb-2">{t('about.iot')}</h3>
                <p className="text-sm text-muted-foreground">{t('about.iot.desc')}</p>
              </div>

              <div className="glass-card p-6 text-center hover:bg-surface-hover transition-all duration-300 hover:scale-105">
                <svg className="h-12 w-12 text-primary mx-auto mb-4 animate-glow-pulse" style={{ animationDelay: '1.5s' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
                <h3 className="font-semibold text-lg mb-2">{t('about.design')}</h3>
                <p className="text-sm text-muted-foreground">{t('about.design.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}