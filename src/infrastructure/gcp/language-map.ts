// Maps the application's internal ISO codes to Google Cloud API language codes
export const gcpLanguageMap: Record<string, string> = {
  'hi': 'hi-IN',    // Hindi (India)
  'te': 'te-IN',    // Telugu (India)
  'mr': 'mr-IN',    // Marathi (India)
  'ta': 'ta-IN',    // Tamil (India)
  'bn': 'bn-IN',    // Bengali (India)
  'gu': 'gu-IN',    // Gujarati (India)
  'kn': 'kn-IN',    // Kannada (India)
  'ml': 'ml-IN',    // Malayalam (India)
  'en': 'en-IN',    // English (India)
  // Expand with further supported Neural2 mapping variants
};

export type SupportedLanguage = keyof typeof gcpLanguageMap;
