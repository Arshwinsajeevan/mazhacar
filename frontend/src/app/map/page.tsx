'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import { useUserLocation } from '@/providers/LocationProvider';
import { MapPin, Navigation } from 'lucide-react';

// Dynamic import with SSR disabled for Leaflet (window check safeguard)
const WeatherMap = dynamic(() => import('@/features/map/WeatherMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] md:h-[600px] rounded-3xl bg-slate-200/50 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-white/5 flex items-center justify-center flex-col gap-4">
      <div className="w-8 h-8 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        Loading Interactive Maps...
      </span>
    </div>
  ),
});

export default function MapPage() {
  const { t } = useTranslation();
  const { favorites, changeLocation, currentLocation } = useUserLocation();

  // Fallback defaults to recommend if no favorites are saved
  const defaultShortcuts = [
    {
      latitude: 9.9312,
      longitude: 76.2673,
      name: t('favorites_data.kochi_title', 'Kochi'),
      displayName: 'Kochi, Kerala, India',
    },
    {
      latitude: 10.0889,
      longitude: 77.0595,
      name: t('favorites_data.munnar_title', 'Munnar'),
      displayName: 'Munnar, Idukki, Kerala, India',
    },
    {
      latitude: 11.2588,
      longitude: 75.7804,
      name: 'Kozhikode',
      displayName: 'Kozhikode, Kerala, India',
    },
  ];

  const activeShortcuts = favorites.length > 0 ? favorites : defaultShortcuts;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav.map')}
        subtitle={t('map_data.subtitle')}
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar Info Panels */}
        <div className="xl:col-span-1 space-y-6">
          <Card>
            <h3 className="font-bold text-sm mb-3 uppercase tracking-wider text-slate-400">
              {favorites.length > 0
                ? t('map_data.filter_title', 'Bookmarked Places')
                : t('map_data.filter_title', 'Quick Focus Shortcuts')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              {t('map_data.filter_desc')}
            </p>
            <div className="space-y-2">
              {activeShortcuts.map((loc, idx) => {
                const isActive =
                  Math.abs(loc.latitude - currentLocation.latitude) < 0.001 &&
                  Math.abs(loc.longitude - currentLocation.longitude) < 0.001;

                return (
                  <button
                    key={idx}
                    onClick={() => changeLocation(loc)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                      isActive
                        ? 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400 shadow-sm'
                        : 'bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 border-white/40 dark:border-white/10'
                    }`}
                  >
                    <MapPin className={`w-4 h-4 ${isActive ? 'text-sky-500 animate-pulse' : 'text-slate-400'}`} />
                    <span className="line-clamp-1">{loc.name}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Navigation className="w-4 h-4 text-sky-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
                {t('map_data.legend_title')}
              </h3>
            </div>
            <div className="space-y-3 text-xs font-medium">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{t('map_data.blue_label', 'Blue')}</span>
                <span className="text-sky-500 font-bold">{t('map_data.normal_rain', 'Light / Moderate')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{t('map_data.yellow_label', 'Yellow')}</span>
                <span className="text-amber-500 font-bold">{t('map_data.heavy_rain', 'Heavy Rain')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{t('map_data.red_label', 'Red')}</span>
                <span className="text-rose-500 font-bold">{t('map_data.very_heavy_rain', 'Very Heavy Rain')}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Dynamic Leaflet Map Area */}
        <div className="xl:col-span-3">
          <WeatherMap />
        </div>
      </div>
    </div>
  );
}
