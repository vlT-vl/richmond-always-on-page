const LAT = 44.0678
const LON = 12.5695
const TZ = 'Europe/Rome'

export const LOCATION = 'Rimini'
export const REFRESH_MS = 10 * 60 * 1000

const URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code,is_day&timezone=${encodeURIComponent(TZ)}`

export function kindFromCode(code) {
  if (code === 0) return 'clear'
  if (code === 1 || code === 2) return 'partly'
  if (code === 3) return 'cloud'
  if (code === 45 || code === 48) return 'fog'
  if (code >= 51 && code <= 57) return 'drizzle'
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow'
  if (code >= 95) return 'storm'
  return 'cloud'
}

export const LABELS = {
  clear: 'Sereno',
  partly: 'Poco nuvoloso',
  cloud: 'Nuvoloso',
  fog: 'Nebbia',
  drizzle: 'Pioggerella',
  rain: 'Pioggia',
  snow: 'Neve',
  storm: 'Temporale',
}

export async function fetchWeather(signal) {
  const res = await fetch(URL, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const { current } = await res.json()
  return {
    temp: Math.round(current.temperature_2m),
    kind: kindFromCode(current.weather_code),
    day: current.is_day === 1,
  }
}
