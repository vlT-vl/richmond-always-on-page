import { useLayoutEffect, useRef } from 'react'

const EPS = 0.004
const SETTLE_MS = 150

export default function FitStage({ children }) {
  const outerRef = useRef(null)
  const innerRef = useRef(null)
  const stageRef = useRef(null)

  useLayoutEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    const stage = stageRef.current
    let busy = false
    let frame = 0
    let settleTimer = 0
    let current = 1
    let grow = true

    const small = window.matchMedia('(max-width: 900px)')

    const fit = () => {
      if (small.matches) {
        inner.style.width = ''
        inner.style.height = ''
        inner.style.transform = 'none'
        if (current !== 1) {
          current = 1
          window.dispatchEvent(new Event('fitchange'))
        }
        return
      }
      if (busy) return
      const W = outer.clientWidth
      const H = outer.clientHeight
      if (!W || !H) return
      busy = true
      let s = 1
      for (let i = 0; i < 6; i += 1) {
        inner.style.width = `${W / s}px`
        inner.style.height = `${H / s}px`
        stage.classList.add('is-measuring')
        const h = stage.offsetHeight
        stage.classList.remove('is-measuring')
        const next = Math.min(1, H / h)
        if (Math.abs(next - s) < EPS) {
          s = next
          break
        }
        s = next
      }
      if (!grow) s = Math.min(s, current)
      grow = true
      inner.style.width = `${W / s}px`
      inner.style.height = `${H / s}px`
      inner.style.transform = s < 1 ? `scale(${s})` : 'none'
      busy = false
      if (Math.abs(s - current) > EPS / 4) {
        current = s
        window.dispatchEvent(new Event('fitchange'))
      }
    }

    const schedule = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(fit)
    }

    const refit = () => {
      grow = true
      schedule()
    }

    const settle = () => {
      clearTimeout(settleTimer)
      settleTimer = setTimeout(() => {
        grow = false
        schedule()
      }, SETTLE_MS)
    }

    fit()
    const ro = new ResizeObserver(refit)
    ro.observe(outer)
    ro.observe(stage)

    const watched = new Set()
    const content = new ResizeObserver(settle)
    const watch = () => {
      for (const el of stage.children) {
        if (watched.has(el)) continue
        watched.add(el)
        content.observe(el)
      }
    }
    watch()
    const mo = new MutationObserver(() => {
      watch()
      settle()
    })
    mo.observe(stage, { childList: true })
    window.addEventListener('resize', refit)
    small.addEventListener('change', refit)
    document.fonts?.ready.then(refit)

    return () => {
      ro.disconnect()
      content.disconnect()
      mo.disconnect()
      clearTimeout(settleTimer)
      window.removeEventListener('resize', refit)
      small.removeEventListener('change', refit)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <main className="fit" ref={outerRef}>
      <div className="fit-inner" ref={innerRef}>
        <div className="stage" ref={stageRef}>
          {children}
        </div>
      </div>
    </main>
  )
}
