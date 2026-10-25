import { useId } from 'react'

const BOWL = 'M0,3.3H66C92,3.3 109,22 109,48C109,68 99,84 83,92L125,131L75,105L53,83L66,82C85,82 94,68 94,50C94,30 82,17.5 66,17.5H0Z'
const LEG = 'M0,67L125,131H97L0,84Z'
const FACET = 'M75,105L83,92L125,131Z'

export default function RichmondLogo({ className = '' }) {
  const uid = useId().replace(/:/g, '')
  const gradId = `rl-grad-${uid}`
  const wipes = {
    bowl: `rl-bowl-${uid}`,
    leg: `rl-leg-${uid}`,
    name: `rl-name-${uid}`,
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`rl-logo${className ? ` ${className}` : ''}`}
      role="img"
      aria-label="Richmond"
      viewBox="0 0 424 133"
    >
      <defs>
        <linearGradient id={gradId} x1="75" y1="98" x2="125" y2="131" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ad9964" />
          <stop offset="0.55" stopColor="#7d6d44" />
          <stop offset="1" stopColor="#2a2414" />
        </linearGradient>
        <clipPath id={wipes.bowl}><rect className="rl-wipe" style={{ '--d': '0s', '--t': '0.9s' }} x="0" y="0" width="126" height="133" /></clipPath>
        <clipPath id={wipes.leg}><rect className="rl-wipe" style={{ '--d': '0.35s', '--t': '0.8s' }} x="0" y="60" width="126" height="73" /></clipPath>
        <clipPath id={wipes.name}><rect className="rl-wipe" style={{ '--d': '0.7s', '--t': '1s' }} x="140" y="40" width="290" height="52" /></clipPath>
      </defs>

      <g clipPath={`url(#${wipes.bowl})`}>
        <path className="rl-gold" d={BOWL} />
      </g>
      <g clipPath={`url(#${wipes.leg})`}>
        <path className="rl-gold" d={LEG} />
      </g>
      <path className="rl-facet" d={FACET} fill={`url(#${gradId})`} />

      <g clipPath={`url(#${wipes.name})`}>
        <text className="rl-ink" x="145" y="83" fontSize="46" fontWeight="500" textLength="276" lengthAdjust="spacing">RICHMOND</text>
      </g>
    </svg>
  )
}
