// etg/service.ts
import { etgFetch } from './client';
import {
  SearchParams,
  SerpHotel,
  HotelpageParams,
  PrebookParams,
  PrebookResponse,
  BookingParams,
  BookingStartResponse,
  BookingFinishResponse,
  HotelDumpMeta,
} from './types';
import {
  searchParamsSchema,
  hotelpageParamsSchema,
  prebookParamsSchema,
  bookingParamsSchema,
} from './schemas';
import { cacheGet, cacheSet } from './cache';
import { ETGError } from './errors';

/**
 * etg/service.ts
 *
 * High-level ETG v3 service functions mapped to the verified endpoint URLs
 * (confirmed from your Postman collection / ETG docs).
 *
 * Important: double-check your Postman environment for any minor variations
 * in required request shape. This implementation follows the official examples
 * and returns raw `data` blobs from ETG for maximum compatibility; you can
 * parse / normalize fields as needed.
 */

/* ---------- Helpers ---------- */

function safeParse<T>(schema: any, val: unknown, name = 'payload'): T {
  try {
    return schema.parse(val);
  } catch (err: any) {
    throw new ETGError(`Validation error for ${name}: ${err?.message ?? String(err)}`, { original: err });
  }
}

/* ---------- Search (SERP) ---------- */

/**
 * Search by hotel IDs (SERP) - returns hotel list and search_hash
 * Endpoint: /api/b2b/v3/search/serp/hotels/
 */
export async function searchHotels(params: SearchParams): Promise<{ hotels: SerpHotel[]; searchHash?: string; rateLimit: any }> {
  const parsed = safeParse<SearchParams>(searchParamsSchema, params, 'searchParams');

  const path = '/api/b2b/v3/search/serp/hotels/';

  const body: any = {
    checkin: parsed.checkin,
    checkout: parsed.checkout,
    guests: parsed.guests,
    residency: parsed.residency,
    currency: parsed.currency ?? 'BYN',
    language: parsed.lang ?? 'ru',
    timeout: parsed.timeout ?? 30,
  };
  if (parsed.hids && parsed.hids.length) body.hids = parsed.hids.join(',');

  const { data, rateLimit } = await etgFetch<{ data: any }>(path, {
    method: 'POST',
    body,
    timeoutMs: (parsed.timeout ?? 30) * 1000,
  });

  if (!data || !data.data) throw new ETGError('Invalid search response from ETG', { raw: data });

  const raw = data.data;
  const hotels: SerpHotel[] = (raw?.hotels ?? []).map((h: any) => ({
    hid: h.hid,
    name: h.name,
    stars: h.stars,
    price: h.price?.show_amount ?? h.price?.total,
    currency: h.price?.currency,
    search_hash: raw.search_hash,
  }));

  return { hotels, searchHash: raw.search_hash, rateLimit };
}

/* ---------- Region / Geo Search (optional helpers) ---------- */

/**
 * Search by region
 * Endpoint: /api/b2b/v3/search/serp/region/
 */
export async function searchRegion(payload: any) {
  const path = '/api/b2b/v3/search/serp/region/';
  const { data, rateLimit } = await etgFetch<{ data: any }>(path, { method: 'POST', body: payload, timeoutMs: 30000 });
  return { data: data.data, rateLimit };
}

/**
 * Search by geo
 * Endpoint: /api/b2b/v3/search/serp/geo/
 */
export async function searchGeo(payload: any) {
  const path = '/api/b2b/v3/search/serp/geo/';
  const { data, rateLimit } = await etgFetch<{ data: any }>(path, { method: 'POST', body: payload, timeoutMs: 30000 });
  return { data: data.data, rateLimit };
}

/* ---------- Hotelpage (detailed rates / rooms) ---------- */

/**
 * Retrieve hotelpage
 * Endpoint: /api/b2b/v3/search/hp/
 */
