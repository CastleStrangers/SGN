interface WindowEntry {
  count: number;
  resetAt: number;
}

const stores = new Map<string, Map<string, WindowEntry>>();

export function createRateLimiter(options: {
  maxRequests: number;
  windowMs: number;
  name?: string;
}) {
  const { maxRequests, windowMs, name = "default" } = options;

  if (!stores.has(name)) {
    stores.set(name, new Map());
  }

  const store = stores.get(name)!;

  function cleanup() {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
  }

  function isLimited(key: string): boolean {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return false;
    }

    if (entry.count >= maxRequests) {
      return true;
    }

    entry.count++;
    return false;
  }

  function getRemaining(key: string): number {
    const now = Date.now();
    const entry = store.get(key);
    if (!entry || now > entry.resetAt) return maxRequests;
    return Math.max(0, maxRequests - entry.count);
  }

  function getResetTime(key: string): number {
    const entry = store.get(key);
    return entry?.resetAt ?? Date.now();
  }

  function reset(key: string): void {
    store.delete(key);
  }

  function resetAll(): void {
    store.clear();
  }

  setInterval(cleanup, Math.min(windowMs, 60_000));

  return { isLimited, getRemaining, getResetTime, reset, resetAll };
}

export type RateLimiter = ReturnType<typeof createRateLimiter>;
