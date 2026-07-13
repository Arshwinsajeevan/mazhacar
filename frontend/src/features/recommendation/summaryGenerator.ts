import { CurrentWeather } from '@/types/weather';
import { WeatherScores } from '../score/scoreEngine';

/**
 * Generates natural language weather advisory summary based on selected locale.
 */
export function generateWeatherSummary(
  weather: CurrentWeather,
  scores: WeatherScores,
  lang: string
): string {
  const currentLang = lang || 'en';

  if (currentLang === 'ml') {
    const sentences: string[] = [];
    sentences.push('നമസ്കാരം.');

    // Rain probability advice
    if (weather.rainProbability < 25) {
      sentences.push('ഇന്ന് മഴയ്ക്ക് സാധ്യത കുറവാണ്.');
    } else if (weather.rainProbability < 60) {
      sentences.push('ഇന്ന് നേരിയ മഴയ്ക്ക് സാധ്യതയുണ്ട്.');
    } else {
      sentences.push('ഇന്ന് ശക്തമായ മഴയ്ക്ക് സാധ്യതയുള്ളതിനാൽ ശ്രദ്ധിക്കുക.');
    }

    // Clothes drying
    if (scores.drying >= 80) {
      sentences.push('വസ്ത്രങ്ങൾ വെയിലത്ത് ഇടാം.');
    } else if (scores.drying >= 50) {
      sentences.push('തുണികൾ ഉണങ്ങാൻ കൂടുതൽ സമയമെടുക്കും.');
    } else {
      sentences.push('ഈർപ്പമുള്ളതിനാൽ തുണികൾ പുറത്തിടുന്നത് ഒഴിവാക്കുക.');
    }

    // 4 hours forecast summary
    if (weather.rainProbability < 35) {
      sentences.push('അടുത്ത നാല് മണിക്കൂറിലും മഴ പ്രതീക്ഷിക്കുന്നില്ല.');
    } else {
      sentences.push('അടുത്ത മണിക്കൂറുകളിൽ മഴ പെയ്യാൻ സാധ്യതയുണ്ട്.');
    }

    return sentences.join(' ');
  }

  if (currentLang === 'hi') {
    const sentences: string[] = [];
    sentences.push('नमस्ते।');

    // Rain probability advice
    if (weather.rainProbability < 25) {
      sentences.push('आज बारिश की संभावना कम है।');
    } else if (weather.rainProbability < 60) {
      sentences.push('आज हल्की वर्षा की संभावना है।');
    } else {
      sentences.push('आज भारी बारिश की चेतावनी है, सावधान रहें।');
    }

    // Clothes drying
    if (scores.drying >= 80) {
      sentences.push('आज कपड़े धूप में सुखाए जा सकते हैं।');
    } else if (scores.drying >= 50) {
      sentences.push('कपड़े सूखने में कुछ अधिक समय लग सकता है।');
    } else {
      sentences.push('नमी के कारण आज कपड़े बाहर सुखाने से बचें।');
    }

    // 4 hours forecast summary
    if (weather.rainProbability < 35) {
      sentences.push('अगले चार घंटों में बारिश की उम्मीद नहीं है।');
    } else {
      sentences.push('आने वाले घंटों में बारिश की संभावना है।');
    }

    return sentences.join(' ');
  }

  // Baseline English builder
  const sentences: string[] = [];
  sentences.push('Hello.');

  // Rain probability advice
  if (weather.rainProbability < 25) {
    sentences.push('Rain is unlikely today.');
  } else if (weather.rainProbability < 60) {
    sentences.push('There is a chance of light rain.');
  } else {
    sentences.push('Heavy rainfall is expected today, stay alert.');
  }

  // Clothes drying
  if (scores.drying >= 80) {
    sentences.push('You can hang your clothes outside to dry.');
  } else if (scores.drying >= 50) {
    sentences.push('Drying clothes outside might take longer.');
  } else {
    sentences.push('Avoid drying clothes outdoors due to wet weather.');
  }

  // 4 hours forecast summary
  if (weather.rainProbability < 35) {
    sentences.push('No rain is expected for the next four hours.');
  } else {
    sentences.push('Rain is likely in the coming hours.');
  }

  return sentences.join(' ');
}
