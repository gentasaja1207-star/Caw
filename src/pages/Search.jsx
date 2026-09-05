import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, X } from 'lucide-react'
import { searchMusic } from '../services/musicApi'
import SongCard from '../components/SongCard'
import PlaylistModal from '../components/PlaylistModal'
import { SkeletonRows, ErrorState, NoResults, EmptyState } from '../components/States'
import { MOODS } from '../config/constants'
import { Sparkles } from 'lucide-react'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const initialQuery = params.get('q') || ''
  const moodId = params.get('mood')

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [addTarget, setAddTarget] = useState(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    const mood = MOODS.find((m) => m.id === moodId)
    if (mood) {
      runSearch(mood.query)
      setQuery('')
    } else if (initialQuery) {
      runSearch(initialQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moodId])

  function handleChange(value) {
    setQuery(value)
    setParams(value ? { q: value } : {}, { replace: true })
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim()) {
      setResults(null)
      return
    }
    debounceRef.current = setTimeout(() => runSearch(value), 450)
  }

  function runSearch(q) {
    setLoading(true)
    setError(null)
    searchMusic(q)
      .then((data) => setResults(data.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  function clear() {
    setQuery('')
    setResults(null)
    setParams({})
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mist-400" />
        <input
          autoFocus
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search songs, artists, albums..."
          className="w-full bg-white/[0.05] border border-white/10 rounded-full pl-11 pr-11 py-3.5 text-sm text-white placeholder:text-mist-400 outline-none focus:border-orchid-500/60 transition-colors"
        />
        {query && (
          <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 icon-btn w-8 h-8" aria-label="Clear search">
            <X size={15} />
          </button>
        )}
      </div>

      {!results && !loading && (
        <div>
          <p className="section-label mb-3 flex items-center gap-1.5">
            <Sparkles size={13} className="text-gold-400" /> Browse by mood
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setParams({ mood: m.id })}
                className="glass-panel rounded-xl2 p-5 text-left hover:bg-white/[0.07] transition-colors"
              >
                <p className="text-white font-medium">{m.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <SkeletonRows count={7} />}

      {error && !loading && <ErrorState message={error} onRetry={() => runSearch(query || MOODS.find((m) => m.id === moodId)?.query)} />}

      {results && !loading && !error && (
        results.length === 0 ? (
          <NoResults query={query} />
        ) : (
          <div className="flex flex-col gap-1">
            {results.map((t) => (
              <SongCard key={t.id} track={t} queue={results} layout="row" onAddToPlaylist={setAddTarget} />
            ))}
          </div>
        )
      )}

      {addTarget && <PlaylistModal track={addTarget} onClose={() => setAddTarget(null)} />}
    </div>
  )
}
