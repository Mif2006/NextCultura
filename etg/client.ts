// etg/client.ts
import { ETGRateLimit } from './types';
import { ETGError } from './errors';

const BASE = process.env.ETG_API_BASE ?? 'https://api.worldota.net';
const KEY_ID = process.env.ETG_API_KEY_ID;
const API_KEY = process.env.ETG_API_KEY;
const DEFAULT_TIMEOUT_MS = Number(process.env.ETG_DEFAULT_TIMEOUT_MS ?? 60000);
const MAX_RETRIES = Number(process.env.ETG_MAX_RETRIES ?? 3);
const RETRY_BASE_MS = Number(process.env.ETG_RETRY_BASE_MS ?? 500);

if (!KEY_ID || !API_KEY) {
  // Fail fast in most environments
  // In some test scenarios you may want to allow missing keys; change as needed.
  throw new Error('Missing ETG credentials in environment (ETG_API_KEY_ID, ETG_API_KEY)');
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function parseRateLimit(headers: Headers): ETGRateLimit {
  return {
    limit: Number(headers.get('X-RateLimit-RequestsNumber') ?? headers.get('X-RateLimit-Limit') ?? 0),
    remaining: Number(headers.get('X-RateLimit-Remaining') ?? 0),
    resetSeconds: Number(headers.get('X-RateLimit-Reset') ?? 0),
  };
}

/**
 * low-level fetch wrapper for ETG API.
 * - Basic auth (KEY_ID:API_KEY)
 * - JSON body + parse
 * - timeout support
 * - retry/backoff for idempotent requests and transient 5xx
 */
export async function etgFetch<T = any>(
  path: string,
  opts?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    timeoutMs?: number;
    signal?: AbortSignal;
    headers?: Record<string, string>;
    retry?: number; // overrides MAX_RETRIES for this call
  }
): Promise<{ data: T; rateLimit: ETGRateLimit; status: number }> {
  const method = opts?.method ?? 'POST';
  const timeoutMs = opts?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const headers = new Headers(opts?.headers ?? {});
  headers.set('Authorization', 'Basic ' + Buffer.from(`${KEY_ID}:${API_KEY}`).toString('base64'));
  if (!headers.has('Content-Type') && method !== 'GET') headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  const url = `${BASE}${path}`;

  let attempt = 0;
  const maxRetries = typeof opts?.retry === 'number' ? opts.retry : MAX_RETRIES;
  let lastErr: any;

  // Only retry GET and safe POSTs if ETG doc indicates idempotency — we will retry on 5xx and network errors.
  while (attempt <= maxRetries) {
    attempt += 1;
    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), timeoutMs);
    // If outer signal provided, combine signals (simple approach: if outer aborted, abort inner)
    const signal = opts?.signal ?? controller.signal;
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: opts?.body ? JSON.stringify(opts.body) : undefined,
        signal,
      });

      clearTimeout(timeoutTimer);

      const rateLimit = parseRateLimit(response.headers);

      const text = await response.text();
      let json: any = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (err) {
        // leave json null and treat as text
      }

      if (!response.ok) {
        // Map ETG error formats to ETGError
        const errPayload = json ?? { status: response.status, body: text };
        lastErr = new ETGError('ETG API responded with error', {
          status: response.status,
          payload: errPayload,
          rateLimit,
        });

        // on 429 (rate limit) and 5xx try again with backoff unless we've exhausted retries
        if ((response.status >= 500 || response.status === 429) && attempt <= maxRetries) {
          const backoffMs = Math.min(RETRY_BASE_MS * Math.pow(2, attempt - 1), 10000);
          await sleep(backoffMs);
          continue;
        }

        throw lastErr;
      }

      // success
      return { data: json, rateLimit, status: response.status };
    } catch (err: any) {
      clearTimeout(timeoutTimer);
      // aborted
      if (err?.name === 'AbortError') {
        lastErr = new ETGError('ETG request timed out', { status: 0, payload: null });
        if (attempt <= maxRetries) {
          await sleep(RETRY_BASE_MS * Math.pow(2, attempt - 1));
          continue;
        }
        throw lastErr;
      }

      // network or other error
      lastErr = new ETGError('Network error when calling ETG', { original: err });
      if (attempt <= maxRetries) {
        await sleep(RETRY_BASE_MS * Math.pow(2, attempt - 1));
        continue;
      }
      throw lastErr;
    }
  }

  // should not reach
  throw lastErr ?? new ETGError('Unknown error in etgFetch');
}
