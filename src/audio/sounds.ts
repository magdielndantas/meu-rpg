/* ============================================================
   Procedural Audio Engine — Shadow Realm Chronicles
   All sounds generated via Web Audio API (no audio files)
   ============================================================ */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let muted = false;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0 : 0.7;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function getMaster(): GainNode {
  getCtx();
  return masterGain!;
}

export function setMuted(value: boolean) {
  muted = value;
  if (masterGain) masterGain.gain.value = value ? 0 : 0.7;
}

export function getMuted() { return muted; }

/* ── Utilities ─────────────────────────────────────────────── */
function osc(
  type: OscillatorType, freq: number,
  startTime: number, endTime: number,
  gainPeak: number, dest: AudioNode,
  freqEnd?: number,
) {
  const ac = getCtx();
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, startTime);
  if (freqEnd !== undefined) {
    o.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), endTime);
  }
  g.gain.setValueAtTime(gainPeak, startTime);
  g.gain.exponentialRampToValueAtTime(0.0001, endTime);
  o.connect(g);
  g.connect(dest);
  o.start(startTime);
  o.stop(endTime + 0.01);
}

function noise(durationSec: number, gainPeak: number, filterFreq: number, dest: AudioNode, startOffset = 0) {
  const ac = getCtx();
  const size = Math.ceil(ac.sampleRate * durationSec);
  const buf = ac.createBuffer(1, size, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;

  const src = ac.createBufferSource();
  src.buffer = buf;

  const filt = ac.createBiquadFilter();
  filt.type = 'bandpass';
  filt.frequency.value = filterFreq;
  filt.Q.value = 1.2;

  const g = ac.createGain();
  const t = ac.currentTime + startOffset;
  g.gain.setValueAtTime(gainPeak, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + durationSec);

  src.connect(filt);
  filt.connect(g);
  g.connect(dest);
  src.start(t);
}

function chime(freqs: number[], spacing: number, gainPeak: number, decay: number) {
  const ac = getCtx();
  const m = getMaster();
  const t0 = ac.currentTime;
  freqs.forEach((freq, i) => {
    osc('sine', freq, t0 + i * spacing, t0 + i * spacing + decay, gainPeak, m);
  });
}

/* ── Sounds ─────────────────────────────────────────────────── */

/** Soft paper whoosh when a card is dealt */
export function sndCardDraw() {
  const ac = getCtx(); const m = getMaster(); const t = ac.currentTime;
  noise(0.12, 0.25, 2000, m);
  osc('sine', 700, t, t + 0.14, 0.12, m, 200);
}

/** Attack card slam — woosh + heavy thump */
export function sndCardAttack() {
  const ac = getCtx(); const m = getMaster(); const t = ac.currentTime;
  osc('sawtooth', 180, t, t + 0.22, 0.5, m, 35);
  noise(0.09, 0.35, 600, m);
  osc('sine', 90, t + 0.04, t + 0.22, 0.6, m, 30);
}

/** Skill card — magical shimmer */
export function sndCardSkill() {
  const ac = getCtx(); const m = getMaster(); const t = ac.currentTime;
  [440, 660, 880].forEach((f, i) => osc('sine', f, t + i * 0.02, t + 0.35, 0.22, m));
  noise(0.1, 0.12, 3000, m);
}

/** Power card — deep resonant pulse */
export function sndCardPower() {
  const ac = getCtx(); const m = getMaster(); const t = ac.currentTime;
  osc('sine', 80, t, t + 0.6, 0.55, m);
  osc('sine', 160, t + 0.02, t + 0.5, 0.2, m);
  osc('triangle', 320, t + 0.04, t + 0.4, 0.15, m);
  noise(0.15, 0.1, 500, m, 0.05);
}

/** Enemy takes damage — sword slice + impact */
export function sndEnemyHit() {
  const ac = getCtx(); const m = getMaster(); const t = ac.currentTime;
  noise(0.07, 0.45, 900, m);
  osc('sine', 130, t, t + 0.18, 0.7, m, 35);
  osc('triangle', 1100, t, t + 0.12, 0.2, m, 600);
}

/** Player takes damage — heavy thud */
export function sndPlayerHit() {
  const ac = getCtx(); const m = getMaster(); const t = ac.currentTime;
  osc('sine', 80, t, t + 0.25, 0.8, m, 25);
  noise(0.1, 0.5, 300, m);
  osc('sawtooth', 55, t + 0.02, t + 0.2, 0.35, m, 20);
}

/** Block gained — metallic clang */
export function sndBlock() {
  const ac = getCtx(); const m = getMaster(); const t = ac.currentTime;
  [500, 750, 1200].forEach((f, i) => {
    osc('triangle', f, t + i * 0.012, t + 0.35, 0.22 / (i + 1), m);
  });
  noise(0.04, 0.15, 2500, m);
}

/** Heal — rising green chime C-E-G */
export function sndHeal() {
  chime([523, 659, 784], 0.1, 0.28, 0.5);
}

/** Player turn start — clear bell */
export function sndTurnStart() {
  const ac = getCtx(); const m = getMaster(); const t = ac.currentTime;
  osc('sine', 880, t, t + 0.55, 0.3, m);
  osc('sine', 1320, t + 0.04, t + 0.4, 0.12, m);
}

/** Enemy turn — ominous low pulse */
export function sndEnemyTurn() {
  const ac = getCtx(); const m = getMaster(); const t = ac.currentTime;
  osc('sawtooth', 110, t, t + 0.7, 0.4, m, 80);
  osc('sine', 55, t, t + 0.5, 0.3, m);
  noise(0.2, 0.15, 250, m);
}

/** Victory fanfare — ascending arpeggio */
export function sndVictory() {
  const ac = getCtx(); const m = getMaster(); const t = ac.currentTime;
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => {
    osc('sine', f, t + i * 0.12, t + i * 0.12 + 0.55, 0.35, m);
    osc('triangle', f * 2, t + i * 0.12, t + i * 0.12 + 0.3, 0.1, m);
  });
}

