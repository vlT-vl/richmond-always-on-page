import { useEffect, useState } from 'react'
import { FiUsers } from 'react-icons/fi'
import { slotState, useAgenda } from '../lib/agenda.js'
import { KIND_ICON } from '../lib/kinds.js'
import { useRomeNow } from '../lib/clock.js'
import { PILL_MS } from '../lib/cycle.js'

const dayLabel = date =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', timeZone: 'UTC' })

function Row({ id, icon: Icon, className = '', delay = 0, children }) {
  return (
    <span className={`agp-line ${className}`}>
      <span key={id} className="agp-row" style={{ animationDelay: `${delay}s` }}>
        <Icon className="agp-ico" />
        <span className="agp-text">{children}</span>
      </span>
    </span>
  )
}

export default function AgendaPill() {
  const now = useRomeNow()
  const { slots: AGENDA, days: DAYS } = useAgenda()
  const TOTAL = AGENDA.filter(s => s.kind === 'meeting').length
  const day =
    DAYS.find(d => d >= now.date && AGENDA.some(s => s.date === d && slotState(s, now) !== 'past')) ??
    DAYS[DAYS.length - 1]
  const daySlots = AGENDA.filter(s => s.date === day)
  const meetings = daySlots.filter(s => s.kind === 'meeting').length
  const upcoming = AGENDA.filter(s => slotState(s, now) !== 'past')
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (!PILL_MS || upcoming.length < 2) return undefined
    const id = setInterval(() => setIdx(i => i + 1), PILL_MS)
    return () => clearInterval(id)
  }, [upcoming.length])

  if (!daySlots.length) return null

  const slot = upcoming.length ? upcoming[idx % upcoming.length] : null
  const Icon = slot && KIND_ICON[slot.kind]
  const current = slot && slotState(slot, now) === 'current'

  return (
    <div className="agp" aria-label="Agenda del giorno">
      <Row id="summary" icon={FiUsers} className="agp-summary" delay={0.2}>
        {TOTAL} partecipanti totali · {meetings} meeting {day === now.date ? 'oggi' : dayLabel(day)}
      </Row>
      {slot && (
        <Row id={slot.id} icon={Icon} className={`agp-slot${current ? ' is-current' : ''}`} delay={idx === 0 ? 1 : 0.1}>
          <b>{slot.date !== now.date ? `${dayLabel(slot.date)} ` : ''}{slot.start} – {slot.end}</b> · {slot.attendee ?? slot.title}
        </Row>
      )}
    </div>
  )
}
