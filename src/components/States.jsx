import { Music2, SearchX, WifiOff } from 'lucide-react'

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="skeleton aspect-square" />
          <div className="skeleton h-3.5 w-3/4 mt-2.5 rounded-md" />
          <div className="skeleton h-3 w-1/2 mt-1.5 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonRows({ count = 6 }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2.5">
          <div className="skeleton w-14 h-14 rounded-xl shrink-0" />
          <div className="flex-1">
            <div className="skeleton h-3.5 w-2/3 rounded-md" />
            <div className="skeleton h-3 w-1/3 mt-2 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ icon: Icon = Music2, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center mb-4">
        <Icon size={26} className="text-mist-400" />
      </div>
      <h3 className="text-white font-display font-semibold text-lg">{title}</h3>
      {subtitle && <p className="text-sm text-mist-400 mt-1.5 max-w-xs">{subtitle}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <EmptyState
      icon={WifiOff}
      title="Something interrupted the signal"
      subtitle={message || 'Unable to reach the music service right now.'}
      action={
        onRetry && (
          <button onClick={onRetry} className="btn-ghost mt-4 text-sm">
            Try again
          </button>
        )
      }
    />
  )
}

export function NoResults({ query }) {
  return (
    <EmptyState
      icon={SearchX}
      title="No results found"
      subtitle={query ? `Nothing matched "${query}". Try a different search.` : 'Try searching for a song, artist, or album.'}
    />
  )
}
