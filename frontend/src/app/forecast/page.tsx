'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Card from '@/components/Card';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Button';
import { useUserLocation } from '@/providers/LocationProvider';
import { useWeather } from '@/hooks/useWeather';
import {
  Sun,
  CloudRain,
  Cloud,
  CloudLightning,
  Calendar,
  Clock,
  BarChart3,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export default function ForecastPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'hourly' | 'daily'>('hourly');
  const { currentLocation } = useUserLocation();

  // Retrieve weather forecasts
  const {
    data: weather,
    isLoading: weatherLoading,
    isError: weatherError,
    refetch: refetchWeather,
  } = useWeather(currentLocation.latitude, currentLocation.longitude);

  // Helper to map condition keyword to lucide icon component
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return Sun;
      case 'rainy':
        return CloudRain;
      case 'cloudy':
        return Cloud;
      case 'stormy':
        return CloudLightning;
      default:
        return CloudRain;
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
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4 md:space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title={`${t('nav.forecast')} - ${currentLocation.name}`}
          subtitle={t('forecast_data.subtitle')}
          action={
            <div className="flex bg-white/20 dark:bg-slate-900/30 p-0.5 rounded-xl border border-white/20 dark:border-white/5 mt-2 md:mt-0 shrink-0">
              <button
                onClick={() => setTab('hourly')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-semibold transition-all ${
                  tab === 'hourly'
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {t('forecast_data.hourly')}
              </button>
              <button
                onClick={() => setTab('daily')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-semibold transition-all ${
                  tab === 'daily'
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                {t('forecast_data.daily')}
              </button>
            </div>
          }
        />
      </motion.div>

      {/* Loading Skeleton */}
      {weatherLoading && (
        <div className="flex items-center justify-center py-20 gap-3 text-slate-400 font-semibold text-xs md:text-sm">
          <Loader2 className="w-4.5 h-4.5 animate-spin" />
          Loading weather projections...
        </div>
      )}

      {/* Error state */}
      {weatherError && (
        <Card className="flex flex-col items-center justify-center text-center py-12 space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-500" />
          <div>
            <h3 className="font-bold text-lg">Unable to load forecast details</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              Please check your connection or retry manually.
            </p>
          </div>
          <Button variant="solid" onClick={() => refetchWeather()} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </Button>
        </Card>
      )}

      {/* Live Data Render */}
      {weather && !weatherLoading && !weatherError && (
        <>
          {tab === 'hourly' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-6">
              {weather.hourly.map((hour, idx) => {
                const Icon = getWeatherIcon(hour.condition);
                return (
                  <motion.div key={idx} variants={itemVariants}>
                    <Card className="flex flex-col items-center justify-between text-center p-4 space-y-3 h-44 md:h-52">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {hour.formattedTime}
                      </span>
                      <div className="p-2.5 rounded-2xl bg-white/30 dark:bg-slate-800/30 flex items-center justify-center">
                        <Icon className="w-7 h-7 md:w-8 md:h-8 text-sky-500" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">{hour.temperature}°C</h3>
                        <p className="text-[9px] text-sky-600 dark:text-sky-400 font-bold mt-0.5">
                          {hour.rainProbability}% {t('weather.rainProbability')}
                        </p>
                      </div>

                      {/* Visual progress bar for rain probability */}
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-sky-500 h-full rounded-full"
                          style={{ width: `${hour.rainProbability}%` }}
                        />
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {weather.daily.map((day, idx) => {
                const Icon = getWeatherIcon(day.condition);
                return (
                  <motion.div key={idx} variants={itemVariants}>
                    <Card className="flex items-center justify-between gap-3 py-3.5 px-4 md:px-6">
                      {/* Day Label & Weather condition icon */}
                      <div className="flex items-center gap-3 w-1/3 min-w-0">
                        <div className="p-1.5 rounded-xl bg-white/30 dark:bg-slate-800/30 shrink-0">
                          <Icon className="w-5 h-5 text-sky-500" />
                        </div>
                        <span className="font-extrabold text-xs md:text-base truncate">{day.dayName}</span>
                      </div>

                      {/* Temp range max/min */}
                      <div className="flex items-center gap-2 w-1/4 justify-center text-xs md:text-sm">
                        <span className="font-extrabold text-slate-800 dark:text-slate-100">{day.tempMax}°</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-500 font-semibold">{day.tempMin}°</span>
                      </div>

                      {/* Rain Probability progress bar */}
                      <div className="flex items-center gap-2 w-2/5 justify-end">
                        <span className="text-[9px] md:text-xs text-sky-600 dark:text-sky-400 font-bold shrink-0">
                          {day.rainProbability}%
                        </span>
                        <div className="w-12 md:w-24 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden shrink-0">
                          <div
                            className="bg-sky-500 h-full rounded-full"
                            style={{ width: `${day.rainProbability}%` }}
                          />
                        </div>
                        <BarChart3 className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
