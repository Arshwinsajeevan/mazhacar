'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
export type WeatherTheme = 'sunny' | 'rainy' | 'cloudy' | 'stormy';

interface ThemeContextProps {
  theme: ThemeMode;
  weatherTheme: WeatherTheme;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setWeatherTheme: (wTheme: WeatherTheme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('dark'); // Default to dark mode as requested
  const [weatherTheme, setWeatherThemeState] = useState<WeatherTheme>('rainy'); // Default weather theme

  useEffect(() => {
    // Read from localStorage on mount
    const savedTheme = localStorage.getItem('mazhacar_theme') as ThemeMode;
    const initialTheme = savedTheme || 'dark';
    
    setThemeState(initialTheme);
    
    const root = window.document.documentElement;
    if (initialTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('mazhacar_theme', newTheme);
    
    const root = window.document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const setWeatherTheme = (wTheme: WeatherTheme) => {
    setWeatherThemeState(wTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        weatherTheme,
        toggleTheme,
        setTheme,
        setWeatherTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
