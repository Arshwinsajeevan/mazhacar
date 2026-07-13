'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useAppLanguage } from '@/providers/LanguageProvider';
import {
  Home,
  Calendar,
  Map as MapIcon,
  AlertTriangle,
  Heart,
  Settings as SettingsIcon,
  Info,
  CloudLightning,
  Sun,
  CloudRain,
  Cloud,
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { weatherTheme, theme, toggleTheme } = useAppTheme();
  const { language, changeLanguage } = useAppLanguage();
  const { t } = useTranslation();
  const pathname = usePathname();

  const navItems = [
    { name: t('nav.home'), href: '/', icon: Home },
    { name: t('nav.forecast'), href: '/forecast', icon: Calendar },
    { name: t('nav.map'), href: '/map', icon: MapIcon },
    { name: t('nav.alerts'), href: '/alerts', icon: AlertTriangle, badge: true },
    { name: t('nav.favorites'), href: '/favorites', icon: Heart },
    { name: t('nav.settings'), href: '/settings', icon: SettingsIcon },
    { name: t('nav.about'), href: '/about', icon: Info },
  ];

  // Pick exactly 5 items for the mobile bottom nav bar to keep it uncluttered
  const mobileNavItems = [
    navItems[0], // Home
    navItems[1], // Forecast
    navItems[2], // Map
    navItems[4], // Favorites
    navItems[5], // Settings
  ];

  // Helper to map weather theme to class and icon
  const getWeatherStyles = () => {
    switch (weatherTheme) {
      case 'sunny':
        return { class: 'bg-sunny', icon: Sun, color: 'text-amber-500' };
      case 'rainy':
        return { class: 'bg-rainy', icon: CloudRain, color: 'text-sky-500' };
      case 'cloudy':
        return { class: 'bg-cloudy', icon: Cloud, color: 'text-slate-500' };
      case 'stormy':
        return { class: 'bg-stormy', icon: CloudLightning, color: 'text-indigo-600' };
      default:
        return { class: 'bg-rainy', icon: CloudRain, color: 'text-sky-500' };
    }
  };

  const currentStyle = getWeatherStyles();

  return (
    <div className={`weather-bg h-screen h-[100dvh] flex flex-col md:flex-row overflow-hidden transition-all duration-1000 ${currentStyle.class} text-slate-800 dark:text-slate-100`}>
      {/* Background overlay/blur effect to enhance glassmorphism */}
      <div className="fixed inset-0 bg-white/10 dark:bg-slate-950/20 backdrop-brightness-95 pointer-events-none z-0" />

      {/* Desktop Sidebar (Left side) */}
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-white/20 dark:border-white/5 m-4 mr-0 rounded-3xl z-10 p-6 space-y-8 select-none shrink-0">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="p-2.5 rounded-2xl bg-white/40 dark:bg-slate-900/40 shadow-inner flex items-center justify-center transition-all group-hover:scale-105">
            <CloudRain className="w-7 h-7 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight leading-none bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent group-hover:text-sky-500 transition-colors">
              {t('common.appName')}
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wider font-semibold uppercase">
              MazhaCar
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white/60 dark:bg-slate-800/60 shadow-sm font-semibold scale-[1.02] border border-white/40 dark:border-white/10 text-sky-600 dark:text-sky-400'
                    : 'hover:bg-white/20 dark:hover:bg-slate-900/20 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.name}</span>
                </div>
                {item.badge && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info & Weather Theme indicators */}
        <div className="space-y-4 pt-4 border-t border-slate-500/10">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/20 dark:bg-slate-900/20">
            <span className="text-xs text-slate-500 dark:text-slate-400">Theme System</span>
            <button
              onClick={toggleTheme}
              className="px-2.5 py-1 rounded-xl text-xs bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-700/80 shadow-sm border border-white/40 dark:border-white/10"
            >
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
          <div className="text-[11px] text-slate-400 text-center">
            MazhaCar v1.0.0
          </div>
        </div>
      </aside>

      {/* Mobile Top Header (Fixed height, no push down) */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 glass-panel m-3 mb-0 rounded-2xl z-10 shrink-0">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <CloudRain className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <h1 className="font-bold text-base">{t('common.appName')}</h1>
        </Link>

        {/* Translation Switcher & Theme button directly accessible on Mobile Header */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/20 dark:bg-slate-900/30 p-0.5 rounded-xl border border-white/10">
            <button
              onClick={() => changeLanguage('ml')}
              className={`px-1.5 py-0.5 text-[9px] font-bold rounded-lg transition-all ${
                language === 'ml' ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-extrabold' : 'text-slate-500'
              }`}
            >
              മല
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`px-1.5 py-0.5 text-[9px] font-bold rounded-lg transition-all ${
                language === 'en' ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-extrabold' : 'text-slate-500'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('hi')}
              className={`px-1.5 py-0.5 text-[9px] font-bold rounded-lg transition-all ${
                language === 'hi' ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-extrabold' : 'text-slate-500'
              }`}
            >
              हिं
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/10 text-xs shadow-sm"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Main Content Area (Flexible viewport bounds with inner scrolling) */}
      <main className="flex-1 flex flex-col min-h-0 z-10 m-3 md:my-4 md:mr-4 md:ml-2 relative overflow-hidden">
        <div className="flex-1 glass-panel rounded-2xl md:rounded-3xl p-4 pb-20 md:p-8 overflow-y-auto shadow-xl border border-white/20 dark:border-white/5">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Navigation (Fixed bottom placement) */}
      <nav className="flex md:hidden items-center justify-around py-2 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 fixed bottom-3 left-3 right-3 z-40 select-none shadow-2xl rounded-2xl">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl relative ${
                isActive ? 'text-sky-600 dark:text-sky-400 font-bold scale-105' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span className="text-[9px] mt-0.5">{item.name}</span>
              {item.badge && (
                <span className="absolute top-1 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-rose-500/20" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MainLayout;
