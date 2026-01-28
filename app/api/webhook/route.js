import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('Webhook received');
  return NextResponse.json({ received: true });
}