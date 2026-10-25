import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import { maskText } from '../src/lib/mask.js'

const teamSrc = process.argv[2] ?? 'data/team.json'
const agendaSrc = process.argv[3] ?? 'data/agenda.json'
const out = process.argv[4] ?? 'public/alwaysondata.dat'

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' }

const team = JSON.parse(readFileSync(teamSrc, 'utf8'))
const agenda = JSON.parse(readFileSync(agendaSrc, 'utf8'))

const embed = (m, field) => {
  if (!m[field]) return m
  const file = resolve(dirname(teamSrc), m[field])
  const mime = MIME[extname(file).toLowerCase()]
  if (!mime) throw new Error(`Unsupported ${field} type: ${m[field]}`)
  const base64 = readFileSync(file).toString('base64')
  return { ...m, [field]: `data:${mime};base64,${base64}` }
}

team.members = team.members.map(m => embed(embed(m, 'photo'), 'qr'))

writeFileSync(out, maskText(JSON.stringify({ team, agenda })))
console.log(`${teamSrc} + ${agendaSrc} -> ${out} (${team.members.length} members, ${agenda.slots.length} slots)`)
