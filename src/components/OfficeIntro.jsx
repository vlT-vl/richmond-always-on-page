import useReveal from '../lib/useReveal.js'
import { EVENT_DONE_MS } from '../lib/timing.js'

const WORD_AT = 0.25
const WORD_STEP = 0.14

export default function OfficeIntro({ words, className = '', accent = true }) {
  const [ref, started] = useReveal(EVENT_DONE_MS, 0.5)

  return (
    <section
      ref={ref}
      className={`office${className ? ` ${className}` : ''}${started ? ' is-in' : ''}`}
      aria-label={words.join(' ')}
    >
      <span className="office-rule office-rule--l" />
      <h3 className="office-title" aria-hidden="true">
        {words.map((w, i) => (
          <span className="office-mask" key={w}>
            <span
              className={`office-word${accent && i === words.length - 1 ? ' office-word--accent' : ''}`}
              style={{ '--d': `${WORD_AT + i * WORD_STEP}s` }}
            >
              {w}
            </span>
          </span>
        ))}
      </h3>
      <span className="office-rule office-rule--r" />
    </section>
  )
}
