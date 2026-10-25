import { useRomeNow } from '../lib/clock.js'
import { pickSlots, useAgenda } from '../lib/agenda.js'

const LINE_STEP = 0.09
const LINES_AT = 0.7

const dayLabel = date =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', timeZone: 'UTC' })

function Line({ i, delay = 0, className = '', children }) {
  return (
    <span className={`att-line ${className}`}>
      <span style={{ '--d': `${delay + LINES_AT + i * LINE_STEP}s` }}>{children}</span>
    </span>
  )
}

function Slot({ label, slot, today, empty, delay }) {
  const lines = slot
    ? [
        { cls: 'att-time', node: `${slot.date !== today ? `${dayLabel(slot.date)} \u00b7 ` : ''}${slot.start} \u2013 ${slot.end}` },
        { cls: 'att-name', node: slot.attendee ?? slot.title },
        ...(slot.attendee
          ? [
              { cls: 'att-role', node: slot.role },
              { cls: 'att-role', node: slot.company },
            ]
          : []),
      ]
    : [{ cls: 'att-role', node: empty }]

  return (
    <div className="att-block" key={slot?.id ?? 'none'}>
      <Line i={0} delay={delay} className="att-label">{label}</Line>
      {lines.map((l, i) => (
        <Line i={i + 1} delay={delay} className={l.cls} key={i}>{l.node}</Line>
      ))}
    </div>
  )
}

export default function AttendeePanel() {
  const now = useRomeNow()
  const { slots } = useAgenda()
  const { current, next } = pickSlots(slots, now)

  return (
    <aside className="att" aria-label="Attendee">
      <span className="att-rule" aria-hidden="true" />
      <Slot label="In corso" slot={current} today={now.date} empty="Nessun evento in corso" delay={0} />
      <Slot label="A seguire" slot={next} today={now.date} empty="Nessun altro evento in programma" delay={0.5} />
    </aside>
  )
}
