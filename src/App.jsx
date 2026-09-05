import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Search from './pages/Search'
import Library from './pages/Library'
import Lyrics from './pages/Lyrics'
import Profile from './pages/Profile'
import AboutDeveloper from './pages/AboutDeveloper'
import SplashScreen from './components/SplashScreen'
import OnboardingModal from './components/OnboardingModal'
import { STORAGE_KEYS } from './config/constants'
import { loadJSON, saveJSON } from './utils/storage'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
      if (!loadJSON(STORAGE_KEYS.onboarded, false)) setShowOnboarding(true)
    }, 2200)
    return () => clearTimeout(timer)
  }, [])

  function finishOnboarding() {
    saveJSON(STORAGE_KEYS.onboarded, true)
    setShowOnboarding(false)
  }

  return (
    <>
      <AnimatePresence>{showSplash && <SplashScreen />}</AnimatePresence>

      {!showSplash && (
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/lyrics" element={<Lyrics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<AboutDeveloper />} />
          </Route>
        </Routes>
      )}

      {!showSplash && showOnboarding && <OnboardingModal onDone={finishOnboarding} />}
    </>
  )
}
