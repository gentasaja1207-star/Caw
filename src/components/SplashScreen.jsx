import { motion } from 'framer-motion'
import GentaMark from './GentaMark'
import { BRAND } from '../config/constants'

export default function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void-950 overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
    >
      <div className="absolute inset-0 bg-genta-radial" />
      <motion.div
        className="absolute w-[520px] h-[520px] rounded-full bg-orchid-600/20 blur-[120px]"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <GentaMark size={96} animated />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-6 text-2xl font-display font-bold tracking-tight text-white"
      >
        {BRAND.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="relative mt-2 text-sm text-mist-400"
      >
        {BRAND.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-10 h-[2px] w-40 origin-center bg-genta-glow rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full w-1/3 bg-white/70"
          animate={{ x: ['-120%', '220%'] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  )
}
