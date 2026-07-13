import { CurrentWeather } from '@/types/weather';
import { WeatherScores } from '../score/scoreEngine';

export interface DecisionItem {
  id: string;
  question: string;
  answer: string;
  type: 'YES' | 'NO' | 'CAUTION';
  reason: string;
}

/**
 * Generates dynamic decisions based on scores and current weather.
 * Accepts the active i18next `t` function to provide translations.
 */
export function generateRecommendations(
  weather: CurrentWeather,
  scores: WeatherScores,
  t: any
): DecisionItem[] {
  const decisions: DecisionItem[] = [];

  // 1. Dry Clothes
  let dryType: 'YES' | 'NO' | 'CAUTION' = 'YES';
  let dryAnswer = t('decisions.yes', 'Yes');
  let dryReason = '';

  if (scores.drying >= 75) {
    dryType = 'YES';
    dryAnswer = t('decisions.yes', 'Yes');
    dryReason = t('decisions_data.sunny.dry_clothes', 'It is a sunny day, clothes will dry quickly.');
  } else if (scores.drying >= 40) {
    dryType = 'CAUTION';
    dryAnswer = t('decisions.caution', 'Caution');
    dryReason = t('decisions_data.cloudy.dry_clothes', 'High cloud cover or humidity might delay drying.');
  } else {
    dryType = 'NO';
    dryAnswer = t('decisions.no', 'No');
    dryReason = t('decisions_data.rainy.dry_clothes', 'Rain makes it unsuitable; dry clothes indoors.');
  }

  decisions.push({
    id: 'dry_clothes',
    question: t('questions.dry_clothes', 'Can I dry clothes?'),
    answer: dryAnswer,
    type: dryType,
    reason: dryReason,
  });

  // 2. Carry Umbrella
  let umbType: 'YES' | 'NO' | 'CAUTION' = 'NO';
  let umbAnswer = t('decisions.no', 'No');
  let umbReason = '';

  if (weather.rainProbability >= 60 || weather.condition === 'rainy' || weather.condition === 'stormy') {
    umbType = 'YES';
    umbAnswer = t('decisions.yes', 'Yes');
    umbReason = t('decisions_data.rainy.carry_umbrella', 'High rain probability, keep an umbrella handy.');
  } else if (weather.rainProbability >= 20) {
    umbType = 'CAUTION';
    umbAnswer = t('decisions.yes', 'Yes'); // still recommend carrying but as a warning
    umbReason = t('decisions_data.cloudy.carry_umbrella', 'Skies are overcast, light drizzles are possible.');
  } else {
    umbType = 'NO';
    umbAnswer = t('decisions.no', 'No');
    umbReason = t('decisions_data.sunny.carry_umbrella', 'Very low chance of precipitation.');
  }

  decisions.push({
    id: 'carry_umbrella',
    question: t('questions.carry_umbrella', 'Should I carry an umbrella?'),
    answer: umbAnswer,
    type: umbType,
    reason: umbReason,
  });

  // 3. Travel Safe
  let travType: 'YES' | 'NO' | 'CAUTION' = 'YES';
  let travAnswer = t('decisions.yes', 'Yes');
  let travReason = '';

  if (scores.travel >= 75) {
    travType = 'YES';
    travAnswer = t('decisions.yes', 'Yes');
    travReason = t('decisions_data.sunny.travel_safe', 'Good visibility and clear roads.');
  } else if (scores.travel >= 40) {
    travType = 'CAUTION';
    travAnswer = t('decisions.caution', 'Caution');
    travReason = t('decisions_data.rainy.travel_safe', 'Roads may be wet and slippery, drive carefully.');
  } else {
    travType = 'NO';
    travAnswer = t('decisions.no', 'No');
    travReason = t('decisions_data.stormy.travel_safe', 'Strong wind gusts and storms, delay travel.');
  }

  decisions.push({
    id: 'travel_safe',
    question: t('questions.travel_safe', 'Is it safe to travel?'),
    answer: travAnswer,
    type: travType,
    reason: travReason,
  });

  // 4. Outdoor Activity
  let outType: 'YES' | 'NO' | 'CAUTION' = 'YES';
  let outAnswer = t('decisions.yes', 'Yes');
  let outReason = '';

  if (scores.outdoor >= 75) {
    outType = 'YES';
    outAnswer = t('decisions.yes', 'Yes');
    outReason = t('decisions_data.sunny.outdoor_activity', 'Weather is pleasant for outdoor events.');
  } else if (scores.outdoor >= 40) {
    outType = 'CAUTION';
    outAnswer = t('decisions.caution', 'Caution');
    outReason = t('decisions_data.cloudy.outdoor_activity', 'Cloudy skies, stay close to shelters.');
  } else {
    outType = 'NO';
    outAnswer = t('decisions.no', 'No');
    outReason = t('decisions_data.stormy.outdoor_activity', 'Danger of lightning strikes, remain indoors.');
  }

  decisions.push({
    id: 'outdoor_activity',
    question: t('questions.outdoor_activity', 'Is today suitable for outdoor activities?'),
    answer: outAnswer,
    type: outType,
    reason: outReason,
  });

  // 5. Suitable for Farming
  let farmType: 'YES' | 'NO' | 'CAUTION' = 'YES';
  let farmAnswer = t('decisions.yes', 'Yes');
  let farmReason = '';

  if (scores.farming >= 75) {
    farmType = 'YES';
    farmAnswer = t('decisions.yes', 'Yes');
    farmReason = t('about.why_point1', 'Favorable temperature and humidity for irrigation and crop checks.');
  } else if (scores.farming >= 40) {
    farmType = 'CAUTION';
    farmAnswer = t('decisions.caution', 'Caution');
    farmReason = t('about.why_point3', 'Moderate weather, soil moisture levels are highly variable.');
  } else {
    farmType = 'NO';
    farmAnswer = t('decisions.no', 'No');
    farmReason = t('decisions_data.stormy.outdoor_activity', 'High storms or extreme heat will damage young seedlings.');
  }

  decisions.push({
    id: 'outdoor_farming',
    question: t('questions.outdoor_farming', 'Is today suitable for farming?'),
    answer: farmAnswer,
    type: farmType,
    reason: farmReason,
  });

  return decisions;
}
