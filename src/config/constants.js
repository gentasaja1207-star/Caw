export const BRAND = {
  name: 'Genta Music Player',
  shortName: 'Genta Music',
  tagline: 'A luxury music ecosystem.',
}

export const STORAGE_KEYS = {
  favorites: 'genta.favorites',
  playlists: 'genta.playlists',
  history: 'genta.history',
  lastSong: 'genta.lastSong',
  volume: 'genta.volume',
  onboarded: 'genta.onboarded',
}

export const MOODS = [
  { id: 'focus', label: 'Focus', query: 'deep focus instrumental music' },
  { id: 'chill', label: 'Chill', query: 'chill lofi music mix' },
  { id: 'energy', label: 'Energy', query: 'high energy workout music' },
  { id: 'romance', label: 'Romance', query: 'romantic love songs playlist' },
  { id: 'night', label: 'Late Night', query: 'late night vibes music' },
  { id: 'drive', label: 'Drive', query: 'road trip driving music' },
]

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'search', label: 'Search', path: '/search' },
  { id: 'library', label: 'Library', path: '/library' },
  { id: 'profile', label: 'Profile', path: '/profile' },
  { id: 'about', label: 'About Developer', path: '/about' },
]
