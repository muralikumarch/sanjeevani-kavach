/**
 * Server-side input validation utilities.
 * Provides strict sanitization and validation for API route handlers.
 */

/** Maximum allowed payload size in bytes (1MB) */
const MAX_PAYLOAD_SIZE = 1 * 1024 * 1024;

/** Maximum allowed image size in bytes (10MB) */
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

/** Allowed image MIME types */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Allowed urgency levels */
const VALID_URGENCY_LEVELS = ['GREEN', 'YELLOW', 'RED'] as const;

/**
 * Sanitizes a string input by removing potentially dangerous characters.
 * Prevents XSS injection in stored/reflected data.
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '')        // Strip HTML angle brackets
    .replace(/javascript:/gi, '') // Strip javascript: protocol
    .replace(/on\w+=/gi, '')     // Strip event handlers
    .trim()
    .slice(0, 500);              // Enforce maximum length
}

/**
 * Validates the Vani API request payload.
 * Returns a sanitized payload or throws with a descriptive error.
 */
export function validateVaniPayload(data: Record<string, unknown>): {
  childName: string;
  vaccineCode: string;
  urgency: 'GREEN' | 'YELLOW' | 'RED';
  targetLanguage: string;
} {
  const { childName, vaccineCode, urgency, targetLanguage } = data;

  if (typeof childName !== 'string' || childName.trim().length === 0) {
    throw new Error('Invalid childName: must be a non-empty string');
  }
  if (typeof vaccineCode !== 'string' || vaccineCode.trim().length === 0) {
    throw new Error('Invalid vaccineCode: must be a non-empty string');
  }
  if (typeof urgency !== 'string' || !VALID_URGENCY_LEVELS.includes(urgency as typeof VALID_URGENCY_LEVELS[number])) {
    throw new Error('Invalid urgency: must be GREEN, YELLOW, or RED');
  }
  if (typeof targetLanguage !== 'string' || targetLanguage.trim().length === 0) {
    throw new Error('Invalid targetLanguage: must be a non-empty string');
  }

  return {
    childName: sanitizeString(childName),
    vaccineCode: sanitizeString(vaccineCode),
    urgency: urgency as 'GREEN' | 'YELLOW' | 'RED',
    targetLanguage: sanitizeString(targetLanguage),
  };
}

/**
 * Validates an uploaded image file for the Vision API.
 * Checks type, size, and presence.
 */
export function validateImageUpload(file: File | null): File {
  if (!file) {
    throw new Error('No image file provided');
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`Image exceeds maximum size of ${MAX_IMAGE_SIZE / 1024 / 1024}MB`);
  }
  if (file.type && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`Invalid image type: ${file.type}. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
  }
  return file;
}

export { MAX_PAYLOAD_SIZE, MAX_IMAGE_SIZE, ALLOWED_IMAGE_TYPES, VALID_URGENCY_LEVELS };
