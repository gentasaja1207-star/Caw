import { motion } from 'framer-motion'
import { Github, Globe, Sparkles, Code2, Palette, Cpu, Rocket } from 'lucide-react'
import GentaMark from '../components/GentaMark'

const SKILLS = [
  { label: 'Full Stack Development', Icon: Code2 },
  { label: 'Web Development', Icon: Globe },
  { label: 'UI/UX Design', Icon: Palette },
  { label: 'Modern Application Development', Icon: Cpu },
  { label: 'Creative Technology', Icon: Sparkles },
]

const ROADMAP = [
  'Offline playback with cached queues',
  'Collaborative playlists',
  'Cross-device sync via account login',
  'Native lyrics provider integration',
]

export default function AboutDeveloper() {
  return (
    <div className="flex flex-col gap-10 max-w-3xl">
      {/* Header */}
      <section className="glass-panel rounded-xl3 p-8 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-genta-radial pointer-events-none" />
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className="relative">
          <div className="w-20 h-20 rounded-xl3 bg-genta-glow flex items-center justify-center shadow-glow mb-4 mx-auto">
            <GentaMark size={40} />
          </div>
        </motion.div>
        <h1 className="relative text-2xl font-display font-bold text-white">Genta</h1>
        <p className="relative text-sm text-orchid-400 font-medium mt-1">Full Stack Developer & Digital Creator</p>

        <div className="relative flex gap-3 mt-5">
          <a href="#" className="btn-ghost flex items-center gap-2 text-sm" aria-label="GitHub profile">
            <Github size={15} /> GitHub
          </a>
          <a href="#" className="btn-ghost flex items-center gap-2 text-sm" aria-label="Portfolio site">
            <Globe size={15} /> Portfolio
          </a>
        </div>
      </section>

      {/* About */}
      <section className="glass-panel rounded-xl2 p-7">
        <h2 className="text-lg font-display font-bold text-white mb-3">About</h2>
        <p className="text-sm text-mist-300 leading-relaxed">
          Hello, I'm Genta, the creator behind Genta Music Player. This application was built to bring
          together modern web technology, premium interface design, and a smooth music experience in one
          platform. The goal of this project is to explore advanced development, craft beautiful digital
          products, and give people a modern way to enjoy music.
        </p>
      </section>

      {/* Mission */}
      <section className="glass-panel rounded-xl2 p-7 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-orchid-600/20 blur-[80px] rounded-full" />
        <h2 className="relative text-lg font-display font-bold text-white mb-3 flex items-center gap-2">
          <Rocket size={17} className="text-gold-400" /> Mission
        </h2>
        <p className="relative text-sm text-mist-300 leading-relaxed">
          Creating modern digital experiences through technology, creativity, and innovation.
        </p>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-lg font-display font-bold text-white mb-4">Skills</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SKILLS.map(({ label, Icon }) => (
            <div key={label} className="glass-panel rounded-xl2 p-4 flex flex-col items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
                <Icon size={16} className="text-orchid-400" />
              </div>
              <p className="text-sm text-white font-medium leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech used */}
      <section>
        <h2 className="text-lg font-display font-bold text-white mb-4">Technology used</h2>
        <div className="flex flex-wrap gap-2">
          {['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Lucide Icons', 'Node.js / Express', 'YouTube Data API v3'].map(
            (t) => (
              <span key={t} className="glass-pill px-3.5 py-1.5 text-xs text-mist-300">
                {t}
              </span>
            )
          )}
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <h2 className="text-lg font-display font-bold text-white mb-4">Future updates</h2>
        <div className="glass-panel rounded-xl2 divide-y divide-white/5">
          {ROADMAP.map((item) => (
            <div key={item} className="px-5 py-3.5 text-sm text-mist-300">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
