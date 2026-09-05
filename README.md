# Genta Music Player

A premium, glassmorphic music streaming web app built on real YouTube data —
React + Vite frontend, Express backend, iOS/visionOS-inspired UI.

## Quick start

Two processes run side by side: the Vite frontend and the Express API
(which is the only thing that holds your YouTube key).

```bash
# 1. Install dependencies (once)
npm install

# 2. Terminal A — start the backend (proxies YouTube Data API v3)
npm run server

# 3. Terminal B — start the frontend
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Your YouTube API key already lives in `server/.env` (gitignored). If you
ever need to rotate it, edit that file — the key is never read by, sent
to, or bundled into the frontend.

> **Security note:** the key you provided was shared in plain text in this
> brief. Treat it as potentially exposed — consider rotating it in the
> Google Cloud Console and restricting it (HTTP referrer / IP, and to the
> YouTube Data API v3 only) before using this app publicly.

## Architecture

```
Frontend (React)  →  /api/music/*  →  Express backend  →  YouTube Data API v3
                                         (holds the key)
```

The frontend never calls `googleapis.com` directly — see
`src/services/musicApi.js`. All requests go through the backend
(`server/services/youtubeService.js`), which adds the key, caches
responses briefly to protect your daily quota, and rate-limits callers.

```
src/
  components/   Reusable UI: player, cards, states, modals, nav
  pages/        Route-level screens (Home, Search, Library, Lyrics, ...)
  layouts/      MainLayout — sidebar/topbar/outlet/player shell
  services/     Frontend API clients (musicApi, lyricsProvider)
  hooks/        Cross-cutting hooks (keyboard controls)
  context/      Global state: PlayerContext (playback+library), ToastContext
  config/       Constants: nav items, moods, storage keys
  utils/        Small pure helpers (storage, duration formatting)

server/
  index.js            Express entry point
  routes/youtube.js   /api/music/search, /details, /trending
  services/           YouTube API integration + response mapping
  middleware/          Rate limiting
  utils/cache.js       In-memory TTL cache (quota protection)
```

## Notable design decisions

- **Playback engine**: uses the YouTube IFrame Player API in a hidden
  `0x0` sink (`#genta-yt-audio-sink`), controlled entirely by
  `PlayerContext`. This keeps playback state centralized and lets any
  component (mini player, full player, song cards) drive the same
  transport.
- **Lyrics**: `src/services/lyricsProvider.js` defines a provider
  contract but ships with no licensed lyrics source wired in (that needs
  its own API agreement). The Lyrics page is fully built and will light
  up the moment a real provider is plugged in server-side.
- **Persistence**: favorites, playlists, history, volume, and the
  "last song" are persisted to `localStorage` — no backend database in
  v1. Swap `src/utils/storage.js` for real API calls if you add user
  accounts later.
- **Quota protection**: search/trending/detail responses are cached
  server-side for 5–60 minutes, and a per-IP rate limiter caps requests
  at 60/min.

## Known limitations to know about before shipping publicly

- No user accounts/auth — library data is per-browser, not per-account.
- No real audio waveform/streaming CDN — playback is via YouTube's own
  player, so this app is best understood as a premium YouTube Music
  client, not an independent audio host.
- Lyrics require a provider you plug in yourself (see above).
