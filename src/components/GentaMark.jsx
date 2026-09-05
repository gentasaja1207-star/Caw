export default function GentaMark({ size = 40, animated = false }) {
  return (
    <div
      className={`relative shrink-0 ${animated ? 'animate-pulse-glow' : ''}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} fill="none">
        <defs>
          <linearGradient id="gentaGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C77DFF" />
            <stop offset="45%" stopColor="#8A2BE2" />
            <stop offset="80%" stopColor="#6C1EC9" />
            <stop offset="100%" stopColor="#EFC565" />
          </linearGradient>
        </defs>
        <path
          d="M62 14H32c-4 0-7 3-7 7v20c0 4 3 7 7 7h14v10H32c-4 0-7 3-7 7v8c0 4 3 7 7 7h30c4 0 7-3 7-7V52c0-4-3-7-7-7H48V35h14c4 0 7-3 7-7v-7c0-4-3-7-7-7Z"
          fill="url(#gentaGrad)"
        />
      </svg>
    </div>
  )
}
