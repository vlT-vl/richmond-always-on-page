import { NETWORK } from '../lib/network.js'

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function NetworkBackdrop() {
  const { W, H, edges, nodes, pulses, dots, rings } = NETWORK

  return (
    <svg
      className="net"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g className="net-lines">
        {edges.map((e, i) => (
          <line
            key={i}
            className="net-edge"
            pathLength="1"
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            style={{ '--d': `${e.delay}s` }}
          />
        ))}
      </g>
      <g className="net-pulses">
        {pulses.map((e, i) => (
          <line
            key={i}
            className="net-pulse"
            pathLength="1"
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            style={{ '--s': `${e.start}s`, '--t': `${e.duration}s` }}
          />
        ))}
      </g>
      <g className="net-rings">
        {rings.map((r, i) => (
          <circle
            key={i}
            className="net-ring"
            cx={r.x}
            cy={r.y}
            r="0.9"
            style={{ '--s': `${r.start}s`, '--t': `${r.duration}s` }}
          />
        ))}
      </g>
      <g className="net-nodes">
        {nodes.map((n, i) => (
          <circle
            key={i}
            className={`net-node${n.breathes ? ' net-node--breath' : ''}`}
            cx={n.x}
            cy={n.y}
            r="0.65"
            style={{ '--d': `${n.delay}s`, '--b': `${n.breath}s`, '--p': `${n.phase}s` }}
          />
        ))}
      </g>
      {!reduceMotion && (
        <g className="net-dots">
          {dots.map((d, i) => (
            <circle key={i} className="net-dot" r="0.42" opacity="0">
              <animateMotion
                dur={`${d.duration}s`}
                begin={`${d.start}s`}
                repeatCount="indefinite"
                path={d.path}
                keyPoints="0;1;1"
                keyTimes="0;0.45;1"
                calcMode="linear"
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0;0"
                keyTimes="0;0.04;0.41;0.45;1"
                dur={`${d.duration}s`}
                begin={`${d.start}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      )}
    </svg>
  )
}
