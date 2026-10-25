const STORAGE_KEY = 'vlt-theme'
const THEMES = new Set(['system', 'light', 'dark'])

const normalizeTheme = value => (value === 'dark' || value === 'light' ? value : null)

export function getSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getThemePreference() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (THEMES.has(saved)) return saved
  } catch {
    return 'system'
  }
  return 'system'
}

export function resolveTheme(preference = getThemePreference()) {
  return normalizeTheme(preference) ?? getSystemTheme()
}

export function applyTheme(preference = getThemePreference()) {
  const normalized = THEMES.has(preference) ? preference : 'system'
  const resolved = normalizeTheme(normalized) ?? getSystemTheme()
  const root = document.documentElement
  root.dataset.theme = resolved
  root.dataset.themePreference = normalized
  root.style.colorScheme = resolved
  return { preference: normalized, theme: resolved }
}

export function setThemePreference(preference) {
  const normalized = THEMES.has(preference) ? preference : 'system'
  try {
    localStorage.setItem(STORAGE_KEY, normalized)
  } catch {
    return applyTheme(normalized)
  }
  return applyTheme(normalized)
}

export function toggleTheme(current = getThemePreference()) {
  const resolved = resolveTheme(current)
  return setThemePreference(resolved === 'dark' ? 'light' : 'dark')
}

export function watchSystemTheme(callback) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const query = window.matchMedia('(prefers-color-scheme: dark)')
  const listener = () => callback(getSystemTheme())
  query.addEventListener('change', listener)
  return () => query.removeEventListener('change', listener)
}
