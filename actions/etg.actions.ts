// actions/etg.actions.ts
import { searchHotels, getHotelpage, prebook, startBooking, finishBooking } from '../etg/service';
import { SearchParams, HotelpageParams, BookingParams } from '../etg/types';

/**
 * Example wrapper functions you can call from app route handlers or server actions.
 * They adapt to your app's DB or Supabase calls (example commented).
 */

export async function etgSearch(params: SearchParams) {
  // you may sanitize / transform params here before calling the client
  return searchHotels(params);
}

export async function etgGetHotelpage(params: HotelpageParams) {
  return getHotelpage(params);
}

export async function etgPrebook(bookHash: string) {
  return prebook({ book_hash: bookHash });
}

export async function etgStartBooking(payload: BookingParams) {
  // Here you might:
  // - create a local "pending" booking row in your DB (Supabase)
  // - call startBooking
  // - persist process_id / order_id
  // - return booking process info to caller
  return startBooking(payload);
}

export async function etgFinishBooking(processId: string) {
  return finishBooking(processId);
}
