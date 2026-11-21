import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { LEVELS } from '../game/src/config.js';

// Node standard library CDP client; screenshots come straight from Chrome.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = process.env.GAME_URL || 'http://127.0.0.1:4173';
const chromePath = '/home/hatch/workspace/ducat-chrome/cft/chrome-linux64/chrome';
const profile = mkdtempSync(resolve(tmpdir(), 'riverlight-chrome-'));
const chrome = spawn(chromePath, ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--metrics-recording-only', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--window-size=1280,900', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
let chromeErrors = '';
chrome.stderr.on('data', data => { chromeErrors = (chromeErrors + data.toString()).slice(-1800); });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
try {
  let port;
  for (let i = 0; i < 100 && !port; i++) {
    try { port = readFileSync(resolve(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]; } catch { await delay(100); }
  }
  if (!port) throw new Error('Chrome did not start: ' + chromeErrors);
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  let sequence = 0; const pending = new Map(); const errors = []; const requests = [];
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const promise = pending.get(message.id); pending.delete(message.id);
      if (message.error) promise.reject(new Error(message.error.message)); else promise.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text + ': ' + (message.params.exceptionDetails.exception?.description || ''));
    else if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map(a => a.value || a.description).join(' '));
    else if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') errors.push(message.params.entry.text);
    else if (message.method === 'Network.requestWillBeSent') requests.push(message.params.request.url);
  });
  function send(method, params = {}) {
    return new Promise((resolve, reject) => { const id = ++sequence; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
  }
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }
  async function until(expression, expected = true) {
    for (let i = 0; i < 60; i++) { const value = await evaluate(expression); if (value === expected) return value; await delay(50); }
    throw new Error('Timed out: ' + expression);
  }
  async function navigate(query = '') {
    await send('Page.navigate', { url: base + '/' + query });
    await until('document.readyState === "complete" && !!document.querySelector("#found-chips .find-chip")');
    await delay(100);
  }
  async function click(x, y, side = 'right') {
    const point = await evaluate(`(() => { const b = document.querySelector('#${side}').getBoundingClientRect(); return {x:b.left+${x}*b.width/720,y:b.top+${y}*b.height/560}; })()`);
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
    await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(true))))');
  }
  async function key(key, code = key) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code });
    await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(true))))');
  }
  const remaining = () => evaluate('Number(document.querySelector("#remaining").firstChild.textContent.trim())');
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable'); await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await navigate();
  assert.equal(await remaining(), 7);
  await delay(1100);
  assert.equal(await evaluate('document.querySelector("#timer").textContent'), '02:30', 'Timer waits for the first attempt');
  await click(409, 230, 'left'); assert.equal(await remaining(), 6);
  assert.equal(await evaluate('document.querySelector("#score").textContent'), '0100');
  await click(409, 230); assert.equal(await remaining(), 6, 'Repeated find does not score again');
  await click(30, 40);
  assert.equal(await evaluate('document.querySelector("#score").textContent'), '0075');
  assert.match(await evaluate('document.querySelector("#message").textContent'), /−3 seconds/);
  await key('h', 'KeyH'); assert.equal(await evaluate('document.querySelector("#hints").textContent'), '2 left');
  await key('h', 'KeyH'); await key('h', 'KeyH');
  assert.equal(await evaluate('document.querySelector("#hint").disabled'), true, 'Hints are limited');
  await key('h', 'KeyH'); assert.equal(await evaluate('document.querySelector("#hints").textContent'), '0 left');
  await key('r', 'KeyR'); assert.equal(await remaining(), 7);
  assert.equal(await evaluate('document.querySelector("#hints").textContent'), '3 left');
  // Keyboard finds the window: cursor begins at (360,280).
  await key('ArrowRight'); await key('ArrowRight'); await key('ArrowRight');
  await key('ArrowUp'); await key('ArrowUp'); await key('ArrowUp'); await key('Enter');
  assert.equal(await remaining(), 6, 'Arrow cursor and Enter find a difference');
  await key('r', 'KeyR');
  for (let level = 0; level < LEVELS.length; level++) {
    for (const d of LEVELS[level].differences) await click(d.x, d.y);
    assert.equal(await remaining(), 0);
    assert.equal(await evaluate('document.querySelector("#overlay").hidden'), false);
    if (level < 2) { await key('Enter'); assert.equal(await remaining(), LEVELS[level + 1].differences.length); }
  }
  assert.equal(await evaluate('document.querySelector("#result-title").textContent'), 'You saw the little things.');
  await key('r', 'KeyR'); assert.equal(await remaining(), 7);
  // Ordinary wrong attempts bring the clock near zero; let the real timer
  // expire rather than changing state or accelerating the game's clock.
  for (let i = 0; i < 49; i++) await click(30, 40);
  await until('document.querySelector("#result-title").textContent === "The moment slipped away."');
  assert.equal(await evaluate('document.querySelector("#timer").textContent'), '00:00');
  await key('r', 'KeyR'); assert.equal(await remaining(), 7);
  console.log('Play-test: mouse, keyboard, wrong guesses, limited hints, 3 chapters, win, loss, R restart PASS.');
  const shots = JSON.parse(readFileSync(resolve(root, 'shots.json'), 'utf8'));
  mkdirSync(resolve(root, 'screenshots'), { recursive: true });
  for (const shot of shots) {
    await navigate(shot.query);
    await delay(150);
    if (shot.name.startsWith('1-')) {
      assert.equal(await remaining(), 4, 'Cover retains four unfound differences');
      assert.equal(await evaluate('document.querySelectorAll(".find-chip.found").length'), 3);
      assert.equal(await evaluate('document.querySelector("#overlay").hidden'), true);
    }
    const result = await send('Page.captureScreenshot', { format: 'jpeg', quality: 89, fromSurface: true, captureBeyondViewport: false });
    const bytes = Buffer.from(result.data, 'base64'); assert.ok(bytes.length <= 262144, 'Screenshot byte cap');
    writeFileSync(resolve(root, 'screenshots', shot.name), bytes);
    console.log(`Screenshot: screenshots/${shot.name} ${bytes.length} bytes (1280 × 900).`);
  }
  assert.deepEqual(errors, [], 'Browser must have zero console errors');
  assert.equal(requests.filter(url => !url.startsWith(base) && !url.startsWith('data:')).length, 0, 'All runtime requests remain local');
  console.log(`Chrome console errors: ${errors.length}. External game requests: 0.`);
} finally {
  if (socket) socket.close(); chrome.kill(); await delay(300);
  rmSync(profile, { recursive: true, force: true });
}