/** Defeat — descending groan */
export function sndDefeat() {
  const ac = getCtx(); const m = getMaster(); const t = ac.currentTime;
  osc('sawtooth', 200, t, t + 2.2, 0.45, m, 55);
  osc('sine', 120, t, t + 1.8, 0.3, m, 40);
  noise(0.8, 0.2, 200, m, 0.1);
}

/** Map node select — click + quick tone */
export function sndNodeSelect() {
  const ac = getCtx(); const m = getMaster(); const t = ac.currentTime;
  noise(0.025, 0.4, 3500, m);
  osc('sine', 660, t + 0.02, t + 0.15, 0.2, m, 400);
}

/** Shop buy — coin jingle */
export function sndShopBuy() {
  chime([783, 1047, 1319], 0.06, 0.3, 0.25);
}

/** Rest screen — soft crackle tick */
export function sndRestEnter() {
  const ac = getCtx(); const m = getMaster(); const t = ac.currentTime;
  noise(0.18, 0.15, 400, m);
  osc('sine', 220, t, t + 0.5, 0.12, m, 180);
}

/** End turn whoosh */
export function sndEndTurn() {
  const ac = getCtx(); const m = getMaster(); const t = ac.currentTime;
  osc('sine', 300, t, t + 0.25, 0.22, m, 600);
  noise(0.12, 0.2, 1500, m, 0.02);
}

/* ── Dispatcher ─────────────────────────────────────────────── */
export type SoundName =
  | 'cardDraw' | 'cardAttack' | 'cardSkill' | 'cardPower'
  | 'enemyHit' | 'playerHit' | 'block' | 'heal'
  | 'turnStart' | 'enemyTurn' | 'victory' | 'defeat'
  | 'nodeSelect' | 'shopBuy' | 'restEnter' | 'endTurn';

const soundMap: Record<SoundName, () => void> = {
  cardDraw:   sndCardDraw,
  cardAttack: sndCardAttack,
  cardSkill:  sndCardSkill,
  cardPower:  sndCardPower,
  enemyHit:   sndEnemyHit,
  playerHit:  sndPlayerHit,
  block:      sndBlock,
  heal:       sndHeal,
  turnStart:  sndTurnStart,
  enemyTurn:  sndEnemyTurn,
  victory:    sndVictory,
  defeat:     sndDefeat,
  nodeSelect: sndNodeSelect,
  shopBuy:    sndShopBuy,
  restEnter:  sndRestEnter,
  endTurn:    sndEndTurn,
};

export function play(name: SoundName) {
  if (muted) return;
  try { soundMap[name](); } catch { /* AudioContext not ready */ }
}
