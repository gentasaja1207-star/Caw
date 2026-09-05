import { NavLink } from 'react-router-dom'
import { Home, Search, Library, User } from 'lucide-react'

const ITEMS = [
  { id: 'home', label: 'Home', path: '/', Icon: Home },
  { id: 'search', label: 'Search', path: '/search', Icon: Search },
  { id: 'library', label: 'Library', path: '/library', Icon: Library },
  { id: 'profile', label: 'Profile', path: '/profile', Icon: User },
]

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel !rounded-none border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16">
        {ITEMS.map(({ id, label, path, Icon }) => (
          <NavLink
            key={id}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-1.5 text-[11px] transition-colors ${
                isActive ? 'text-white' : 'text-mist-400'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
