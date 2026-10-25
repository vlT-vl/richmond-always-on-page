import { useEffect, useState } from 'react'
import { loadData } from './data.js'

const toMinutes = hhmm => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const EMPTY = { slots: [], days: [] }

function build(agenda) {
  const slots = agenda.slots
    .map(s => ({ ...s, startMin: toMinutes(s.start), endMin: toMinutes(s.end) }))
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))
  return { slots, days: [...new Set(slots.map(s => s.date))] }
}

export function useAgenda() {
  const [agenda, setAgenda] = useState(EMPTY)

  useEffect(() => {
    let dead = false
    loadData()
      .then(d => { if (!dead) setAgenda(build(d.agenda)) })
      .catch(() => {})
    return () => { dead = true }
  }, [])

  return agenda
}

export function slotState(slot, { date, minutes }) {
  if (slot.date < date) return 'past'
  if (slot.date > date) return 'upcoming'
  if (slot.endMin <= minutes) return 'past'
  return slot.startMin <= minutes ? 'current' : 'upcoming'
}

export function pickSlots(slots, { date, minutes }) {
  const current = slots.find(s => s.date === date && s.startMin <= minutes && minutes < s.endMin) ?? null
  const nowKey = `${date} ${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
  const next = slots.find(s => `${s.date} ${s.start}` > nowKey && s !== current) ?? null
  return { current, next }
}
