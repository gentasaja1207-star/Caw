import { cacheGet, cacheSet } from '../utils/cache.js'

const API_BASE = 'https://www.googleapis.com/youtube/v3'
const SEARCH_TTL_MS = 5 * 60_000 // 5 min — search results churn slowly
const DETAILS_TTL_MS = 60 * 60_000 // 1 hr — durations/titles rarely change
const TRENDING_TTL_MS = 15 * 60_000 // 15 min

class YouTubeApiError extends Error {
  constructor(message, status, code = 'YOUTUBE_API_ERROR') {
    super(message)
    this.status = status
    this.code = code
  }
}

function getApiKey() {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) {
    throw new YouTubeApiError(
      'Server is missing YOUTUBE_API_KEY. Add it to server/.env (see server/.env.example).',
      500,
      'MISSING_API_KEY'
    )
  }
  return key
}

async function callYouTube(endpoint, params) {
  const url = new URL(`${API_BASE}/${endpoint}`)
  Object.entries(params).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, v))
  url.searchParams.set('key', getApiKey())

  const res = await fetch(url)
  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    const reason = body?.error?.errors?.[0]?.reason
    if (reason === 'quotaExceeded' || reason === 'dailyLimitExceeded') {
      throw new YouTubeApiError('The daily YouTube API quota has been reached. Try again tomorrow.', 429, 'QUOTA_EXCEEDED')
    }
    throw new YouTubeApiError(body?.error?.message || 'YouTube API request failed.', res.status, 'YOUTUBE_API_ERROR')
  }
  return body
}

function mapSearchItem(item) {
  const id = item.id?.videoId || item.id
  return {
    id,
    title: decodeEntities(item.snippet?.title || 'Untitled'),
    artist: decodeEntities(item.snippet?.channelTitle || 'Unknown artist'),
    thumbnail:
      item.snippet?.thumbnails?.high?.url ||
      item.snippet?.thumbnails?.medium?.url ||
      item.snippet?.thumbnails?.default?.url ||
      '',
    publishedAt: item.snippet?.publishedAt,
    duration: 0, // filled in by getMusicDetails when needed
  }
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function isoDurationToSeconds(iso) {
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || '')
  if (!match) return 0
  const [, h, m, s] = match
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0)
}

/** Search songs / artists / albums / videos on YouTube. */
export async function searchMusic(query, { pageToken, type = 'video' } = {}) {
  if (!query || !query.trim()) throw new YouTubeApiError('A search query is required.', 400, 'INVALID_QUERY')

  const cacheKey = `search:${type}:${query}:${pageToken || ''}`
  const cached = cacheGet(cacheKey)
  if (cached) return cached

  const data = await callYouTube('search', {
    part: 'snippet',
    q: `${query} music`,
    type,
    videoCategoryId: type === 'video' ? '10' : undefined, // 10 = Music category
    maxResults: 20,
    pageToken,
  })

  const items = (data.items || []).map(mapSearchItem)
  const enriched = await enrichWithDurations(items)

  const result = { items: enriched, nextPageToken: data.nextPageToken || null }
  cacheSet(cacheKey, result, SEARCH_TTL_MS)
  return result
}

/** Full details (duration, stats, channel) for a set of video IDs. */
export async function getMusicDetails(ids) {
  const idList = Array.isArray(ids) ? ids : String(ids).split(',')
  if (!idList.length) throw new YouTubeApiError('At least one video id is required.', 400, 'INVALID_IDS')

  const cacheKey = `details:${idList.join(',')}`
  const cached = cacheGet(cacheKey)
  if (cached) return cached

  const data = await callYouTube('videos', {
    part: 'snippet,contentDetails,statistics',
    id: idList.join(','),
  })

  const items = (data.items || []).map((item) => ({
    id: item.id,
    title: decodeEntities(item.snippet?.title || 'Untitled'),
    artist: decodeEntities(item.snippet?.channelTitle || 'Unknown artist'),
    thumbnail:
      item.snippet?.thumbnails?.high?.url ||
      item.snippet?.thumbnails?.medium?.url ||
      item.snippet?.thumbnails?.default?.url ||
      '',
    duration: isoDurationToSeconds(item.contentDetails?.duration),
    viewCount: Number(item.statistics?.viewCount || 0),
    publishedAt: item.snippet?.publishedAt,
  }))

  const result = { items }
  cacheSet(cacheKey, result, DETAILS_TTL_MS)
  return result
}

/** Curated trending music via the most-popular endpoint, scoped to the Music category. */
export async function getTrendingMusic({ regionCode = 'US' } = {}) {
  const cacheKey = `trending:${regionCode}`
  const cached = cacheGet(cacheKey)
  if (cached) return cached

  const data = await callYouTube('videos', {
    part: 'snippet,contentDetails,statistics',
    chart: 'mostPopular',
    videoCategoryId: '10', // Music
    regionCode,
    maxResults: 25,
  })

  const items = (data.items || []).map((item) => ({
    id: item.id,
    title: decodeEntities(item.snippet?.title || 'Untitled'),
    artist: decodeEntities(item.snippet?.channelTitle || 'Unknown artist'),
    thumbnail:
      item.snippet?.thumbnails?.high?.url ||
      item.snippet?.thumbnails?.medium?.url ||
      item.snippet?.thumbnails?.default?.url ||
      '',
    duration: isoDurationToSeconds(item.contentDetails?.duration),
    viewCount: Number(item.statistics?.viewCount || 0),
  }))

  const result = { items }
  cacheSet(cacheKey, result, TRENDING_TTL_MS)
  return result
}

/** Batches a details lookup to attach real durations onto search results. */
async function enrichWithDurations(items) {
  if (!items.length) return items
  try {
    const { items: details } = await getMusicDetails(items.map((i) => i.id))
    const byId = new Map(details.map((d) => [d.id, d]))
    return items.map((i) => ({ ...i, duration: byId.get(i.id)?.duration || 0 }))
  } catch {
    // Non-fatal — search still works without exact durations.
    return items
  }
}

export { YouTubeApiError }
