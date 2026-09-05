import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Mic2,
} from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { formatDuration } from '../utils/storage'
import { useKeyboardControls } from '../hooks/useKeyboardControls'

export default function FullPlayer() {
  const navigate = useNavigate()
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    progress,
    duration,
    seekTo,
    volume,
    changeVolume,
    shuffle,
    setShuffle,
    repeatMode,
    cycleRepeat,
    isFavorite,
    toggleFavorite,
    isFullPlayerOpen,
    setIsFullPlayerOpen,
  } = usePlayer()

  useKeyboardControls()

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2
  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat

  return (
    <AnimatePresence>
      {isFullPlayerOpen && currentTrack && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[90] bg-void-950 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-110 opacity-40"
            style={{ backgroundImage: `url(${currentTrack.thumbnail})`, filter: 'blur(60px) saturate(1.4)' }}
          />
          <div className="absolute inset-0 bg-void-950/70" />

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full flex flex-col max-w-lg mx-auto px-6 py-6"
          >
            <div className="flex items-center justify-between">
              <button onClick={() => setIsFullPlayerOpen(false)} className="icon-btn" aria-label="Minimize player">
                <ChevronDown size={22} />
              </button>
              <p className="text-xs text-mist-400 tracking-wide">Now Playing</p>
              <button
                onClick={() => {
                  setIsFullPlayerOpen(false)
                  navigate('/lyrics')
                }}
                className="icon-btn"
                aria-label="Open lyrics"
              >
                <Mic2 size={19} />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center py-6">
              <motion.img
                key={currentTrack.id}
                initial={{ scale: 0.85, opacity: 0, rotate: -3 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                src={currentTrack.thumbnail}
                alt=""
                className="w-full max-w-sm aspect-square object-cover rounded-xl3 shadow-glass"
              />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-xl font-display font-bold text-white truncate">{currentTrack.title}</h2>
                <p className="text-sm text-mist-400 truncate mt-1">{currentTrack.artist}</p>
              </div>
              <button onClick={() => toggleFavorite(currentTrack)} className="icon-btn shrink-0 mt-1" aria-label="Toggle favorite">
                <Heart size={22} className={isFavorite(currentTrack.id) ? 'fill-orchid-500 text-orchid-500' : ''} />
              </button>
            </div>

            <div className="mt-5">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={Math.min(progress, duration || 0)}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="w-full accent-orchid-500 h-1.5 rounded-full cursor-pointer"
                aria-label="Seek"
              />
              <div className="flex justify-between text-[11px] text-mist-400 mt-1 tabular-nums">
                <span>{formatDuration(progress)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setShuffle((s) => !s)}
                className={`icon-btn ${shuffle ? 'text-orchid-400' : ''}`}
                aria-label="Toggle shuffle"
              >
                <Shuffle size={18} />
              </button>
              <button onClick={playPrevious} className="icon-btn w-11 h-11" aria-label="Previous">
                <SkipBack size={22} />
              </button>
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-genta-glow flex items-center justify-center shadow-glow"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={26} className="text-void-950" /> : <Play size={26} className="text-void-950 ml-1" />}
              </button>
              <button onClick={playNext} className="icon-btn w-11 h-11" aria-label="Next">
                <SkipForward size={22} />
              </button>
              <button
                onClick={cycleRepeat}
                className={`icon-btn ${repeatMode !== 'off' ? 'text-orchid-400' : ''}`}
                aria-label="Cycle repeat mode"
              >
                <RepeatIcon size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <VolumeIcon size={17} className="text-mist-400 shrink-0" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                className="w-full accent-orchid-500 h-1 rounded-full cursor-pointer"
                aria-label="Volume"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
