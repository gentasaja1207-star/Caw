// Small in-memory rate limiter. Not distributed-safe, but sufficient to
// stop a runaway frontend loop (or a bot) from burning through the daily
// YouTube API quota. For multi-instance deployments, swap this for a
// Redis-backed limiter.
const WINDOW_MS = 60_000
const MAX_REQUESTS = 60

const hits = new Map()

export function rateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown'
  const now = Date.now()
  const windowStart = now - WINDOW_MS

  const timestamps = (hits.get(ip) || []).filter((t) => t > windowStart)
  timestamps.push(now)
  hits.set(ip, timestamps)

  if (timestamps.length > MAX_REQUESTS) {
    return res.status(429).json({
      code: 'RATE_LIMITED',
      message: 'Too many requests. Please slow down and try again shortly.',
    })
  }
  next()
}
