'use client';

import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { LanguageProvider } from './LanguageProvider';
import { QueryProvider } from './QueryProvider';
import { LocationProvider } from './LocationProvider';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryProvider>
      <LanguageProvider>
        <ThemeProvider>
          <LocationProvider>
            {children}
          </LocationProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryProvider>
  );
};

export default AppProviders;
