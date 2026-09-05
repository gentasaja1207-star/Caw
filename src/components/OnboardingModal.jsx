import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Heart, ListMusic, Mic2, ArrowRight } from 'lucide-react'
import GentaMark from './GentaMark'

const SLIDES = [
  {
    Icon: Search,
    title: 'Find any song',
    body: 'Search millions of tracks, artists, and albums powered by real YouTube data.',
  },
  {
    Icon: Heart,
    title: 'Save your favorites',
    body: 'Tap the heart on any track to build a collection that\u2019s always at hand.',
  },
  {
    Icon: ListMusic,
    title: 'Build your playlists',
    body: 'Group songs into playlists for every mood, moment, or mix.',
  },
  {
    Icon: Mic2,
    title: 'Follow along with lyrics',
    body: 'Open the fullscreen lyrics view while your music plays.',
  },
]

export default function OnboardingModal({ onDone }) {
  const [step, setStep] = useState(0)
  const slide = SLIDES[step]
  const isLast = step === SLIDES.length - 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[150] bg-void-950/95 backdrop-blur-xl2 flex items-center justify-center p-6"
    >
      <div className="glass-panel rounded-xl3 w-full max-w-sm p-8 text-center">
        <div className="flex justify-center mb-6">
          <GentaMark size={40} />
        </div>

        <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="w-14 h-14 rounded-full bg-white/[0.06] flex items-center justify-center mx-auto mb-5">
            <slide.Icon size={24} className="text-orchid-400" />
          </div>
          <h2 className="text-white font-display font-bold text-lg">{slide.title}</h2>
          <p className="text-sm text-mist-400 mt-2 leading-relaxed">{slide.body}</p>
        </motion.div>

        <div className="flex justify-center gap-1.5 mt-8 mb-6">
          {SLIDES.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-orchid-500' : 'w-1.5 bg-white/15'}`} />
          ))}
        </div>

        <button
          onClick={() => (isLast ? onDone() : setStep((s) => s + 1))}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLast ? 'Start listening' : 'Continue'}
          <ArrowRight size={16} />
        </button>
        {!isLast && (
          <button onClick={onDone} className="text-xs text-mist-400 mt-4 hover:text-white transition-colors">
            Skip
          </button>
        )}
      </div>
    </motion.div>
  )
}
