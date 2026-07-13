import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchWeather } from '@/services/weatherService';
import { calculateScores, WeatherScores } from '@/features/score/scoreEngine';
import { generateRecommendations, DecisionItem } from '@/features/recommendation/recommendationEngine';
import { generateWeatherSummary } from '@/features/recommendation/summaryGenerator';
import { WeatherData } from '@/types/weather';

export interface EnrichedWeatherData extends WeatherData {
  scores: WeatherScores;
  recommendations: DecisionItem[];
  summary: string;
  isOfflineFallback: boolean;
}

// Resilient default mock data when offline and cache is empty
const MOCK_FALLBACK_WEATHER: WeatherData = {
  latitude: 9.9312,
  longitude: 76.2673,
  timezone: 'Asia/Kolkata',
  current: {
    time: '2026-07-13T12:00',
    temperature: 28,
    apparentTemperature: 32,
    humidity: 78,
    windSpeed: 14,
    windDirection: 270,
    rainProbability: 35,
    cloudCover: 85,
    visibility: 12000,
    pressure: 1009,
    uvIndex: 5,
    condition: 'cloudy',
    weatherCode: 3,
  },
  hourly: [
    {
      time: '2026-07-13T09:00',
      formattedTime: '09:00 AM',
      temperature: 26,
      apparentTemperature: 29,
      humidity: 82,
      rainProbability: 20,
      windSpeed: 12,
      windDirection: 260,
      cloudCover: 80,
      visibility: 10000,
      uvIndex: 4,
      condition: 'cloudy',
      weatherCode: 3,
    },
    {
      time: '2026-07-13T12:00',
      formattedTime: '12:00 PM',
      temperature: 29,
      apparentTemperature: 33,
      humidity: 75,
      rainProbability: 35,
      windSpeed: 14,
      windDirection: 270,
      cloudCover: 85,
      visibility: 12000,
      uvIndex: 7,
      condition: 'cloudy',
      weatherCode: 3,
    },
    {
      time: '2026-07-13T15:00',
      formattedTime: '03:00 PM',
      temperature: 28,
      apparentTemperature: 32,
      humidity: 85,
      rainProbability: 60,
      windSpeed: 15,
      windDirection: 280,
      cloudCover: 95,
      visibility: 8000,
      uvIndex: 3,
      condition: 'rainy',
      weatherCode: 61,
    },
    {
      time: '2026-07-13T18:00',
      formattedTime: '06:00 PM',
      temperature: 27,
      apparentTemperature: 31,
      humidity: 88,
      rainProbability: 40,
      windSpeed: 10,
      windDirection: 250,
      cloudCover: 90,
      visibility: 9000,
      uvIndex: 1,
      condition: 'cloudy',
      weatherCode: 3,
    },
    {
      time: '2026-07-13T21:00',
      formattedTime: '09:00 PM',
      temperature: 25,
      apparentTemperature: 28,
      humidity: 90,
      rainProbability: 15,
      windSpeed: 8,
      windDirection: 240,
      cloudCover: 50,
      visibility: 11000,
      uvIndex: 0,
      condition: 'sunny',
      weatherCode: 0,
    },
  ],
  daily: [
    {
      date: '2026-07-13',
      dayName: 'Mon',
      tempMax: 30,
      tempMin: 24,
      rainProbability: 65,
      uvIndex: 7,
      sunrise: '06:05 AM',
      sunset: '06:42 PM',
      condition: 'rainy',
      weatherCode: 61,
    },
    {
      date: '2026-07-14',
      dayName: 'Tue',
      tempMax: 31,
      tempMin: 25,
      rainProbability: 40,
      uvIndex: 8,
      sunrise: '06:06 AM',
      sunset: '06:42 PM',
      condition: 'cloudy',
      weatherCode: 3,
    },
    {
      date: '2026-07-15',
      dayName: 'Wed',
      tempMax: 32,
      tempMin: 26,
      rainProbability: 15,
      uvIndex: 9,
      sunrise: '06:06 AM',
      sunset: '06:43 PM',
      condition: 'sunny',
      weatherCode: 0,
    },
    {
      date: '2026-07-16',
      dayName: 'Thu',
      tempMax: 29,
      tempMin: 24,
      rainProbability: 80,
      uvIndex: 6,
      sunrise: '06:07 AM',
      sunset: '06:43 PM',
      condition: 'stormy',
      weatherCode: 95,
    },
    {
      date: '2026-07-17',
      dayName: 'Fri',
      tempMax: 30,
      tempMin: 25,
      rainProbability: 30,
      uvIndex: 8,
      sunrise: '06:07 AM',
      sunset: '06:43 PM',
      condition: 'cloudy',
      weatherCode: 3,
    },
  ],
};

/**
 * React Query Hook to retrieve localized, enriched weather data with offline fallback caching.
 */
export function useWeather(latitude: number, longitude: number) {
  const { t, i18n } = useTranslation();

  // Round coordinates to 3 decimal places to optimize caching granularity
  const latKey = latitude.toFixed(3);
  const lonKey = longitude.toFixed(3);
  const cacheKey = `mazhacar_cache_${latKey}_${lonKey}`;

  return useQuery<WeatherData & { isOfflineFallback: boolean }, Error, EnrichedWeatherData>({
    queryKey: ['weather', latKey, lonKey],
    queryFn: async () => {
      // 1. Check if offline and try local storage cache
      if (typeof window !== 'undefined' && !navigator.onLine) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            return { ...parsed, isOfflineFallback: true };
          } catch {
            // continue if parse fails
          }
        }
        // Fallback to static mock to avoid blank screens in sandbox
        return { ...MOCK_FALLBACK_WEATHER, isOfflineFallback: true };
      }

      // 2. Online fetch
      try {
        const data = await fetchWeather(latitude, longitude);
        if (typeof window !== 'undefined') {
          localStorage.setItem(cacheKey, JSON.stringify(data));
        }
        return { ...data, isOfflineFallback: false };
      } catch (error) {
        // Fallback to cache on api fetch failure
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              return { ...parsed, isOfflineFallback: true };
            } catch {
              // ignore cache parse errors
            }
          }
        }
        // Fallback to static mock to prevent complete load failure
        return { ...MOCK_FALLBACK_WEATHER, isOfflineFallback: true };
      }
    },
    // Configuration
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    refetchOnWindowFocus: false,

    // Derived selector: computes scores, advises, and localized summaries on the fly
    select: (data) => {
      const scores = calculateScores(data.current);
      const recommendations = generateRecommendations(data.current, scores, t);
      const summary = generateWeatherSummary(data.current, scores, i18n.language);

      return {
        ...data,
        scores,
        recommendations,
        summary,
      };
    },
  });
}
