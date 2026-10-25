import { useEffect, useState } from 'react'
import { FiMaximize, FiMinimize } from 'react-icons/fi'

const ALWAYS = import.meta.env.VITE_FULLSCREEN_ALWAYS_VISIBLE === 'true'

export default function FullscreenToggle() {
  const [full, setFull] = useState(() => Boolean(document.fullscreenElement))

  useEffect(() => {
    const onChange = () => setFull(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  if (!document.documentElement.requestFullscreen) return null

  const toggle = () => {
    const task = full ? document.exitFullscreen() : document.documentElement.requestFullscreen()
    task.catch(() => {})
  }

  return (
    <button
      className={`round-btn${ALWAYS ? ' round-btn--always' : ''}`}
      onClick={toggle}
      aria-label={full ? 'Esci da schermo intero' : 'Schermo intero'}
      title={full ? 'Esci da schermo intero' : 'Schermo intero'}
    >
      {full ? <FiMinimize /> : <FiMaximize />}
    </button>
  )
}
