import { NextResponse } from 'next/server';
import { getVisionModel, fileToGenerativePart } from '../../../infrastructure/ai/gemini-client';
import { MEDICINE_ID_SYSTEM_PROMPT, MEDICINE_ID_USER_PROMPT } from '../../../infrastructure/ai/prompts/medicine-id';
import { verifyAuthToken } from '../../../infrastructure/auth/verifyToken';

export async function POST(request: Request) {
  try {
    try {
      await verifyAuthToken(request);
    } catch (authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const childAge = formData.get('childAge') as string || 'Unknown';
    const childWeight = formData.get('childWeight') as string || 'Unknown';


    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    const model = getVisionModel();
    const imagePart = await fileToGenerativePart(file);

    // Replace template variables
    const prompt = MEDICINE_ID_USER_PROMPT
      .replace('{{AGE}}', childAge)
      .replace('{{WEIGHT}}', childWeight);

    const requestBody = {
      contents: [{ role: 'user', parts: [imagePart, { text: prompt }] }],
      systemInstruction: { role: 'system', parts: [{ text: MEDICINE_ID_SYSTEM_PROMPT }] },
      generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
    };

    const result = await model.generateContent(requestBody);
    const text = await result.response.text();
    
    return NextResponse.json({ success: true, data: JSON.parse(text) });

  } catch (error) {
    console.error('Medicine ID API Error:', error);
    return NextResponse.json({ error: 'Failed to identify medicine' }, { status: 500 });
  }
}
