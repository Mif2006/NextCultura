// app/api/booking/prebook/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { etgPrebook, etgGetHotelpage, etgSearch } from '@/actions/etg.actions'; // repo-root actions
// NOTE: ensure tsconfig path alias `@` maps to project root

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// Minimal request schema for prebook (adjust / extend as needed)
const PrebookRequestSchema = z.object({
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guestsCount: z.number().int().min(1),
  roomType: z.string().optional(),
  pricePerNight: z.number().optional(),
  totalPrice: z.number().optional(),
  // optional book_hash if client already selected ETG rate (recommended)
  bookHash: z.string().optional(),
  // optionally pass hotel hid or searchHash if needed
  hid: z.number().optional(),
  searchHash: z.string().optional(),
  residency: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = PrebookRequestSchema.parse(body);

    // If client didn't pass bookHash, you can call search/hotelpage to derive it.
    // For simplicity: if no bookHash -> attempt to call hotelpage/search → pick first rate.
    let book_hash: string | null = parsed.bookHash ?? null;
    let prebookResult: any = null;

    if (!book_hash) {
      // If client provided hid, call hotelpage; otherwise call a simple search.
      if (parsed.hid) {
        const hp = await etgGetHotelpage({
          hid: parsed.hid,
          checkin: parsed.checkIn,
          checkout: parsed.checkOut,
          guests: [{ adults: parsed.guestsCount }],
        });
        // pick first available rate's book_hash
        const firstRate = hp.hotelpage?.rates?.[0];
        if (!firstRate) return NextResponse.json({ error: 'No rates available' }, { status: 422 });
        book_hash = firstRate.book_hash;
      } else {
        // fallback search — you may want to route user to a hotel selection UI instead
        const sr = await etgSearch({
          checkin: parsed.checkIn,
          checkout: parsed.checkOut,
          guests: [{ adults: parsed.guestsCount }],
          residency: parsed.residency ?? 'BY',
        });
        const hid = sr.hotels?.[0]?.hid;
        if (!hid) return NextResponse.json({ error: 'No hotels found' }, { status: 422 });
        const hp = await etgGetHotelpage({
          hid,
          checkin: parsed.checkIn,
          checkout: parsed.checkOut,
          guests: [{ adults: parsed.guestsCount }],
        });
        const firstRate = hp.hotelpage?.rates?.[0];
        if (!firstRate) return NextResponse.json({ error: 'No rates available' }, { status: 422 });
        book_hash = firstRate.book_hash;
      }
    }

    // Do prebook via ETG
    if (!book_hash) {
      return NextResponse.json({ error: 'Unable to determine booking hash' }, { status: 422 });
    }
    const { prebook } = await etgPrebook(book_hash);

    // Create local pending booking in Supabase (idempotency: create with client_provided_id if you want)
    const localId = randomUUID();
    const insertPayload = {
      id: localId,
      guest_name: null,
      guest_email: null,
      guest_phone: null,
      room_type: parsed.roomType ?? null,
      check_in: parsed.checkIn,
      check_out: parsed.checkOut,
      guests_count: parsed.guestsCount,
      total_price: parsed.totalPrice ?? prebook.price ?? null,
      payment_status: 'pending',
      booking_status: 'pending_payment',
      created_at: new Date().toISOString(),
      etg_book_hash: book_hash,
      etg_prebook: prebook,
    };

    const { data, error } = await supabaseAdmin.from('bookings').insert(insertPayload).select().single();

    if (error) {
      console.error('Supabase insert error (prebook):', error);
      return NextResponse.json({ error: 'DB insert failed' }, { status: 500 });
    }

    // Return local booking id and prebook summary to client
    return NextResponse.json({
      ok: true,
      localBookingId: data.id,
      prebook: prebook,
      price: prebook.price ?? parsed.totalPrice,
      bookHash: book_hash,
    });
  } catch (err: any) {
    console.error('Prebook route error:', err);
    if (err?.name === 'ZodError' || err?.issues) {
      return NextResponse.json({ error: 'Invalid request', details: err?.message ?? err }, { status: 400 });
    }
    return NextResponse.json({ error: 'Prebook failed', details: err?.message ?? String(err) }, { status: 500 });
  }
}
