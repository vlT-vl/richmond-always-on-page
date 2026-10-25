const seconds = v => {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n * 1000 : 0
}

export const TEAM_HOLD_MS = seconds(import.meta.env.VITE_TEAM_CAROUSEL_START_DELAY_SECONDS)
export const TEAM_CARD_MS = seconds(import.meta.env.VITE_TEAM_CARD_DURATION_SECONDS)
export const TEAM_END_MS = seconds(import.meta.env.VITE_TEAM_CAROUSEL_PAUSE_SECONDS)
export const TEAM_CAROUSEL = TEAM_CARD_MS > 0

export const PILL_MS = seconds(import.meta.env.VITE_PILL_INTERVAL_SECONDS)

export const WELCOME_SWAP_MS = seconds(import.meta.env.VITE_WELCOME_SWAP_SECONDS)
