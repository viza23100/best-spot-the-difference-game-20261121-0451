import { WIDTH, HEIGHT } from './config.js';

export function bindInput(state, sound, canvases) {
  canvases.forEach((canvas, side) => {
    canvas.addEventListener('pointerdown', event => {
      const bounds = canvas.getBoundingClientRect();
      const x = (event.clientX - bounds.left) * WIDTH / bounds.width;
      const y = (event.clientY - bounds.top) * HEIGHT / bounds.height;
      state.cursor.visible = false;
      state.inspect(x, y, side);
      canvas.focus({ preventScroll: true });
    });
  });
  document.querySelector('#hint').addEventListener('click', () => state.hint());
  document.querySelector('#continue').addEventListener('click', () => state.next());
  document.querySelector('#sound').addEventListener('click', event => {
    const enabled = sound.toggle();
    event.currentTarget.innerHTML = `Sound ${enabled ? 'on' : 'off'} <span>♪</span>`;
    event.currentTarget.setAttribute('aria-pressed', String(enabled));
  });
  window.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const key = event.key.toLowerCase();
    if (key === 'r') { event.preventDefault(); sound.unlock(); state.reset(); return; }
    if (key === 'h') { event.preventDefault(); state.hint(); return; }
    if (state.mode !== 'playing') {
      if (key === 'enter' || key === ' ') { event.preventDefault(); state.next(); }
      return;
    }
    const movements = { arrowleft: [-1, 0], arrowright: [1, 0], arrowup: [0, -1], arrowdown: [0, 1] };
    if (movements[key]) {
      event.preventDefault(); sound.unlock(); state.cursor.visible = true;
      const move = movements[key]; const step = event.shiftKey ? 6 : 18;
      state.cursor.x = Math.max(6, Math.min(WIDTH - 6, state.cursor.x + move[0] * step));
      state.cursor.y = Math.max(6, Math.min(HEIGHT - 6, state.cursor.y + move[1] * step));
      state.cursor.side = document.activeElement === canvases[0] ? 0 : 1;
      canvases[state.cursor.side].focus({ preventScroll: true });
    } else if ((key === 'enter' || key === ' ') && !['BUTTON', 'A'].includes(document.activeElement.tagName)) {
      event.preventDefault(); state.cursor.visible = true;
      state.inspect(state.cursor.x, state.cursor.y, state.cursor.side);
    }
  });
}
