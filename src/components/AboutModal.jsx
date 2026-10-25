import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import '../css/aboutmodal.css'
import { HiXMark } from 'react-icons/hi2'
import { FiInfo } from 'react-icons/fi'
import RichmondLogo from './RichmondLogo.jsx'
import AlwaysOnWord from './AlwaysOnWord.jsx'
import VltLogo from './VltLogo.jsx'
import pkg from '../../package.json'

const stripCaret = v => v?.replace(/^[\^~]/, '') ?? '—'

const STACK = [
  { label: 'React',       value: stripCaret(pkg.dependencies.react) },
  { label: 'Vite',        value: stripCaret(pkg.devDependencies.vite) },
  { label: 'React Icons', value: stripCaret(pkg.dependencies['react-icons']) },
]

export default function AboutModal({ onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div className="amo-overlay" onClick={onClose}>
      <div className="amo-card" onClick={e => e.stopPropagation()}>

        <div className="amo-header">
          <div className="amo-header-left">
            <FiInfo className="amo-header-icon" />
            <div>
              <span className="amo-eyebrow">Info</span>
              <h2 className="amo-title">RICHMOND always on page</h2>
              <span className="amo-subtitle">
                v{pkg.version} · {pkg.build} · {pkg.updated}
              </span>
            </div>
          </div>
          <button className="amo-close" onClick={onClose} aria-label="Chiudi">
            <HiXMark />
          </button>
        </div>

        <div className="amo-body">
          <div className="amo-logos">
            <RichmondLogo className="amo-rl-logo" />
            <AlwaysOnWord />
          </div>

          <div className="amo-grid">
            <div className="amo-field">
              <span className="amo-field-label">Versione</span>
              <span className="amo-field-value">{pkg.version}</span>
            </div>
            <div className="amo-field">
              <span className="amo-field-label">Build</span>
              <span className="amo-field-value">{pkg.build}</span>
            </div>
            <div className="amo-field">
              <span className="amo-field-label">Aggiornato</span>
              <span className="amo-field-value">{pkg.updated}</span>
            </div>
          </div>

          <div className="amo-grid">
            {STACK.map(s => (
              <div className="amo-field" key={s.label}>
                <span className="amo-field-label">{s.label}</span>
                <span className="amo-field-value">{s.value}</span>
              </div>
            ))}
          </div>

          <p className="amo-notice">RICHMOND always on page è un progetto vlT.</p>

          <a
            className="amo-vlt-link"
            href="https://lorenzoveronesi.it"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="lorenzoveronesi.it"
          >
            <VltLogo size="2.1rem" staticExpanded />
          </a>

          <p className="amo-notice amo-notice--copy">
            © 2026 vlT · Veronesi Lorenzo. Tutti i diritti riservati.
          </p>
        </div>

      </div>
    </div>,
    document.body
  )
}
