import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Pause, Sparkles, Clock, Heart, ChevronRight } from 'lucide-react'
import { getTrendingMusic } from '../services/musicApi'
import { usePlayer } from '../context/PlayerContext'
import SongCard from '../components/SongCard'
import { SkeletonGrid, SkeletonRows, ErrorState } from '../components/States'
import { MOODS } from '../config/constants'

export default function Home() {
  const { currentTrack, isPlaying, togglePlay, playTrack, history, favorites } = usePlayer()
  const [trending, setTrending] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    load()
  }, [])

  function load() {
    setError(null)
    setTrending(null)
    getTrendingMusic()
      .then((data) => setTrending(data.items || []))
      .catch((e) => setError(e.message))
  }

  const featured = trending?.[0]
  const recommended = trending?.slice(1, 11) || []

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="relative rounded-xl3 overflow-hidden glass-panel min-h-[280px] flex items-end p-6 sm:p-8">
        {featured ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center scale-110"
              style={{ backgroundImage: `url(${featured.thumbnail})`, filter: 'blur(40px) brightness(0.55) saturate(1.3)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/40 to-transparent" />
            <div className="relative flex items-end justify-between w-full gap-6">
              <div className="min-w-0">
                <p className="section-label flex items-center gap-1.5 mb-2">
                  <Sparkles size={13} className="text-gold-400" /> Featured today
                </p>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white truncate max-w-xl">
                  {featured.title}
                </h1>
                <p className="text-sm text-mist-300 mt-1.5">{featured.artist}</p>
              </div>
              <button
                onClick={() => (currentTrack?.id === featured.id ? togglePlay() : playTrack(featured, trending))}
                className="w-14 h-14 rounded-full bg-genta-glow flex items-center justify-center shadow-glow shrink-0"
                aria-label="Play featured track"
              >
                {currentTrack?.id === featured.id && isPlaying ? (
                  <Pause size={22} className="text-void-950" />
                ) : (
                  <Play size={22} className="text-void-950 ml-0.5" />
                )}
              </button>
            </div>
          </>
        ) : error ? (
          <div className="relative w-full">
            <ErrorState message={error} onRetry={load} />
          </div>
        ) : (
          <div className="relative w-full h-40 skeleton" />
        )}
      </section>

      {/* Quick access */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/library?tab=favorites" className="glass-panel rounded-xl2 p-4 flex items-center gap-3 hover:bg-white/[0.07] transition-colors">
          <div className="w-10 h-10 rounded-full bg-orchid-600/20 flex items-center justify-center">
            <Heart size={17} className="text-orchid-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Favorites</p>
            <p className="text-xs text-mist-400">{favorites.length} songs</p>
          </div>
        </Link>
        <Link to="/library?tab=playlists" className="glass-panel rounded-xl2 p-4 flex items-center gap-3 hover:bg-white/[0.07] transition-colors">
          <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
            <Sparkles size={17} className="text-gold-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Playlists</p>
            <p className="text-xs text-mist-400">Your mixes</p>
          </div>
        </Link>
        {MOODS.slice(0, 2).map((m) => (
          <Link
            key={m.id}
            to={`/search?mood=${m.id}`}
            className="glass-panel rounded-xl2 p-4 flex items-center gap-3 hover:bg-white/[0.07] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center">
              <Sparkles size={17} className="text-mist-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{m.label}</p>
              <p className="text-xs text-mist-400">Mood mix</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Trending */}
      <Section title="Trending now" subtitle="What everyone's playing" to="/search?mood=energy">
        {trending ? (
          <ScrollRow>
            {trending.slice(0, 12).map((t) => (
              <div key={t.id} className="w-40 shrink-0">
                <SongCard track={t} queue={trending} />
              </div>
            ))}
          </ScrollRow>
        ) : error ? null : (
          <SkeletonGrid count={6} />
        )}
      </Section>

      {/* Recommended */}
      <Section title="Made for you" subtitle="Smart picks based on trending taste">
        {trending ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommended.map((t) => (
              <SongCard key={t.id} track={t} queue={trending} />
            ))}
          </div>
        ) : error ? null : (
          <SkeletonGrid count={5} />
        )}
      </Section>

      {/* Recently played */}
      <Section title="Recently played" subtitle="Pick up where you left off" icon={Clock}>
        {history.length ? (
          <div className="flex flex-col gap-1">
            {history.slice(0, 6).map((t) => (
              <SongCard key={t.id} track={t} queue={history} layout="row" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-mist-400">Songs you play will show up here.</p>
        )}
      </Section>
    </div>
  )
}

function Section({ title, subtitle, to, icon: Icon = Sparkles, children }) {
  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Icon size={16} className="text-orchid-400" />
            {title}
          </h2>
          {subtitle && <p className="text-xs text-mist-400 mt-0.5">{subtitle}</p>}
        </div>
        {to && (
          <Link to={to} className="text-xs text-mist-400 hover:text-white flex items-center gap-0.5 transition-colors">
            See all <ChevronRight size={14} />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

function ScrollRow({ children }) {
  return <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x">{children}</div>
}