export async function getHotelpage(params: HotelpageParams): Promise<{ hotelpage: any; rateLimit: any }> {
  const parsed = safeParse<HotelpageParams>(hotelpageParamsSchema, params, 'hotelpageParams');

  const path = '/api/b2b/v3/search/hp/';
  const body: any = {
    checkin: parsed.checkin,
    checkout: parsed.checkout,
    guests: parsed.guests,
    currency: parsed.currency ?? 'BYN',
    lang: parsed.lang ?? 'ru',
    timeout: parsed.timeout ?? 60,
  };

  if (parsed.hid) body.hids = [parsed.hid];
  if (parsed.hotel_id) body.hotel_id = parsed.hotel_id;
  if (parsed.search_hash) body.search_hash = parsed.search_hash;

  const { data, rateLimit } = await etgFetch<{ data: any }>(path, {
    method: 'POST',
    body,
    timeoutMs: (parsed.timeout ?? 60) * 1000,
  });

  if (!data || !data.data) throw new ETGError('Invalid hotelpage response from ETG', { raw: data });

  return { hotelpage: data.data, rateLimit };
}

/* ---------- Prebook ---------- */

/**
 * Prebook a rate
 * Endpoint: /api/b2b/v3/hotel/prebook
 */
export async function prebook(params: PrebookParams): Promise<{ prebook: PrebookResponse; rateLimit: any }> {
  const parsed = safeParse<PrebookParams>(prebookParamsSchema, params, 'prebookParams');

  const path = '/api/b2b/v3/hotel/prebook';
  const { data, rateLimit } = await etgFetch<{ data: any }>(path, {
    method: 'POST',
    body: {
      book_hash: parsed.book_hash,
      price_increase_percent: parsed.price_increase_percent ?? 0,
      currency: parsed.currency ?? 'BYN',
    },
    timeoutMs: 60000,
  });

  if (!data || !data.data) throw new ETGError('Invalid prebook response from ETG', { raw: data });

  return { prebook: data.data as PrebookResponse, rateLimit };
}

/* ---------- Booking: start / finish / status ---------- */

/**
 * Start booking process (create booking form/process)
 * Endpoint: /api/b2b/v3/hotel/order/booking/form/
 *
 * Note: ETG's booking process can be two-step: create a "form/process" (form endpoint),
 * then finalize via finish endpoint. We call form endpoint and then call finish endpoint
 * if necessary (some partners use separate flows). This implementation returns form + finish results.
 */
export async function startBooking(params: BookingParams): Promise<{ booking: BookingStartResponse; rateLimit: any }> {
  const parsed = safeParse<BookingParams>(bookingParamsSchema, params, 'bookingParams');

  const formPath = '/api/b2b/v3/hotel/order/booking/form/';
  const { data: formResp, rateLimit: formRate } = await etgFetch<{ data: any }>(formPath, {
    method: 'POST',
    body: {
      book_hash: parsed.book_hash,
      guest: {
        name: parsed.guest_name,
        email: parsed.guest_email,
        phone: parsed.guest_phone,
      },
      guests: parsed.guests,
      nationality: parsed.nationality,
      notes: parsed.special_requests,
      payment: parsed.payment,
      return_path: parsed.return_path,
    },
    timeoutMs: 60000,
  });

  if (!formResp || !formResp.data) throw new ETGError('Invalid booking form response', { raw: formResp });

  // If the form response already contains finalized booking -> return it
  if (formResp.data.order_id && formResp.data.status) {
    return { booking: formResp.data as BookingStartResponse, rateLimit: formRate };
  }

  // Otherwise, attempt to finish booking if ETG expects it
  const finishPath = '/api/b2b/v3/hotel/order/booking/finish/';
  const finishPayload: any = {};
  if (formResp.data.process_id) finishPayload.process_id = formResp.data.process_id;
  if (formResp.data.order_id) finishPayload.order_id = formResp.data.order_id;

  const { data: finishResp, rateLimit: finishRate } = await etgFetch<{ data: any }>(finishPath, {
    method: 'POST',
    body: finishPayload,
    timeoutMs: 60000,
  });

  if (!finishResp || !finishResp.data) {
    // Return form data but include meta that finish failed
    return { booking: formResp.data as BookingStartResponse, rateLimit: { form: formRate, finish: finishRate } as any };
  }

  // ETG may return final order id / status in finishResp.data
  return { booking: finishResp.data as BookingStartResponse, rateLimit: finishRate };
}

