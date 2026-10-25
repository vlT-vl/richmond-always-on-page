import { useEffect, useState } from 'react'

const TZ = 'Europe/Rome'
const TIME_URL = 'https://timeapi.io/api/Time/current/zone?timeZone=UTC'
const RESYNC_MS = 10 * 60 * 1000
const TICK_MS = 15 * 1000

let offset = 0

const fmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

async function offsetFromApi(signal) {
  const t0 = Date.now()
  const res = await fetch(TIME_URL, { signal, cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const { dateTime } = await res.json()
  const t1 = Date.now()
  return Date.parse(`${dateTime.slice(0, 23)}Z`) - (t0 + t1) / 2
}

async function offsetFromOrigin(signal) {
  const t0 = Date.now()
  const res = await fetch(window.location.href, { method: 'HEAD', signal, cache: 'no-store' })
  const header = res.headers.get('date')
  if (!header) throw new Error('no Date header')
  const t1 = Date.now()
  return Date.parse(header) + 500 - (t0 + t1) / 2
}

export async function syncClock(signal) {
  for (const source of [offsetFromApi, offsetFromOrigin]) {
    try {
      offset = await source(signal)
      return
    } catch {
      if (signal?.aborted) return
    }
  }
}

export function romeNow() {
  const parts = Object.fromEntries(fmt.formatToParts(new Date(Date.now() + offset)).map(p => [p.type, p.value]))
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  }
}

export function useRomeNow() {
  const [now, setNow] = useState(romeNow)

  useEffect(() => {
    const ctrl = new AbortController()
    const sync = () => syncClock(ctrl.signal).then(() => setNow(romeNow()))
    sync()
    const tick = setInterval(() => setNow(romeNow()), TICK_MS)
    const resync = setInterval(sync, RESYNC_MS)
    return () => {
      ctrl.abort()
      clearInterval(tick)
      clearInterval(resync)
    }
  }, [])

  return now
}
