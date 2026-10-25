import { FiRefreshCw } from 'react-icons/fi'

const ENABLED = import.meta.env.VITE_DEBUG_REPLAY === 'true'

export default function DebugReplay({ onReplay }) {
  if (!ENABLED) return null

  return (
    <button
      className="round-btn"
      onClick={onReplay}
      aria-label="Riavvia le animazioni (debug)"
      title="Riavvia le animazioni da capo (debug)"
    >
      <FiRefreshCw />
    </button>
  )
}
