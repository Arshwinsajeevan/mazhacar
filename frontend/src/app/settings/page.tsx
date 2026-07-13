'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAppTheme, ThemeMode } from '@/providers/ThemeProvider';
import { useAppLanguage } from '@/providers/LanguageProvider';
import Card from '@/components/Card';
import Button from '@/components/Button';
import PageHeader from '@/components/PageHeader';
import { Globe, Moon, Sun, Volume2, Bell, Shield, Check } from 'lucide-react';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { theme, setTheme } = useAppTheme();
  const { language, changeLanguage } = useAppLanguage();

  // Local state for toggles
  const [notifications, setNotifications] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value as any);
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Animation constants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-3xl">
      <motion.div variants={itemVariants}>
        <PageHeader
          title={t('settings.title')}
          subtitle={t('settings.subtitle')}
        />
      </motion.div>

      <div className="space-y-6">
        {/* Localization & Language */}
        <motion.div variants={itemVariants}>
          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-sky-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
                {t('settings.language')}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t('settings.select_language')}
                </label>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full glass-input bg-transparent text-slate-800 dark:text-white"
                >
                  <option value="ml" className="bg-slate-100 dark:bg-slate-900">മലയാളം (Default)</option>
                  <option value="en" className="bg-slate-100 dark:bg-slate-900">English</option>
                  <option value="hi" className="bg-slate-100 dark:bg-slate-900">हिन्दी (Hindi)</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Theme Settings */}
        <motion.div variants={itemVariants}>
          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
                {t('settings.theme')}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border text-sm font-semibold transition-all ${
                  theme === 'light'
                    ? 'bg-white border-sky-500 text-sky-600 shadow-md scale-105'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4" />
                {t('settings.light')}
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border text-sm font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-sky-500 text-sky-400 shadow-md scale-105'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Moon className="w-4 h-4" />
                {t('settings.dark')}
              </button>
            </div>
          </Card>
        </motion.div>

        {/* System Settings & Notifications */}
        <motion.div variants={itemVariants}>
          <Card className="space-y-6">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
                {t('settings.alerts_audio')}
              </h3>
            </div>

            <div className="space-y-4">
              {/* Notifications Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/20 dark:bg-slate-900/20">
                <div>
                  <h4 className="text-xs font-bold">{t('settings.notifications')}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('settings.notifications_desc')}
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
                    notifications ? 'bg-sky-500 flex justify-end' : 'bg-slate-500 flex justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md block" />
                </button>
              </div>

              {/* Voice Assistance Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/20 dark:bg-slate-900/20">
                <div>
                  <h4 className="text-xs font-bold">{t('settings.voice')}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('settings.voice_desc')}
                  </p>
                </div>
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
                    voiceEnabled ? 'bg-sky-500 flex justify-end' : 'bg-slate-500 flex justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md block" />
                </button>
              </div>

              {/* Speech Speed slider */}
              {voiceEnabled && (
                <div className="space-y-2 p-3 rounded-2xl bg-white/10 dark:bg-slate-900/10">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {t('settings.voiceSpeed')}
                    </span>
                    <span className="text-[11px] font-semibold">{speechSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechSpeed}
                    onChange={(e) => setSpeechSpeed(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Footer Actions */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 justify-end pt-4">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4" />
              Settings saved successfully!
            </span>
          )}
          <Button variant="solid" onClick={handleSave}>
            {t('settings.save')}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
