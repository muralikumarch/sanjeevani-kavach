import { SupportedLanguage } from '../../infrastructure/gcp/language-map';

/**
 * Standard port for text-to-speech AI implementations.
 */
export interface IVaniAgent {
  generateAudioNudge(text: string, sourceLang: SupportedLanguage, targetLang: SupportedLanguage): Promise<string>;
}
