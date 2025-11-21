// etg/types.ts

export type ETGRateLimit = {
    limit: number;
    remaining: number;
    resetSeconds: number;
  };
  
  export type Guest = {
    adults: number;
    children?: number;
    child_ages?: number[];
  };
  
  export type SearchParams = {
    checkin: string; // YYYY-MM-DD
    checkout: string; // YYYY-MM-DD
    hids?: number[];
    residency?: string;
    guests: Guest[];
    currency?: string;
    lang?: string;
    timeout?: number; // seconds
  };
  
  export type SerpHotel = {
    hid: number;
    name: string;
    stars?: number;
    price?: number;
    currency?: string;
    search_hash?: string;
  };
  
  export type HotelpageParams = {
    hid?: number;
    hotel_id?: string;
    search_hash?: string;
    checkin: string;
    checkout: string;
    guests: Guest[];
    currency?: string;
    lang?: string;
    timeout?: number;
  };
  
  export type PrebookParams = {
    book_hash: string;
    price_increase_percent?: number;
    currency?: string;
  };
  
  export type PrebookResponse = {
    book_hash: string;
    price: number;
    currency: string;
    daily: { date: string; price: number }[];
    cancellation_policy?: any;
    match_hash?: string;
  };
  
  export type BookingParams = {
    book_hash: string;
    guest_name: string;
    guest_email: string;
    guest_phone?: string;
    guests?: Guest[];
    nationality?: string;
    special_requests?: string;
    payment?: {
      method: 'external' | 'card' | 'offline';
      provider?: string;
      external_payment_id?: string;
    };
    return_path?: string; // optional redirect for 3DS
  };
  
  export type BookingStartResponse = {
    process_id?: string;
    order_id?: string;
    status?: string;
  };
  
  export type BookingFinishResponse = {
    order_id: string;
    status: string;
    details?: any;
  };
  
  export type HotelDumpMeta = {
    generated_at: string;
    file_url: string;
  };
  