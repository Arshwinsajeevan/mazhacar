'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Card from '@/components/Card';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Button';
import { useUserLocation } from '@/providers/LocationProvider';
import { useWeather } from '@/hooks/useWeather';
import { LocationData } from '@/types/location';
import { Heart, Trash2, CloudRain, Sun, Cloud, CloudLightning, Plus, MapPin, Loader2 } from 'lucide-react';

function FavoriteCard({
  location,
  onRemove,
  onSelect,
}: {
  location: LocationData;
  onRemove: () => void;
  onSelect: () => void;
}) {
  const { t } = useTranslation();
  const { data: weather, isLoading, isError } = useWeather(location.latitude, location.longitude);

  const getWeatherIcon = (cond?: string) => {
    switch (cond) {
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

  const WeatherIcon = getWeatherIcon(weather?.current?.condition);

  return (
    <Card
      interactive
      onClick={onSelect}
      className="flex flex-col justify-between h-48 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">
              {location.state || 'India'}
            </span>
          </div>
          <h3 className="text-base font-extrabold group-hover:text-sky-500 transition-colors">
            {location.name}
          </h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-2 rounded-xl bg-white/20 dark:bg-slate-900/30 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 border border-white/20 dark:border-white/5 transition-all shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-xs text-slate-400 py-4">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Syncing weather...
        </div>
      ) : isError ? (
        <div className="text-xs text-rose-500 py-4">Offline / Sync error</div>
      ) : weather ? (
        <div className="flex items-center justify-between pt-4 border-t border-slate-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/30 dark:bg-slate-800/30">
              <WeatherIcon className="w-6 h-6 text-sky-500" />
            </div>
            <div>
              <p className="text-xs font-semibold">
                {t(`weather.conditions.${weather.current.condition}`, weather.current.condition)}
              </p>
              <p className="text-[10px] font-bold text-sky-600 dark:text-sky-400">
                {weather.current.rainProbability}% {t('weather.rainProbability')}
              </p>
            </div>
          </div>
          <span className="text-3xl font-extrabold tracking-tight">{weather.current.temperature}°C</span>
        </div>
      ) : null}
    </Card>
  );
}

export default function FavoritesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { favorites, toggleFavorite, changeLocation } = useUserLocation();

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
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title={t('nav.favorites')}
          subtitle={t('favorites_data.subtitle')}
          action={
            <Button
              variant="solid"
              className="flex items-center gap-2"
              onClick={() => router.push('/')}
            >
              <Plus className="w-4 h-4 text-white" />
              {t('favorites_data.add_location')}
            </Button>
          }
        />
      </motion.div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <motion.div key={fav.latitude + '-' + fav.longitude} variants={itemVariants}>
              <FavoriteCard
                location={fav}
                onRemove={() => toggleFavorite(fav)}
                onSelect={() => {
                  changeLocation(fav);
                  router.push('/');
                }}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div variants={itemVariants}>
          <Card className="flex flex-col items-center justify-center text-center py-12 space-y-4">
            <Heart className="w-12 h-12 text-slate-300 dark:text-slate-700 animate-pulse" />
            <div>
              <h3 className="font-bold text-lg">{t('favorites_data.no_favorites')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                {t('favorites_data.no_favorites_desc')}
              </p>
            </div>
            <Button variant="glass" onClick={() => router.push('/')}>
              Search Places
            </Button>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
