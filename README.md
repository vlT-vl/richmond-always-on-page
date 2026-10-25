<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="src/res/richmond-alwayson-dark.svg" />
    <img src="src/res/richmond-alwayson-light.svg" alt="RICHMOND AlwaysOn page" width="460" />
  </picture>
</p>

<p align="center">
  RICHMOND always on page — the always-on page of the Richmond IT Director Forum<br/>
  <sub>Frontend React · Build Vite</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0--R271026-00afcb?style=flat-square" alt="version"/>
  <img src="https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="react"/>
  <img src="https://img.shields.io/badge/vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="vite"/>
  <img src="https://img.shields.io/badge/license-proprietary-critical?style=flat-square" alt="license"/>
</p>

---

## Overview

This page is dedicated to the **Richmond IT Director Forum** event (Rimini, 26–27 October 2026): it is meant to stay open on a screen during the event and shows the day's agenda, the attendee being welcomed and the S2E team on site. It is a static, frontend-only page. There is no backend and no login. The visual language follows the S2E website: S2E cyan and navy, Montserrat typography, in light and dark themes.

---

## Features

| Area | Description |
|---|---|
| **Flip clock** | Top-left. Hours, minutes and seconds in Europe/Rome time, shown as animated flip digits with no card, background, border, blur or transparency — plain text in the theme color, in the same visual style as the weather. Each digit folds over when it changes; the two dots between the groups blink. To the left, a clock icon from the Weather Icons set (the same family as the weather icon) whose hands follow the current hour. Below the clock, today's date in the same flip style, one item per group (weekday, day, month, year, in Italian and Europe/Rome time), with a calendar icon on the left; the date row always spans exactly the same width as the clock. The clock, date, icons, weather and the two buttons stay hidden on the first load and enter together only when the opening statement starts to leave. Its size is close to the weather widget on the right; on small phones it scales down to fit the screen width |
| **Theme** | Light and dark, with a switch in the top-right corner. The first visit follows the system setting; the choice is then remembered in the browser. The page background is a gradient from white (staying nearly white at the top, where the logo sits) to the S2E cyan in the light theme and from black to the S2E navy in the dark one. Over it sits an animated network drawn as an organic network of irregularly placed points, each joined to its two or three nearest neighbours, spread from one side of the page to the other (no waves, no regular grid), behind the content, at low opacity and faded out toward the center so it never gets in the way of reading text. On load the lines trace themselves from left to right; in idle a few nodes breathe, a few points of light travel along some of the lines and occasional rings ripple out of a node. Everything stands still when reduced motion is requested. |
| **Info** | Round button next to the theme switch (both buttons fade in after the weather). It opens a modal with the animated Richmond logo with the animated wording "AlwaysOn page" next to it, then version, build, update date and stack versions, plus the vlT credit — same layout as the nxget app portal's About modal. Closes with the X, a click outside or Esc |
| **S2E logo** | On load it starts large in the middle of the screen and plays its entrance there; then it eases up and shrinks into its place at the top center of the page and only after it has settled does the rest of the page start, cascading in. It is also shown in the info modal. It is an inline SVG React component whose pieces enter in a choreographed sequence: the emblem rings spin in and the brackets open, the S, 2 and E rise from behind a mask, then the caption line wipes in from the left |
| **Opening statement** | Shown in the vertical center of the page (the logo has moved up to make room), and only once the logo animation has finished: "We are making the shift" on a single wide line (it wraps only on narrow screens), with SHIFT larger and the I in cyan. Sober, professional motion: every word and letter rises from behind a mask in order, and a short bar draws under SHIFT. While the statement stays on screen (about five seconds) a spotlight-like sheen periodically sweeps across the letters only — nothing moves, the letters stay still and the light just passes over them. It leaves the same way it came — words and letters lift out through the mask and the bar retracts — and the space goes to the event title and everything after it |
| **Event title** | First section under the logo, on one horizontal row: the Richmond logo (R mark and "RICHMOND", drawn with left-to-right wipes), a thin gold divider, and "IT Director Forum" (IT in the logo cyan) rising word by word; a thin line draws underneath. It starts only after the opening statement has left, and once the section is in view |
| **Section titles** | Two small animated labels sit above the team area, each centered on its own column: "A questo evento per S2E" over the two team cards (the last word in the logo cyan) and "In agenda" over the attendee column. Words rise one after the other from behind a mask while two thin lines draw outward from them; they start right after the event title animation |
| **Welcome** | Between the event title and the team, laid out horizontally. For a meeting: the label "Diamo il benvenuto a:" and the attendee — a round badge with a person icon and the name in large type on the left, a thin vertical line, and on the right the role (briefcase icon), the company (office-building icon) and the start–end time (clock icon). For any other agenda slot (session, lunch, aperitif, dinner) the label becomes "Adesso in programma:" (or "A seguire:" when it is not started yet) and the badge shows a context icon (microphone for sessions, cutlery for lunch and dinner, wine glass for the aperitif) with the slot title and time. It shows the slot in progress, or the next one when none is. Lines rise from behind a mask like the team cards, a thin line draws beside the name, and everything replays when the slot changes. For meeting attendees (in progress or next; never for sessions or meals) the card also alternates, every `VITE_WELCOME_SWAP_SECONDS` seconds (a single value in `.env`, 30 at the moment; no default in the code, missing or 0 = no swap), between that main layout and a second one: the badge shows an office-building icon, the company name leads in larger type, below it the attendee (user icon), a pipe and the role (briefcase icon), and on the right only the meeting time (clock icon). The card widens and narrows with a smooth size transition while the old lines slide out through their masks and the new ones rise in, and it keeps cycling between the two layouts. Icons come from `react-icons` (Feather, Heroicons 2, Lucide) |
| **Team** | Third section, under the event title. Office members shown signature-style with no card background or border: a round photo on the left, then the S2E emblem, then the details (name, role, unit when present, address, mobile, office and website) (phone numbers are `tel:` links). The photo opens with a circular reveal, the emblem rings spin in, then the text lines rise from masks one after the other; it starts only after the "A questo evento per S2E" label has finished. Neither the members nor the agenda are in the code: both are read at runtime from `public/alwaysondata.dat`, a single lightly masked (not readable at a glance) file with the team data (photos and QR codes included) and the whole agenda, so they can be changed without rebuilding the app. The readable sources are `data/agenda.json` for the agenda and `data/team.json` (a `labels` block with the "Mobile" and "Office" captions, a `defaults` block with the shared unit, address, office phone and website, plus one entry per member with name, role, mobile and photo path; any default can be overridden per member, and a member can add or drop the unit line); the photos are the source images in `data/team/`. After editing the data or replacing a photo, run `npm run data:encode`: it embeds the photos and QR codes and the agenda in `alwaysondata.dat`, so no photo, QR or data file is served at all (the `data/` folder is git-ignored, only the `.dat` is committed). The masking only keeps the data from being exposed in plain text; it is not a security measure, since the browser has to decode it to show it. Currently two people. On screens from 1100px up the cards sit four to a row (fewer cards are centered); below that they wrap. The card details are always a single column: medium and wide cards put the photo and emblem on the left, narrow ones stack them above the text |
| **Team carousel** | After the intro, once the page has been complete for `VITE_TEAM_CAROUSEL_START_DELAY_SECONDS`, each team card expands in turn into a large card in the same area (the photo and the S2E emblem fly from the small card to the large one, the other card fades, the lines rise from masks, always in the same order: photo and data first, then the role, then the QR code; it closes in the same order). The large card is laid out horizontally in three blocks beside the photo and emblem: the data (name, role, unit, address, mobile and office, email and website), then a short description of the role, then a QR code that saves the contact (a vCard) on a phone when scanned. The descriptions are the `description` field of each member in `team.json` (the first copied from the S2E AlwaysOn page, the second adapted to a virtualization focus). Each card stays for `VITE_TEAM_CARD_DURATION_SECONDS`, then collapses back; after all of them the carousel pauses for `VITE_TEAM_CAROUSEL_PAUSE_SECONDS` and starts again. All three timings live in `.env` (no defaults in the code; a missing or zero card duration turns the carousel off). The QR codes are generated once, offline, from the vCard of each member and stored as `data/team/qr-<id>.svg`, then embedded in `alwaysondata.dat` by `npm run data:encode` like the photos (the vCard has name, organisation, role, mobile, office, email and website; the address is left out to keep the code small and easy to scan). Email addresses are in `team.json` (`email`, with an `Email` label) |
| **Attendees** | Column on the right of the team cards, in the same motion style as the team (lines rising from masks, a thin line drawing beside it, lines replaying when the slot changes), showing the slot in progress ("In corso") and the next one ("A seguire") with start and end time and, for meetings, name, role and company (other slots show their title). It reads the agenda from `alwaysondata.dat` (source `data/agenda.json`, the whole agenda of 2026-10-26 and 2026-10-27: meetings, sessions, lunch, aperitif and dinner; `data/agenda.md` is the readable table). The current time is Europe/Rome: it is fetched from `timeapi.io`, falling back to the `Date` header of the page's own server and then to the device clock, re-synced every 10 minutes. A true NTP query (`time.google.com`) is not possible from a browser. The agenda is not bundled in the code: after editing it run `npm run data:encode` (no rebuild needed) |
| **No replay on reload** | The entrance sequence plays once. When it has fully finished the browser remembers it (local storage), and from then on a reload shows the page directly in its final state, with no intro animations (the live parts — clock, weather, background network — keep running). Reloading in the middle of the sequence starts it again. Adding `?intro=1` to the address forces the full sequence for testing. How long the memory lasts is a single setting in `src/lib/intro.js` (`INTRO_REPLAY_AFTER_MS`, currently never expires), ready for a future timed loop |
| **Debug replay button** | Only when `VITE_DEBUG_REPLAY=true` in `.env`: a round button next to the others that restarts the whole sequence from scratch (exit animation, then the entrance again) without reloading the page, so fullscreen is kept. It appears together with the other buttons |
| **Fullscreen button** | Round button next to the info button (same form and entrance). It switches the page to fullscreen and back; it is hidden on browsers without the Fullscreen API (e.g. iPhone Safari). Fullscreen is kept across loop restarts. With `VITE_FULLSCREEN_ALWAYS_VISIBLE=true` in `.env` (on now) the button is visible and clickable from the very first frame of the entrance sequence, before the top bar and the other buttons enter; otherwise it enters with them |
| **Agenda calendar** | Round calendar button next to the info button (same form and entrance). It opens an animated modal with the whole event agenda: a tab per day (2026-10-26 and 2026-10-27), filter chips by type (all, meetings, sessions, meals, each with a count) and one row per appointment with start–end time, a context icon (person for meetings, microphone for sessions, cutlery for lunch and dinner, wine glass for the aperitif), name or title, role and company, and the session description when there is one. Rows rise in one after the other and replay when the day or the filter changes; the slot in progress is highlighted ("In corso") and past ones are dimmed. It opens on the current day when that is in the agenda. Esc or a click outside closes it |
| **Agenda pill** | Top left, to the right of the flip clock and without any background (a thin line on its left, icons in the logo cyan). First line: the total number of attendees of the whole event and how many meetings the day has ("17 partecipanti totali · 10 meeting oggi"; the date instead of "oggi" when it is not an event day: the next event day with slots left is used). Second line: a carousel through the slot in progress and every slot that follows in the whole event (meetings, sessions, lunch, aperitif, dinner; slots of the next days carry their date), each with start–end time, the attendee name or slot title and its context icon; slots already over never appear (it uses the Europe/Rome time of the page), and the slot in progress is highlighted. The line rises from a mask at every change, every `VITE_PILL_INTERVAL_SECONDS` seconds (15 in `.env`; no default in the code, missing or 0 = no rotation). Hidden below 760px wide, and the slot part below 1100px |
| **Loop** | Every `VITE_LOOP_SECONDS` seconds (set in `.env`, no default in the code: if the variable is missing or not a positive number the loop is off) the page plays an exit in motion design (top bar, logo, titles, lines, photos, attendee and team lines slide or draw out through their masks, the background network fades) and then restarts the whole entrance sequence from the beginning, as on a first visit, switching between the light and dark theme at every restart (the new choice is remembered, like a manual switch). The clock, weather and agenda lookups restart with it. The About modal, if open, stays open |
| **No scrolling** | The page never scrolls: under the top bar, the logo, the event title slot, the welcome card and the team row (section titles, team cards and attendee column) are laid out in a column that spreads over the available height, and if the content would be taller than the screen the whole block is scaled down uniformly (never up) so everything stays visible. It recomputes on resize and when content changes |
| **Responsive** | Above 900px wide the page is a single no-scroll screen that scales to fit. At 900px and below (phones, tablets in portrait) it becomes one normal scrolling column with a readable base font size (14–17px): the top bar stacks, all centered, the clock and date, the agenda pill (two lines) and then the weather and buttons, with thin dividers that draw in with the top bar; the logo, event title, welcome card (badge above the text), section titles, team cards and attendee column follow one below the other, all centered, so nothing overlaps; the opening statement is placed right under the S2E logo instead of the screen centre; the team carousel keeps running (the stage grows smoothly to fit the expanded card and shrinks back, so nothing overlaps); modals get smaller paddings, two-column info boxes and larger touch targets. The viewport is declared with `viewport-fit=cover` and the page pads itself by the device safe-area insets, so in fullscreen on phones the gradient reaches the screen edges (no flat white/black band). On desktop the scale-to-fit is recomputed whenever the content height changes after the first measure (data arriving, welcome layout swap), so nothing stays cut off. The motion design (entrances, welcome swap, loop) is kept |
| **Stage** | Below the team section the page is empty for now |

