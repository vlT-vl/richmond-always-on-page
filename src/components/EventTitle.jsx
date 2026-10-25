import useReveal from '../lib/useReveal.js'
import { SHIFT_DONE_MS } from '../lib/timing.js'
import RichmondLogo from './RichmondLogo.jsx'

const WORDS = ['IT', 'Director', 'Forum']

const WORD_AT = 1.5
const WORD_STEP = 0.15
const RULE_AT = 2.4

export default function EventTitle() {
  const [ref, started] = useReveal(SHIFT_DONE_MS)

  return (
    <section
      ref={ref}
      className={`event${started ? ' is-in' : ''}`}
      aria-label="Richmond IT Director Forum"
    >
      <div className="event-row">
        <RichmondLogo className="event-logo" />
        <span className="event-divider" aria-hidden="true" />
        <h2 className="event-title" aria-hidden="true">
          {WORDS.map((w, i) => (
            <span className="event-mask" key={w}>
              <span
                className={`event-word${i === 0 ? ' event-cyan' : ''}`}
                style={{ '--d': `${WORD_AT + i * WORD_STEP}s` }}
              >
                {w}
              </span>
            </span>
          ))}
        </h2>
      </div>
      <div className="event-rule" style={{ '--d': `${RULE_AT}s` }} />
    </section>
  )
}
