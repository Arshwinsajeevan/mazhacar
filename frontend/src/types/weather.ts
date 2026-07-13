export type WeatherTheme = 'sunny' | 'rainy' | 'cloudy' | 'stormy';

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number; // Feels like
  humidity: number;
  rainProbability: number;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  condition: WeatherTheme;
  weatherCode: number;
}

export interface HourlyForecast {
  time: string; // ISO String
  formattedTime: string; // "09:00 AM"
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  rainProbability: number;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
  condition: WeatherTheme;
  weatherCode: number;
}

export interface DailyForecast {
  date: string; // "2026-07-13"
  dayName: string; // "Mon", "Monday", or localized
  tempMax: number;
  tempMin: number;
  rainProbability: number;
  uvIndex: number;
  sunrise: string; // "06:12 AM"
  sunset: string; // "06:45 PM"
  condition: WeatherTheme;
  weatherCode: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  latitude: number;
  longitude: number;
  timezone: string;
}
