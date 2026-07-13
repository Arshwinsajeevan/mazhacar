import { CurrentWeather } from '@/types/weather';
import { scoreConfigs } from './scoreConfig';

export interface WeatherScores {
  drying: number;
  travel: number;
  outdoor: number;
  walking: number;
  farming: number;
  overallSafety: number;
}

/**
 * Calculates all MazhaCar Weather Scores (0 - 100).
 */
export function calculateScores(weather: CurrentWeather): WeatherScores {
  const { drying: dCfg, travel: tCfg, outdoor: oCfg, walking: wCfg, farming: fCfg } = scoreConfigs;

  // 1. CLOTHES DRYING SCORE
  // Temp component
  const tempScore = Math.min(100, Math.max(0, (weather.temperature / dCfg.optimalTemp) * 100));
  // Humidity component (lower is better)
  const humidityScore = Math.min(
    100,
    Math.max(0, ((100 - weather.humidity) / (100 - dCfg.optimalHumidity)) * 100)
  );
  // Wind component (bell curve: too little is slow, too much blows clothes away)
  let windScore = 0;
  if (weather.windSpeed < dCfg.optimalWind) {
    windScore = (weather.windSpeed / dCfg.optimalWind) * 100;
  } else {
    // Declines above optimal speed, dropping to 0 at 40 km/h
    windScore = Math.max(0, 100 - ((weather.windSpeed - dCfg.optimalWind) / 28) * 100);
  }
  // UV index component (helps sanitize & dry)
  const uvScore = Math.min(100, (weather.uvIndex / 10) * 100);
  // Cloud cover (less is better)
  const cloudScore = 100 - weather.cloudCover;
  // Rain probability (lower is better)
  const rainScore = 100 - weather.rainProbability;

  const drying = Math.round(
    tempScore * dCfg.tempWeight +
      humidityScore * dCfg.humidityWeight +
      windScore * dCfg.windWeight +
      uvScore * dCfg.uvWeight +
      cloudScore * dCfg.cloudWeight +
      rainScore * dCfg.rainWeight
  );

  // 2. TRAVEL SCORE
  // Rain factor (lower is safer)
  const tRainScore = 100 - weather.rainProbability;
  // Wind factor
  const tWindScore = Math.max(0, 100 - (weather.windSpeed / tCfg.unsafeWindLimit) * 100);
  // Visibility factor (e.g. 10km is 100%, 3km is 0%)
  const tVisScore = Math.min(
    100,
    Math.max(0, ((weather.visibility - tCfg.poorVisibilityLimit) / (10 - tCfg.poorVisibilityLimit)) * 100)
  );
  // Condition penalty
  let tCondScore = 100;
  if (weather.condition === 'cloudy') tCondScore = 90;
  if (weather.condition === 'rainy') tCondScore = 55;
  if (weather.condition === 'stormy') tCondScore = 10;

  const travel = Math.round(
    tRainScore * tCfg.rainWeight +
      tWindScore * tCfg.windWeight +
      tVisScore * tCfg.visibilityWeight +
      tCondScore * tCfg.conditionWeight
  );

  // 3. OUTDOOR SCORE
  // Rain factor
  const oRainScore = 100 - weather.rainProbability;
  // UV Index factor (excessive UV degrades score)
  const oUvScore = Math.max(0, 100 - (Math.max(0, weather.uvIndex - 5) / (oCfg.dangerUV - 5)) * 100);
  // Temperature comfort
  let oTempScore = 100;
  if (weather.temperature > 30) {
    oTempScore = Math.max(0, 100 - ((weather.temperature - 30) / (oCfg.hotTempThreshold - 30)) * 100);
  } else if (weather.temperature < 18) {
    oTempScore = Math.max(0, 100 - ((18 - weather.temperature) / (18 - oCfg.coldTempThreshold)) * 100);
  }
  // Condition factor
  let oCondScore = 100;
  if (weather.condition === 'cloudy') oCondScore = 90;
  if (weather.condition === 'rainy') oCondScore = 40;
  if (weather.condition === 'stormy') oCondScore = 5;

  const outdoor = Math.round(
    oRainScore * oCfg.rainWeight +
      oUvScore * oCfg.uvWeight +
      oTempScore * oCfg.tempWeight +
      oCondScore * oCfg.conditionWeight
  );

  // 4. WALKING SCORE
  // Temp comfort
  let wTempScore = 100;
  if (weather.temperature > wCfg.idealTempMax) {
    wTempScore = Math.max(0, 100 - ((weather.temperature - wCfg.idealTempMax) / 10) * 100);
  } else if (weather.temperature < wCfg.idealTempMin) {
    wTempScore = Math.max(0, 100 - ((wCfg.idealTempMin - weather.temperature) / 10) * 100);
  }
  // Rain factor
  const wRainScore = 100 - weather.rainProbability;
  // UV factor
  const wUvScore = Math.max(0, 100 - (weather.uvIndex / 8) * 100);
  // Humidity factor
  const wHumidScore = Math.max(0, 100 - Math.abs(weather.humidity - 55));

  const walking = Math.round(
    wTempScore * wCfg.tempWeight +
      wRainScore * wCfg.rainWeight +
      wUvScore * wCfg.uvWeight +
      wHumidScore * wCfg.humidityWeight
  );

  // 5. FARMING SCORE
  // Temp factor
  let fTempScore = 100;
  if (weather.temperature > fCfg.optimalTempMax) {
    fTempScore = Math.max(0, 100 - ((weather.temperature - fCfg.optimalTempMax) / 8) * 100);
  } else if (weather.temperature < fCfg.optimalTempMin) {
    fTempScore = Math.max(0, 100 - ((fCfg.optimalTempMin - weather.temperature) / 8) * 100);
  }
  // Humidity factor (higher humidity is favorable for tropical farming)
  const fHumidScore =
    weather.humidity >= fCfg.optimalHumidityMin
      ? 100
      : (weather.humidity / fCfg.optimalHumidityMin) * 100;
  // Rain factor (moderate precipitation is optimal; dry and storm are poor)
  let fRainScore = 60; // baseline for no rain
  if (weather.rainProbability >= 20 && weather.rainProbability <= 60) {
    fRainScore = 100; // perfect watering
  } else if (weather.rainProbability > 60) {
    fRainScore = Math.max(20, 100 - ((weather.rainProbability - 60) / 40) * 80); // waterlogging
  } else {
    fRainScore = 60 + (weather.rainProbability / 20) * 40; // slight moisture
  }
  // Cloud cover factor
  const fCloudScore = 100 - weather.cloudCover * fCfg.cloudWeight;

  const farming = Math.round(
    fTempScore * fCfg.tempWeight +
      fHumidScore * fCfg.humidityWeight +
      fRainScore * fCfg.rainWeight +
      fCloudScore * fCfg.cloudWeight
  );

  // 6. OVERALL SAFETY SCORE
  // Heavy weight on storm and heavy rain
  let overallSafety = 100;
  if (weather.condition === 'stormy') {
    overallSafety = 15;
  } else if (weather.condition === 'rainy') {
    overallSafety = Math.max(30, 95 - weather.rainProbability * 0.6);
  } else if (weather.condition === 'cloudy') {
    overallSafety = 85;
  } else {
    // Sunny safety
    overallSafety = weather.uvIndex >= 9 ? 85 : 95; // high UV reduces outdoors safety slightly
  }

  return {
    drying: Math.max(0, Math.min(100, drying)),
    travel: Math.max(0, Math.min(100, travel)),
    outdoor: Math.max(0, Math.min(100, outdoor)),
    walking: Math.max(0, Math.min(100, walking)),
    farming: Math.max(0, Math.min(100, farming)),
    overallSafety: Math.round(overallSafety),
  };
}
