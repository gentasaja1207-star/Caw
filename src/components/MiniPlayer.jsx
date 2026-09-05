import { AnimatePresence, motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Heart } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { formatDuration } from '../utils/storage'

export default function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    progress,
    duration,
    isFavorite,
    toggleFavorite,
    setIsFullPlayerOpen,
  } = usePlayer()

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          className="fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-2xl bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:bottom-4"
        >
          <div className="glass-panel rounded-xl2 pl-2 pr-3 py-2 flex items-center gap-3 cursor-pointer" onClick={() => setIsFullPlayerOpen(true)}>
            <img src={currentTrack.thumbnail} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{currentTrack.title}</p>
              <p className="text-[11px] text-mist-400 truncate">{currentTrack.artist}</p>
            </div>

            <div className="hidden sm:flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button onClick={playPrevious} className="icon-btn w-8 h-8" aria-label="Previous">
                <SkipBack size={15} />
              </button>
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-genta-glow flex items-center justify-center shadow-glow"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={16} className="text-void-950" /> : <Play size={16} className="text-void-950 ml-0.5" />}
              </button>
              <button onClick={playNext} className="icon-btn w-8 h-8" aria-label="Next">
                <SkipForward size={15} />
              </button>
            </div>

            <button onClick={togglePlay} className="sm:hidden icon-btn" aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(currentTrack)
              }}
              className="icon-btn hidden sm:flex"
              aria-label="Toggle favorite"
            >
              <Heart size={16} className={isFavorite(currentTrack.id) ? 'fill-orchid-500 text-orchid-500' : ''} />
            </button>
          </div>

          <div className="h-[3px] w-full bg-white/5 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-genta-glow"
              style={{ width: duration ? `${Math.min((progress / duration) * 100, 100)}%` : '0%' }}
            />
          </div>
          <div className="sr-only">
            {formatDuration(progress)} / {formatDuration(duration)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
