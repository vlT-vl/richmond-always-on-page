import { unmaskText } from './mask.js'

const BASE = import.meta.env.BASE_URL

let cache = null

export function loadData() {
  if (!cache) {
    cache = fetch(`${BASE}alwaysondata.dat`, { cache: 'no-cache' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then(text => JSON.parse(unmaskText(text)))
      .catch(err => {
        cache = null
        throw err
      })
  }
  return cache
}

export function resetData() {
  cache = null
}
