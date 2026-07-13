import { WeatherData, WeatherTheme, HourlyForecast, DailyForecast, CurrentWeather } from '@/types/weather';

/**
 * Maps WMO Weather Codes to MazhaCar Weather Themes.
 * Reference: https://open-meteo.com/en/docs
 */
export function mapWeatherCodeToTheme(code: number): WeatherTheme {
  if (code === 0) return 'sunny';
  if ([1, 2, 3, 45, 48, 71, 73, 75, 77, 85, 86].includes(code)) return 'cloudy';
  if ([95, 96, 99].includes(code)) return 'stormy';
  return 'rainy'; // Handles rain, drizzles, showers
}

/**
 * Formats ISO date string to a simple readable time like "09:00 AM".
 */
export function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return '00:00 AM';
  }
}

/**
 * Maps ISO date string to a day name like "Monday".
 */
export function getDayName(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short' });
  } catch {
    return 'Day';
  }
}

/**
 * Service to interact with the free Open-Meteo Forecast API.
 */
export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,visibility&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,uv_index,visibility,cloud_cover&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather fetch failed with status: ${response.status}`);
  }

  const data = await response.json();

  // Find the index of the hourly forecast matching the current time
  const currentIsoTime = data.current.time;
  const hourlyTimes: string[] = data.hourly.time || [];
  let currentHourIdx = hourlyTimes.findIndex(t => t.substring(0, 13) === currentIsoTime.substring(0, 13));
  if (currentHourIdx === -1) {
    currentHourIdx = 0; // Fallback to first hour
  }

  // Extract current UV and Rain probability from hourly calculations
  const currentUV = data.hourly.uv_index ? data.hourly.uv_index[currentHourIdx] ?? 0 : 0;
  const currentRainProbability = data.hourly.precipitation_probability ? data.hourly.precipitation_probability[currentHourIdx] ?? 0 : 0;

  // Build current weather model
  const current: CurrentWeather = {
    time: data.current.time,
    temperature: Math.round(data.current.temperature_2m),
    apparentTemperature: Math.round(data.current.apparent_temperature),
    humidity: Math.round(data.current.relative_humidity_2m),
    rainProbability: Math.round(currentRainProbability),
    windSpeed: Math.round(data.current.wind_speed_10m),
    windDirection: Math.round(data.current.wind_direction_10m),
    cloudCover: Math.round(data.current.cloud_cover),
    visibility: Math.round(data.current.visibility / 1000), // Convert meters to km
    pressure: Math.round(data.current.pressure_msl),
    uvIndex: Math.round(currentUV),
    condition: mapWeatherCodeToTheme(data.current.weather_code),
    weatherCode: data.current.weather_code,
  };

  // Build hourly forecast model (24 hours range)
  const hourly: HourlyForecast[] = [];
  const limitHours = Math.min(24, hourlyTimes.length);
  for (let i = 0; i < limitHours; i++) {
    hourly.push({
      time: data.hourly.time[i],
      formattedTime: formatTime(data.hourly.time[i]),
      temperature: Math.round(data.hourly.temperature_2m[i]),
      apparentTemperature: Math.round(data.hourly.apparent_temperature[i]),
      humidity: Math.round(data.hourly.relative_humidity_2m[i]),
      rainProbability: Math.round(data.hourly.precipitation_probability[i]),
      windSpeed: Math.round(data.hourly.wind_speed_10m[i]),
      windDirection: Math.round(data.hourly.wind_direction_10m[i]),
      cloudCover: Math.round(data.hourly.cloud_cover[i]),
      visibility: Math.round(data.hourly.visibility[i] / 1000),
      uvIndex: Math.round(data.hourly.uv_index[i]),
      condition: mapWeatherCodeToTheme(data.hourly.weather_code[i]),
      weatherCode: data.hourly.weather_code[i],
    });
  }

  // Build daily forecast model (7 days range)
  const daily: DailyForecast[] = [];
  const dailyTimes: string[] = data.daily.time || [];
  for (let i = 0; i < dailyTimes.length; i++) {
    daily.push({
      date: data.daily.time[i],
      dayName: getDayName(data.daily.time[i]),
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      rainProbability: Math.round(data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[i] : 0),
      uvIndex: Math.round(data.daily.uv_index_max ? data.daily.uv_index_max[i] : 0),
      sunrise: formatTime(data.daily.sunrise[i]),
      sunset: formatTime(data.daily.sunset[i]),
      condition: mapWeatherCodeToTheme(data.daily.weather_code[i]),
      weatherCode: data.daily.weather_code[i],
    });
  }

  return {
    current,
    hourly,
    daily,
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
  };
}
