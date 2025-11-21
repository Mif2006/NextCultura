# ETG client

This folder contains a production-ready ETG API v3 client and helpers.

## Environment variables

Required:
- `ETG_API_BASE` (optional) - base URL, default `https://api.worldota.net`
- `ETG_API_KEY_ID` - API key id (username for Basic Auth)
- `ETG_API_KEY` - API secret (password for Basic Auth)

Optional:
- `ETG_DEFAULT_TIMEOUT_MS` - default timeout for ETG requests (ms). Default `60000`.
- `ETG_MAX_RETRIES` - how many retries for transient errors (default `3`).
- `ETG_RETRY_BASE_MS` - base backoff ms (default `500`).
- `REDIS_URL` - if set, cache uses Redis. Otherwise an in-memory cache is used (dev only).
- `ETG_CACHE_TTL_SEC` - TTL for cache in seconds (default 1800).

## Notes

- Verify actual ETG endpoint paths in your Postman collection; adjust `service.ts` paths accordingly.
- This client implements robust retry/backoff, response validation (Zod), rate-limit parsing, and a cache abstraction.
- Do not cache price/availability-sensitive endpoints (`hotelpage`, `prebook`, `book`) — caching is intended for static dumps only.
