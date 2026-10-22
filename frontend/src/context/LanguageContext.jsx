import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { translations, phraseTranslations } from '../data/translations';

const LanguageContext = createContext(null);

export const SUPPORTED_LANGUAGES = [
  { code: 'EN', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'HI', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'FR', name: 'French', nativeName: 'Français', flag: '🇫🇷' }
];

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('smf_language');
      if (saved && ['EN', 'HI', 'ES', 'FR'].includes(saved.toUpperCase())) {
        return saved.toUpperCase();
      }
    } catch (e) {
      console.warn('Could not read language from localStorage:', e);
    }
    return 'EN';
  });

  const setLanguage = useCallback((lang) => {
    const code = (lang || 'EN').toUpperCase();
    if (['EN', 'HI', 'ES', 'FR'].includes(code)) {
      setLanguageState(code);
      try {
        localStorage.setItem('smf_language', code);
        document.documentElement.lang = code.toLowerCase();
        window.dispatchEvent(new CustomEvent('smf_language_changed', { detail: { language: code } }));
      } catch (e) {
        console.warn('Could not save language to localStorage:', e);
      }
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = language.toLowerCase();
    } catch {
      // ignore
    }
  }, [language]);

  // Translation function: checks translation dictionary, then direct phrase dictionary, then fallback
  const t = useCallback((keyOrText, fallback) => {
    if (!keyOrText) return fallback !== undefined ? fallback : '';

    // 1. Check semantic key in active language
    const currentDict = translations[language];
    if (currentDict && currentDict[keyOrText] !== undefined) {
      return currentDict[keyOrText];
    }

    // 2. Check phrase in active language
    const currentPhraseDict = phraseTranslations[language];
    if (currentPhraseDict && currentPhraseDict[keyOrText] !== undefined) {
      return currentPhraseDict[keyOrText];
    }

    // 3. Fallback to English dictionary
    if (translations['EN'] && translations['EN'][keyOrText] !== undefined) {
      return translations['EN'][keyOrText];
    }

    // 4. Fallback to English phrases
    if (phraseTranslations['EN'] && phraseTranslations['EN'][keyOrText] !== undefined) {
      return phraseTranslations['EN'][keyOrText];
    }

    // 5. Explicit fallback or original string
    return fallback !== undefined ? fallback : keyOrText;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    supportedLanguages: SUPPORTED_LANGUAGES
  }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'EN',
      setLanguage: () => {},
      t: (key, fallback) => fallback !== undefined ? fallback : key,
      supportedLanguages: SUPPORTED_LANGUAGES
    };
  }
  return context;
}
