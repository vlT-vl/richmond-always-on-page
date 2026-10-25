import { useEffect, useState } from 'react'
import { LOGO_DONE_MS, SHIFT_EXIT_MS, SHIFT_GONE_MS } from '../lib/timing.js'
import { SKIP_INTRO } from '../lib/intro.js'

const WORDS = ['We', 'are', 'making', 'the']
const LETTERS = [...'SHIFT']
const START = LOGO_DONE_MS / 1000
const WORD_AT = START + 0.15
const WORD_STEP = 0.14
const LETTER_AT = START + 0.75
const LETTER_STEP = 0.1

export default function ShiftIntro() {
  const [out, setOut] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const exitId = setTimeout(() => setOut(true), SHIFT_EXIT_MS)
    const goneId = setTimeout(() => setGone(true), SHIFT_GONE_MS)
    return () => {
      clearTimeout(exitId)
      clearTimeout(goneId)
    }
  }, [])

  if (SKIP_INTRO) return null

  const headline = (extra = '', withBar = false) => (
    <h2 className={`shift-headline${extra}`} aria-hidden="true">
      <span className="shift-light">
        {WORDS.map((w, i) => (
          <span className="shift-mask" key={w}>
            <span
              className="shift-word"
              style={{ '--d': `${WORD_AT + i * WORD_STEP}s`, '--o': `${i * 0.06}s` }}
            >
              {w}
            </span>
          </span>
        ))}
      </span>
      <span className="shift-big">
        {LETTERS.map((ch, i) => (
          <span className="shift-mask" key={i}>
            <span
              className={`shift-letter${ch === 'I' ? ' shift-letter--accent' : ''}`}
              style={{ '--d': `${LETTER_AT + i * LETTER_STEP}s`, '--o': `${0.25 + i * 0.06}s` }}
            >
              {ch}
            </span>
          </span>
        ))}
        {withBar && <span className="shift-bar" />}
      </span>
    </h2>
  )

  return (
    <section
      className={`shift${out ? ' is-out' : ''}${gone ? ' is-gone' : ''}`}
      aria-label="We are making the shift"
      style={{ '--bar-at': `${START + 1.5}s`, '--sheen-at': `${START + 2.5}s` }}
    >
      <div className="shift-stack">
        {headline('', true)}
        {headline(' shift-sheen')}
      </div>
    </section>
  )
}