/**
 * Check / finish booking status (poll)
 * Endpoint: /api/b2b/v3/hotel/order/booking/finish/status/
 */
export async function finishBooking(processIdOrOrderId: string): Promise<{ finish: BookingFinishResponse; rateLimit: any }> {
  const path = '/api/b2b/v3/hotel/order/booking/finish/status/';
  const { data, rateLimit } = await etgFetch<{ data: any }>(path, {
    method: 'POST',
    body: { process_id: processIdOrOrderId, order_id: processIdOrOrderId },
    timeoutMs: 30000,
  });

  if (!data || !data.data) throw new ETGError('Invalid finish status response', { raw: data });

  return { finish: data.data as BookingFinishResponse, rateLimit };
}

/* ---------- Static data (hotel dump) ---------- */

/**
 * Get hotel dump metadata (static content)
 * Endpoint: /api/b2b/v3/hotel/info/dump/
 *
 * This is safe to cache. We cache the returned metadata (file_url, generated_at).
 */
export async function getHotelDump(): Promise<{ dump: HotelDumpMeta; rateLimit: any }> {
  const cacheKey = 'etg:hotel_dump_meta_v1';
  const cached = await cacheGet(cacheKey);
  if (cached) return { dump: cached as HotelDumpMeta, rateLimit: { limit: 0, remaining: 0, resetSeconds: 0 } };

  const path = '/api/b2b/v3/hotel/info/dump/';
  const { data, rateLimit } = await etgFetch<{ data: any }>(path, { method: 'GET', timeoutMs: 120_000 });

  if (!data || !data.data) throw new ETGError('Invalid hotel dump response', { raw: data });

  const meta: HotelDumpMeta = {
    generated_at: data.data.generated_at ?? new Date().toISOString(),
    file_url: data.data.file_url ?? data.data.url ?? '',
  };

  // cache for several hours (configurable in cache.ts)
  await cacheSet(cacheKey, meta, 60 * 60 * 6);

  return { dump: meta, rateLimit };
}

/**
 * Get incremental dump metadata
 * Endpoint: /api/b2b/v3/hotel/info/incremental_dump/
 */
export async function getHotelIncrementalDump(sinceTimestamp?: string) {
  const path = '/api/b2b/v3/hotel/info/incremental_dump/';
  const body: any = {};
  if (sinceTimestamp) body.since = sinceTimestamp;
  const { data, rateLimit } = await etgFetch<{ data: any }>(path, { method: 'POST', body, timeoutMs: 120_000 });
  return { data: data.data, rateLimit };
}

/**
 * Get hotel info by hid or hotel_id
 * Endpoint: /api/b2b/v3/hotel/info/
 */
export async function getHotelInfo(hid?: number, hotel_id?: string) {
  if (!hid && !hotel_id) throw new ETGError('getHotelInfo requires hid or hotel_id');
  const path = '/api/b2b/v3/hotel/info/';
  const body: any = {};
  if (hid) body.hids = [hid];
  if (hotel_id) body.hotel_id = hotel_id;
  const { data, rateLimit } = await etgFetch<{ data: any }>(path, { method: 'POST', body, timeoutMs: 30000 });
  return { info: data.data, rateLimit };
}

/* ---------- Export ---------- */
export default {
  searchHotels,
  searchRegion,
  searchGeo,
  getHotelpage,
  prebook,
  startBooking,
  finishBooking,
  getHotelDump,
  getHotelIncrementalDump,
  getHotelInfo,
};
