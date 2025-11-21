// app/etg/helpers.ts
import { z } from 'zod';
import { SearchParams, HotelpageParams, PrebookParams, BookingParams } from './types';

export const searchSchema = z.object({
  checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hids: z.array(z.number()).optional(),
  residency: z.string().optional(),
  guests: z.array(
    z.object({
      adults: z.number().min(1),
      children: z.number().min(0).optional(),
      child_ages: z.array(z.number()).optional(),
    })
  ),
  currency: z.string().optional(),
  lang: z.string().optional(),
  timeout: z.number().int().min(30).max(600).optional(),
});

export const hotelpageSchema = z.object({
  hid: z.number().optional(),
  search_hash: z.string().optional(),
  checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.array(
    z.object({
      adults: z.number().min(1),
      children: z.number().min(0).optional(),
      child_ages: z.array(z.number()).optional(),
    })
  ),
  currency: z.string().optional(),
  lang: z.string().optional(),
  timeout: z.number().int().min(30).optional(),
});

export const prebookSchema = z.object({
  book_hash: z.string(),
  price_increase_percent: z.number().min(0).max(100).optional(),
  currency: z.string().optional(),
});

export const bookingSchema = z.object({
  book_hash: z.string(),
  guest_name: z.string(),
  guest_email: z.string().email(),
  guest_phone: z.string().optional(),
  guests: z.array(
    z.object({
      adults: z.number().min(1),
      children: z.number().min(0).optional(),
      child_ages: z.array(z.number()).optional(),
    })
  ).optional(),
  return_path: z.string().url().optional(),
});
