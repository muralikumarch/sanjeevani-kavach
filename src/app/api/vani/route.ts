import { NextResponse } from 'next/server';
import { generateUrgencyVoiceNudgeUseCase } from '../../../core/usecases/generate-voice-nudge';
import { vaniAgent } from '../../../infrastructure/gcp/client';
import { SupportedLanguage } from '../../../infrastructure/gcp/language-map';
import { validateVaniPayload } from '../../../lib/validation';

/**
 * POST /api/vani
 * Generates an urgency-aware audio nudge in the target Indian language.
 * Uses Google Cloud Translation + Neural2 TTS via the Vani-Agent.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Strict input validation and XSS sanitization
    const { childName, vaccineCode, urgency, targetLanguage } = validateVaniPayload(data);

    // Call Use Case tying Vani-Agent (Bhashini) to the Urgency calculation
    const audioBlobBase64 = await generateUrgencyVoiceNudgeUseCase(
      childName,
      vaccineCode,
      urgency,
      targetLanguage as SupportedLanguage,
      vaniAgent
    );

    return NextResponse.json({ success: true, data: { audioBase64: audioBlobBase64 } });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate voice nudge';
    console.error('Vani API Error:', message);
    return NextResponse.json(
      { error: message },
      { status: message.includes('Invalid') ? 400 : 500 }
    );
  }
}
