import { FiGlobe, FiMail, FiMapPin, FiPhone, FiSmartphone } from 'react-icons/fi'
import S2EEmblem from './S2EEmblem.jsx'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useReveal from '../lib/useReveal.js'
import useAfter from '../lib/useAfter.js'
import { OFFICE_DONE_MS } from '../lib/timing.js'
import { INTRO_TOTAL_MS } from '../lib/intro.js'
import { TEAM_CAROUSEL, TEAM_CARD_MS, TEAM_END_MS, TEAM_HOLD_MS } from '../lib/cycle.js'
import { fetchTeam } from '../lib/team.js'
import AttendeePanel from './AttendeePanel.jsx'
import OfficeIntro from './OfficeIntro.jsx'

const IN_MS = 1800
const OUT_MS = 900
const GAP_MS = 600
const EXPAND_MS = 1100
const COLLAPSE_MS = 800
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EASE_IO = 'cubic-bezier(0.76, 0, 0.24, 1)'

const EVENT_WORDS = ['A', 'questo', 'evento', 'per', 'S2E']
const AGENDA_WORDS = ['In', 'agenda']

const LINE_STEP = 0.09
const LINES_AT = 0.8

const telHref = n => `tel:${n.replace(/\s+/g, '')}`

function Line({ i, className = '', children }) {
  return (
    <span className={`team-line ${className}`}>
      <span style={{ '--d': `${LINES_AT + i * LINE_STEP}s` }}>{children}</span>
    </span>
  )
}

function TeamCard({ member, labels, index, mode }) {
  const lines = [
    { key: 'name', cls: 'team-name', node: member.name },
    { key: 'role', cls: 'team-role', node: member.role },
    member.unit && { key: 'unit', cls: 'team-role', node: member.unit },
    { key: 'address', node: member.address },
    {
      key: 'mobile',
      node: (
        <>
          <FiSmartphone className="team-ico" /> {labels.mobile}{labels.mobile ? ':' : ''}{' '}
          <a href={telHref(member.mobile)}>{member.mobile}</a>
        </>
      ),
    },
    {
      key: 'office',
      node: (
        <>
          <FiPhone className="team-ico" /> {labels.office}{labels.office ? ':' : ''}{' '}
          <a href={telHref(member.office)}>{member.office}</a>
        </>
      ),
    },
    {
      key: 'web',
      node: (
        <a
          className="team-web"
          href={`https://${member.web}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {member.web}
        </a>
      ),
    },
  ].filter(Boolean)

  return (
    <article
      className={`team-card${mode ? ` is-${mode}` : ''}`}
      data-i={index}
      style={{ '--c': `${index * 0.3}s`, '--rows': member.unit ? 4 : 3 }}
    >
      <div className="team-inner">
        <div className="team-visuals">
          <div className="team-photo-wrap">
            {member.photo && <img className="team-photo" src={member.photo} alt={member.name} />}
          </div>
          <S2EEmblem className="team-emblem" />
        </div>
        <div className="team-info">
          {lines.map((l, i) => (
            <Line i={i} className={l.cls} key={l.key}>{l.node}</Line>
          ))}
        </div>
      </div>
    </article>
  )
}

function ExpandedCard({ member, labels, phase, innerRef }) {
  const label = key => (labels[key] ? `${labels[key]}: ` : '')
  const pair = (key, items) => {
    const nodes = items.filter(Boolean)
    return nodes.length && { key, cls: 'team-x-row', node: <span className="team-x-pair">{nodes}</span> }
  }
  const lines = [
    { key: 'name', cls: 'team-x-name', node: member.name },
    { key: 'role', cls: 'team-x-role', node: member.role },
    member.unit && { key: 'unit', cls: 'team-x-sub', node: member.unit },
    member.address && {
      key: 'address',
      cls: 'team-x-row',
      node: <><FiMapPin className="team-ico" /> {member.address}</>,
    },
    pair('phones', [
      member.mobile && (
        <span key="mobile"><FiSmartphone className="team-ico" /> {label('mobile')}<a href={telHref(member.mobile)}>{member.mobile}</a></span>
      ),
      member.office && (
        <span key="office"><FiPhone className="team-ico" /> {label('office')}<a href={telHref(member.office)}>{member.office}</a></span>
      ),
    ]),
    pair('online', [
      member.email && (
        <span key="email"><FiMail className="team-ico" /> {label('email')}<a href={`mailto:${member.email}`}>{member.email}</a></span>
      ),
      member.web && (
        <span key="web"><FiGlobe className="team-ico" /> <a href={`https://${member.web}`} target="_blank" rel="noopener noreferrer">{member.web}</a></span>
      ),
    ]),
  ].filter(Boolean)

  return (
    <article className="team-x" data-phase={phase || undefined} aria-hidden={phase ? undefined : true} ref={innerRef}>
      <div className="team-x-inner">
        <div className="team-x-visuals">
          <div className="team-x-photo">
            {member.photo && <img src={member.photo} alt={member.name} />}
          </div>
          <div className="team-x-emblem">
            <S2EEmblem />
          </div>
        </div>
        <div className="team-x-info">
          {lines.map((l, i) => (
            <span className={`team-x-line ${l.cls}`} key={l.key}>
              <span style={{ '--d': `${0.45 + i * 0.1}s` }}>{l.node}</span>
            </span>
          ))}
        </div>
        {member.description && (
          <div className="team-x-about">
            <span className="team-x-line team-x-about-label">
              <span style={{ '--d': '1.2s' }}>Ruolo</span>
            </span>
            <span className="team-x-line team-x-desc">
              <span style={{ '--d': '1.3s' }}>{member.description}</span>
            </span>
          </div>
        )}
        {member.qr && (
          <figure className="team-x-qr">
            <img src={member.qr} alt={`QR code contatto ${member.name}`} />
            <figcaption>Inquadra per salvare il contatto</figcaption>
          </figure>
        )}
      </div>
    </article>
  )
}

