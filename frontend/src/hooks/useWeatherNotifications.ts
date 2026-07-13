import { useEffect, useRef } from 'react';
import { EnrichedWeatherData } from './useWeather';
import { notificationService } from '@/services/notificationService';

export function useWeatherNotifications(weather: EnrichedWeatherData | undefined) {
  const prevCondition = useRef<string | undefined>(undefined);
  const prevRainProbability = useRef<number | undefined>(undefined);
  const prevDryingScore = useRef<number | undefined>(undefined);
  const lastTriggeredTime = useRef<number>(0);

  useEffect(() => {
    if (!weather) return;

    // Check if notifications are enabled in settings
    let notificationsEnabled = true;
    try {
      const storedSettings = localStorage.getItem('mazhacar_settings');
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        if (parsed.notifications !== undefined) {
          notificationsEnabled = parsed.notifications;
        }
      }
    } catch {
      // fallback to true
    }

    if (!notificationsEnabled) return;

    // Avoid double notifications in quick succession (throttle to 10 seconds minimum)
    const now = Date.now();
    if (now - lastTriggeredTime.current < 10000) return;

    const currentCondition = weather.current.condition;
    const currentRainProb = weather.current.rainProbability;
    const currentDrying = weather.scores.drying;

    // Request permissions dynamically if granted status is default
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        notificationService.requestPermission();
      }
    }

    // 1. Rain starts: condition goes from non-rainy to rainy/stormy
    if (
      prevCondition.current !== undefined &&
      prevCondition.current !== 'rainy' &&
      prevCondition.current !== 'stormy' &&
      (currentCondition === 'rainy' || currentCondition === 'stormy')
    ) {
      notificationService.send('☔ Rain Alert', {
        body: 'Precipitation has started or is starting soon in your location. Keep an umbrella handy!',
      });
      lastTriggeredTime.current = now;
    }

    // 2. Heavy rain alert: rain probability crosses 80%
    if (
      prevRainProbability.current !== undefined &&
      prevRainProbability.current < 80 &&
      currentRainProb >= 80
    ) {
      notificationService.send('⛈️ Heavy Rain Warning', {
        body: `Heavy rain probability is high (${currentRainProb}%). Stay prepared.`,
      });
      lastTriggeredTime.current = now;
    }

    // 3. Storm / Severe alert
    if (
      prevCondition.current !== 'stormy' &&
      currentCondition === 'stormy'
    ) {
      notificationService.send('🚨 Red Alert: Thunderstorm Warning', {
        body: 'Severe winds and lightning strikes detected. Seek safe shelter immediately.',
      });
      lastTriggeredTime.current = now;
    }

    // 4. Good drying weather: drying score crosses 80%
    if (
      prevDryingScore.current !== undefined &&
      prevDryingScore.current < 80 &&
      currentDrying >= 80
    ) {
      notificationService.send('☀️ Perfect Laundry Weather', {
        body: `MazhaCar Score: ${currentDrying}/100. Excellent time to dry clothes outdoors!`,
      });
      lastTriggeredTime.current = now;
    }

    // Update references
    prevCondition.current = currentCondition;
    prevRainProbability.current = currentRainProb;
    prevDryingScore.current = currentDrying;
  }, [weather]);
}
