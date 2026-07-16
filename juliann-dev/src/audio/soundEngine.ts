let ctx: AudioContext | null = null
let enabled = false
let bgTimer: ReturnType<typeof setInterval> | null = null
let bgIdx = 0

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

// Korobeiniki-inspired 8-bit melody
const MELODY = [659,0,494,523,587,0,523,494,440,0,440,523,659,0,587,523,494,0,494,523,587,0,659,523,440,0,440,0]
const BEAT = 160

function startBg() {
  if (bgTimer) return
  bgIdx = 0
  bgTimer = setInterval(() => {
    const note = MELODY[bgIdx % MELODY.length]
    if (note > 0) beep(note, BEAT / 1100, 'square', 0.055)
    bgIdx++
  }, BEAT)
}

function stopBg() {
  if (bgTimer) { clearInterval(bgTimer); bgTimer = null }
}

export function setEnabled(on: boolean) {
  enabled = on
  if (on) { getCtx(); startBg() }
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
