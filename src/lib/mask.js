const KEY = 's2e·dco·2026·alwayson'

function xor(bytes) {
  const key = new TextEncoder().encode(KEY)
  return bytes.map((b, i) => b ^ key[i % key.length])
}

export function maskText(text) {
  const bytes = xor(new TextEncoder().encode(text))
  let bin = ''
  bytes.forEach(b => { bin += String.fromCharCode(b) })
  return btoa(bin)
}

export function unmaskText(masked) {
  const bin = atob(masked.trim())
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0))
  return new TextDecoder().decode(xor(bytes))
}
