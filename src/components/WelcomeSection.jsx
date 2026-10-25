import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FiBriefcase, FiClock, FiUser } from 'react-icons/fi'
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2'
import useReveal from '../lib/useReveal.js'
import { EVENT_DONE_MS } from '../lib/timing.js'
import { useRomeNow } from '../lib/clock.js'
import { pickSlots, useAgenda } from '../lib/agenda.js'
import { KIND_ICON } from '../lib/kinds.js'
import { WELCOME_SWAP_MS } from '../lib/cycle.js'
import OfficeIntro from './OfficeIntro.jsx'

const WELCOME_WORDS = ['Diamo', 'il', 'benvenuto', 'a:']
const NOW_WORDS = ['Adesso', 'in', 'programma:']
const NEXT_WORDS = ['A', 'seguire:']

const LONG_TITLE = 40
const LONG_COMPANY = 26
const LINES_AT = 1.0
const SWAP_LINES_AT = 0.4
const LINE_STEP = 0.14
const LEAVE_MS = 600

const dayLabel = date =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', timeZone: 'UTC' })

function Line({ i, base, className = '', children }) {
  return (
    <span className={`wl-line ${className}`}>
      <span style={{ '--d': `${base + i * LINE_STEP}s` }}>{children}</span>
    </span>
  )
}

function SwapBox({ layerKey, children }) {
  const layer = useRef(null)
  const [size, setSize] = useState(null)
  const [armed, setArmed] = useState(false)

  useLayoutEffect(() => {
    const el = layer.current
    if (!el) return undefined
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [layerKey])

  const measured = size !== null
  useEffect(() => {
    if (!measured) return undefined
    const id = requestAnimationFrame(() => setArmed(true))
    return () => cancelAnimationFrame(id)
  }, [measured])

  return (
    <div
      className={`wl-swap${armed ? ' is-armed' : ''}`}
      style={size ? { width: size.w, height: size.h } : undefined}
    >
      <div className="wl-layer" key={layerKey} ref={layer}>{children}</div>
    </div>
  )
}

function WelcomeBody({ slot, now, started }) {
  const isMeeting = slot.kind === 'meeting'
  const Icon = KIND_ICON[slot.kind] || FiUser
  const name = isMeeting ? slot.attendee : slot.title
  const time = `${slot.date !== now.date ? `${dayLabel(slot.date)} \u00b7 ` : ''}${slot.start} \u2013 ${slot.end}`

  const [mode, setMode] = useState('a')
  const [leaving, setLeaving] = useState(false)
  const [swapped, setSwapped] = useState(false)

  useEffect(() => {
    if (!WELCOME_SWAP_MS || !started || !isMeeting) return undefined
    let dead = false
    const timers = new Set()
    const after = (ms, fn) => {
      const id = setTimeout(() => {
        timers.delete(id)
        if (!dead) fn()
      }, ms)
      timers.add(id)
    }
    const cycle = current => {
      after(WELCOME_SWAP_MS, () => {
        setLeaving(true)
        after(LEAVE_MS, () => {
          const next = current === 'a' ? 'b' : 'a'
          setSwapped(true)
          setMode(next)
          setLeaving(false)
          cycle(next)
        })
      })
    }
    cycle('a')
    return () => {
      dead = true
      timers.forEach(clearTimeout)
    }
  }, [started, isMeeting])

  const base = swapped ? SWAP_LINES_AT : LINES_AT
  const alt = isMeeting && mode === 'b'
  const BadgeIcon = alt ? HiOutlineBuildingOffice2 : Icon

  return (
    <div className={`wl-body${leaving ? ' is-leaving' : ''}`}>
      <div className="wl-id">
        <span className="wl-badge" aria-hidden="true">
          <BadgeIcon key={alt ? 'b' : 'a'} className="wl-badge-ico" />
        </span>
        <SwapBox layerKey={mode}>
          {alt ? (
            <>
              <Line i={0} base={base} className={`wl-company${slot.company.length > LONG_COMPANY ? ' wl-company--long' : ''}`}>
                {slot.company}
              </Line>
              <Line i={1} base={base} className="wl-sub">
                <span className="wl-sub-row">
                  <span className="wl-sub-item"><FiUser className="wl-ico" /> {slot.attendee}</span>
                  <span className="wl-sep">|</span>
                  <span className="wl-sub-item"><FiBriefcase className="wl-ico" /> {slot.role}</span>
                </span>
              </Line>
            </>
          ) : (
            <Line i={0} base={base} className={`wl-name${name.length > LONG_TITLE ? ' wl-name--long' : ''}`}>{name}</Line>
          )}
        </SwapBox>
      </div>
      <div className="wl-rule" style={{ '--d': `${LINES_AT + LINE_STEP}s` }} />
      <SwapBox layerKey={mode}>
        {alt ? (
          <Line i={0} base={base} className="wl-item wl-time wl-time--big">
            <FiClock className="wl-ico" /> {time}
          </Line>
        ) : (
          <>
            {isMeeting && (
              <>
                <Line i={1} base={base} className="wl-item">
                  <FiBriefcase className="wl-ico" /> {slot.role}
                </Line>
                <Line i={2} base={base} className="wl-item">
                  <HiOutlineBuildingOffice2 className="wl-ico" /> {slot.company}
                </Line>
              </>
            )}
            <Line i={isMeeting ? 3 : 1} base={base} className="wl-item wl-time">
              <FiClock className="wl-ico" /> {time}
            </Line>
          </>
        )}
      </SwapBox>
    </div>
  )
}

export default function WelcomeSection() {
  const [ref, started] = useReveal(EVENT_DONE_MS, 0.2)
  const now = useRomeNow()
  const { slots } = useAgenda()
  const { current, next } = pickSlots(slots, now)
  const slot = current ?? next
  const words = !slot || slot.kind === 'meeting' ? WELCOME_WORDS : current ? NOW_WORDS : NEXT_WORDS

  return (
    <section
      ref={ref}
      className={`welcome${started ? ' is-in' : ''}`}
      aria-label={words.join(' ')}
    >
      <OfficeIntro words={words} accent={false} />
      {slot && <WelcomeBody key={slot.id} slot={slot} now={now} started={started} />}
    </section>
  )
}
