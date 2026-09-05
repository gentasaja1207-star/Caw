import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Heart, ListMusic, Clock, Trash2, Plus, X } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import SongCard from '../components/SongCard'
import { EmptyState } from '../components/States'

const TABS = [
  { id: 'favorites', label: 'Favorites', Icon: Heart },
  { id: 'playlists', label: 'Playlists', Icon: ListMusic },
  { id: 'history', label: 'History', Icon: Clock },
]

export default function Library() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'favorites'
  const { favorites, playlists, history, clearHistory, createPlaylist, deletePlaylist, removeFromPlaylist, playTrack } =
    usePlayer()
  const [activePlaylist, setActivePlaylist] = useState(null)
  const [newName, setNewName] = useState('')

  const openPlaylist = playlists.find((p) => p.id === activePlaylist)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-display font-bold text-white">Library</h1>

      <div className="flex gap-2">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => {
              setParams({ tab: id })
              setActivePlaylist(null)
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === id ? 'bg-genta-glow text-void-950' : 'glass-pill text-mist-300 hover:text-white'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'favorites' &&
        (favorites.length === 0 ? (
          <EmptyState icon={Heart} title="No favorites yet" subtitle="Tap the heart on any song to save it here." />
        ) : (
          <div className="flex flex-col gap-1">
            {favorites.map((t) => (
              <SongCard key={t.id} track={t} queue={favorites} layout="row" />
            ))}
          </div>
        ))}

      {tab === 'history' &&
        (history.length === 0 ? (
          <EmptyState icon={Clock} title="Nothing played yet" subtitle="Your recently played songs will appear here." />
        ) : (
          <div>
            <div className="flex justify-end mb-2">
              <button onClick={clearHistory} className="text-xs text-mist-400 hover:text-white flex items-center gap-1">
                <Trash2 size={13} /> Clear history
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {history.map((t) => (
                <SongCard key={t.id} track={t} queue={history} layout="row" />
              ))}
            </div>
          </div>
        ))}

      {tab === 'playlists' && !openPlaylist && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newName.trim()) {
                  createPlaylist(newName.trim())
                  setNewName('')
                }
              }}
              placeholder="New playlist name"
              className="flex-1 bg-white/[0.05] border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-mist-400 outline-none focus:border-orchid-500/60"
            />
            <button
              onClick={() => {
                if (newName.trim()) {
                  createPlaylist(newName.trim())
                  setNewName('')
                }
              }}
              className="icon-btn bg-white/5"
              aria-label="Create playlist"
            >
              <Plus size={16} />
            </button>
          </div>

          {playlists.length === 0 ? (
            <EmptyState icon={ListMusic} title="No playlists yet" subtitle="Create one above to start grouping songs." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePlaylist(p.id)}
                  className="glass-panel rounded-xl2 p-4 text-left hover:bg-white/[0.07] transition-colors group"
                >
                  <div className="w-full aspect-square rounded-xl bg-genta-glow/20 flex items-center justify-center mb-3 overflow-hidden">
                    {p.tracks[0] ? (
                      <img src={p.tracks[0].thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ListMusic size={28} className="text-orchid-400" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-mist-400">{p.tracks.length} songs</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'playlists' && openPlaylist && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setActivePlaylist(null)} className="icon-btn" aria-label="Back">
                <X size={16} />
              </button>
              <h2 className="text-lg font-display font-bold text-white">{openPlaylist.name}</h2>
            </div>
            <button
              onClick={() => {
                deletePlaylist(openPlaylist.id)
                setActivePlaylist(null)
              }}
              className="text-xs text-mist-400 hover:text-white flex items-center gap-1"
            >
              <Trash2 size={13} /> Delete playlist
            </button>
          </div>

          {openPlaylist.tracks.length === 0 ? (
            <EmptyState icon={ListMusic} title="Empty playlist" subtitle="Add songs from Search or Home." />
          ) : (
            <div className="flex flex-col gap-1">
              {openPlaylist.tracks.map((t) => (
                <div key={t.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <SongCard track={t} queue={openPlaylist.tracks} layout="row" />
                  </div>
                  <button
                    onClick={() => removeFromPlaylist(openPlaylist.id, t.id)}
                    className="icon-btn"
                    aria-label="Remove from playlist"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
