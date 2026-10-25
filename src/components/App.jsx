import { useCallback, useEffect, useRef, useState } from 'react'
import { FiCalendar, FiInfo } from 'react-icons/fi'
import FlipClock from './FlipClock.jsx'
import Weather from './Weather.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import AboutModal from './AboutModal.jsx'
import AgendaModal from './AgendaModal.jsx'
import LogoIntro from './LogoIntro.jsx'
import NetworkBackdrop from './NetworkBackdrop.jsx'
import useAfter from '../lib/useAfter.js'
import { EXIT_MS, TOPBAR_IN_MS } from '../lib/timing.js'
import { INTRO_TOTAL_MS, SKIP_INTRO, markIntroDone, replayIntro } from '../lib/intro.js'
import ShiftIntro from './ShiftIntro.jsx'
import EventTitle from './EventTitle.jsx'
import TeamSection from './TeamSection.jsx'
import WelcomeSection from './WelcomeSection.jsx'
import FitStage from './FitStage.jsx'
import DebugReplay from './DebugReplay.jsx'
import FullscreenToggle from './FullscreenToggle.jsx'
import AgendaPill from './AgendaPill.jsx'
import { LOOP_MS } from '../lib/loop.js'
import { toggleTheme } from '../lib/theme.js'
import { resetData } from '../lib/data.js'

function Page({ exiting, onAbout, onAgenda, onReplay }) {
  const topbarIn = useAfter(TOPBAR_IN_MS)

  const layerRef = useRef(null)

  useEffect(() => {
    const small = window.matchMedia('(max-width: 900px)')
    const place = () => {
      const layer = layerRef.current
      const slot = document.querySelector('.slot')
      if (!layer || !slot) return
      if (!small.matches) {
        layer.style.removeProperty('--shift-top')
        return
      }
      layer.style.setProperty('--shift-top', `${slot.getBoundingClientRect().top + window.scrollY}px`)
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(document.body)
    const topbar = document.querySelector('.topbar')
    if (topbar) ro.observe(topbar)
    window.addEventListener('resize', place)
    const id = setTimeout(place, 3000)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', place)
      clearTimeout(id)
    }
  }, [])

  useEffect(() => {
    if (SKIP_INTRO) return undefined
    const id = setTimeout(markIntroDone, INTRO_TOTAL_MS)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className={`page${exiting ? ' is-exiting' : ''}`}>
      <NetworkBackdrop />

      <header className={`topbar${topbarIn ? ' is-in' : ''}`}>
        <div className="topbar-left">
          <FlipClock />
          <AgendaPill />
        </div>
        <div className="topbar-right">
          <Weather />
          <div className="topbar-btns">
            <ThemeToggle />
            <button
              className="round-btn"
              onClick={onAbout}
              aria-label="Info"
              title="Info"
            >
              <FiInfo />
            </button>
            <button
              className="round-btn"
              onClick={onAgenda}
              aria-label="Agenda"
              title="Agenda"
            >
              <FiCalendar />
            </button>
            <FullscreenToggle />
            <DebugReplay onReplay={onReplay} />
          </div>
        </div>
      </header>

      <FitStage>
        <LogoIntro />
        <div className="slot">
          <EventTitle />
        </div>
        <WelcomeSection />
        <TeamSection />
      </FitStage>

      <div className="shift-layer" ref={layerRef}>
        <ShiftIntro />
      </div>
    </div>
  )
}

export default function App() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const [agendaOpen, setAgendaOpen] = useState(false)
  const [cycle, setCycle] = useState(0)
  const [exiting, setExiting] = useState(false)

  const timer = useRef(0)

  const restart = useCallback(() => {
    if (timer.current) return
    setExiting(true)
    timer.current = setTimeout(() => {
      timer.current = 0
      replayIntro()
      toggleTheme()
      resetData()
      setExiting(false)
      setCycle(c => c + 1)
    }, EXIT_MS)
  }, [])

  useEffect(() => {
    if (!LOOP_MS) return undefined
    const id = setTimeout(restart, Math.max(0, LOOP_MS - EXIT_MS))
    return () => clearTimeout(id)
  }, [cycle, restart])

  useEffect(() => () => {
    clearTimeout(timer.current)
    timer.current = 0
  }, [])

  return (
    <>
      <Page key={cycle} exiting={exiting} onAbout={() => setAboutOpen(true)} onAgenda={() => setAgendaOpen(true)} onReplay={restart} />
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
      {agendaOpen && <AgendaModal onClose={() => setAgendaOpen(false)} />}
    </>
  )
}
