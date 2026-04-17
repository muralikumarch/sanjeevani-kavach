import { getVisionModel, fileToGenerativePart } from './gemini-client';
import { VISION_COT_SYSTEM_PROMPT, VISION_COT_USER_PROMPT } from './prompts/vision-cot';

export interface VaccineRecordExtraction {
  vaccine_name: string;
  date_given: string; // DD/MM/YYYY
  batch_number: string;
  confidence_score: number;
}

export interface VisionAgentResponse {
  thoughts: {
    pass_1: string;
    pass_2: string;
    pass_3: string;
  };
  records: VaccineRecordExtraction[];
}

export class VisionAgent {
  /**
   * Processes an image of a handwritten immunization card and returns structured JSON
   * using a 3-pass Chain-of-Thought reasoning.
   */
  async processCardImage(imageFile: File, retries = 2): Promise<VisionAgentResponse> {
    const timeout = 15000; // 15 seconds per try
    let attempt = 0;

    while (attempt <= retries) {
      try {
        const model = getVisionModel();
        const imagePart = await fileToGenerativePart(imageFile);

        const request = {
          contents: [
            {
              role: 'user',
              parts: [
                imagePart,
                { text: VISION_COT_USER_PROMPT }
              ]
            }
          ],
          systemInstruction: {
            role: 'system',
            parts: [{ text: VISION_COT_SYSTEM_PROMPT }]
          },
          generationConfig: {
            temperature: 0.1, // Low temperature for high precision OCR extraction
            responseMimeType: "application/json"
          }
        };

        const resultPromise = model.generateContent(request);
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('TIMEOUT')), timeout)
        );

        // Await with fallback to timeout
        const result = (await Promise.race([resultPromise, timeoutPromise])) as any;
        const response = await result.response;
        const text = response.text();
        
        // Parse the JSON response
        const parsedData = JSON.parse(text) as VisionAgentResponse;
        return parsedData;

      } catch (error: unknown) {
        attempt++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error in VisionAgent processCardImage (Attempt ${attempt}):`, errorMessage);
        
        if (attempt > retries) {
          throw new Error(`Failed to process immunization card image after ${retries} retries.`);
        }
        // Exponental backoff artificially inserted for safety
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    throw new Error('Unexpected termination of processCardImage');
  }
}

export const visionAgent = new VisionAgent();
