// app/api/payments/webhook/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { etgStartBooking } from '@/actions/etg.actions'; // repo-root actions

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Example webhook event schema — adapt to your payment provider
const PaymentWebhookSchema = z.object({
  event: z.string(),
  data: z.any(),
  // many gateways include metadata -> we expect bookingId or localBookingId here
});

function verifyPaymentWebhook(req: Request, bodyText: string) {
  // TODO: implement provider-specific verification (HMAC / signature header / IP check)
  // e.g. const sig = req.headers.get('x-provider-signature');
  // compute HMAC(body, WEBHOOK_SECRET) and timingSafeEqual
  return true;
}

export async function POST(request: Request) {
  const raw = await request.text();
  try {
    if (!verifyPaymentWebhook(request, raw)) {
      console.warn('Payment webhook verification failed');
      return NextResponse.json({ ok: true }, { status: 401 });
    }

    const payload = PaymentWebhookSchema.parse(JSON.parse(raw));

    // Example: handle payment.succeeded
    if (payload.event === 'payment.succeeded' || payload.event === 'checkout.session.completed') {
      // Extract metadata used to map to local booking (adjust keys to your gateway)
      const paymentData = payload.data;
      const paymentIntentId = paymentData.id ?? paymentData.paymentId ?? paymentData.object?.id;
      const metadata = paymentData.metadata ?? paymentData.object?.metadata ?? {};
      const localBookingId = metadata.localBookingId || metadata.bookingId || paymentData.metadata?.localBookingId;

      if (!localBookingId) {
        console.error('Payment webhook missing localBookingId metadata. Cannot proceed.');
        return NextResponse.json({ ok: true }, { status: 400 });
      }

      // Idempotency: check if we already processed this payment
      const { data: existing, error: getErr } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('id', localBookingId)
        .single();

      if (getErr || !existing) {
        console.error('Local booking not found for payment webhook:', getErr);
        return NextResponse.json({ ok: true }, { status: 404 });
      }

      // If we've already processed the payment, return 200
      if (existing.payment_status === 'paid' || existing.booking_status === 'booking_processing' || existing.booking_status === 'confirmed') {
        return NextResponse.json({ ok: true });
      }

      // Update booking row with payment details -> then call ETG startBooking
      const { error: updErr } = await supabaseAdmin
        .from('bookings')
        .update({
          payment_status: 'paid', // mark paid (or 'processing' until ETG confirmed)
          payment_intent_id: paymentIntentId,
          booking_status: 'booking_processing',
        })
        .eq('id', localBookingId);

      if (updErr) {
        console.error('Failed to update booking after payment:', updErr);
        // still continue to attempt booking start, but log error
      }

      // Fetch etg_book_hash from booking (if not available here, query DB)
      const etgBookHash = existing.etg_book_hash ?? existing.etg_prebook?.book_hash;
      if (!etgBookHash) {
        console.error('No etg_book_hash associated with booking', localBookingId);
        // decide whether to refund or notify support
        return NextResponse.json({ ok: true }, { status: 400 });
      }

      // Start booking with ETG (pass external payment id in payment param)
      try {
        const { booking } = await etgStartBooking({
          book_hash: etgBookHash,
          guest_name: existing.guest_name ?? '',
          guest_email: existing.guest_email ?? '',
          guest_phone: existing.guest_phone ?? '',
          guests: [{ adults: existing.guests_count ?? 1 }],
          payment: { method: 'external', provider: 'YOUR_GATEWAY', external_payment_id: paymentIntentId },
          return_path: process.env.BOOKING_RETURN_URL ?? undefined,
        });

        // Persist process_id / order_id back to DB
        await supabaseAdmin
          .from('bookings')
          .update({
            etg_process_id: booking.process_id ?? null,
            etg_order_id: booking.order_id ?? null,
            booking_status: 'booking_processing',
          })
          .eq('id', localBookingId);

        // respond 200 (webhook processed)
        return NextResponse.json({ ok: true });
      } catch (err: any) {
        console.error('Failed to start ETG booking after payment:', err);
        // set booking to error state
        await supabaseAdmin
          .from('bookings')
          .update({ booking_status: 'booking_failed', booking_error: String(err?.message ?? err) })
          .eq('id', localBookingId);
        // optionally trigger refunds/alerts here
        return NextResponse.json({ ok: true }, { status: 500 });
      }
    }

    // If other events are sent, ack them
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Payment webhook handler error:', err);
    return NextResponse.json({ ok: false, message: err?.message ?? String(err) }, { status: 500 });
  }
}
