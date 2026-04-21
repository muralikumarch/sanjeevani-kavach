import { NextResponse } from 'next/server';
import { protocolAgent } from '../../../infrastructure/ai/protocol-agent';
import { verifyAuthToken } from '../../../infrastructure/auth/verifyToken';

export async function POST(request: Request) {
  try {
    try {
      await verifyAuthToken(request);
    } catch (authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { childAgeDays, lastAdministeredDates } = data;


    if (childAgeDays === undefined || !lastAdministeredDates) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Call Protocol-Agent (Clinical Brain)
    const catchupSchedule = protocolAgent.calculateCatchup(childAgeDays, lastAdministeredDates);

    return NextResponse.json({ success: true, data: catchupSchedule });

  } catch (error) {
    console.error('Protocol API Error:', error);
    return NextResponse.json({ error: 'Failed to calculate protocol' }, { status: 500 });
  }
}
