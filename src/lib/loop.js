const seconds = Number(import.meta.env.VITE_LOOP_SECONDS)

export const LOOP_MS = Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 0
