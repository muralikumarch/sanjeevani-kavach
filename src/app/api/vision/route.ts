import { NextResponse } from 'next/server';
import { visionAgent } from '../../../infrastructure/ai/vision-agent';
import { blurPII } from '../../../infrastructure/pii/blur-engine';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    // 1. Source Anonymity Flow: Blur PII before AI processing
    const anonymizedImage = await blurPII(file);

    // 2. Pass to Vision-Agent for 3-pass CoT Extraction
    const extractionResult = await visionAgent.processCardImage(anonymizedImage);

    // 3. Return structured schema
    return NextResponse.json({ success: true, data: extractionResult });

  } catch (error) {
    console.error('Vision API Error:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
