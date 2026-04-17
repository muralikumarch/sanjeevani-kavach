import { NextResponse } from 'next/server';
import { generateUrgencyVoiceNudgeUseCase } from '../../../core/usecases/generate-voice-nudge';
import { vaniAgent } from '../../../infrastructure/gcp/client';
import { SupportedLanguage } from '../../../infrastructure/gcp/language-map';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { childName, vaccineCode, urgency, targetLanguage } = data;

    if (!childName || !vaccineCode || !urgency || !targetLanguage) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Call Use Case tying Vani-Agent (Bhashini) to the Urgency calculation
    const audioBlobBase64 = await generateUrgencyVoiceNudgeUseCase(
      childName,
      vaccineCode,
      urgency as 'GREEN' | 'YELLOW' | 'RED',
      targetLanguage as SupportedLanguage,
      vaniAgent
    );

    return NextResponse.json({ success: true, data: { audioBase64: audioBlobBase64 } });

  } catch (error) {
    console.error('Vani API Error:', error);
    return NextResponse.json({ error: 'Failed to generate voice nudge' }, { status: 500 });
  }
}
