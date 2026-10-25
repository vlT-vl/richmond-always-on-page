import { useEffect, useState } from 'react'
import { SKIP_INTRO } from './intro.js'

export default function useAfter(ms) {
  const [done, setDone] = useState(SKIP_INTRO)

  useEffect(() => {
    const id = setTimeout(() => setDone(true), ms)
    return () => clearTimeout(id)
  }, [ms])

  return done
}
