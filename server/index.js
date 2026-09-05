import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { rateLimiter } from './middleware/rateLimiter.js'
import youtubeRoutes from './routes/youtube.js'

const app = express()
const PORT = process.env.PORT || 8787

app.use(cors())
app.use(rateLimiter)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/music', youtubeRoutes)

app.use((_req, res) => res.status(404).json({ code: 'NOT_FOUND', message: 'Route not found.' }))

app.listen(PORT, () => {
  console.log(`Genta Music Player API listening on http://localhost:${PORT}`)
  if (!process.env.YOUTUBE_API_KEY) {
    console.warn('⚠️  YOUTUBE_API_KEY is not set. Copy server/.env.example to server/.env and add your key.')
  }
})
