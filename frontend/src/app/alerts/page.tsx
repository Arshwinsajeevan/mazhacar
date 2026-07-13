'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Card from '@/components/Card';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Button';
import { AlertTriangle, Bell, BellRing, Info, Check } from 'lucide-react';

export default function AlertsPage() {
  const { t } = useTranslation();
  const [notifEnabled, setNotifEnabled] = useState(false);

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

  // Mock active alerts in India using translation keys
  const activeAlerts = [
    {
      id: 'alert_1',
      level: 'orange',
      districtKey: 'idukki_title',
      districtDefault: 'ഇടുക്കി (Idukki)',
      titleKey: 'orange',
      titleDefault: 'Orange Alert',
      messageKey: 'stormy.desc',
      messageDefault: 'Heavy winds and thunderstorm. Avoid non-essential travels.',
      time: 'Issued: 2 hours ago',
    },
    {
      id: 'alert_2',
      level: 'yellow',
      districtKey: 'ernakulam_title',
      districtDefault: 'എറണാകുളം (Ernakulam)',
      titleKey: 'yellow',
      titleDefault: 'Yellow Alert',
      messageKey: 'rainy.desc',
      messageDefault: 'Rain is expected today. Carry an umbrella when heading out.',
      time: 'Issued: 4 hours ago',
    },
  ];

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
          icon: '/favicon.ico',
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
          <motion.h2 variants={itemVariants} className="text-base font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
            {t('alerts.active_advisories')}
          </motion.h2>

          {activeAlerts.map((alert) => (
            <motion.div key={alert.id} variants={itemVariants}>
              <Card className={`border-l-8 ${
                alert.level === 'orange'
                  ? 'border-l-orange-500 bg-orange-500/5 dark:bg-orange-500/5'
                  : 'border-l-amber-500 bg-amber-500/5 dark:bg-amber-500/5'
              }`}>
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {t(`favorites_data.${alert.districtKey}`, alert.districtDefault)}
                    </span>
                    <h3 className={`text-base font-extrabold ${
                      alert.level === 'orange' ? 'text-orange-600 dark:text-orange-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {t(`alerts.${alert.titleKey}`, alert.titleDefault)}
                    </h3>
                    <p className="text-sm font-semibold mt-2 leading-relaxed text-slate-600 dark:text-slate-200">
                      {t(`decisions_data.${alert.messageKey}`, alert.messageDefault)}
                    </p>
                    <span className="inline-block text-[10px] text-slate-400 font-semibold pt-4">
                      {alert.time}
                    </span>
                  </div>
                  <AlertTriangle className={`w-6 h-6 shrink-0 ${
                    alert.level === 'orange' ? 'text-orange-500' : 'text-amber-500'
                  }`} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* User Alert Settings Sidebar */}
        <div className="lg:col-span-1 space-y-6">
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
