import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { STORAGE_KEYS } from '../config/constants'
import { loadJSON, saveJSON } from '../utils/storage'
import { useToast } from './ToastContext'

const PlayerContext = createContext(null)

const REPEAT_MODES = ['off', 'all', 'one']

export function PlayerProvider({ children }) {
  const { notify } = useToast()

  // --- Library state (persisted) ---------------------------------------
  const [favorites, setFavorites] = useState(() => loadJSON(STORAGE_KEYS.favorites, []))
  const [playlists, setPlaylists] = useState(() => loadJSON(STORAGE_KEYS.playlists, []))
  const [history, setHistory] = useState(() => loadJSON(STORAGE_KEYS.history, []))

  // --- Playback state -----------------------------------------------------
  const [queue, setQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // seconds
  const [duration, setDuration] = useState(0) // seconds
  const [volume, setVolume] = useState(() => loadJSON(STORAGE_KEYS.volume, 0.85))
  const [shuffle, setShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off')
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)

  const ytPlayerRef = useRef(null)
  const progressTimer = useRef(null)

  const currentTrack = queueIndex >= 0 ? queue[queueIndex] : null

  // --- Persistence ----------------------------------------------------
  useEffect(() => saveJSON(STORAGE_KEYS.favorites, favorites), [favorites])
  useEffect(() => saveJSON(STORAGE_KEYS.playlists, playlists), [playlists])
  useEffect(() => saveJSON(STORAGE_KEYS.history, history), [history])
  useEffect(() => saveJSON(STORAGE_KEYS.volume, volume), [volume])
  useEffect(() => {
    if (currentTrack) saveJSON(STORAGE_KEYS.lastSong, currentTrack)
  }, [currentTrack])

  // --- YouTube IFrame Player bootstrap ------------------------------------
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setPlayerReady(true)
      return
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)
    window.onYouTubeIframeAPIReady = () => setPlayerReady(true)
  }, [])

  useEffect(() => {
    if (!playerReady || ytPlayerRef.current) return
    ytPlayerRef.current = new window.YT.Player('genta-yt-audio-sink', {
      height: '0',
      width: '0',
      playerVars: { autoplay: 0, controls: 0, disablekb: 1, playsinline: 1 },
      events: {
        onReady: (e) => e.target.setVolume(volume * 100),
        onStateChange: (e) => {
          // 0 = ended, 1 = playing, 2 = paused, 3 = buffering
          if (e.data === 1) {
            setIsPlaying(true)
            setDuration(ytPlayerRef.current.getDuration() || 0)
          } else if (e.data === 2) {
            setIsPlaying(false)
          } else if (e.data === 0) {
            handleTrackEnd()
          }
        },
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerReady])

  useEffect(() => {
    if (!currentTrack || !ytPlayerRef.current?.loadVideoById) return
    ytPlayerRef.current.loadVideoById(currentTrack.id)
    ytPlayerRef.current.setVolume(volume * 100)
    setProgress(0)
    setHistory((prev) => {
      const withoutDupe = prev.filter((t) => t.id !== currentTrack.id)
      return [currentTrack, ...withoutDupe].slice(0, 60)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id])

  useEffect(() => {
    if (progressTimer.current) clearInterval(progressTimer.current)
    if (isPlaying) {
      progressTimer.current = setInterval(() => {
        const p = ytPlayerRef.current?.getCurrentTime?.() || 0
        setProgress(p)
      }, 500)
    }
    return () => clearInterval(progressTimer.current)
  }, [isPlaying])

  // --- Transport controls -------------------------------------------------
  const playTrack = useCallback((track, contextQueue) => {
    const q = contextQueue && contextQueue.length ? contextQueue : [track]
    const idx = q.findIndex((t) => t.id === track.id)
    setQueue(q)
    setQueueIndex(idx === -1 ? 0 : idx)
  }, [])

  const togglePlay = useCallback(() => {
    if (!ytPlayerRef.current) return
    if (isPlaying) ytPlayerRef.current.pauseVideo()
    else ytPlayerRef.current.playVideo()
  }, [isPlaying])

  const seekTo = useCallback((seconds) => {
    ytPlayerRef.current?.seekTo?.(seconds, true)
    setProgress(seconds)
  }, [])

  const changeVolume = useCallback((v) => {
    setVolume(v)
    ytPlayerRef.current?.setVolume?.(v * 100)
  }, [])

  const nextIndex = useCallback(() => {
    if (!queue.length) return -1
    if (shuffle) return Math.floor(Math.random() * queue.length)
    const n = queueIndex + 1
    if (n < queue.length) return n
    return repeatMode === 'all' ? 0 : -1
  }, [queue.length, queueIndex, shuffle, repeatMode])

  const playNext = useCallback(() => {
    const n = nextIndex()
    if (n === -1) {
      setIsPlaying(false)
      return
    }
    setQueueIndex(n)
  }, [nextIndex])

  const playPrevious = useCallback(() => {
    if (progress > 4) {
      seekTo(0)
      return
    }
    const p = queueIndex - 1
    setQueueIndex(p >= 0 ? p : queue.length - 1)
  }, [progress, queueIndex, queue.length, seekTo])

  const handleTrackEnd = useCallback(() => {
    if (repeatMode === 'one') {
      seekTo(0)
      ytPlayerRef.current?.playVideo?.()
      return
    }
    playNext()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeatMode])

  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => REPEAT_MODES[(REPEAT_MODES.indexOf(prev) + 1) % REPEAT_MODES.length])
  }, [])

  // --- Library actions ------------------------------------------------
  const isFavorite = useCallback((id) => favorites.some((t) => t.id === id), [favorites])

  const toggleFavorite = useCallback(
    (track) => {
      setFavorites((prev) => {
        const exists = prev.some((t) => t.id === track.id)
        notify(exists ? 'Removed from Favorites' : 'Added to Favorites', 'success')
        return exists ? prev.filter((t) => t.id !== track.id) : [track, ...prev]
      })
    },
    [notify]
  )

  const createPlaylist = useCallback(
    (name) => {
      const playlist = { id: `pl_${Date.now()}`, name, tracks: [], createdAt: Date.now() }
      setPlaylists((prev) => [playlist, ...prev])
      notify(`Playlist "${name}" created`, 'success')
      return playlist.id
    },
    [notify]
  )

  const deletePlaylist = useCallback(
    (playlistId) => {
      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId))
      notify('Playlist deleted', 'info')
    },
    [notify]
  )

  const addToPlaylist = useCallback(
    (playlistId, track) => {
      setPlaylists((prev) =>
        prev.map((p) => {
          if (p.id !== playlistId) return p
          if (p.tracks.some((t) => t.id === track.id)) {
            notify('Already in this playlist', 'info')
            return p
          }
          notify(`Added to ${p.name}`, 'success')
          return { ...p, tracks: [track, ...p.tracks] }
        })
      )
    },
    [notify]
  )

  const removeFromPlaylist = useCallback((playlistId, trackId) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) } : p))
    )
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    notify('Playback history cleared', 'info')
  }, [notify])

  const value = useMemo(
    () => ({
      // playback
      queue,
      queueIndex,
      currentTrack,
      isPlaying,
      progress,
      duration,
      volume,
      shuffle,
      repeatMode,
      isFullPlayerOpen,
      playerReady,
      setIsFullPlayerOpen,
      playTrack,
      togglePlay,
      seekTo,
      changeVolume,
      playNext,
      playPrevious,
      setShuffle,
      cycleRepeat,
      // library
      favorites,
      playlists,
      history,
      isFavorite,
      toggleFavorite,
      createPlaylist,
      deletePlaylist,
      addToPlaylist,
      removeFromPlaylist,
      clearHistory,
    }),
    [
      queue,
      queueIndex,
      currentTrack,
      isPlaying,
      progress,
      duration,
      volume,
      shuffle,
      repeatMode,
      isFullPlayerOpen,
      playerReady,
      playTrack,
      togglePlay,
      seekTo,
      changeVolume,
      playNext,
      playPrevious,
      cycleRepeat,
      favorites,
      playlists,
      history,
      isFavorite,
      toggleFavorite,
      createPlaylist,
      deletePlaylist,
      addToPlaylist,
      removeFromPlaylist,
      clearHistory,
    ]
  )

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <div id="genta-yt-audio-sink" className="hidden" aria-hidden="true" />
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
