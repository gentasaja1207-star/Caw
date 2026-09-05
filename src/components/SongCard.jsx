import { motion } from 'framer-motion'
import { Play, Pause, Heart, ListPlus } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { formatDuration } from '../utils/storage'

/**
 * layout: 'grid' (artwork-forward card) | 'row' (search-result / list row)
 */
export default function SongCard({ track, queue, layout = 'grid', onAddToPlaylist }) {
  const { currentTrack, isPlaying, playTrack, togglePlay, isFavorite, toggleFavorite } = usePlayer()
  const isCurrent = currentTrack?.id === track.id

  function handlePlay() {
    if (isCurrent) togglePlay()
    else playTrack(track, queue)
  }

  if (layout === 'row') {
    return (
      <motion.div
        whileHover={{ x: 2 }}
        className={`group flex items-center gap-3 p-2.5 rounded-2xl transition-colors ${
          isCurrent ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'
        }`}
      >
        <button
          onClick={handlePlay}
          className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0"
          aria-label={isCurrent && isPlaying ? 'Pause' : 'Play'}
        >
          <img src={track.thumbnail} alt="" className="w-full h-full object-cover" />
          <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            {isCurrent && isPlaying ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white" />}
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium truncate ${isCurrent ? 'text-orchid-400' : 'text-white'}`}>{track.title}</p>
          <p className="text-xs text-mist-400 truncate">{track.artist}</p>
        </div>

        <span className="text-xs text-mist-400 hidden sm:block tabular-nums">{formatDuration(track.duration)}</span>

        <button onClick={() => toggleFavorite(track)} className="icon-btn" aria-label="Toggle favorite">
          <Heart size={16} className={isFavorite(track.id) ? 'fill-orchid-500 text-orchid-500' : ''} />
        </button>
        {onAddToPlaylist && (
          <button onClick={() => onAddToPlaylist(track)} className="icon-btn" aria-label="Add to playlist">
            <ListPlus size={16} />
          </button>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: 'easeOut' }} className="group w-full">
      <button onClick={handlePlay} className="relative w-full aspect-square rounded-xl2 overflow-hidden block shadow-glass">
        <img src={track.thumbnail} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-genta-glow flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-glow">
          {isCurrent && isPlaying ? (
            <Pause size={16} className="text-void-950" />
          ) : (
            <Play size={16} className="text-void-950 ml-0.5" />
          )}
        </span>
      </button>
      <div className="mt-2.5 px-0.5">
        <p className={`text-sm font-medium truncate ${isCurrent ? 'text-orchid-400' : 'text-white'}`}>{track.title}</p>
        <p className="text-xs text-mist-400 truncate">{track.artist}</p>
      </div>
    </motion.div>
  )
}
