// Genta Music Player — frontend API client.
//
// This module NEVER talks to YouTube directly and NEVER sees the API key.
// Every call goes to our own Express backend (server/), which is the only
// thing that holds the YouTube Data API v3 key. See server/routes/youtube.js.

const BASE = '/api/music'

async function request(path, params = {}) {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${BASE}${path}${qs ? `?${qs}` : ''}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err = new Error(body.message || `Request failed (${res.status})`)
    err.status = res.status
    err.code = body.code
    throw err
  }
  return res.json()
}

/** Search songs / artists / albums / videos. */
export function searchMusic(query, { pageToken, type = 'video' } = {}) {
  return request('/search', { q: query, type, ...(pageToken ? { pageToken } : {}) })
}

/** Full details (duration, stats, channel) for a set of video IDs. */
export function getMusicDetails(ids) {
  return request('/details', { ids: Array.isArray(ids) ? ids.join(',') : ids })
}

/** Curated trending music, optionally scoped by region. */
export function getTrendingMusic({ regionCode = 'US' } = {}) {
  return request('/trending', { regionCode })
}
