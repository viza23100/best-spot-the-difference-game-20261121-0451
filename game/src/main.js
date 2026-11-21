import { Sound } from './audio.js';
import { GameState } from './state.js';
import { Renderer } from './render.js';
import { bindInput } from './input.js';
import { stageShot } from './shots.js';

const sound = new Sound();
const state = new GameState(sound);
const canvases = [document.getElementById('left'), document.getElementById('right')];
const renderer = new Renderer(state, canvases);
bindInput(state, sound, canvases);
const shot = new URLSearchParams(location.search).get('shot');
if (shot) stageShot(shot, state);
function frame(now) {
  if (!shot) state.tick(now);
  renderer.draw(now); requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
