import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Plus, ListMusic } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

export default function PlaylistModal({ track, onClose }) {
  const { playlists, createPlaylist, addToPlaylist } = usePlayer()
  const [newName, setNewName] = useState('')

  if (!track) return null

  function handleCreateAndAdd() {
    const name = newName.trim()
    if (!name) return
    const id = createPlaylist(name)
    addToPlaylist(id, track)
    setNewName('')
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-panel rounded-xl2 w-full max-w-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-display font-semibold">Add to playlist</h3>
            <button onClick={onClose} className="icon-btn w-8 h-8" aria-label="Close">
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-mist-400 truncate mb-3">{track.title} — {track.artist}</p>

          <div className="flex flex-col gap-1 max-h-52 overflow-y-auto mb-4">
            {playlists.length === 0 && (
              <p className="text-sm text-mist-400 py-4 text-center">No playlists yet — create one below.</p>
            )}
            {playlists.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  addToPlaylist(p.id, track)
                  onClose()
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] text-left transition-colors"
              >
                <ListMusic size={16} className="text-orchid-400 shrink-0" />
                <span className="text-sm text-white truncate">{p.name}</span>
                <span className="text-xs text-mist-400 ml-auto">{p.tracks.length}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateAndAdd()}
              placeholder="New playlist name"
              className="flex-1 bg-white/[0.05] border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-mist-400 outline-none focus:border-orchid-500/60"
            />
            <button onClick={handleCreateAndAdd} className="icon-btn bg-white/5" aria-label="Create playlist">
              <Plus size={16} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
