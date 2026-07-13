import { Router, Request, Response } from 'express';

const router = Router();

// Mock weather recommendation handler
router.get('/recommendations', (req: Request, res: Response) => {
  const { lat, lon, lang = 'ml' } = req.query;

  if (!lat || !lon) {
    res.status(400).json({
      status: 'error',
      message: 'Latitude and Longitude are required query parameters.',
    });
    return;
  }

  // Language translations mapping for mock response
  const translations: Record<string, typeof mockML> = {
    ml: mockML,
    en: mockEN,
    hi: mockHI,
  };

  const responseContent = translations[lang as string] || translations['en'];

  res.json({
    status: 'success',
    data: {
      location: {
        latitude: Number(lat),
        longitude: Number(lon),
        name: 'Kochi, Kerala, India (Mock)',
      },
      weatherSummary: {
        temp: 28.5,
        condition: 'Rainy',
        humidity: 85,
        windSpeed: 15,
      },
      ...responseContent,
    },
  });
});

// Mock localization objects
const mockML = {
  overallScore: {
    value: 45,
    status: 'moderate',
    label: 'യാത്ര സൂക്ഷിക്കുക',
    description: 'ഇന്ന് മഴ പെയ്യാൻ സാധ്യതയുണ്ട്. പുറത്തുപോകുമ്പോൾ കുട കരുതുക.',
  },
  recommendations: [
    {
      id: 'dry_clothes',
      title: 'അലക്കിയ തുണികൾ ഉണക്കാൻ പറ്റുമോ?',
      decision: 'NO',
      reason: 'മഴ പെയ്യാൻ സാധ്യത വളരെ കൂടുതലാണ്. അകത്തുതന്നെ ഉണക്കുക.',
      severity: 'warning',
    },
    {
      id: 'carry_umbrella',
      title: 'കുട കരുതേണ്ടതുണ്ടോ?',
      decision: 'YES',
      reason: 'ശക്തമായ മഴ പെയ്യാൻ 80% സാധ്യതയുണ്ട്.',
      severity: 'info',
    },
    {
      id: 'travel_safe',
      title: 'യാത്ര സുരക്ഷിതമാണോ?',
      decision: 'YES_CAUTION',
      reason: 'റോഡുകളിൽ വഴുക്കലുണ്ടാകാം, പതുക്കെ വണ്ടി ഓടിക്കുക.',
      severity: 'warning',
    },
    {
      id: 'outdoor_activity',
      title: 'ഔട്ട്ഡോർ ആക്ടിവിറ്റികൾക്ക് പറ്റിയതാണോ?',
      decision: 'NO',
      reason: 'ചെളി നിറഞ്ഞ റോഡുകളും ഈർപ്പമുള്ള കാലാവസ്ഥയും.',
      severity: 'neutral',
    },
  ],
  alerts: [
    {
      level: 'yellow',
      title: 'മഞ്ഞ അലർട്ട് (Yellow Alert)',
      message: 'ജില്ലയിൽ ഒറ്റപ്പെട്ട ശക്തമായ മഴയ്ക്ക് സാധ്യത.',
      issuedAt: new Date().toISOString(),
    },
  ],
};

const mockEN = {
  overallScore: {
    value: 45,
    status: 'moderate',
    label: 'Exercise Caution',
    description: 'Rain is highly likely today. Make sure to carry an umbrella.',
  },
  recommendations: [
    {
      id: 'dry_clothes',
      title: 'Can I dry clothes today?',
      decision: 'NO',
      reason: 'High probability of rain. Dry them indoors.',
      severity: 'warning',
    },
    {
      id: 'carry_umbrella',
      title: 'Should I carry an umbrella?',
      decision: 'YES',
      reason: 'There is an 80% chance of showers.',
      severity: 'info',
    },
    {
      id: 'travel_safe',
      title: 'Is it safe to travel?',
      decision: 'YES_CAUTION',
      reason: 'Slippery roads expected, drive carefully.',
      severity: 'warning',
    },
    {
      id: 'outdoor_activity',
      title: 'Is today suitable for outdoor activities?',
      decision: 'NO',
      reason: 'Damp and wet conditions ahead.',
      severity: 'neutral',
    },
  ],
  alerts: [
    {
      level: 'yellow',
      title: 'Yellow Alert',
      message: 'Isolated heavy rain expected in the region.',
      issuedAt: new Date().toISOString(),
    },
  ],
};

const mockHI = {
  overallScore: {
    value: 45,
    status: 'moderate',
    label: 'सावधानी बरतें',
    description: 'आज बारिश की संभावना है। बाहर जाते समय छाता अवश्य ले जाएं।',
  },
  recommendations: [
    {
      id: 'dry_clothes',
      title: 'क्या आज कपड़े सुखा सकते हैं?',
      decision: 'NO',
      reason: 'बारिश की अत्यधिक संभावना है। उन्हें घर के अंदर सुखाएं।',
      severity: 'warning',
    },
    {
      id: 'carry_umbrella',
      title: 'क्या छाता ले जाने की आवश्यकता है?',
      decision: 'YES',
      reason: 'बोछारें पड़ने की 80% संभावना है।',
      severity: 'info',
    },
    {
      id: 'travel_safe',
      title: 'क्या यात्रा करना सुरक्षित है?',
      decision: 'YES_CAUTION',
      reason: 'सड़कें गीली हो सकती हैं, कृपया धीरे गाड़ी चलाएं।',
      severity: 'warning',
    },
    {
      id: 'outdoor_activity',
      title: 'क्या आज बाहरी गतिविधियों के लिए उपयुक्त है?',
      decision: 'NO',
      reason: 'गीली और नमी युक्त परिस्थितियाँ रहने की संभावना है।',
      severity: 'neutral',
    },
  ],
  alerts: [
    {
      level: 'yellow',
      title: 'येलो अलर्ट (Yellow Alert)',
      message: 'क्षेत्र में छिटपुट भारी बारिश की संभावना है।',
      issuedAt: new Date().toISOString(),
    },
  ],
};

export default router;
