
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

const webhookSchema = z.object({
  event: z.string(),
  data: z.any(), // or more specific if you know the payload
});

// HMAC secret (if ETG supports)
const WEBHOOK_SECRET = process.env.ETG_WEBHOOK_SECRET ?? '';

function verifySignature(body: string, signature: string | null) {
  if (!WEBHOOK_SECRET) return true;
  if (!signature) return false;
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get('x-etg-signature');
  if (!verifySignature(raw, sig)) {
    return new NextResponse(JSON.stringify({ error: 'Invalid signature' }), { status: 401 });
  }

  let payload;
  try {
    payload = webhookSchema.parse(JSON.parse(raw));
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
  }

  // Handle booking status event
  console.log('ETG Webhook:', payload.event, payload.data);
  // TODO: map payload.data.order_id / status -> your DB (update a Supabase / other record), send confirmation, etc.

  return NextResponse.json({ ok: true });
}
