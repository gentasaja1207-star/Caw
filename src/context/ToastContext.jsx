import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback(
    (message, type = 'info', duration = 3200) => {
      const id = ++idRef.current
      setToasts((prev) => [...prev, { id, message, type }])
      window.setTimeout(() => dismiss(id), duration)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] || Info
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="glass-panel rounded-full px-4 py-2.5 flex items-center gap-2 text-sm text-white shadow-glass pointer-events-auto"
              >
                <Icon size={16} className="text-orchid-400 shrink-0" />
                {t.message}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
