import { VaccineRecord } from '../../lib/types';

export interface IVisionAgentResponse {
  thoughts: Record<string, string>;
  records: VaccineRecord[];
}

/**
 * Standard port for the Vision-Agent to decouple from the specific Gemini implementation.
 */
export interface IVisionAgent {
  processCardImage(imageFile: File): Promise<IVisionAgentResponse>;
}
