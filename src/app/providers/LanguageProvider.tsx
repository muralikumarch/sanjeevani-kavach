'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SupportedLanguage } from '../../infrastructure/gcp/language-map';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  cycleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// A subset of languages for the quick cycle demo
const demoLanguages: SupportedLanguage[] = ['hi', 'te', 'mr', 'ta', 'en' as SupportedLanguage];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SupportedLanguage>('hi'); // Default to Hindi

  const cycleLanguage = () => {
    const currentIndex = demoLanguages.indexOf(language);
    const nextIndex = (currentIndex + 1) % demoLanguages.length;
    setLanguage(demoLanguages[nextIndex]);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, cycleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
