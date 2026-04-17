import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Initialize the Gemini Client
// Requires GEMINI_API_KEY environment variable
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Get the multimodal Gemini 2.5 Flash model specifically configured for high-res vision tasks.
 */
export function getVisionModel(): GenerativeModel {
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. Using mock/simulated responses might be necessary.");
  }

  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    // We use default safety settings but could override them if needed.
    // For vision tasks requiring detail, generationConfig is optimized.
  });
}

/**
 * Utility to convert a file/blob into the format expected by Gemini API (GenerativePart)
 */
export async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string, mimeType: string } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
