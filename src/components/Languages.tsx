import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Languages() {
  const { t } = useLanguage();

  const languages = [
    {
      name: t('languages.italian'),
      level: t('languages.native'),
      progress: 100,
      flag: '🇮🇹'
    },
    {
      name: t('languages.bosnian'),
      level: t('languages.native'),
      progress: 100,
      flag: '🇧🇦'
    },
    {
      name: t('languages.english'),
      level: t('languages.fluent'),
      progress: 95,
      flag: '🇺🇸'
    },
    {
      name: t('languages.german'),
      level: t('languages.c1'),
      progress: 85,
      flag: '🇩🇪'
    }
  ];

  return (
    <section id="languages" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            {t('languages.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('languages.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {languages.map((language, index) => (
            <div
              key={language.name}
              className="glass-card p-6 text-center hover:bg-surface-hover transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{language.flag}</div>
              <h3 className="font-semibold text-lg mb-2">{language.name}</h3>
              <p className="text-sm text-accent mb-4 font-medium">{language.level}</p>
              
              <div className="w-full bg-surface rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${language.progress}%`,
                    animationDelay: `${index * 0.2 + 0.5}s`
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{language.progress}%</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="glass-card p-8 max-w-4xl mx-auto">
            <Globe className="h-12 w-12 text-primary mx-auto mb-4 animate-glow-pulse" />
            <p className="text-muted-foreground leading-relaxed">
              {t('languages.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}