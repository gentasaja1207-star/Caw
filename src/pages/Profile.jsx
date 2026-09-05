import { useState } from 'react'
import { User, Volume2, Info, Moon, Trash2, ChevronRight } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { useToast } from '../context/ToastContext'
import { STORAGE_KEYS, BRAND } from '../config/constants'
import GentaMark from '../components/GentaMark'

export default function Profile() {
  const { volume, changeVolume, favorites, playlists, history } = usePlayer()
  const { notify } = useToast()
  const [highQuality, setHighQuality] = useState(true)

  function resetAppData() {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k))
    notify('Local app data cleared — reload to apply', 'info')
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <h1 className="text-2xl font-display font-bold text-white">Profile & Settings</h1>

      {/* Profile card */}
      <section className="glass-panel rounded-xl2 p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-genta-glow flex items-center justify-center shrink-0">
          <User size={24} className="text-void-950" />
        </div>
        <div>
          <p className="text-white font-display font-semibold">Listener</p>
          <p className="text-xs text-mist-400 mt-0.5">
            {favorites.length} favorites · {playlists.length} playlists · {history.length} recently played
          </p>
        </div>
      </section>

      {/* Audio settings */}
      <SettingsGroup title="Audio" icon={Volume2}>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm text-white">Default volume</p>
            <p className="text-xs text-mist-400 mt-0.5">Applied when a new session starts</p>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="w-32 accent-orchid-500"
          />
        </div>
        <Toggle
          label="High quality streaming"
          subtitle="Prefer the highest available audio bitrate"
          value={highQuality}
          onChange={setHighQuality}
        />
      </SettingsGroup>

      {/* Theme settings */}
      <SettingsGroup title="Appearance" icon={Moon}>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm text-white">Theme</p>
            <p className="text-xs text-mist-400 mt-0.5">Premium Dark is the only theme in v1</p>
          </div>
          <span className="glass-pill px-3 py-1.5 text-xs text-mist-300">Premium Dark</span>
        </div>
      </SettingsGroup>

      {/* App info */}
      <SettingsGroup title="Application" icon={Info}>
        <Row label="Version" value="1.0.0" />
        <Row label="Music data" value="YouTube Data API v3" />
        <button
          onClick={resetAppData}
          className="w-full flex items-center justify-between py-3 text-left group"
        >
          <div>
            <p className="text-sm text-red-400 group-hover:text-red-300">Clear local app data</p>
            <p className="text-xs text-mist-400 mt-0.5">Removes favorites, playlists, and history from this device</p>
          </div>
          <Trash2 size={16} className="text-red-400" />
        </button>
      </SettingsGroup>

      <div className="flex items-center gap-3 justify-center py-6 opacity-70">
        <GentaMark size={22} />
        <p className="text-xs text-mist-400">{BRAND.name}</p>
      </div>
    </div>
  )
}

function SettingsGroup({ title, icon: Icon, children }) {
  return (
    <section>
      <p className="section-label mb-3 flex items-center gap-1.5">
        <Icon size={13} /> {title}
      </p>
      <div className="glass-panel rounded-xl2 px-5 divide-y divide-white/5">{children}</div>
    </section>
  )
}

function Toggle({ label, subtitle, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm text-white">{label}</p>
        {subtitle && <p className="text-xs text-mist-400 mt-0.5">{subtitle}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${value ? 'bg-genta-glow' : 'bg-white/10'}`}
        aria-pressed={value}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            value ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3">
      <p className="text-sm text-mist-300">{label}</p>
      <span className="text-sm text-mist-400 flex items-center gap-1">
        {value} <ChevronRight size={14} className="opacity-0" />
      </span>
    </div>
  )
}
