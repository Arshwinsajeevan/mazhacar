export interface ScoreWeights {
  humidityWeight: number;
  tempWeight: number;
  windWeight: number;
  uvWeight: number;
  cloudWeight: number;
  rainWeight: number;
  visibilityWeight: number;
  conditionWeight: number;
}

export const scoreConfigs = {
  drying: {
    humidityWeight: 0.25,
    tempWeight: 0.25,
    windWeight: 0.15,
    uvWeight: 0.15,
    cloudWeight: 0.10,
    rainWeight: 0.10,
    optimalTemp: 32, // Temp above which score increases to max
    optimalHumidity: 45, // Humidity below which score increases to max
    optimalWind: 12, // Wind speed in km/h that is optimal for drying
  },
  travel: {
    rainWeight: 0.40,
    windWeight: 0.20,
    visibilityWeight: 0.25,
    conditionWeight: 0.15,
    unsafeWindLimit: 35, // wind in km/h above which travel becomes hazardous
    poorVisibilityLimit: 3, // visibility in km below which travel score drops
  },
  outdoor: {
    uvWeight: 0.20,
    rainWeight: 0.40,
    tempWeight: 0.20,
    conditionWeight: 0.20,
    hotTempThreshold: 36,
    coldTempThreshold: 15,
    dangerUV: 8,
  },
  walking: {
    tempWeight: 0.30,
    rainWeight: 0.40,
    uvWeight: 0.20,
    humidityWeight: 0.10,
    idealTempMin: 20,
    idealTempMax: 28,
  },
  farming: {
    tempWeight: 0.20,
    humidityWeight: 0.30,
    rainWeight: 0.30,
    cloudWeight: 0.20,
    optimalTempMin: 22,
    optimalTempMax: 30,
    optimalHumidityMin: 65,
  },
};
