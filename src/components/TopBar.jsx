import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import GentaMark from './GentaMark'
import { BRAND } from '../config/constants'

export default function TopBar() {
  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-void-950/80 backdrop-blur-xl2 border-b border-white/5">
      <Link to="/" className="flex items-center gap-2">
        <GentaMark size={26} />
        <span className="text-white font-display font-bold text-sm">{BRAND.shortName}</span>
      </Link>
      <Link to="/search" className="icon-btn">
        <Search size={19} />
      </Link>
    </header>
  )
}
