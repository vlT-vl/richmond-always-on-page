const ALWAYS = [...'Always']
const ON = [...'On']
const START = 1.1
const STEP = 0.06

export default function AlwaysOnWord() {
  const letter = (ch, i, cls) => (
    <span className="aow-mask" key={`${cls}${i}`}>
      <span className={`aow-letter ${cls}`} style={{ '--d': `${START + i * STEP}s` }}>
        {ch}
      </span>
    </span>
  )

  return (
    <div className="aow" aria-label="AlwaysOn page">
      <span className="aow-main" aria-hidden="true">
        {ALWAYS.map((ch, i) => letter(ch, i, 'aow-navy'))}
        {ON.map((ch, i) => letter(ch, ALWAYS.length + i, 'aow-cyan'))}
      </span>
      <span className="aow-mask aow-page" aria-hidden="true">
        <span
          className="aow-letter aow-light"
          style={{ '--d': `${START + (ALWAYS.length + ON.length) * STEP + 0.1}s` }}
        >
          page
        </span>
      </span>
    </div>
  )
}
