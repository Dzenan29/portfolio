import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="language-switcher glass-effect">
        <Globe className="w-4 h-4 text-primary opacity-60" />
        <div className="flex gap-1">
          <button
            onClick={() => setLanguage('en')}
            className={`language-btn ${language === 'en' ? 'active' : ''}`}
          >
            EN
          </button>
          <span className="text-muted-foreground/40">|</span>
          <button
            onClick={() => setLanguage('de')}
            className={`language-btn ${language === 'de' ? 'active' : ''}`}
          >
            DE
          </button>
        </div>
      </div>
    </div>
  );
};