---

## Data source

The team and the whole event agenda come from one masked file, `public/alwaysondata.dat`, built offline from `data/team.json`, `data/agenda.json` and the photos and QR codes in `data/team/` with `npm run data:encode` (the readable `data/` folder is git-ignored, so no participant data is in clear in the repository). It is loaded at runtime and again at every loop restart. The masking only hides the data from a quick look; it is not encryption.

Weather comes from the free [Open-Meteo](https://open-meteo.com/) forecast API (no key, called directly from the browser). Only the current temperature, weather code and day/night flag are requested.

---

## Stack

| Package | Version |
|---|---|
| react / react-dom | ^19.3.0 |
| react-icons | ^5.7.0 |
| vite | ^8.3.4 |
| @vitejs/plugin-react | ^6.1.2 |

---

## Development

```bash
npm install
npm run dev
npm run build
npm run data:encode
```

`VITE_BASE_URL` in `.env` sets the public base path; `VITE_LOOP_SECONDS` sets the loop length in seconds (see Loop above); `VITE_PILL_INTERVAL_SECONDS` sets the interval of the top-left agenda pill; `VITE_WELCOME_SWAP_SECONDS` sets how long the welcome card stays in each of its two layouts; `VITE_FULLSCREEN_ALWAYS_VISIBLE` makes the fullscreen button visible from the start of the sequence; `VITE_TEAM_CAROUSEL_START_DELAY_SECONDS`, `VITE_TEAM_CARD_DURATION_SECONDS` and `VITE_TEAM_CAROUSEL_PAUSE_SECONDS` set the team carousel timings (see Team carousel above). Vite bakes all of them in at build time, so restart the dev server after editing `.env`; `.env.example` documents every key and is the tracked copy (`.env` is git-ignored).

---

## Deployment

A single branch, `sourcecode`, holds the code. A push to it runs `.github/workflows/deploy.yml`, which installs the dependencies (`npm install`), copies `.env.example` to `.env` (the real `.env` is git-ignored, so the build takes its `VITE_*` values from the example file), builds with `VITE_BASE_URL=/richmond-always-on-page/` and publishes `dist` to GitHub Pages (Settings → Pages → Source: GitHub Actions). The workflow can also be started by hand from the Actions tab. The agenda and the team travel only inside the masked `public/alwaysondata.dat`, which is committed; the readable `data/` folder is not.

---

## Security notes

- No secrets, tokens or credentials are in the repository (`.env` is git-ignored; `.env.example` only holds public `VITE_*` timings). The GitHub workflow has minimal permissions (`contents: read`, `pages: write`, `id-token: write`) and `npm audit` reported no known vulnerabilities at the time of the check. There is no lockfile in the repository on purpose (it is git-ignored), so the workflow resolves the newest versions allowed by `package.json` at each build.
- The page renders every text through React (no `innerHTML`, `eval` or similar); external links use `rel="noopener noreferrer"`; source maps are off.
- Team and agenda data are only masked, not encrypted: `public/alwaysondata.dat` can be decoded by anyone who reads the page's JavaScript. Keep out of it anything that must stay confidential.
- The browser contacts three third-party hosts: Google Fonts (typography), Open-Meteo (weather) and timeapi.io (time). Only the visitor's IP address and the usual request headers reach them; no data of the page is sent.
- GitHub Pages cannot set HTTP headers, so there is no Content-Security-Policy. A CSP `<meta>` was not added because it would also block the inline scripts Vite injects in development.

---

## Project structure

```
index.html
.github/workflows/deploy.yml   GitHub Pages deploy
data/          team.json, agenda.json, agenda.md (readable table), team/ (photos and QR codes) — readable sources, not committed
.env.example   documented environment keys (tracked); .env is ignored
scripts/       encode-data.mjs
public/        alwaysondata.dat (masked team and agenda data, photos and QR codes embedded)
src/
  main.jsx
  components/   App, DebugReplay, NetworkBackdrop, FitStage, LogoIntro, AlwaysOnWord, FlipClock, Weather, ThemeToggle, ShiftIntro, FullscreenToggle, AgendaModal, AgendaPill, EventTitle, RichmondLogo, WelcomeSection, AttendeePanel, OfficeIntro, TeamSection, S2EEmblem, AboutModal, S2ELogo, VltLogo
  css/          index (tokens), app, flipclock, weather, theme, aboutmodal, agendamodal, agendapill, s2elogo, intro-skip, exit, network, shift, event, welcome, office, team, vltlogo
  lib/          intro.js, network.js, weather.js, theme.js, data.js (loads alwaysondata.dat), team.js, agenda.js (agenda hook), clock.js (Europe/Rome time), kinds.js (icons and labels per slot kind), loop.js and cycle.js (timings from .env), mask.js, timing.js, useAfter.js, useReveal.js
  res/          s2e-logo.svg, s2e-icon.svg (favicon), vltcube.svg
```

---

Veronesi Lorenzo © 2026 vlT - vl.TECH
