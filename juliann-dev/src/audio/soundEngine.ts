let ctx: AudioContext | null = null
let enabled = false

function getCtx(): AudioContext | null {
  if (!enabled) return null
  if (!ctx) {
    try { ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)() } catch { return null }
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function beep(freq: number, dur: number, type: OscillatorType = 'square', vol = 0.10) {
  const c = getCtx()
  if (!c) return
  try {
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.connect(g)
    g.connect(c.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, c.currentTime)
    g.gain.setValueAtTime(vol, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + dur + 0.01)
  } catch { /* ignore */ }
}

// ---- background music ---------------------------------------------------------------
// Juliann playing the Tetris theme. The file is the single opening E note followed by exactly
// one 45.784s period of the piece, cut where the phrase repeats, phase-aligned to the sample
// and crossfaded across the join so it repeats without a seam.
//
// Playback starts at 0 so the E is heard once; the loop region begins just after it, so the E
// never comes back around:
//
//   0.000s ──── 0.240s ─────────────────────── 46.024s
//      E        loopStart               loopEnd ↺
//
// Played through an AudioBufferSourceNode rather than an <audio loop> tag on purpose: AAC
// carries encoder padding, so an audio element inserts a short gap every time it wraps, and
// it has no equivalent of loopStart. Looping a decoded buffer is sample-accurate.
const MUSIC_URL = '/assets/audio/tetris-theme-loop.m4a'
const LOOP_START = 0.24
const LOOP_END = 46.0238
const MUSIC_GAIN = 0.22          // sits under the SFX beeps (0.05 - 0.13) rather than over them
const START_DELAY = 0.4          // a beat of silence after the toggle click before the E lands
const FADE_IN = 0.05             // just enough to avoid a click; short so the E is not ducked
const FADE_OUT = 0.4

let musicBuf: AudioBuffer | null = null
let musicReq: Promise<AudioBuffer | null> | null = null
let musicSrc: AudioBufferSourceNode | null = null
let musicGain: GainNode | null = null

// Fetched on first unmute, never on page load, and only once per session.
function loadMusic(c: AudioContext): Promise<AudioBuffer | null> {
  if (musicBuf) return Promise.resolve(musicBuf)
  if (!musicReq) {
    musicReq = fetch(MUSIC_URL)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
      .then((b) => c.decodeAudioData(b))
      .then((buf) => { musicBuf = buf; return buf })
      .catch(() => { musicReq = null; return null })   // stay silent, let the SFX carry on
  }
  return musicReq
}

async function startBg() {
  const c = getCtx()
  if (!c || musicSrc) return
  const buf = await loadMusic(c)
  // The visitor may have muted again while the file was still downloading.
  if (!buf || !enabled || musicSrc) return

  const at = c.currentTime + START_DELAY

  musicGain = c.createGain()
  musicGain.gain.setValueAtTime(0.0001, at)
  musicGain.gain.linearRampToValueAtTime(MUSIC_GAIN, at + FADE_IN)
  musicGain.connect(c.destination)

  const src = c.createBufferSource()
  src.buffer = buf
  src.loop = true
  src.loopStart = LOOP_START
  // Guard against an AAC decode coming back a hair short of the authored length, which would
  // otherwise leave loopEnd past the end of the buffer.
  src.loopEnd = Math.min(LOOP_END, buf.duration)
  src.connect(musicGain)
  src.start(at)
  musicSrc = src
}

function stopBg() {
  const src = musicSrc, gain = musicGain
  musicSrc = null; musicGain = null
  if (!src || !gain || !ctx) return
  // Ramp down before stopping, otherwise cutting mid-waveform clicks.
  const t = ctx.currentTime
  gain.gain.cancelScheduledValues(t)
  gain.gain.setValueAtTime(gain.gain.value, t)
  gain.gain.linearRampToValueAtTime(0.0001, t + FADE_OUT)
  src.onended = () => { src.disconnect(); gain.disconnect() }
  try { src.stop(t + FADE_OUT + 0.05) } catch { /* already stopped */ }
}

export function setEnabled(on: boolean) {
  enabled = on
  if (on) { getCtx(); void startBg() }
  else stopBg()
}

export function isEnabled() { return enabled }

export const SFX = {
  move:     () => beep(200, 0.04, 'square', 0.07),
  rotate:   () => beep(330, 0.05, 'square', 0.09),
  lock:     () => beep(160, 0.08, 'sawtooth', 0.11),
  softDrop: () => beep(180, 0.03, 'square', 0.06),
  hardDrop: () => { beep(120, 0.07, 'sawtooth', 0.13); beep(90, 0.07, 'sawtooth', 0.09) },
  hold:     () => beep(262, 0.06, 'square', 0.08),
  clear:    () => [440, 554, 659, 880].forEach((f, i) => setTimeout(() => beep(f, 0.12, 'square', 0.10), i * 40)),
  tetris:   () => [523, 659, 784, 880, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.15, 'square', 0.12), i * 50)),
  win:      () => [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => beep(f, 0.18, 'square', 0.11), i * 70)),
  gameOver: () => [440, 330, 262, 165].forEach((f, i) => setTimeout(() => beep(f, 0.20, 'sawtooth', 0.12), i * 90)),
  uiClick:  () => beep(440, 0.05, 'square', 0.07),
}
