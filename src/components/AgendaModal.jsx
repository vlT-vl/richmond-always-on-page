import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { HiXMark } from 'react-icons/hi2'
import { FiCalendar } from 'react-icons/fi'
import { slotState, useAgenda } from '../lib/agenda.js'
import { KIND_ICON, KIND_LABEL } from '../lib/kinds.js'
import { useRomeNow } from '../lib/clock.js'
import '../css/aboutmodal.css'

const FILTERS = [
  { id: 'all', label: 'Tutti', kinds: null },
  { id: 'meeting', label: 'Meeting', kinds: ['meeting'] },
  { id: 'session', label: 'Sessioni', kinds: ['session'] },
  { id: 'meal', label: 'Pasti', kinds: ['lunch', 'aperitif', 'dinner'] },
]

const dayName = date =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('it-IT', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })

export default function AgendaModal({ onClose }) {
  const now = useRomeNow()
  const { slots: AGENDA, days: DAYS } = useAgenda()
  const [pickedDay, setDay] = useState(null)
  const day = pickedDay ?? (DAYS.includes(now.date) ? now.date : DAYS[0])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const ofDay = AGENDA.filter(s => s.date === day)
  const active = FILTERS.find(f => f.id === filter)
  const rows = active.kinds ? ofDay.filter(s => active.kinds.includes(s.kind)) : ofDay

  return createPortal(
    <div className="amo-overlay" onClick={onClose}>
      <div className="amo-card agm-card" onClick={e => e.stopPropagation()}>

        <div className="amo-header">
          <div className="amo-header-left">
            <FiCalendar className="amo-header-icon" />
            <div>
              <span className="amo-eyebrow">Agenda</span>
              <h2 className="amo-title">Richmond IT Director Forum</h2>
              <span className="amo-subtitle">{AGENDA.length} appuntamenti · {DAYS.length} giornate</span>
            </div>
          </div>
          <button className="amo-close" onClick={onClose} aria-label="Chiudi">
            <HiXMark />
          </button>
        </div>

        <div className="agm-controls">
          <div className="agm-tabs" role="tablist">
            {DAYS.map(d => (
              <button
                key={d}
                role="tab"
                aria-selected={d === day}
                className={`agm-tab${d === day ? ' is-active' : ''}`}
                onClick={() => setDay(d)}
              >
                {dayName(d)}
              </button>
            ))}
          </div>
          <div className="agm-chips">
            {FILTERS.map(f => {
              const n = f.kinds ? ofDay.filter(s => f.kinds.includes(s.kind)).length : ofDay.length
              return (
                <button
                  key={f.id}
                  className={`agm-chip${f.id === filter ? ' is-active' : ''}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label} <span className="agm-count">{n}</span>
                </button>
              )
            })}
          </div>
        </div>

        <ol className="agm-list" key={`${day}-${filter}`}>
          {rows.map((s, i) => {
            const Icon = KIND_ICON[s.kind]
            const state = slotState(s, now)
            const person = s.kind === 'meeting'
            return (
              <li
                key={s.id}
                className={`agm-row agm-row--${state}`}
                style={{ '--i': i }}
              >
                <span className="agm-time">{s.start}<span className="agm-dash"> – </span>{s.end}</span>
                <span className="agm-badge" aria-hidden="true"><Icon /></span>
                <span className="agm-main">
                  <span className="agm-name">{person ? s.attendee : s.title}</span>
                  <span className="agm-sub">
                    {person ? `${s.role} · ${s.company}` : s.type === 'Empowerment Session' ? s.type : ''}
                  </span>
                  {s.description && <span className="agm-desc">{s.description}</span>}
                </span>
                <span className="agm-tag">
                  {state === 'current' ? 'In corso' : KIND_LABEL[s.kind]}
                </span>
              </li>
            )
          })}
          {rows.length === 0 && <li className="agm-empty">Nessun appuntamento</li>}
        </ol>

      </div>
    </div>,
    document.body
  )
}
