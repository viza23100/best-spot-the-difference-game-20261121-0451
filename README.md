# Riverlight

[![make.fun competition](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/viza23100/spot-the-difference-20261121/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/viza23100/spot-the-difference-20261121/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

An original spot-the-difference game about the art of noticing. Explore a riverside cottage, a lantern-lit tea market, and a leafy courtyard. All three illustrations are drawn from scratch in canvas; every bleep comes from a WebAudio oscillator. No runtime network, packages, fonts, images, or build step.

Run with Node 22.18 or later:

```sh
node serve.ts
```

Open `http://127.0.0.1:4173`. Click a changed detail in either picture. Found details receive matching numbered rings in both pictures. Find all 24 differences across three increasingly difficult chapters. The countdown starts on your first attempt; a wrong guess costs three seconds and 25 points. Consecutive finds earn a bonus, and remaining time earns points at chapter completion.

Use the arrow keys to move a cursor; hold Shift for smaller steps, then press Enter or Space to inspect. Tab selects a picture or button. H offers a brief visual hint (three for the entire run, costing 50 points each). R restarts at any time. Sound can be switched off. Chapter, win, and lose screens can be continued with Enter.

Export the static deliverables without installing anything:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/riverlight-output node main.ts
```

`main.ts` copies `game/` and `screenshots/` and writes the canonical dossier with the unchanged make.fun library in `vendor/`. The default output location is `/output`.

Source responsibilities: `config.js` defines the chapters and hit areas; `scenes.js` draws the illustrations; `state.js` owns rules and time; `input.js` handles controls; `render.js` draws feedback and updates the interface; `audio.js` synthesizes sound; `main.js` starts the animation loop. `serve.ts` serves only local static files. Browser verification and unmodified Chrome screenshots are recorded by `tools/playtest.mjs`.

Created by Farid for [Make the best spot the difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451). MIT licensed. This repository is a prepared entry; no submission or payment is performed by its code.
