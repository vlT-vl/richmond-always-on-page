import { loadData } from './data.js'

export async function fetchTeam() {
  const { team } = await loadData()
  const { labels = {}, defaults = {}, members = [] } = team
  return {
    labels,
    members: members.map(m => ({ ...defaults, ...m })),
  }
}