const SMALL_QUERY = '(max-width: 900px)'

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function TeamSection() {
  const [ref, started] = useReveal(OFFICE_DONE_MS, 0.2)
  const [team, setTeam] = useState({ labels: {}, members: [] })
  const [focus, setFocus] = useState(null)
  const introDone = useAfter(INTRO_TOTAL_MS)
  const [small, setSmall] = useState(() => window.matchMedia(SMALL_QUERY).matches)
  const [gridH, setGridH] = useState(0)
  const [focusH, setFocusH] = useState(0)
  const gridRef = useRef(null)
  const xRefs = useRef([])
  const opens = useRef(0)

  useEffect(() => {
    const ctrl = new AbortController()
    fetchTeam(ctrl.signal)
      .then(async t => {
        await Promise.all(
          t.members
            .filter(m => m.photo)
            .map(m => {
              const img = new Image()
              img.src = m.photo
              return img.decode().catch(() => {})
            }),
        )
        if (!ctrl.signal.aborted) setTeam(t)
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [])

  const count = team.members.length

  useEffect(() => {
    const mq = window.matchMedia(SMALL_QUERY)
    const on = () => setSmall(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    if (!TEAM_CAROUSEL || !introDone || !count) return undefined
    let dead = false
    const timers = new Set()
    const wait = ms =>
      new Promise(resolve => {
        const id = setTimeout(resolve, ms)
        timers.add(id)
      })

    const hold = Math.max(0, TEAM_CARD_MS - IN_MS - OUT_MS - GAP_MS)

    ;(async () => {
      await wait(TEAM_HOLD_MS)
      while (!dead) {
        for (let i = 0; i < count; i += 1) {
          if (dead) return
          opens.current += 1
          setFocus({ i, phase: 'in', n: opens.current })
          await wait(IN_MS)
          if (dead) return
          setFocus({ i, phase: 'open', n: opens.current })
          await wait(hold)
          if (dead) return
          setFocus({ i, phase: 'out', n: opens.current })
          await wait(OUT_MS)
          if (dead) return
          setFocus(null)
          await wait(GAP_MS)
        }
        await wait(TEAM_END_MS)
      }
    })()

    return () => {
      dead = true
      timers.forEach(clearTimeout)
      setFocus(null)
    }
  }, [introDone, count])

  useLayoutEffect(() => {
    const el = gridRef.current
    if (!el || !small) return undefined
    const measure = () => setGridH(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [small, count])

  useLayoutEffect(() => {
    if (!small) {
      setFocusH(0)
      return
    }
    if (focus && focus.phase !== 'out') {
      const el = xRefs.current[focus.i]
      setFocusH(el ? el.offsetHeight : 0)
    } else if (!focus) {
      setFocusH(0)
    }
  }, [focus, small])

  useLayoutEffect(() => {
    if (!focus || (focus.phase !== 'in' && focus.phase !== 'out')) return
    const root = xRefs.current[focus.i]
    const grid = gridRef.current
    if (!root || !grid) return
    const still = reduceMotion()
    ;[
      ['.team-x-photo', '.team-photo-wrap'],
      ['.team-x-emblem', '.team-emblem'],
    ].forEach(([bigSel, smallSel]) => {
      const big = root.querySelector(bigSel)
      const small = grid.querySelector(`[data-i="${focus.i}"] ${smallSel}`)
      if (!big || !small) return
      const b = big.getBoundingClientRect()
      const a = small.getBoundingClientRect()
      if (!b.width || !a.width) return
      const k = b.width / big.offsetWidth || 1
      const dx = (a.left + a.width / 2 - (b.left + b.width / 2)) / k
      const dy = (a.top + a.height / 2 - (b.top + b.height / 2)) / k
      const home = `translate(${dx}px, ${dy}px) scale(${a.width / b.width})`
      if (focus.phase === 'in') {
        big.animate([{ transform: home }, { transform: 'none' }], {
          duration: still ? 0 : EXPAND_MS,
          easing: EASE_OUT,
          fill: 'both',
        })
      } else {
        big.animate([{ transform: 'none' }, { transform: home }], {
          duration: still ? 0 : COLLAPSE_MS,
          easing: EASE_IO,
          fill: 'both',
        })
      }
    })
  }, [focus])

  return (
    <section ref={ref} className={`team${started ? ' is-in' : ''}${focus ? ' is-focus' : ''}`} aria-label="Team">
      <div className="team-row">
        <OfficeIntro words={EVENT_WORDS} className="team-title team-title--l" />
        <div
          className="team-stage"
          style={small && gridH ? { height: Math.max(gridH, focusH) } : undefined}
        >
          <div className="team-grid" ref={gridRef}>
            {team.members.map((m, i) => (
              <TeamCard
                member={m}
                labels={team.labels}
                index={i}
                mode={focus ? (focus.i === i ? 'active' : 'dim') : ''}
                key={m.id}
              />
            ))}
          </div>
          <div className="team-focus">
            {team.members.map((m, i) => {
              const active = focus && focus.i === i
              return (
                <ExpandedCard
                  member={m}
                  labels={team.labels}
                  phase={active ? focus.phase : ''}
                  innerRef={el => { xRefs.current[i] = el }}
                  key={active ? `${m.id}-${focus.n}` : m.id}
                />
              )
            })}
          </div>
        </div>
        <OfficeIntro words={AGENDA_WORDS} className="team-title team-title--r" />
        <AttendeePanel />
      </div>
    </section>
  )
}
