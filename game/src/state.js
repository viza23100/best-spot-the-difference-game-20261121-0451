import { LEVELS, HINTS, WIDTH, HEIGHT } from './config.js';

export class GameState {
  constructor(sound) { this.sound = sound; this.reset(); }
  reset() {
    this.level = 0; this.score = 0; this.hints = HINTS; this.streak = 0;
    this.cursor = { x: WIDTH / 2, y: HEIGHT / 2, visible: false, side: 1 };
    this.loadLevel();
  }
  get chapter() { return LEVELS[this.level]; }
  get remaining() { return this.chapter.differences.length - this.found.size; }
  loadLevel() {
    this.mode = 'playing'; this.found = new Set(); this.effects = [];
    this.hintTarget = null; this.started = false; this.time = this.chapter.seconds;
    this.lastTick = performance.now(); this.message = 'The timer starts when you explore. Click either picture.';
    this.cursor.visible = false; this.revision = (this.revision || 0) + 1;
  }
  start() { if (!this.started) { this.started = true; this.lastTick = performance.now(); } }
  inspect(x, y, side = 1) {
    if (this.mode !== 'playing') return;
    this.sound.unlock(); this.start();
    const index = this.chapter.differences.findIndex(d => Math.hypot(x - d.x, y - d.y) <= d.r);
    if (index >= 0 && this.found.has(index)) { this.message = 'Already found. There are more little secrets to discover.'; this.revision++; return; }
    if (index >= 0) {
      this.found.add(index); this.streak++;
      const d = this.chapter.differences[index];
      const points = 100 + Math.min(this.streak - 1, 4) * 25;
      this.score += points;
      this.effects.push({ type: 'find', x: d.x, y: d.y, points, at: performance.now() });
      this.hintTarget = null; this.message = `${d.name}. Beautifully spotted!`;
      this.sound.play('find');
      if (!this.remaining) {
        this.score += Math.ceil(this.time) * 2;
        this.mode = this.level === LEVELS.length - 1 ? 'win' : 'chapter';
        this.message = 'Every secret found. Take a breath.'; this.sound.play('complete');
      }
    } else {
      this.streak = 0; this.score = Math.max(0, this.score - 25); this.time = Math.max(0, this.time - 3);
      this.effects.push({ type: 'wrong', x, y, side, at: performance.now() });
      this.message = 'A little too quick. −3 seconds. Take another look.'; this.sound.play('wrong');
      if (this.time === 0) this.lose();
    }
    this.revision++;
  }
  hint() {
    if (this.mode !== 'playing') return;
    this.sound.unlock();
    if (!this.hints) { this.message = 'All three hints used. Trust your eyes.'; this.revision++; return; }
    this.start(); this.hints--; this.streak = 0; this.score = Math.max(0, this.score - 50);
    const index = this.chapter.differences.findIndex((_, i) => !this.found.has(i));
    this.hintTarget = { index, until: performance.now() + 2600 };
    this.message = 'Follow the golden glow. A hint costs 50 points.'; this.sound.play('hint'); this.revision++;
  }
  next() {
    if (this.mode === 'chapter') { this.level++; this.loadLevel(); }
    else if (this.mode === 'win' || this.mode === 'lose') this.reset();
  }
  lose() { this.mode = 'lose'; this.time = 0; this.message = 'The moment slipped away. Another look awaits.'; this.sound.play('lose'); this.revision++; }
  tick(now) {
    if (this.mode === 'playing' && this.started) {
      this.time = Math.max(0, this.time - (now - this.lastTick) / 1000);
      if (this.time === 0) this.lose();
    }
    this.lastTick = now;
    this.effects = this.effects.filter(e => now - e.at < (e.type === 'find' ? 1000 : 650));
    if (this.hintTarget && now > this.hintTarget.until) this.hintTarget = null;
  }
}
