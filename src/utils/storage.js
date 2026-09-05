export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable — fail silently, app still works in-memory
  }
}

export function formatDuration(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00'
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Parses an ISO 8601 duration (YouTube's format, e.g. PT3M42S) into seconds. */
export function parseISODuration(iso) {
  if (!iso) return 0
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso)
  if (!match) return 0
  const [, h, m, s] = match
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0)
}
