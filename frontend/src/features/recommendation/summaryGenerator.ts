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
    // Malayalam sentences builder
    const sentences: string[] = [];

    // Drying clothes advice
    if (scores.drying >= 80) {
      sentences.push('ഇന്ന് തുണികൾ പുറത്ത് ഉണക്കാൻ വളരെ അനുയോജ്യമായ ദിവസമാണ്.');
    } else if (scores.drying >= 50) {
      sentences.push('ഇന്ന് തുണികൾ ഉണക്കാൻ തരക്കേടില്ലാത്ത ദിവസമാണ്, എങ്കിലും അല്പം കൂടുതൽ സമയമെടുക്കും.');
    } else {
      sentences.push('ശക്തമായ ഈർപ്പമോ മഴയോ ഉള്ളതിനാൽ തുണികൾ പുറത്തിടുന്നത് ഒഴിവാക്കുക.');
    }

    // Rain probability advice
    if (weather.rainProbability < 15) {
      sentences.push('വൈകുന്നേരം വരെ മഴ പെയ്യാൻ സാധ്യത കുറവാണ്.');
    } else if (weather.rainProbability < 50) {
      sentences.push('ചില ഭാഗങ്ങളിൽ നേരിയ മഴയ്ക്ക് സാധ്യത കാണുന്നുണ്ട്.');
    } else if (weather.rainProbability < 80) {
      sentences.push('മഴ പെയ്യാൻ നല്ല സാധ്യതയുള്ളതിനാൽ പുറത്തുപോകുമ്പോൾ കുട കരുതുക.');
    } else {
      sentences.push('അതിശക്തമായ മഴയ്ക്കും ഇടിമിന്നലിനും സാധ്യതയുണ്ട്, സുരക്ഷിതരായി ഇരിക്കുക.');
    }

    // Wind speed advice
    if (weather.windSpeed > 25) {
      sentences.push('ശക്തമായ കാറ്റുള്ളതിനാൽ തുണികൾ നന്നായി കെട്ടിയിടുക.');
    } else if (weather.windSpeed >= 8) {
      sentences.push('അനുകൂലമായ മിതമായ കാറ്റ് തുണികൾ പെട്ടെന്ന് ഉണങ്ങാൻ സഹായിക്കും.');
    }

    // Estimated drying time
    if (scores.drying >= 85) {
      sentences.push('കണക്കാക്കിയ സമയം: 2 മണിക്കൂർ.');
    } else if (scores.drying >= 60) {
      sentences.push('കണക്കാക്കിയ സമയം: 4 മണിക്കൂർ.');
    } else if (scores.drying >= 40) {
      sentences.push('കണക്കാക്കിയ സമയം: 6 മണിക്കൂർ.');
    }

    return sentences.join(' ');
  }

  if (currentLang === 'hi') {
    // Hindi sentences builder
    const sentences: string[] = [];

    // Drying clothes advice
    if (scores.drying >= 80) {
      sentences.push('आज कपड़े सुखाने के लिए बहुत अच्छा दिन है।');
    } else if (scores.drying >= 50) {
      sentences.push('कपड़े सुखाने के लिए आज ठीक-ठाक दिन है, लेकिन सूखने में थोड़ा अधिक समय लग सकता है।');
    } else {
      sentences.push('बारिश या उच्च नमी के कारण आज कपड़े बाहर सुखाने से बचें।');
    }

    // Rain probability advice
    if (weather.rainProbability < 15) {
      sentences.push('शाम तक बारिश की संभावना बहुत कम है।');
    } else if (weather.rainProbability < 50) {
      sentences.push('हल्की बूंदाबांदी की संभावना हो सकती है।');
    } else if (weather.rainProbability < 80) {
      sentences.push('बारिश होने की पूरी संभावना है, कृपया बाहर जाते समय छाता साथ रखें।');
    } else {
      sentences.push('आंधी-तूफान के साथ भारी बारिश की चेतावनी है, कृपया घर में सुरक्षित रहें।');
    }

    // Wind speed advice
    if (weather.windSpeed > 25) {
      sentences.push('तेज हवाओं के कारण कपड़े उड़ सकते हैं, उन्हें ठीक से सुरक्षित करें।');
    } else if (weather.windSpeed >= 8) {
      sentences.push('मध्यम हवा कपड़े जल्दी सुखाने में मदद करेगी।');
    }

    // Estimated drying time
    if (scores.drying >= 85) {
      sentences.push('अनुमानित समय: 2 घंटे।');
    } else if (scores.drying >= 60) {
      sentences.push('अनुमानित समय: 4 घंटे।');
    } else if (scores.drying >= 40) {
      sentences.push('अनुमानित समय: 6 घंटे।');
    }

    return sentences.join(' ');
  }

  // Baseline English builder
  const sentences: string[] = [];

  // Drying clothes advice
  if (scores.drying >= 80) {
    sentences.push('Today is an excellent day to dry clothes.');
  } else if (scores.drying >= 50) {
    sentences.push('It is a moderate day to dry clothes, though drying might take longer.');
  } else {
    sentences.push('Avoid drying clothes outdoors due to high moisture or active precipitation.');
  }

  // Rain probability advice
  if (weather.rainProbability < 15) {
    sentences.push('Rain is highly unlikely before evening.');
  } else if (weather.rainProbability < 50) {
    sentences.push('There is a slight chance of light precipitation.');
  } else if (weather.rainProbability < 80) {
    sentences.push('Rain is expected today, keep an umbrella handy.');
  } else {
    sentences.push('Heavy downpour and lightning are probable. Stay indoors and be safe.');
  }

  // Wind speed advice
  if (weather.windSpeed > 25) {
    sentences.push('Strong wind gusts might blow garments away; secure them tightly.');
  } else if (weather.windSpeed >= 8) {
    sentences.push('Moderate wind will help clothes dry faster.');
  }

  // Estimated drying time
  if (scores.drying >= 85) {
    sentences.push('Estimated drying time: 2 hours.');
  } else if (scores.drying >= 60) {
    sentences.push('Estimated drying time: 4 hours.');
  } else if (scores.drying >= 40) {
    sentences.push('Estimated drying time: 6 hours.');
  }

  return sentences.join(' ');
}
