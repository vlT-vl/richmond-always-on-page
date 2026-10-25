import { useEffect, useState } from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'
import { getThemePreference, resolveTheme, toggleTheme, watchSystemTheme } from '../lib/theme.js'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => resolveTheme(getThemePreference()))

  useEffect(() => {
    return watchSystemTheme(systemTheme => {
      if (getThemePreference() === 'system') setTheme(systemTheme)
    })
  }, [])

  const handleToggle = () => {
    const { theme: resolved } = toggleTheme(getThemePreference())
    setTheme(resolved)
  }

  const dark = theme === 'dark'

  return (
    <button
      className="round-btn"
      onClick={handleToggle}
      aria-label={dark ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
      title={dark ? 'Tema chiaro' : 'Tema scuro'}
    >
      {dark ? <FiSun /> : <FiMoon />}
    </button>
  )
}
