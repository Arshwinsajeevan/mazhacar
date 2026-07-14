'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Card from '@/components/Card';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Button';
import { useWeather } from '@/hooks/useWeather';
import { useUserLocation } from '@/providers/LocationProvider';
import { AlertTriangle, Bell, BellRing, Info, Check, CloudRain, Wind, Thermometer, Eye, Sun, Droplets, CloudLightning } from 'lucide-react';

interface LiveAlert {
  id: string;
  level: 'red' | 'orange' | 'yellow' | 'green';
  title: string;
  message: string;
  icon: React.ElementType;
  time: string;
}

export default function AlertsPage() {
  const { t, i18n } = useTranslation();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const { currentLocation } = useUserLocation();
  const { data: weather, isLoading } = useWeather(currentLocation.latitude, currentLocation.longitude);

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

  // Format time relative to now for alert timestamps
  const formatAlertTime = (date: Date) => {
    const locale = i18n.language === 'ml' ? 'ml-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  // Generate REAL alerts from actual live weather data
  const liveAlerts: LiveAlert[] = useMemo(() => {
    if (!weather?.current) return [];

    const alerts: LiveAlert[] = [];
    const now = new Date();
    const timeStr = formatAlertTime(now);
    const { current } = weather;

    // --- Heavy Rain / High Rain Probability ---
    if (current.rainProbability >= 80) {
      alerts.push({
        id: 'rain_heavy',
        level: 'red',
        title: i18n.language === 'ml' ? 'ശക്തമായ മഴ മുന്നറിയിപ്പ്' : i18n.language === 'hi' ? 'भारी बारिश चेतावनी' : 'Heavy Rain Warning',
        message: i18n.language === 'ml'
          ? `മഴ സാധ്യത ${current.rainProbability}%. ശക്തമായ മഴയ്ക്ക് സാധ്യതയുണ്ട്. പുറത്തിറങ്ങുന്നത് ഒഴിവാക്കുക.`
          : i18n.language === 'hi'
          ? `बारिश की संभावना ${current.rainProbability}%। भारी बारिश की आशंका। बाहर जाने से बचें।`
          : `Rain probability ${current.rainProbability}%. Heavy rainfall likely. Avoid going outside.`,
        icon: CloudRain,
        time: timeStr,
      });
    } else if (current.rainProbability >= 50) {
      alerts.push({
        id: 'rain_moderate',
        level: 'orange',
        title: i18n.language === 'ml' ? 'മഴ മുന്നറിയിപ്പ്' : i18n.language === 'hi' ? 'बारिश चेतावनी' : 'Rain Alert',
        message: i18n.language === 'ml'
          ? `മഴ സാധ്യത ${current.rainProbability}%. കുട കൊണ്ടുപോകുക.`
          : i18n.language === 'hi'
          ? `बारिश की संभावना ${current.rainProbability}%। छाता साथ रखें।`
          : `Rain probability ${current.rainProbability}%. Carry an umbrella.`,
        icon: CloudRain,
        time: timeStr,
      });
    } else if (current.rainProbability >= 30) {
      alerts.push({
        id: 'rain_light',
        level: 'yellow',
        title: i18n.language === 'ml' ? 'ചെറിയ മഴ സാധ്യത' : i18n.language === 'hi' ? 'हल्की बारिश संभव' : 'Light Rain Possible',
        message: i18n.language === 'ml'
          ? `മഴ സാധ്യത ${current.rainProbability}%. ചെറിയ മഴയ്ക്ക് സാധ്യതയുണ്ട്.`
          : i18n.language === 'hi'
          ? `बारिश की संभावना ${current.rainProbability}%। हल्की बारिश हो सकती है।`
          : `Rain probability ${current.rainProbability}%. Light showers possible.`,
        icon: Droplets,
        time: timeStr,
      });
    }

    // --- Strong Wind ---
    if (current.windSpeed >= 50) {
      alerts.push({
        id: 'wind_danger',
        level: 'red',
        title: i18n.language === 'ml' ? 'അപകടകരമായ കാറ്റ്' : i18n.language === 'hi' ? 'खतरनाक हवा' : 'Dangerous Wind',
        message: i18n.language === 'ml'
          ? `കാറ്റിന്റെ വേഗം ${current.windSpeed} km/h. പുറത്തിറങ്ങരുത്.`
          : i18n.language === 'hi'
          ? `हवा की गति ${current.windSpeed} km/h। बाहर न जाएं।`
          : `Wind speed ${current.windSpeed} km/h. Stay indoors.`,
        icon: Wind,
        time: timeStr,
      });
    } else if (current.windSpeed >= 30) {
      alerts.push({
        id: 'wind_strong',
        level: 'orange',
        title: i18n.language === 'ml' ? 'ശക്തമായ കാറ്റ്' : i18n.language === 'hi' ? 'तेज हवा' : 'Strong Wind',
        message: i18n.language === 'ml'
          ? `കാറ്റിന്റെ വേഗം ${current.windSpeed} km/h. യാത്ര ശ്രദ്ധിക്കുക.`
          : i18n.language === 'hi'
          ? `हवा की गति ${current.windSpeed} km/h। यात्रा में सावधानी बरतें।`
          : `Wind speed ${current.windSpeed} km/h. Be cautious while travelling.`,
        icon: Wind,
        time: timeStr,
      });
    }

    // --- Extreme Heat ---
    if (current.apparentTemperature >= 42) {
      alerts.push({
        id: 'heat_extreme',
        level: 'red',
        title: i18n.language === 'ml' ? 'തീവ്രമായ ചൂട്' : i18n.language === 'hi' ? 'अत्यधिक गर्मी' : 'Extreme Heat',
        message: i18n.language === 'ml'
          ? `അനുഭവ ഊഷ്മാവ് ${current.apparentTemperature}°C. ഹീറ്റ് സ്ട്രോക്ക് സാധ്യത.`
          : i18n.language === 'hi'
          ? `अनुभव तापमान ${current.apparentTemperature}°C। हीट स्ट्रोक का खतरा।`
          : `Feels like ${current.apparentTemperature}°C. Heat stroke risk.`,
        icon: Thermometer,
        time: timeStr,
      });
    } else if (current.apparentTemperature >= 38) {
      alerts.push({
        id: 'heat_high',
        level: 'orange',
        title: i18n.language === 'ml' ? 'ഉയർന്ന ചൂട്' : i18n.language === 'hi' ? 'उच्च ताप' : 'High Heat',
        message: i18n.language === 'ml'
          ? `അനുഭവ ഊഷ്മാവ് ${current.apparentTemperature}°C. വെള്ളം ധാരാളം കുടിക്കുക.`
          : i18n.language === 'hi'
          ? `अनुभव तापमान ${current.apparentTemperature}°C। खूब पानी पिएं।`
          : `Feels like ${current.apparentTemperature}°C. Stay hydrated.`,
        icon: Thermometer,
        time: timeStr,
      });
    }

    // --- UV Index ---
    if (current.uvIndex >= 8) {
      alerts.push({
        id: 'uv_high',
        level: 'orange',
        title: i18n.language === 'ml' ? 'ഉയർന്ന UV സൂചിക' : i18n.language === 'hi' ? 'उच्च UV सूचकांक' : 'High UV Index',
        message: i18n.language === 'ml'
          ? `UV സൂചിക ${current.uvIndex}. സൺസ്ക്രീൻ ഉപയോഗിക്കുക. 10AM-4PM നേരിട്ട് വെയിലത്ത് നിൽക്കരുത്.`
          : i18n.language === 'hi'
          ? `UV सूचकांक ${current.uvIndex}। सनस्क्रीन लगाएं। 10AM-4PM धूप से बचें।`
          : `UV index ${current.uvIndex}. Apply sunscreen. Avoid direct sun 10AM-4PM.`,
        icon: Sun,
        time: timeStr,
      });
    }

    // --- Low Visibility ---
    if (current.visibility <= 2) {
      alerts.push({
        id: 'visibility_low',
        level: 'orange',
        title: i18n.language === 'ml' ? 'കുറഞ്ഞ ദൃശ്യപരത' : i18n.language === 'hi' ? 'कम दृश्यता' : 'Low Visibility',
        message: i18n.language === 'ml'
          ? `ദൃശ്യപരത ${current.visibility} km മാത്രം. വാഹനം ഓടിക്കുമ്പോൾ ശ്രദ്ധിക്കുക.`
          : i18n.language === 'hi'
          ? `दृश्यता केवल ${current.visibility} km। ड्राइविंग में सावधानी बरतें।`
          : `Visibility only ${current.visibility} km. Drive carefully.`,
        icon: Eye,
        time: timeStr,
      });
    }

    // --- Stormy Condition ---
    if (current.condition === 'stormy') {
      alerts.push({
        id: 'storm',
        level: 'red',
        title: i18n.language === 'ml' ? 'കൊടുങ്കാറ്റ് മുന്നറിയിപ്പ്' : i18n.language === 'hi' ? 'तूफान चेतावनी' : 'Storm Warning',
        message: i18n.language === 'ml'
          ? `ഇടിമിന്നലും കൊടുങ്കാറ്റും പ്രതീക്ഷിക്കുന്നു. സുരക്ഷിതമായ സ്ഥലത്ത് നിൽക്കുക.`
          : i18n.language === 'hi'
          ? `बिजली और तूफान की आशंका। सुरक्षित स्थान पर रहें।`
          : `Thunderstorms expected. Stay in a safe place.`,
        icon: CloudLightning,
        time: timeStr,
      });
    }

    // --- High Humidity ---
    if (current.humidity >= 90) {
      alerts.push({
        id: 'humidity_high',
        level: 'yellow',
        title: i18n.language === 'ml' ? 'ഉയർന്ന ആർദ്രത' : i18n.language === 'hi' ? 'उच्च आर्द्रता' : 'High Humidity',
        message: i18n.language === 'ml'
          ? `ആർദ്രത ${current.humidity}%. ശാരീരിക അസ്വസ്ഥത ഉണ്ടായേക്കാം. ജലാംശം നിലനിർത്തുക.`
          : i18n.language === 'hi'
          ? `आर्द्रता ${current.humidity}%। शारीरिक असुविधा हो सकती है। पानी पीते रहें।`
          : `Humidity ${current.humidity}%. May feel uncomfortable. Stay hydrated.`,
        icon: Droplets,
        time: timeStr,
      });
    }

    return alerts;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather, i18n.language]);

  // Sort alerts: red first, then orange, then yellow, then green
  const sortedAlerts = useMemo(() => {
    const levelOrder = { red: 0, orange: 1, yellow: 2, green: 3 };
    return [...liveAlerts].sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
  }, [liveAlerts]);

  const alertColors: Record<string, { border: string; bg: string; text: string; icon: string }> = {
    red: { border: 'border-l-red-500', bg: 'bg-red-500/5', text: 'text-red-600 dark:text-red-400', icon: 'text-red-500' },
    orange: { border: 'border-l-orange-500', bg: 'bg-orange-500/5', text: 'text-orange-600 dark:text-orange-400', icon: 'text-orange-500' },
    yellow: { border: 'border-l-amber-500', bg: 'bg-amber-500/5', text: 'text-amber-600 dark:text-amber-400', icon: 'text-amber-500' },
    green: { border: 'border-l-emerald-500', bg: 'bg-emerald-500/5', text: 'text-emerald-600 dark:text-emerald-400', icon: 'text-emerald-500' },
  };

  const levelLabels: Record<string, string> = {
    red: i18n.language === 'ml' ? 'ചുവപ്പ് അലേർട്ട്' : i18n.language === 'hi' ? 'लाल अलर्ट' : 'Red Alert',
    orange: i18n.language === 'ml' ? 'ഓറഞ്ച് അലേർട്ട്' : i18n.language === 'hi' ? 'नारंगी अलर्ट' : 'Orange Alert',
    yellow: i18n.language === 'ml' ? 'മഞ്ഞ അലേർട്ട്' : i18n.language === 'hi' ? 'पीला अलर्ट' : 'Yellow Alert',
    green: i18n.language === 'ml' ? 'പച്ച അലേർട്ട്' : i18n.language === 'hi' ? 'हरा अलर्ट' : 'Green Alert',
  };

  // Request browser permission for notifications
  const handleRequestPermission = () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        setNotifEnabled(true);
        new Notification(t('common.appName', 'MazhaCar'), {
          body: t('alerts.custom_alerts_desc', 'Alerts are enabled on your device!'),
          icon: '/logo.png',
        });
      } else {
        setNotifEnabled(false);
      }
    });
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title={t('alerts.title')}
          subtitle={t('about.free_service_desc')}
          action={
            <Button
              variant={notifEnabled ? 'solid' : 'glass'}
              onClick={handleRequestPermission}
            >
              {notifEnabled ? (
                <>
                  <BellRing className="w-4 h-4 text-white" />
                  {t('settings.notifications', 'Notifications Enabled')}
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  {t('settings.notifications', 'Enable Alerts')}
                </>
              )}
            </Button>
          }
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Active Alerts list */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div variants={itemVariants} className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-400">
              {t('alerts.active_advisories')}
            </h2>
            <span className="text-[10px] font-bold text-slate-400 bg-white/20 dark:bg-slate-900/20 px-2.5 py-1 rounded-lg">
              {currentLocation.name}
            </span>
          </motion.div>

          {isLoading ? (
            <motion.div variants={itemVariants}>
              <Card className="h-32 animate-pulse bg-white/10 dark:bg-slate-900/10" />
            </motion.div>
          ) : sortedAlerts.length > 0 ? (
            sortedAlerts.map((alert) => {
              const colors = alertColors[alert.level];
              const Icon = alert.icon;
              return (
                <motion.div key={alert.id} variants={itemVariants}>
                  <Card className={`border-l-8 ${colors.border} ${colors.bg}`}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 flex-1">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider ${colors.text}`}>
                          {levelLabels[alert.level]}
                        </span>
                        <h3 className={`text-base font-extrabold ${colors.text}`}>
                          {alert.title}
                        </h3>
                        <p className="text-sm font-semibold mt-2 leading-relaxed text-slate-600 dark:text-slate-200">
                          {alert.message}
                        </p>
                        <span className="inline-block text-[10px] text-slate-400 font-semibold pt-3">
                          {i18n.language === 'ml' ? 'അവസാനം പരിശോധിച്ചത്' : i18n.language === 'hi' ? 'अंतिम जाँच' : 'Last checked'}: {alert.time}
                        </span>
                      </div>
                      <div className={`p-2 rounded-xl bg-white/30 dark:bg-slate-900/30 ${colors.icon}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="border-l-8 border-l-emerald-500 bg-emerald-500/5 text-center py-8 space-y-2">
                <Check className="w-8 h-8 text-emerald-500 mx-auto" />
                <h3 className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {i18n.language === 'ml' ? 'നിലവിൽ അലേർട്ടുകൾ ഇല്ല' : i18n.language === 'hi' ? 'कोई अलर्ट नहीं' : 'No Active Alerts'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {i18n.language === 'ml'
                    ? 'കാലാവസ്ഥ സുരക്ഷിതമാണ്. പുറത്ത് പോകാം!'
                    : i18n.language === 'hi'
                    ? 'मौसम सुरक्षित है। बाहर जा सकते हैं!'
                    : 'Weather conditions are safe. You can go outside!'}
                </p>
              </Card>
            </motion.div>
          )}
        </div>

        {/* User Alert Settings Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Live Weather Stats Summary */}
          {weather?.current && (
            <motion.div variants={itemVariants}>
              <Card className="space-y-3">
                <h3 className="font-bold text-sm mb-2 uppercase tracking-wider text-slate-400">
                  {i18n.language === 'ml' ? 'തത്സമയ കാലാവസ്ഥ' : i18n.language === 'hi' ? 'लाइव मौसम' : 'Live Weather'}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: i18n.language === 'ml' ? 'ഊഷ്മാവ്' : i18n.language === 'hi' ? 'तापमान' : 'Temp', value: `${weather.current.temperature}°C` },
                    { label: i18n.language === 'ml' ? 'ആർദ്രത' : i18n.language === 'hi' ? 'आर्द्रता' : 'Humidity', value: `${weather.current.humidity}%` },
                    { label: i18n.language === 'ml' ? 'കാറ്റ്' : i18n.language === 'hi' ? 'हवा' : 'Wind', value: `${weather.current.windSpeed} km/h` },
                    { label: i18n.language === 'ml' ? 'മഴ' : i18n.language === 'hi' ? 'बारिश' : 'Rain', value: `${weather.current.rainProbability}%` },
                    { label: 'UV', value: `${weather.current.uvIndex}` },
                    { label: i18n.language === 'ml' ? 'ദൃശ്യപരത' : i18n.language === 'hi' ? 'दृश्यता' : 'Visibility', value: `${weather.current.visibility} km` },
                  ].map((stat) => (
                    <div key={stat.label} className="p-2 rounded-xl bg-white/20 dark:bg-slate-900/20 text-center">
                      <div className="text-[10px] text-slate-400 font-bold">{stat.label}</div>
                      <div className="text-sm font-extrabold mt-0.5">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-slate-400">
                {t('alerts.custom_alerts')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/20 dark:bg-slate-900/20">
                  <Check className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold">{t('alerts.rain_alerts')}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('alerts.rain_alerts_desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/20 dark:bg-slate-900/20">
                  <Check className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold">{t('alerts.travel_alerts')}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('alerts.travel_alerts_desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/20 dark:bg-slate-900/20">
                  <Check className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold">{t('alerts.lightning_alerts')}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('alerts.lightning_alerts_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-sky-500/5 dark:bg-sky-500/5 border border-sky-500/20 flex items-start gap-3">
              <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-sky-600 dark:text-sky-400">
                  {t('alerts.note_title')}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-300 mt-1 leading-relaxed">
                  {t('alerts.note_text')}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
