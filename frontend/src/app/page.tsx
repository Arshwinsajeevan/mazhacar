'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useUserLocation } from '@/providers/LocationProvider';
import { useWeather } from '@/hooks/useWeather';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import Card from '@/components/Card';
import Button from '@/components/Button';
import PageHeader from '@/components/PageHeader';
import {
  Sun,
  CloudRain,
  Cloud,
  CloudLightning,
  AlertTriangle,
  Umbrella,
  Search,
  Heart,
  MapPin,
  Navigation,
  Activity,
  Loader2,
  RefreshCw,
  Volume2,
  VolumeX,
  Shirt,
  Car,
  Trees,
  Footprints,
  Sprout,
  Compass,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

// Dynamic import with SSR disabled for Leaflet (window check safeguard)
const WeatherMapWidget = dynamic(() => import('@/features/map/WeatherMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[250px] md:h-[300px] rounded-3xl bg-slate-200/50 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-white/5 flex items-center justify-center flex-col gap-3">
      <div className="w-6 h-6 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
        Loading Weather Map...
      </span>
    </div>
  ),
});

// Premium Animated Weather Illustrations
const WeatherIllustration = ({ condition }: { condition: string }) => {
  switch (condition) {
    case 'sunny':
      return (
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: 360 }}
            transition={{ rotate: { duration: 30, repeat: Infinity, ease: 'linear' }, scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
            className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full blur-xl opacity-40"
          />
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            viewBox="0 0 24 24"
            className="w-16 h-16 md:w-24 md:h-24 text-amber-500 relative z-10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="4" fill="currentColor" className="text-amber-400" />
            <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </motion.svg>
        </div>
      );
    case 'rainy':
      return (
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-450 to-blue-400 rounded-full blur-xl opacity-30" />
          <div className="relative z-10 flex flex-col items-center">
            <motion.svg
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              viewBox="0 0 24 24"
              className="w-16 h-16 md:w-24 md:h-24 text-sky-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" fill="currentColor" className="text-sky-300/40" />
            </motion.svg>
            <div className="flex gap-3 -mt-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, 8, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4, ease: 'linear' }}
                  className="w-1 h-2.5 bg-sky-400 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      );
    case 'cloudy':
      return (
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-200 rounded-full blur-xl opacity-30" />
          <div className="relative z-10">
            <motion.svg
              animate={{ x: [-3, 3, -3] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              viewBox="0 0 24 24"
              className="w-16 h-16 md:w-24 md:h-24 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" fill="currentColor" className="text-slate-200/40" />
            </motion.svg>
            <motion.svg
              animate={{ x: [3, -3, 3] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              viewBox="0 0 24 24"
              className="w-11 h-11 md:w-16 md:h-16 text-slate-300 absolute -bottom-1 -right-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" fill="currentColor" className="text-slate-100/50" />
            </motion.svg>
          </div>
        </div>
      );
    case 'stormy':
      return (
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full blur-xl opacity-30" />
          <div className="relative z-10 flex flex-col items-center">
            <motion.svg
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              viewBox="0 0 24 24"
              className="w-16 h-16 md:w-24 md:h-24 text-indigo-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" fill="currentColor" className="text-slate-800/30" />
            </motion.svg>
            <motion.svg
              animate={{ opacity: [0, 1, 0, 1, 0, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              viewBox="0 0 24 24"
              className="w-6 h-6 text-amber-400 -mt-3"
              fill="currentColor"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </motion.svg>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { weatherTheme, setWeatherTheme } = useAppTheme();
  const {
    currentLocation,
    gpsLoading,
    triggerGPS,
    toggleFavorite,
    isLocFavorite,
    changeLocation,
    favorites,
  } = useUserLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Keep ticking clock synced every second
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const locale = i18n.language === 'ml' ? 'ml-IN' : (i18n.language === 'hi' ? 'hi-IN' : 'en-US');
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };

  // Get weather data for the active location
  const {
    data: weather,
    isLoading: weatherLoading,
    isError: weatherError,
    refetch: refetchWeather,
  } = useWeather(currentLocation.latitude, currentLocation.longitude);

  // Search locations matching query
  const { data: searchResults, isLoading: searchLoading } = useLocationSearch(searchQuery);

  const [lastSyncedLoc, setLastSyncedLoc] = useState('');

  // Sync app ambient background with the actual weather condition ONLY when coordinates change
  useEffect(() => {
    if (weather?.current?.condition) {
      const locKey = `${currentLocation.latitude.toFixed(3)}_${currentLocation.longitude.toFixed(3)}`;
      if (lastSyncedLoc !== locKey) {
        setWeatherTheme(weather.current.condition);
        setLastSyncedLoc(locKey);
      }
    }
  }, [weather?.current?.condition, currentLocation.latitude, currentLocation.longitude, lastSyncedLoc, setWeatherTheme]);

  // Pre-load Web Speech voices on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Speech assistant control
  const handleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Your browser does not support Speech Synthesis API.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const activeLang = i18n.language || 'ml';
    const text = weather?.summary || 'No weather details available.';

    const utterance = new SpeechSynthesisUtterance(text);

    // Map language locales
    if (activeLang === 'ml') {
      utterance.lang = 'ml-IN';
    } else if (activeLang === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }

    // Load custom rate speed from local storage
    try {
      const stored = localStorage.getItem('mazhacar_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.speechSpeed) {
          utterance.rate = parsed.speechSpeed;
        }
      }
    } catch {
      utterance.rate = 1.0;
    }

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) => v.lang.startsWith(utterance.lang) || v.lang.startsWith(activeLang)
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const getSafetyDetails = (safetyScore: number) => {
    if (safetyScore >= 80) {
      return {
        label: t('common.safe', 'Safe'),
        color: 'text-emerald-500 dark:text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        badge: 'bg-emerald-500 text-white',
      };
    } else if (safetyScore >= 40) {
      return {
        label: t('common.caution', 'Caution'),
        color: 'text-amber-500 dark:text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20',
        badge: 'bg-amber-500 text-slate-900',
      };
    } else {
      return {
        label: t('common.danger', 'Danger'),
        color: 'text-rose-500 dark:text-rose-400',
        bg: 'bg-rose-500/10 border-rose-500/20',
        badge: 'bg-rose-500 text-white',
      };
    }
  };

  const getCardIcon = (id: string) => {
    switch (id) {
      case 'dry_clothes':
        return Shirt;
      case 'travel_safe':
        return Car;
      case 'outdoor_activity':
        return Trees;
      case 'walking':
        return Footprints;
      case 'outdoor_farming':
        return Sprout;
      default:
        return Compass;
    }
  };

  // Weather theme manual preview list
  const themesList = [
    { name: t('weather.conditions.sunny'), id: 'sunny' as const, icon: Sun },
    { name: t('weather.conditions.rainy'), id: 'rainy' as const, icon: CloudRain },
    { name: t('weather.conditions.cloudy'), id: 'cloudy' as const, icon: Cloud },
    { name: t('weather.conditions.stormy'), id: 'stormy' as const, icon: CloudLightning },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 220, damping: 22 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 relative pb-6">
      {/* Header Search & Bookmark Toolbar */}
      <motion.div variants={itemVariants} className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="flex items-start justify-between w-full xl:w-auto gap-4">
          <PageHeader
            title={currentLocation.name}
            subtitle={currentLocation.displayName || t('common.selectedLocation')}
          />
          <button
            onClick={() => toggleFavorite(currentLocation)}
            className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/35 hover:bg-rose-500/10 border border-white/10 text-rose-500 shrink-0 shadow-sm transition-all active:scale-95"
          >
            <Heart
              fill={isLocFavorite(currentLocation.latitude, currentLocation.longitude) ? 'currentColor' : 'none'}
              className="w-5 h-5"
            />
          </button>
        </div>

        {/* Search Input Container & Clock */}
        <div className="flex flex-col items-start xl:items-end gap-1.5 w-full xl:w-auto shrink-0 select-none">
          {/* Location Search Input */}
          <div className="relative w-full xl:w-96 flex gap-2 shrink-0">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder={t('common.searchPlaceholder')}
                className="w-full glass-input pr-10 text-slate-800 dark:text-white py-2 text-sm"
              />
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <AnimatePresence>
                {showDropdown && searchQuery.trim().length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 right-0 top-full mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl z-50 space-y-1 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-60 overflow-y-auto"
                  >
                    {searchLoading ? (
                      <div className="flex items-center justify-center py-4 text-xs font-semibold text-slate-400 gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('common.searching')}
                      </div>
                    ) : searchResults && searchResults.length > 0 ? (
                      searchResults.map((res, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            changeLocation(res);
                            setSearchQuery('');
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs font-medium text-slate-800 dark:text-slate-100 text-left"
                        >
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <div className="w-full">
                            <p className="font-bold text-left">{res.name}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{res.displayName}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="py-4 text-center text-xs text-slate-400">
                        {t('common.noLocations')}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              variant="glass"
              className="p-2.5 shrink-0 flex items-center justify-center rounded-2xl active:scale-95"
              onClick={triggerGPS}
              disabled={gpsLoading}
            >
              {gpsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Real-time Ticking Clock */}
          {currentTime && (
            <div className="text-[11px] font-bold text-slate-550 dark:text-slate-400 tracking-wide bg-white/40 dark:bg-slate-900/35 border border-white/20 dark:border-white/5 px-3 py-1 rounded-xl shadow-sm">
              {formatDateTime(currentTime)}
            </div>
          )}
        </div>
      </motion.div>

      {/* Offline Alert */}
      {weather?.isOfflineFallback && (
        <motion.div variants={itemVariants}>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-2xl flex items-center gap-2 text-xs font-semibold shadow-sm leading-normal">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {t('common.offlineBanner')}
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {weatherLoading && (
        <div className="space-y-6">
          <Card className="h-60 animate-pulse bg-white/20 dark:bg-slate-900/10" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="h-44 animate-pulse bg-white/20 dark:bg-slate-900/10" />
            ))}
          </div>
        </div>
      )}

      {/* Connection Error State */}
      {weatherError && (
        <Card className="flex flex-col items-center justify-center text-center py-12 space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-500" />
          <div>
            <h3 className="font-bold text-lg">{t('common.loadError')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              {t('common.loadErrorDesc')}
            </p>
          </div>
          <Button variant="solid" onClick={() => refetchWeather()} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            {t('common.retry')}
          </Button>
        </Card>
      )}

      {/* Dashboard Render */}
      {weather && !weatherLoading && !weatherError && (
        <>
          {/* PREMIUM HERO SECTION */}
          <motion.div variants={itemVariants}>
            <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-white/60 to-white/20 dark:from-slate-900/60 dark:to-slate-900/25 border border-white/20 dark:border-white/5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-4 w-full md:w-3/5 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-extrabold uppercase tracking-widest">
                  <MapPin className="w-3 h-3" />
                  {currentLocation.name}
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-center md:justify-start gap-2">
                    <span className="text-6xl md:text-8xl font-black tracking-tighter">
                      {weather.current.temperature}°C
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {t('weather.feelsLike')} {weather.current.apparentTemperature}°
                    </span>
                  </div>
                  <p className="text-lg md:text-xl font-extrabold text-slate-800 dark:text-white capitalize">
                    {t(`weather.conditions.${weather.current.condition}`)}
                  </p>
                </div>

                <p className="text-xs md:text-sm font-semibold leading-relaxed text-slate-500 dark:text-slate-300">
                  {weather.summary}
                </p>

                {/* Voice Assistant Button: Ask MazhaCar */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleSpeak}
                    className={`relative overflow-hidden px-6 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-95 ${
                      isSpeaking
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        Stop Assistant
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        Ask MazhaCar
                      </>
                    )}
                  </button>

                  {/* Soundwave animation */}
                  {isSpeaking && (
                    <div className="flex items-end gap-1 h-6 px-1">
                      {[0, 1, 2, 3, 4].map((bar) => (
                        <motion.div
                          key={bar}
                          animate={{ height: [4, 18, 4] }}
                          transition={{
                            duration: 0.6 + bar * 0.1,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="w-1 bg-sky-500 rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Large Animated Weather Illustration */}
              <div className="w-full md:w-2/5 flex items-center justify-center shrink-0">
                <WeatherIllustration condition={weather.current.condition} />
              </div>
            </div>
          </motion.div>

          {/* LARGE WEATHER ACTION CARDS */}
          <div className="space-y-3">
            <motion.div variants={itemVariants}>
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Action Recommendations
              </h3>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {weather.recommendations.map((decision) => {
                const CardIcon = getCardIcon(decision.id);
                const scoreValue =
                  decision.id === 'dry_clothes'
                    ? weather.scores.drying
                    : decision.id === 'travel_safe'
                    ? weather.scores.travel
                    : decision.id === 'outdoor_activity'
                    ? weather.scores.outdoor
                    : decision.id === 'walking'
                    ? weather.scores.walking
                    : weather.scores.farming;

                return (
                  <motion.div key={decision.id} variants={itemVariants}>
                    <Card interactive className="h-full flex flex-col justify-between p-5 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            <CardIcon className="w-4.5 h-4.5" />
                          </div>
                          {/* Radial / score display */}
                          <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-lg border border-slate-200/40 dark:border-slate-800/40">
                            Score: {scoreValue}%
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            {decision.question}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                decision.type === 'YES'
                                  ? 'bg-emerald-500'
                                  : decision.type === 'NO'
                                  ? 'bg-rose-500'
                                  : 'bg-amber-500'
                              }`}
                            />
                            <span className="text-sm font-extrabold tracking-tight">
                              {decision.answer}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-500 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                        {decision.reason}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* LOWER GRID FOR FORECASTS & METRICS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Weather Card & Rain Timeline */}
            <div className="lg:col-span-2 space-y-6">
              {/* Secondary weather metrics */}
              <motion.div variants={itemVariants}>
                <Card className="p-5 md:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-3">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t('common.currentConditions')}
                    </span>
                    <span className="text-[9px] bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-xl font-bold uppercase tracking-wider">
                      Live Open-Meteo
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                        {t('weather.humidity')}
                      </span>
                      <p className="text-sm font-extrabold">{weather.current.humidity}%</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                        {t('weather.windSpeed')}
                      </span>
                      <p className="text-sm font-extrabold">{weather.current.windSpeed} km/h</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                        {t('weather.rainProbability')}
                      </span>
                      <p className="text-sm font-extrabold">{weather.current.rainProbability}%</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                        {t('weather.uvIndex')}
                      </span>
                      <p className="text-sm font-extrabold">
                        {weather.current.uvIndex} ({weather.current.uvIndex >= 6 ? t('weather.uvHigh') : weather.current.uvIndex >= 3 ? t('weather.uvMod') : t('weather.uvLow')})
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Rain Probability Timeline */}
              <motion.div variants={itemVariants}>
                <Card className="p-5 md:p-6 space-y-4">
                  <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">
                    Rain Timeline (Next 6 Hours)
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {weather.hourly.slice(0, 6).map((hour, i) => (
                      <div key={i} className="flex flex-col items-center justify-between text-center p-3 rounded-xl bg-slate-100/40 dark:bg-slate-800/20 border border-slate-200/30 dark:border-slate-800/40 space-y-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          {hour.formattedTime}
                        </span>
                        <div className="text-[10px] font-extrabold text-sky-500">
                          {hour.rainProbability}%
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-sky-500 h-full rounded-full"
                            style={{ width: `${hour.rainProbability}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Live Weather Map */}
              <motion.div variants={itemVariants}>
                <Card className="p-5 md:p-6 space-y-4 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">
                      Live Weather Map
                    </h3>
                    <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-[250px] md:h-[300px] relative border border-slate-200 dark:border-slate-800">
                    <WeatherMapWidget />
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Right sidebar: Projections, Alerts, Favorites */}
            <div className="space-y-6">
              {/* Weather Alerts / Advisories */}
              <motion.div variants={itemVariants}>
                <Card className="p-5 md:p-6 space-y-4">
                  <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t('alerts.title')}
                  </h3>

                  {weather.scores.overallSafety < 65 || weather.current.condition === 'stormy' ? (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-rose-600 dark:text-rose-450 uppercase">
                          Weather Warning
                        </h4>
                        <p className="text-[10px] font-semibold text-slate-650 dark:text-slate-350 leading-relaxed">
                          {weather.current.condition === 'stormy'
                            ? 'Severe storm and electrical lighting warnings active. Avoid travels.'
                            : 'Heavy rains and reduced safety conditions predicted in this sector.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
                      <Activity className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-450 uppercase">
                          All Clear
                        </h4>
                        <p className="text-[10px] font-semibold text-slate-650 dark:text-slate-350 leading-relaxed">
                          Local metrics indicate calm conditions. No active dangerous warning protocols.
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Weekly projections */}
              <motion.div variants={itemVariants}>
                <Card className="p-5 md:p-6 space-y-4">
                  <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">
                    Weekly Projections
                  </h3>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {weather.daily.slice(0, 5).map((day, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 text-xs font-bold">
                        <span className="text-slate-500 dark:text-slate-400 w-12">{day.dayName}</span>
                        <span className="text-slate-600 dark:text-slate-350">{day.tempMax}° / {day.tempMin}°</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-sky-500">{day.rainProbability}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Quick bookmarks favorites shortcuts */}
              {favorites.length > 0 && (
                <motion.div variants={itemVariants}>
                  <Card className="p-5 md:p-6 space-y-4">
                    <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">
                      Bookmarked Stations
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {favorites.slice(0, 4).map((fav, i) => (
                        <button
                          key={i}
                          onClick={() => changeLocation(fav)}
                          className="p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 text-left hover:border-sky-500/40 text-[10px] font-bold line-clamp-1 truncate active:scale-95 transition-all"
                        >
                          {fav.name}
                        </button>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Manual Weather theme preview widget */}
      <motion.div variants={itemVariants}>
        <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
          <div>
            <h4 className="text-[10px] md:text-xs font-bold tracking-wide uppercase text-slate-400 mb-1">
              {t('common.preview_title')}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-300">
              {t('common.preview_desc')}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {themesList.map((tItem) => {
              const ThemeIcon = tItem.icon;
              const isSelected = weatherTheme === tItem.id;
              return (
                <button
                  key={tItem.id}
                  onClick={() => setWeatherTheme(tItem.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold border transition-all duration-300 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-sky-500 text-sky-600 dark:text-sky-400 shadow-md scale-105'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <ThemeIcon className={`w-3.5 h-3.5 ${isSelected ? 'animate-pulse' : ''}`} />
                  {tItem.name}
                </button>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
