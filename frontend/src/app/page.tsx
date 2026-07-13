'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';

export default function HomePage() {
  const { t } = useTranslation();
  const { weatherTheme, setWeatherTheme } = useAppTheme();
  const {
    currentLocation,
    gpsLoading,
    triggerGPS,
    toggleFavorite,
    isLocFavorite,
    changeLocation,
  } = useUserLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Get weather data for the active location
  const {
    data: weather,
    isLoading: weatherLoading,
    isError: weatherError,
    refetch: refetchWeather,
  } = useWeather(currentLocation.latitude, currentLocation.longitude);

  // Search locations matching query
  const { data: searchResults, isLoading: searchLoading } = useLocationSearch(searchQuery);

  // Track the last synced location to allow manual overrides without auto-resetting
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

  // Weather theme manual preview helper list
  const themesList = [
    { name: t('weather.conditions.sunny'), id: 'sunny' as const, icon: Sun },
    { name: t('weather.conditions.rainy'), id: 'rainy' as const, icon: CloudRain },
    { name: t('weather.conditions.cloudy'), id: 'cloudy' as const, icon: Cloud },
    { name: t('weather.conditions.stormy'), id: 'stormy' as const, icon: CloudLightning },
  ];

  // Helper to map weather code/condition to matching safety status
  const getSafetyDetails = (safetyScore: number) => {
    if (safetyScore >= 80) {
      return {
        label: t('common.safe', 'Safe'),
        color: 'text-emerald-500 dark:text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        stroke: 'stroke-emerald-500',
      };
    } else if (safetyScore >= 40) {
      return {
        label: t('common.caution', 'Caution'),
        color: 'text-amber-500 dark:text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20',
        stroke: 'stroke-amber-500',
      };
    } else {
      return {
        label: t('common.danger', 'Danger'),
        color: 'text-rose-500 dark:text-rose-400',
        bg: 'bg-rose-500/10 border-rose-500/20',
        stroke: 'stroke-rose-500',
      };
    }
  };

  // Animation constants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4 md:space-y-6 relative">
      {/* Header, location bookmark, search bar, and GPS locator */}
      <motion.div variants={itemVariants} className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 md:gap-6">
        <div className="flex items-start justify-between w-full xl:w-auto gap-4">
          <PageHeader
            title={currentLocation.name}
            subtitle={currentLocation.displayName || 'Selected Location'}
          />
          <button
            onClick={() => toggleFavorite(currentLocation)}
            className="p-2.5 rounded-2xl bg-white/20 dark:bg-slate-900/30 hover:bg-rose-500/10 border border-white/10 text-rose-500 shrink-0 shadow-sm"
          >
            <Heart
              fill={isLocFavorite(currentLocation.latitude, currentLocation.longitude) ? 'currentColor' : 'none'}
              className="w-5 h-5"
            />
          </button>
        </div>

        {/* Apple-style Location Search with GPS Locator */}
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

            {/* Dropdown containing Nominatim results */}
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
                      Searching cities in India...
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
                      No locations found in India
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            variant="glass"
            className="p-2.5 shrink-0 flex items-center justify-center rounded-2xl"
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
      </motion.div>

      {/* Offline banner indicator */}
      {weather?.isOfflineFallback && (
        <motion.div variants={itemVariants}>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-2xl flex items-center gap-2 text-xs font-semibold shadow-sm leading-normal">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Offline Mode: Currently showing cached weather data. Check your network.
          </div>
        </motion.div>
      )}

      {/* Loading Skeleton */}
      {weatherLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="h-64 animate-pulse bg-white/20 dark:bg-slate-900/10" />
          <Card className="lg:col-span-2 h-64 animate-pulse bg-white/20 dark:bg-slate-900/10" />
        </div>
      )}

      {/* Error state */}
      {weatherError && (
        <Card className="flex flex-col items-center justify-center text-center py-12 space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-500" />
          <div>
            <h3 className="font-bold text-lg">Unable to load weather details</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              Please check your connection and try again. Open-Meteo services might be experiencing high load.
            </p>
          </div>
          <Button variant="solid" onClick={() => refetchWeather()} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </Button>
        </Card>
      )}

      {weather && !weatherLoading && !weatherError && (
        <>
          {/* Main Top Section: Safety Score Circular Dial & Weather Metrics Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Safety Score Card Widget */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <Card className="h-full flex flex-col items-center justify-between text-center py-6 px-4 md:py-8">
                <div className="w-full flex items-center justify-between px-2 mb-3">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">
                    Weather Safety Score
                  </span>
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* Circular Dial */}
                <div className="relative w-36 h-36 md:w-40 md:h-40 flex items-center justify-center my-3 shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="62"
                      className="stroke-slate-200 dark:stroke-slate-800"
                      strokeWidth="6"
                      fill="transparent"
                      style={{ transform: 'translate(8px, 8px)' }}
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="62"
                      className={`transition-all duration-1000 ${getSafetyDetails(weather.scores.overallSafety).stroke}`}
                      strokeWidth="8"
                      strokeDasharray={390}
                      strokeDashoffset={390 - (390 * weather.scores.overallSafety) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      style={{ transform: 'translate(8px, 8px)' }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl md:text-4xl font-extrabold tracking-tighter">
                      {weather.scores.overallSafety}%
                    </span>
                    <span className={`text-[9px] font-bold mt-1 px-2 py-0.5 rounded-full uppercase tracking-wider ${getSafetyDetails(weather.scores.overallSafety).bg} ${getSafetyDetails(weather.scores.overallSafety).color}`}>
                      {getSafetyDetails(weather.scores.overallSafety).label}
                    </span>
                  </div>
                </div>

                <div className="mt-3 px-2">
                  <p className="text-xs md:text-sm font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                    {weather.summary}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Weather Metrics Card */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="h-full flex flex-col justify-between py-6 px-4 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">
                    Current Conditions
                  </span>
                  <span className="text-[10px] bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-white/10 px-2.5 py-0.5 rounded-xl font-semibold">
                    Live Open-Meteo
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 my-2">
                  <div className="space-y-0.5">
                    <span className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-none">
                      {weather.current.temperature}°C
                    </span>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Feels like {weather.current.apparentTemperature}°C • {currentLocation.name}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/35 dark:bg-slate-850/35 border border-white/20 shadow-inner flex items-center justify-center shrink-0">
                    {weather.current.condition === 'sunny' && <Sun className="w-12 h-12 md:w-16 md:h-16 text-amber-500 animate-spin-slow" />}
                    {weather.current.condition === 'rainy' && <CloudRain className="w-12 h-12 md:w-16 md:h-16 text-sky-500" />}
                    {weather.current.condition === 'cloudy' && <Cloud className="w-12 h-12 md:w-16 md:h-16 text-slate-400" />}
                    {weather.current.condition === 'stormy' && <CloudLightning className="w-12 h-12 md:w-16 md:h-16 text-indigo-500 animate-pulse" />}
                  </div>
                </div>

                {/* Grid metrics list */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <div className="p-3 rounded-xl bg-white/20 dark:bg-slate-900/20 border border-white/10">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      {t('weather.humidity')}
                    </span>
                    <p className="text-sm font-extrabold mt-0.5">{weather.current.humidity}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/20 dark:bg-slate-900/20 border border-white/10">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      {t('weather.windSpeed')}
                    </span>
                    <p className="text-sm font-extrabold mt-0.5">{weather.current.windSpeed} km/h</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/20 dark:bg-slate-900/20 border border-white/10">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      {t('weather.rainProbability')}
                    </span>
                    <p className="text-sm font-extrabold mt-0.5">{weather.current.rainProbability}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/20 dark:bg-slate-900/20 border border-white/10">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      {t('weather.uvIndex')}
                    </span>
                    <p className="text-sm font-extrabold mt-0.5">
                      {weather.current.uvIndex} ({weather.current.uvIndex >= 6 ? 'High' : weather.current.uvIndex >= 3 ? 'Mod' : 'Low'})
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sub Scores progress meters */}
          <motion.div variants={itemVariants}>
            <Card className="py-5 px-4 md:p-6">
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                MazhaCar Index Performance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
                {[
                  { name: t('scores.drying', 'Clothes Drying'), value: weather.scores.drying, color: 'bg-emerald-500' },
                  { name: t('scores.travel', 'Travel Safe'), value: weather.scores.travel, color: 'bg-sky-500' },
                  { name: t('scores.outdoor', 'Outdoors'), value: weather.scores.outdoor, color: 'bg-amber-500' },
                  { name: t('scores.walking', 'Walking Walk'), value: weather.scores.walking, color: 'bg-teal-500' },
                  { name: t('scores.farming', 'Farming Fit'), value: weather.scores.farming, color: 'bg-indigo-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500 dark:text-slate-400">{item.name}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Weather Actionable Decision Grid */}
          <div className="space-y-3">
            <motion.div variants={itemVariants}>
              <h2 className="text-base md:text-lg font-bold tracking-tight px-1 flex items-center gap-2">
                <Umbrella className="w-4.5 h-4.5 text-sky-500" />
                Weather Decisions (AI Recommendations)
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {weather.recommendations.map((decision) => (
                <motion.div key={decision.id} variants={itemVariants}>
                  <Card interactive className="h-full flex flex-col justify-between p-4 space-y-3">
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {decision.question}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        {decision.type === 'YES' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/20" />
                        )}
                        {decision.type === 'NO' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md shadow-rose-500/20" />
                        )}
                        {decision.type === 'CAUTION' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-md shadow-amber-500/20" />
                        )}
                        <span className="text-base font-extrabold tracking-tight">
                          {decision.answer}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-300 leading-normal pt-2 border-t border-slate-500/10">
                      {decision.reason}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Dynamic Background Controller preview widget (kept for UI flexibility) */}
      <motion.div variants={itemVariants}>
        <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
          <div>
            <h4 className="text-xs md:text-sm font-semibold tracking-wide uppercase text-slate-400 dark:text-slate-400 mb-1">
              {t('common.preview_title', 'Ambient Weather Previewer')}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-300">
              {t('common.preview_desc', 'Use these buttons to preview background changes based on weather conditions:')}
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold border transition-all duration-350 ${
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
