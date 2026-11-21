// Every sound is made here with oscillators. No audio assets or requests.
export class Sound {
  constructor() { this.enabled = true; this.context = null; }
  unlock() {
    if (!this.enabled) return;
    this.context ||= new (window.AudioContext || window.webkitAudioContext)();
    if (this.context.state === 'suspended') this.context.resume();
  }
  tone(frequency, delay = 0, duration = .13, shape = 'sine', volume = .055) {
    if (!this.enabled || !this.context) return;
    const t = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = shape;
    oscillator.frequency.setValueAtTime(frequency, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + .012);
    gain.gain.exponentialRampToValueAtTime(.001, t + duration);
    oscillator.connect(gain); gain.connect(this.context.destination);
    oscillator.start(t); oscillator.stop(t + duration + .02);
  }
  play(event) {
    this.unlock();
    if (event === 'find') [659, 880, 1319].forEach((f, i) => this.tone(f, i * .075, .2));
    if (event === 'wrong') { this.tone(175, 0, .14, 'triangle', .04); this.tone(131, .1, .18, 'triangle', .04); }
    if (event === 'hint') [523, 784].forEach((f, i) => this.tone(f, i * .14, .28));
    if (event === 'complete') [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * .12, .4));
    if (event === 'lose') [330, 294, 220].forEach((f, i) => this.tone(f, i * .18, .3, 'triangle'));
  }
  toggle() { this.enabled = !this.enabled; if (this.enabled) this.unlock(); return this.enabled; }
}
