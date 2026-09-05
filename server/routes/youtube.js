import { Router } from 'express'
import { searchMusic, getMusicDetails, getTrendingMusic, YouTubeApiError } from '../services/youtubeService.js'

const router = Router()

function handleError(err, res) {
  if (err instanceof YouTubeApiError) {
    return res.status(err.status).json({ code: err.code, message: err.message })
  }
  console.error('[genta-music-player] Unexpected error:', err)
  return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' })
}

router.get('/search', async (req, res) => {
  try {
    const { q, type, pageToken } = req.query
    const result = await searchMusic(q, { type, pageToken })
    res.json(result)
  } catch (err) {
    handleError(err, res)
  }
})

router.get('/details', async (req, res) => {
  try {
    const { ids } = req.query
    const result = await getMusicDetails(ids)
    res.json(result)
  } catch (err) {
    handleError(err, res)
  }
})

router.get('/trending', async (req, res) => {
  try {
    const { regionCode } = req.query
    const result = await getTrendingMusic({ regionCode })
    res.json(result)
  } catch (err) {
    handleError(err, res)
  }
})

export default router
