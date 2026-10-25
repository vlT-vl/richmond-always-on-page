import { useEffect, useState } from 'react'
import {
  WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, WiCloudy,
  WiFog, WiSprinkle, WiRain, WiSnow, WiThunderstorm,
} from 'react-icons/wi'
import { LABELS, LOCATION, REFRESH_MS, fetchWeather } from '../lib/weather.js'

function pickIcon(kind, day) {
  switch (kind) {
    case 'clear':   return day ? WiDaySunny : WiNightClear
    case 'partly':  return day ? WiDayCloudy : WiNightAltCloudy
    case 'fog':     return WiFog
    case 'drizzle': return WiSprinkle
    case 'rain':    return WiRain
    case 'snow':    return WiSnow
    case 'storm':   return WiThunderstorm
    default:        return WiCloudy
  }
}

export default function Weather() {
  const [data, setData] = useState(null)

  useEffect(() => {
    let ctrl
    const load = () => {
      ctrl?.abort()
      ctrl = new AbortController()
      fetchWeather(ctrl.signal)
        .then(setData)
        .catch(() => {})
    }
    load()
    const id = setInterval(load, REFRESH_MS)
    return () => {
      clearInterval(id)
      ctrl?.abort()
    }
  }, [])

  if (!data) {
    return <div className="weather weather--empty" aria-hidden="true" />
  }

  const Icon = pickIcon(data.kind, data.day)
  const precip = data.kind === 'drizzle' || data.kind === 'rain' || data.kind === 'snow' || data.kind === 'storm'

  return (
    <div className="weather" aria-label={`${LOCATION}: ${LABELS[data.kind]}, ${data.temp}°C`}>
      <div className="weather-text">
        <span className="weather-temp">{data.temp}°</span>
        <span className="weather-meta">{LOCATION} · {LABELS[data.kind]}</span>
      </div>
      <div className={`weather-icon weather-icon--${data.kind}${data.day ? '' : ' is-night'}`}>
        <Icon className="weather-glyph" />
        {precip && (
          <span className="weather-drops" aria-hidden="true">
            <i /><i /><i />
          </span>
        )}
      </div>
    </div>
  )
}
