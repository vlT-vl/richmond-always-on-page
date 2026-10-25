import React from 'react'
import ReactDOM from 'react-dom/client'
import './css/index.css'
import './css/app.css'
import './css/flipclock.css'
import './css/weather.css'
import './css/theme.css'
import './css/s2elogo.css'
import './css/shift.css'
import './css/event.css'
import './css/welcome.css'
import './css/agendamodal.css'
import './css/agendapill.css'
import './css/office.css'
import './css/network.css'
import './css/team.css'
import App from './components/App.jsx'
import './css/intro-skip.css'
import './css/exit.css'
import './css/responsive.css'
import { applyTheme, getThemePreference, watchSystemTheme } from './lib/theme.js'
import { SKIP_INTRO } from './lib/intro.js'

applyTheme()
if (SKIP_INTRO) document.documentElement.classList.add('intro-skip')
watchSystemTheme(() => {
  if (getThemePreference() === 'system') applyTheme('system')
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
