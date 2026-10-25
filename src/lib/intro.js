import { OFFICE_DONE_MS } from './timing.js'

const KEY = 's2e-alwayson-intro-done'

export const INTRO_REPLAY_AFTER_MS = Infinity
export const INTRO_TOTAL_MS = OFFICE_DONE_MS + 3500

function readDoneAt() {
  try {
    const v = Number(localStorage.getItem(KEY))
    return Number.isFinite(v) && v > 0 ? v : null
  } catch {
    return null
  }
}

export function markIntroDone(now = Date.now()) {
  try {
    localStorage.setItem(KEY, String(now))
  } catch {
    return
  }
}

export function resetIntro() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    return
  }
}

export function shouldPlayIntro(now = Date.now()) {
  const at = readDoneAt()
  return at === null || now - at >= INTRO_REPLAY_AFTER_MS
}

const forced = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('intro') === '1'

export let SKIP_INTRO = !forced && !shouldPlayIntro()

export function replayIntro() {
  SKIP_INTRO = false
  if (typeof document !== 'undefined') document.documentElement.classList.remove('intro-skip')
}
