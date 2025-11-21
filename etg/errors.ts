// etg/errors.ts

export type ETGErrorMeta = Record<string, any>;

export class ETGError extends Error {
  meta?: ETGErrorMeta;
  constructor(message: string, meta?: ETGErrorMeta) {
    super(message);
    this.name = 'ETGError';
    this.meta = meta;
  }
}

export class ETGValidationError extends ETGError {
  constructor(message: string, meta?: ETGErrorMeta) {
    super(message, meta);
    this.name = 'ETGValidationError';
  }
}

export class ETGRateLimitError extends ETGError {
  constructor(message = 'ETG rate limit exceeded', meta?: ETGErrorMeta) {
    super(message, meta);
    this.name = 'ETGRateLimitError';
  }
}
