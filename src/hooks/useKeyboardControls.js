import { useEffect } from 'react'
import { usePlayer } from '../context/PlayerContext'

/** Space = play/pause, Arrow keys = seek/track, M = mute. Ignored while typing in inputs. */
export function useKeyboardControls() {
  const { togglePlay, playNext, playPrevious, seekTo, progress, volume, changeVolume, currentTrack } =
    usePlayer()

  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return
      if (!currentTrack) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowRight':
          seekTo(Math.min(progress + 5, 1e9))
          break
        case 'ArrowLeft':
          seekTo(Math.max(progress - 5, 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          changeVolume(Math.min(volume + 0.1, 1))
          break
        case 'ArrowDown':
          e.preventDefault()
          changeVolume(Math.max(volume - 0.1, 0))
          break
        case 'KeyN':
          playNext()
          break
        case 'KeyP':
          playPrevious()
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [togglePlay, playNext, playPrevious, seekTo, progress, volume, changeVolume, currentTrack])
}
