import { NavLink } from 'react-router-dom'
import { Home, Search, Library, User, Code2, Sparkles } from 'lucide-react'
import GentaMark from './GentaMark'
import { BRAND, MOODS } from '../config/constants'

const ICONS = { home: Home, search: Search, library: Library, profile: User, about: Code2 }

const ITEMS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'search', label: 'Search', path: '/search' },
  { id: 'library', label: 'Library', path: '/library' },
  { id: 'profile', label: 'Profile', path: '/profile' },
  { id: 'about', label: 'About Developer', path: '/about' },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 px-4 py-6 border-r border-white/5">
      <div className="flex items-center gap-3 px-2 mb-8">
        <GentaMark size={34} />
        <div>
          <p className="text-white font-display font-bold text-sm leading-tight">{BRAND.shortName}</p>
          <p className="text-[11px] text-mist-400">{BRAND.tagline}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {ITEMS.map((item) => {
          const Icon = ICONS[item.id]
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/[0.07] text-white shadow-glass'
                    : 'text-mist-400 hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-8 px-2">
        <p className="section-label mb-3 flex items-center gap-1.5">
          <Sparkles size={13} className="text-gold-400" /> Moods
        </p>
        <div className="flex flex-col gap-1">
          {MOODS.slice(0, 4).map((m) => (
            <NavLink
              key={m.id}
              to={`/search?mood=${m.id}`}
              className="text-sm text-mist-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              {m.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="mt-auto px-2 pt-6">
        <p className="text-[11px] text-mist-400/70">
          Built by <span className="text-mist-300">Genta</span> · Powered by YouTube Data API
        </p>
      </div>
    </aside>
  )
}
