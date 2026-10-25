import { useEffect, useState } from 'react'
import {
  WiTime1, WiTime2, WiTime3, WiTime4, WiTime5, WiTime6,
  WiTime7, WiTime8, WiTime9, WiTime10, WiTime11, WiTime12,
} from 'react-icons/wi'
import { PiCalendarBlank } from 'react-icons/pi'

const TZ = 'Europe/Rome'
const HOUR_ICONS = [
  WiTime12, WiTime1, WiTime2, WiTime3, WiTime4, WiTime5,
  WiTime6, WiTime7, WiTime8, WiTime9, WiTime10, WiTime11,
]
const DIGIT_AT = 0.15
const DIGIT_STEP = 0.08
const DATE_AT = 0.8
const DATE_STEP = 0.12

function getParts() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const pick = type => parts.find(p => p.type === type).value
  return [pick('hour'), pick('minute'), pick('second')]
}

const dateFormat = new Intl.DateTimeFormat('it-IT', {
  timeZone: TZ,
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const clean = v => v.replace(/\./g, '').slice(0, 3).toUpperCase()

function getDate() {
  const parts = dateFormat.formatToParts(new Date())
  const pick = type => parts.find(p => p.type === type).value
  return [clean(pick('weekday')), pick('day'), clean(pick('month')), pick('year')]
}

function FlipDigit({ value, token = false, enter = 0 }) {
  const [prev, setPrev] = useState(value)
  const [cur, setCur] = useState(value)
  const [flips, setFlips] = useState(0)

  if (value !== cur) {
    setPrev(cur)
    setCur(value)
    setFlips(f => f + 1)
  }

  return (
    <div className={`flip-digit${token ? ' flip-token' : ''}`} style={{ ...(token ? { '--n': value.length } : {}), '--e': `${enter}s` }}>
      <div key={`st${flips}`} className={`flip-half flip-top${flips ? ' flip-st' : ''}`}><span>{cur}</span></div>
      <div key={`sb${flips}`} className={`flip-half flip-bottom${flips ? ' flip-sb' : ''}`}><span>{flips ? prev : cur}</span></div>
      {flips > 0 && (
        <>
          <div key={`t${flips}`} className="flip-half flip-top flip-flap flip-flap-top"><span>{prev}</span></div>
          <div key={`b${flips}`} className="flip-half flip-bottom flip-flap flip-flap-bottom"><span>{cur}</span></div>
        </>
      )}
    </div>
  )
}

export default function FlipClock() {
  const [time, setTime] = useState(getParts)
  const [date, setDate] = useState(getDate)

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getParts())
      setDate(getDate())
    }, 250)
    return () => clearInterval(id)
  }, [])

  const HourIcon = HOUR_ICONS[Number(time[0]) % 12]

  return (
    <div className="clock-block">
      <div className="clock-row">
        <span className="clock-ico" style={{ '--e': '0.05s' }} aria-hidden="true">
          <HourIcon />
        </span>
        <div className="flipclock" role="timer" aria-label={time.join(':')}>
          {time.map((unit, i) => (
            <div className="flip-group" key={i}>
              <FlipDigit value={unit[0]} enter={DIGIT_AT + i * 2 * DIGIT_STEP} />
              <FlipDigit value={unit[1]} enter={DIGIT_AT + (i * 2 + 1) * DIGIT_STEP} />
              {i < 2 && (
                <div className="flip-sep" style={{ '--e': `${DIGIT_AT + (i * 2 + 2) * DIGIT_STEP}s` }}>
                  <i /><i />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="clock-row">
        <span className="clock-ico clock-ico--date" style={{ '--e': `${DATE_AT - 0.05}s` }} aria-hidden="true">
          <PiCalendarBlank />
        </span>
        <div className="flipdate" aria-label={date.join(' ')}>
          <div className="flipdate-row">
            {date.map((chunk, i) => (
              <FlipDigit value={chunk} token enter={DATE_AT + i * DATE_STEP} key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
