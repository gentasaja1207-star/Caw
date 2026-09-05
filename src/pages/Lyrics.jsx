import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Mic2 } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { fetchLyrics } from '../services/lyricsProvider'
import { EmptyState } from '../components/States'

export default function Lyrics() {
  const navigate = useNavigate()
  const { currentTrack, progress } = usePlayer()
  const [lyrics, setLyrics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentTrack) return
    setLoading(true)
    fetchLyrics(currentTrack).then((res) => {
      setLyrics(res)
      setLoading(false)
    })
  }, [currentTrack?.id])

  if (!currentTrack) {
    return (
      <EmptyState
        icon={Mic2}
        title="Nothing playing"
        subtitle="Start a song to follow along with lyrics here."
      />
    )
  }

  const activeIndex = lyrics?.synced
    ? lyrics.lines.reduce((acc, line, i) => (line.time !== null && line.time <= progress ? i : acc), -1)
    : -1

  return (
    <div className="fixed inset-0 z-[80] bg-void-950 flex flex-col">
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 opacity-30"
        style={{ backgroundImage: `url(${currentTrack.thumbnail})`, filter: 'blur(70px) saturate(1.3)' }}
      />
      <div className="absolute inset-0 bg-void-950/60" />

      <div className="relative flex items-center justify-between px-6 py-5">
        <button onClick={() => navigate(-1)} className="icon-btn" aria-label="Close lyrics">
          <ChevronDown size={22} />
        </button>
        <div className="text-center min-w-0 px-4">
          <p className="text-sm font-medium text-white truncate max-w-[240px]">{currentTrack.title}</p>
          <p className="text-xs text-mist-400 truncate max-w-[240px]">{currentTrack.artist}</p>
        </div>
        <div className="w-10" />
      </div>

      <div className="relative flex-1 overflow-y-auto px-8 pb-24 flex flex-col items-center justify-center text-center">
        {loading ? (
          <div className="flex flex-col gap-4 w-full max-w-md">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-5 w-2/3 mx-auto rounded-md" />
            ))}
          </div>
        ) : lyrics?.available ? (
          <div className="flex flex-col gap-5 max-w-md">
            {lyrics.lines.map((line, i) => (
              <p
                key={i}
                className={`text-2xl font-display font-semibold leading-snug transition-all duration-300 ${
                  i === activeIndex ? 'text-white scale-105' : 'text-mist-400/60'
                }`}
              >
                {line.text}
              </p>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Mic2}
            title="No lyrics available"
            subtitle="This track doesn't have synced lyrics yet. Connect a lyrics provider in src/services/lyricsProvider.js to enable this page."
          />
        )}
      </div>
    </div>
  )
}
