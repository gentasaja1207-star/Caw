// Minimal in-memory TTL cache. Search/trending calls are the most
// quota-expensive YouTube endpoints (100 units each), so caching identical
// queries for a short window meaningfully protects the daily quota.
const store = new Map()

export function cacheGet(key) {
  const entry = store.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return undefined
  }
  return entry.value
}

export function cacheSet(key, value, ttlMs) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs })
}
