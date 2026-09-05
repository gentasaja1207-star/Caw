import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import MobileNav from '../components/MobileNav'
import MiniPlayer from '../components/MiniPlayer'
import FullPlayer from '../components/FullPlayer'
import { usePlayer } from '../context/PlayerContext'

export default function MainLayout() {
  const { currentTrack } = usePlayer()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopBar />
        <motion.main
          key={typeof window !== 'undefined' ? window.location.pathname : 'page'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`px-4 sm:px-6 lg:px-8 pt-6 max-w-7xl mx-auto ${
            currentTrack ? 'pb-40 lg:pb-28' : 'pb-24 lg:pb-10'
          }`}
        >
          <Outlet />
        </motion.main>
      </div>
      <MobileNav />
      <MiniPlayer />
      <FullPlayer />
    </div>
  )
}
