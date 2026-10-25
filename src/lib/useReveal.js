import { useEffect, useRef, useState } from 'react'
import { SKIP_INTRO } from './intro.js'

export default function useReveal(startMs, threshold = 0.35) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(SKIP_INTRO)
  const [ready, setReady] = useState(SKIP_INTRO)

  useEffect(() => {
    const id = setTimeout(() => setReady(true), startMs)
    return () => clearTimeout(id)
  }, [startMs])

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return undefined
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        io.disconnect()
      }
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, visible && ready]
}
