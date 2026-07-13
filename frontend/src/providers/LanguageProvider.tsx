'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import mlTranslation from '../locales/ml.json';
import enTranslation from '../locales/en.json';
import hiTranslation from '../locales/hi.json';

// Initialize i18next
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        ml: { translation: mlTranslation },
        en: { translation: enTranslation },
        hi: { translation: hiTranslation },
      },
      lng: 'ml', // Malayalam default
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false, // prevent nextjs loading state glitches
      },
    });
}

type Language = 'ml' | 'en' | 'hi';

interface LanguageContextProps {
  language: Language;
  changeLanguage: (lng: Language) => void;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ml');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Read from localStorage on mount
    const savedLang = localStorage.getItem('mazhacar_lang') as Language;
    if (savedLang && ['ml', 'en', 'hi'].includes(savedLang)) {
      i18n.changeLanguage(savedLang).then(() => {
        setLanguageState(savedLang);
        setIsReady(true);
      });
    } else {
      setLanguageState('ml');
      setIsReady(true);
    }
  }, []);

  const changeLanguage = async (lng: Language) => {
    await i18n.changeLanguage(lng);
    localStorage.setItem('mazhacar_lang', lng);
    setLanguageState(lng);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useAppLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useAppLanguage must be used within a LanguageProvider');
  }
  return context;
};
