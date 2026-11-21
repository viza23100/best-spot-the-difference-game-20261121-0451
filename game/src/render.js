import { WIDTH, HEIGHT, LEVELS } from './config.js';
import { drawScene } from './scenes.js';

export class Renderer {
  constructor(state, canvases) {
    this.state = state; this.canvases = canvases; this.contexts = canvases.map(c => c.getContext('2d'));
    this.cachedLevel = -1; this.revision = -1; this.lastSecond = -1; this.lastMode = '';
    this.elements = Object.fromEntries(['chapter', 'scene-name', 'remaining', 'timer', 'score', 'hints', 'hint', 'message', 'difficulty', 'found-chips', 'level-track', 'overlay', 'result-eyebrow', 'result-title', 'result-description', 'result-score', 'result-symbol', 'continue'].map(id => [id, document.getElementById(id)]));
    this.backgrounds = [];
  }
  prepare() {
    if (this.cachedLevel === this.state.level) return;
    this.cachedLevel = this.state.level;
    this.backgrounds = [false, true].map(changed => { const canvas = document.createElement('canvas'); drawScene(canvas, this.state.level, changed); return canvas; });
  }
  marker(c, d, number, now) {
    c.save(); c.shadowColor = '#264a3640'; c.shadowBlur = 5;
    c.beginPath(); c.arc(d.x, d.y, d.r + 6, 0, Math.PI * 2);
    c.strokeStyle = '#fff9df'; c.lineWidth = 5; c.stroke();
    c.strokeStyle = '#34674f'; c.lineWidth = 2.5; c.stroke(); c.shadowBlur = 0;
    const x = d.x + d.r * .75, y = d.y - d.r * .75;
    c.beginPath(); c.arc(x, y, 10, 0, Math.PI * 2); c.fillStyle = '#34674f'; c.fill();
    c.strokeStyle = '#fff9df'; c.lineWidth = 1.5; c.stroke();
    c.font = 'bold 10px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff9df'; c.fillText(String(number), x, y + .5); c.restore();
  }
  effects(c, side, now) {
    const s = this.state;
    for (const e of s.effects) {
      if (e.type === 'wrong' && e.side !== side) continue;
      const duration = e.type === 'find' ? 1000 : 650, t = (now - e.at) / duration;
      c.save(); c.globalAlpha = Math.max(0, 1 - t);
      if (e.type === 'find') {
        c.strokeStyle = '#fff6ba'; c.lineWidth = 3 * (1 - t) + 1;
        c.beginPath(); c.arc(e.x, e.y, 20 + t * 52, 0, Math.PI * 2); c.stroke();
        for (let i = 0; i < 12; i++) {
          const a = i * Math.PI * 2 / 12, radius = 21 + t * 63;
          const x = e.x + Math.cos(a) * radius, y = e.y + Math.sin(a) * radius + t * t * 18;
          c.fillStyle = i % 2 ? '#fff4cb' : '#e9bf68'; c.beginPath(); c.arc(x, y, 3 * (1 - t) + 1, 0, Math.PI * 2); c.fill();
        }
        c.font = 'bold 16px Arial'; c.fillStyle = '#234f39'; c.textAlign = 'center'; c.fillText(`+${e.points}`, e.x, e.y - 47 - t * 25);
      } else {
        const r = 12 + t * 8; c.strokeStyle = '#c35d4e'; c.lineWidth = 3;
        c.beginPath(); c.moveTo(e.x - r / 2, e.y - r / 2); c.lineTo(e.x + r / 2, e.y + r / 2);
        c.moveTo(e.x + r / 2, e.y - r / 2); c.lineTo(e.x - r / 2, e.y + r / 2); c.stroke();
        c.beginPath(); c.arc(e.x, e.y, r + 6, 0, Math.PI * 2); c.stroke();
      }
      c.restore();
    }
    if (s.hintTarget) {
      const d = s.chapter.differences[s.hintTarget.index];
      const radius = d.r + 14 + Math.sin(now / 150) * 4;
      c.save(); c.fillStyle = '#ffea9d22'; c.strokeStyle = '#fbe29a'; c.lineWidth = 4;
      c.shadowColor = '#ffe3a5'; c.shadowBlur = 16; c.setLineDash([9, 5]);
      c.beginPath(); c.arc(d.x, d.y, radius, 0, Math.PI * 2); c.fill(); c.stroke(); c.restore();
    }
    if (s.cursor.visible && s.cursor.side === side && s.mode === 'playing') {
      const { x, y } = s.cursor; c.save(); c.strokeStyle = '#fffbee'; c.lineWidth = 4;
      for (const width of [4, 1.5]) {
        c.lineWidth = width; c.strokeStyle = width === 4 ? '#fffbee' : '#244c3b';
        c.beginPath(); c.arc(x, y, 12, 0, Math.PI * 2); c.moveTo(x - 19, y); c.lineTo(x + 19, y);
        c.moveTo(x, y - 19); c.lineTo(x, y + 19); c.stroke();
      }
      c.restore();
    }
  }
  ui() {
    const s = this.state, e = this.elements;
    const second = Math.ceil(s.time);
    if (second !== this.lastSecond) {
      e.timer.textContent = `${String(Math.floor(second / 60)).padStart(2, '0')}:${String(second % 60).padStart(2, '0')}`;
      e.timer.classList.toggle('timer-urgent', second <= 20); this.lastSecond = second;
    }
    if (s.revision !== this.revision) {
      this.revision = s.revision;
      e.chapter.textContent = `CHAPTER 0${s.level + 1} / 03`;
      e['scene-name'].textContent = s.chapter.name;
      e.remaining.innerHTML = `${s.remaining} <em>/ ${s.chapter.differences.length}</em>`;
      e.score.textContent = String(s.score).padStart(4, '0');
      e.hints.textContent = `${s.hints} left`; e.hint.disabled = s.hints === 0 || s.mode !== 'playing';
      e.message.textContent = '✦  ' + s.message; e.difficulty.textContent = s.chapter.mood;
      e['found-chips'].innerHTML = s.chapter.differences.map((_, i) => `<span class="find-chip ${s.found.has(i) ? 'found' : ''}" aria-label="Difference ${i + 1}: ${s.found.has(i) ? 'found' : 'hidden'}">${s.found.has(i) ? '✓' : i + 1}</span>`).join('');
      e['level-track'].innerHTML = LEVELS.map((l, i) => `<div class="level-step ${i === s.level ? 'active' : i < s.level ? 'done' : ''}"><i>${i < s.level ? '✓' : '0' + (i + 1)}</i><span>${l.short}</span></div>`).join('');
    }
    if (s.mode !== this.lastMode) {
      const mode = s.mode; this.lastMode = mode; e.overlay.hidden = mode === 'playing';
      if (mode !== 'playing') {
        const won = mode === 'win', lost = mode === 'lose';
        e['result-eyebrow'].textContent = lost ? 'ANOTHER LOOK AWAITS' : won ? 'A WONDERFULLY KEEN EYE' : `CHAPTER 0${s.level + 1} COMPLETE`;
        e['result-symbol'].textContent = lost ? '☾' : '✦';
        e['result-title'].textContent = lost ? 'The moment slipped away.' : won ? 'You saw the little things.' : 'Every little secret, found.';
        e['result-description'].textContent = lost ? 'Some secrets need a second glance. Take a fresh walk through Riverlight.' : won ? 'Three worlds, twenty-four discoveries. Thank you for taking the time to notice.' : `A new scene awaits: ${LEVELS[Math.min(s.level + 1, 2)].name.toLowerCase()}.`;
        e['result-score'].textContent = `${s.score.toLocaleString('en-US')} points`;
        e.continue.textContent = lost || won ? 'Take another look  ↻' : 'On to the next chapter  →';
        e.continue.focus({ preventScroll: true });
      }
    }
  }
  draw(now) {
    this.prepare();
    this.contexts.forEach((c, side) => {
      c.clearRect(0, 0, WIDTH, HEIGHT); c.drawImage(this.backgrounds[side], 0, 0);
      let count = 0;
      for (const index of this.state.found) this.marker(c, this.state.chapter.differences[index], ++count, now);
      this.effects(c, side, now);
    });
    this.ui();
  }
}
