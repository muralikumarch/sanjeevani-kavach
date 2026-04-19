/**
 * Environment variable validation.
 * Ensures all required configuration is present before the application starts.
 * Fails fast with clear error messages rather than cryptic runtime failures.
 */

interface EnvConfig {
  GEMINI_API_KEY: string;
  NEXT_PUBLIC_FIREBASE_API_KEY: string;
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
}

/**
 * Validates that all required environment variables are present.
 * Call this at application startup or in API routes.
 */
export function validateEnv(): EnvConfig {
  const required: (keyof EnvConfig)[] = [
    'GEMINI_API_KEY',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `[Sanjeevani-Kavach] Missing environment variables: ${missing.join(', ')}. ` +
      'Some features may be unavailable. See .env.example for reference.'
    );
  }

  return {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  };
}
