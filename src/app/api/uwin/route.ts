import { NextResponse } from 'next/server';
import { uwinAPI } from '../../../infrastructure/uwin/mock-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || 'Kavach-8492-X';
  const records = await uwinAPI.getChildRecords(id);
  return NextResponse.json(records);
}
