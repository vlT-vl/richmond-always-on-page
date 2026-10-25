import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import S2ELogo from './S2ELogo.jsx'
import { LOGO_MOVE_AT_MS } from '../lib/timing.js'
import { SKIP_INTRO } from '../lib/intro.js'

const MAX_SCALE = 1.7
const MAX_WIDTH_VW = 0.8
const MAX_HEIGHT_VH = 0.55

export default function LogoIntro() {
  const ref = useRef(null)
  const [settled, setSettled] = useState(SKIP_INTRO)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || settled) return undefined

    const place = () => {
      el.style.setProperty('--dx', '0px')
      el.style.setProperty('--dy', '0px')
      el.style.setProperty('--s', '1')
      const r = el.getBoundingClientRect()
      const k = el.offsetWidth ? r.width / el.offsetWidth : 1
      const aspect = r.width / r.height
      const target = Math.min(
        r.width * MAX_SCALE,
        window.innerWidth * MAX_WIDTH_VW,
        window.innerHeight * MAX_HEIGHT_VH * aspect,
      )
      const s = Math.max(1, target / r.width)
      el.style.setProperty('--s', String(s))
      el.style.setProperty('--dx', `${(window.innerWidth / 2 - (r.left + r.width / 2)) / k}px`)
      el.style.setProperty('--dy', `${(window.innerHeight / 2 - (r.top + r.height / 2)) / k}px`)
    }

    place()
    window.addEventListener('resize', place)
    window.addEventListener('fitchange', place)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('fitchange', place)
    }
  }, [settled])

  useEffect(() => {
    if (SKIP_INTRO) return undefined
    const id = setTimeout(() => setSettled(true), LOGO_MOVE_AT_MS)
    return () => clearTimeout(id)
  }, [])

  return (
    <div ref={ref} className={`logo-intro${settled ? ' is-settled' : ''}`}>
      <S2ELogo className="stage-logo" />
    </div>
  )
}
