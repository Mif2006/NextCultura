// etg/schemas.ts
import { z } from 'zod';

export const guestSchema = z.object({
  adults: z.number().min(1),
  children: z.number().min(0).optional(),
  child_ages: z.array(z.number()).optional(),
});

export const searchParamsSchema = z.object({
  checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hids: z.array(z.number()).optional(),
  residency: z.string().optional(),
  guests: z.array(guestSchema),
  currency: z.string().optional(),
  lang: z.string().optional(),
  timeout: z.number().int().min(10).max(300).optional(),
});

export const hotelpageParamsSchema = z.object({
  hid: z.number().optional(),
  hotel_id: z.string().optional(),
  search_hash: z.string().optional(),
  checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.array(guestSchema),
  currency: z.string().optional(),
  lang: z.string().optional(),
  timeout: z.number().int().min(10).max(300).optional(),
});

export const prebookParamsSchema = z.object({
  book_hash: z.string(),
  price_increase_percent: z.number().min(0).max(100).optional(),
  currency: z.string().optional(),
});

export const bookingParamsSchema = z.object({
  book_hash: z.string(),
  guest_name: z.string(),
  guest_email: z.string().email(),
  guest_phone: z.string().optional(),
  guests: z.array(guestSchema).optional(),
  nationality: z.string().optional(),
  special_requests: z.string().optional(),
  payment: z.object({
    method: z.enum(['external', 'card', 'offline']),
    provider: z.string().optional(),
    external_payment_id: z.string().optional(),
  }).optional(),
  return_path: z.string().url().optional(),
});
