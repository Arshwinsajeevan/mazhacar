'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Card from '@/components/Card';
import PageHeader from '@/components/PageHeader';
import { HelpCircle, Code, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  const { t } = useTranslation();

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

  const techBadges = [
    { name: 'Next.js 16 (App Router)', category: 'Frontend' },
    { name: 'React 19', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Tailwind CSS v4', category: 'Styling' },
    { name: 'Framer Motion', category: 'Animation' },
    { name: 'React Query', category: 'State Management' },
    { name: 'Leaflet & OpenStreetMap', category: 'Maps' },
    { name: 'i18next', category: 'Localization' },
    { name: 'Node.js & Express.js', category: 'Backend' },
    { name: 'Supabase PostgreSQL', category: 'Database' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-4xl">
      <motion.div variants={itemVariants}>
        <PageHeader
          title={t('about.title')}
          subtitle={t('common.tagline')}
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Vision Statement */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <HeartHandshake className="w-6 h-6 text-sky-500" />
              <h3 className="text-lg font-bold">{t('about.vision_title')}</h3>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {t('about.description1')}
            </p>
            <p className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {t('about.description2')}
            </p>
          </Card>
        </motion.div>

        {/* Dynamic decision rules helper */}
        <motion.div variants={itemVariants}>
          <Card className="h-full space-y-4">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
                {t('about.why_title')}
              </h3>
            </div>
            <div className="space-y-3 text-xs md:text-sm font-medium">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1.5" />
                <span>{t('about.why_point1')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1.5" />
                <span>{t('about.why_point2')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1.5" />
                <span>{t('about.why_point3')}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tech Stack card */}
        <motion.div variants={itemVariants}>
          <Card className="h-full space-y-4">
            <div className="flex items-center gap-3">
              <Code className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
                {t('about.tech_title')}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {techBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/20 dark:bg-slate-900/40 border border-white/20 dark:border-white/5 shadow-sm text-slate-700 dark:text-slate-200"
                >
                  {badge.name}
                </span>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Services & APIs disclosures */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Free Services Integrations
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                {t('about.free_service_desc')}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
              <ShieldCheck className="w-4 h-4" />
              100% Free Open Data Powered
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Developer */}
      <motion.div variants={itemVariants} className="pt-6 border-t border-slate-500/10 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 select-none">
        <span>MazhaCar v1.0.0</span>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Arshwinsajeevan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            github
          </a>
          <span className="text-slate-400/30">·</span>
          <a
            href="https://instagram.com/arshw1n"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            insta
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
