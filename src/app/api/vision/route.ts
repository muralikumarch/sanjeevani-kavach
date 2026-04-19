import { NextResponse } from 'next/server';
import { visionAgent } from '../../../infrastructure/ai/vision-agent';
import { blurPII } from '../../../infrastructure/pii/blur-engine';
import { validateImageUpload } from '../../../lib/validation';

/**
 * POST /api/vision
 * Processes a Yellow Card image through the PII blur engine and Vision-Agent.
 * Returns structured vaccine extraction data with confidence scores.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const rawFile = formData.get('image') as File | null;

    // Strict input validation: check presence, size, and MIME type
    const file = validateImageUpload(rawFile);

    // 1. Source Anonymity Flow: Blur PII before AI processing
    const anonymizedImage = await blurPII(file);

    // 2. Pass to Vision-Agent for 3-pass CoT Extraction
    const extractionResult = await visionAgent.processCardImage(anonymizedImage);

    // 3. Return structured schema
    return NextResponse.json({ success: true, data: extractionResult });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to process image';
    console.error('Vision API Error:', message);
    return NextResponse.json(
      { error: message },
      { status: message.includes('Invalid') || message.includes('No image') ? 400 : 500 }
    );
  }
}
