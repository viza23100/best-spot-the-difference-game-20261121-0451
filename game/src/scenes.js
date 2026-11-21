import { WIDTH, HEIGHT } from './config.js';

// Original, deterministic canvas illustrations. Each changed detail lives at a
// matching location in config.js; there are no images, fonts or borrowed assets.
const INK = '#42584c';
function path(c, points, fill, stroke = INK, width = 2) {
  c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
  c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.lineJoin = 'round'; c.stroke(); }
}
function ellipse(c, x, y, rx, ry, fill, stroke = null, width = 2) {
  c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fillStyle = fill; c.fill();
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
}
function rect(c, x, y, w, h, fill, stroke = null, radius = 0) {
  c.beginPath(); c.roundRect(x, y, w, h, radius); c.fillStyle = fill; c.fill();
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = 2; c.stroke(); }
}
function line(c, points, color = INK, width = 2) {
  c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
  c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
}
function curve(c, x, y, x1, y1, x2, y2, ex, ey, color, width = 2) {
  c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x1, y1, x2, y2, ex, ey);
  c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.stroke();
}
function gradient(c, top, bottom, y = 0, h = HEIGHT) {
  const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, top); g.addColorStop(1, bottom);
  rect(c, 0, y, WIDTH, h, g);
}
function cloud(c, x, y, scale = 1, color = '#fff2d6') {
  c.save(); c.translate(x, y); c.scale(scale, scale);
  c.beginPath(); c.moveTo(-50, 10); c.bezierCurveTo(-67, -8, -32, -18, -22, -13);
  c.bezierCurveTo(-17, -38, 22, -38, 32, -16); c.bezierCurveTo(52, -20, 67, -4, 53, 10);
  c.closePath(); c.fillStyle = color; c.fill(); c.restore();
}
function bush(c, x, y, size, color = '#78927b', dark = '#496954') {
  ellipse(c, x, y, size * 1.15, size * .72, dark);
  ellipse(c, x - size * .5, y - size * .38, size * .65, size * .62, color);
  ellipse(c, x + size * .38, y - size * .52, size * .68, size * .65, color);
  ellipse(c, x, y - size * .72, size * .66, size * .7, color);
  for (let i = 0; i < 5; i++) line(c, [[x - size * .7 + i * size * .35, y - size * .3], [x - size * .64 + i * size * .35, y - size * .4]], '#b4bd8b', 2);
}
function leaf(c, x, y, ex, ey, color = '#738965', size = 10) {
  const dx = ex - x, dy = ey - y, length = Math.hypot(dx, dy);
  const nx = -dy / length * size, ny = dx / length * size;
  c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + dx * .55 + nx, y + dy * .55 + ny, ex, ey);
  c.quadraticCurveTo(x + dx * .5 - nx, y + dy * .5 - ny, x, y); c.fillStyle = color; c.fill();
  line(c, [[x, y], [ex, ey]], '#425e45', 1);
}
function flower(c, x, y, size = 8, color = '#f3c367') {
  for (let i = 0; i < 5; i++) {
    const angle = i * Math.PI * 2 / 5 - Math.PI / 2;
    ellipse(c, x + Math.cos(angle) * size * .65, y + Math.sin(angle) * size * .65, size * .6, size * .6, color);
  }
  ellipse(c, x, y, size * .32, size * .32, '#a16e45');
}
function pot(c, x, y, width = 35, height = 32, color = '#c88364') {
  ellipse(c, x, y + height + 3, width * .68, 5, '#314d391c');
  path(c, [[x - width / 2, y], [x + width / 2, y], [x + width * .36, y + height], [x - width * .36, y + height]], color);
  rect(c, x - width / 2 - 3, y - 3, width + 6, 8, '#df9f79', INK, 2);
  line(c, [[x - width * .25, y + 10], [x - width * .2, y + height - 5]], '#ebb38b', 2);
}
function bird(c, x, y, color = INK) {
  curve(c, x - 13, y + 2, x - 10, y - 8, x - 3, y - 7, x, y, color, 2.5);
  curve(c, x, y, x + 4, y - 7, x + 11, y - 6, x + 14, y + 1, color, 2.5);
}
function reeds(c, x, y, scale = 1) {
  for (let i = 0; i < 5; i++) {
    const endX = x + (i - 2) * 12 * scale, endY = y - (24 + Math.sin(i * 3) * 15) * scale;
    curve(c, x, y, x + (i - 2) * 4, y - 20 * scale, endX - 4, endY, endX, endY, '#547b5f', 3 * scale);
  }
}
function palm(c, x, y, scale = 1) {
  c.save(); c.translate(x, y); c.scale(scale, scale);
  path(c, [[-8, 0], [4, 0], [6, -120], [-4, -150], [-10, -122]], '#b8a275', '#637658');
  for (let i = 0; i < 9; i++) line(c, [[-8, -i * 13 - 6], [5, -i * 13 - 11]], '#827e59', 2);
  const fronds = [[-92, -105], [-90, -158], [-59, -196], [-9, -210], [49, -190], [96, -143], [92, -104]];
  fronds.forEach(([ex, ey], n) => {
    curve(c, -2, -149, ex * .6, -194, ex * .9, ey - 15, ex, ey, '#486c53', 5);
    for (let i = 1; i <= 5; i++) {
      const t = i / 6, px = ex * t, py = -149 + (ey + 149) * t - Math.sin(t * Math.PI) * 28;
      leaf(c, px, py, px + (ex < 0 ? -12 : 12), py + 27 - n % 2 * 8, '#759371', 6);
    }
  });
  ellipse(c, -11, -145, 8, 9, '#b29b63', '#4b6550');
  ellipse(c, 2, -140, 8, 9, '#bfa56f', '#4b6550'); c.restore();
}
function texture(c) {
  c.save(); c.globalAlpha = .035;
  for (let i = 0; i < 1400; i++) {
    const x = (i * 163.17) % WIDTH, y = (i * 91.73 + i * i * .13) % HEIGHT;
    rect(c, x, y, 1, 1, i % 2 ? '#ffffff' : '#183c2a');
  }
  c.restore();
}

function river(c, changed) {
  gradient(c, '#f3d8b5', '#fcf0d3', 0, 325);
  ellipse(c, 562, 83, 32, 32, '#eccb8e');
  ellipse(c, 562, 83, 27, 27, changed ? '#edaa82' : '#efc366');
  cloud(c, 90, 69, .9); cloud(c, 310, 66, .75); cloud(c, 624, 155, .65);
  bird(c, 196, 108, '#87927b'); if (!changed) bird(c, 169, 119, '#87927b'); bird(c, 481, 97, '#87927b');
  path(c, [[0, 239], [49, 207], [99, 215], [156, 183], [215, 217], [278, 183], [336, 203], [392, 179], [457, 219], [541, 182], [609, 211], [720, 174], [720, 324], [0, 324]], '#c1c9a0', null);
  for (let i = 0; i < 9; i++) {
    const x = 26 + i * 84; rect(c, x, 248 - i % 3 * 9, 45, 48, '#a9b58a');
    path(c, [[x - 5, 248 - i % 3 * 9], [x + 22, 227 - i % 3 * 9], [x + 50, 248 - i % 3 * 9]], '#8f9f77', null);
    rect(c, x + 15, 264 - i % 3 * 9, 10, 13, '#c8ce9e');
  }
  bush(c, 56, 291, 51, '#9aa77f', '#738e72'); bush(c, 226, 298, 48, '#91a17a', '#738e72');
  gradient(c, '#83b7ac', '#a5c9b3', 309, 251);
  path(c, [[0, 305], [52, 292], [182, 294], [240, 319], [409, 306], [495, 321], [632, 302], [720, 311], [720, 332], [0, 330]], '#91a17b', null);
  for (let i = 0; i < 32; i++) {
    const x = (i * 117) % 700, y = 338 + (i * 37) % 199;
    line(c, [[x, y], [x + 14 + i % 4 * 12, y]], i % 3 ? '#c5ded0' : '#6da69b', 2);
  }
  ellipse(c, 433, 360, 139, 13, '#639c8c35');
  palm(c, 125, 317, .9); bush(c, 50, 314, 35); reeds(c, 173, 328, .7);
  // The little stilt cottage, its tiled roof and shaded veranda.
  [302, 347, 462, 509].forEach(x => { rect(c, x, 324, 9, 40, '#a08662', INK); line(c, [[x + 1, 358], [x + 8, 359]], '#d4c299'); });
  rect(c, 290, 214, 226, 115, '#efc58f', INK);
  rect(c, 290, 216, 15, 111, '#dfae7b'); rect(c, 504, 219, 12, 108, '#dca574');
  for (let y = 245; y < 322; y += 15) line(c, [[306, y], [502, y]], '#deb17f', 1);
  path(c, [[264, 213], [402, 123], [541, 213]], '#bd7057');
  path(c, [[275, 210], [403, 134], [527, 210]], '#d98e69', null);
  for (let y = 161; y < 210; y += 13) {
    const inset = (210 - y) * 1.57; line(c, [[280 + inset, y], [525 - inset, y]], '#a9604d', 2);
    for (let x = 299 + inset; x < 513 - inset; x += 23) line(c, [[x, y], [x - 7, y + 11]], '#b97454', 1);
  }
  line(c, [[267, 215], [539, 215]], '#735e47', 4);
  rect(c, 376, 262, 52, 66, '#4c7262', INK, 2); rect(c, 384, 268, 36, 53, '#678370');
  line(c, [[401, 270], [401, 319]], '#3d6253', 2); ellipse(c, 412, 295, 2, 2, '#e4c785');
  ellipse(c, 409, 230, 17, 17, '#efdaa5', INK);
  if (changed) path(c, [[409, 216], [423, 230], [409, 244], [395, 230]], '#62877b', INK, 1);
  else ellipse(c, 409, 230, 13, 13, '#62877b', INK, 1);
  line(c, [[397, 230], [421, 230]], '#d8c58f', 2); line(c, [[409, 218], [409, 242]], '#d8c58f', 2);
  rect(c, 312, 252, 39, 41, '#75968a', INK, 2); rect(c, 466, 252, 33, 41, '#75968a', INK, 2);
  [331, 482].forEach(x => { line(c, [[x, 253], [x, 291]], '#eed49b'); line(c, [[x - 16, 271], [x + 16, 271]], '#eed49b'); });
  rect(c, 308, 295, 48, 8, '#b77c60', INK, 2);
  rect(c, 460, 295, 45, 8, '#b77c60', INK, 2);
  [316, 329, 343, 465, 478, 492].forEach((x, i) => { leaf(c, x, 300, x + (i % 2 ? 9 : -8), 281, '#638260', 6); flower(c, x, 282, 3, '#e6b173'); });
  rect(c, 278, 328, 251, 13, '#bd986b', INK, 2); line(c, [[283, 333], [523, 333]], '#e4c99b');
  rect(c, 392, 342, 53, 10, '#b4936c', INK, 1); rect(c, 385, 352, 66, 8, '#c8aa7b', INK, 1);
  pot(c, 342, 318, 30, 20); line(c, [[342, 318], [342, 299]], '#638260');
  leaf(c, 342, 311, 325, 301, '#638260', 5); leaf(c, 342, 309, 355, 298, '#638260', 5);
  flower(c, 342, 309, 9, changed ? '#edbd59' : '#d58073');
  pot(c, 476, 315, 21, 15); reeds(c, 476, 314, .5);
  line(c, [[545, 289], [595, 282], [626, 298]], '#a89262', 2);
  rect(c, 543, 282, 3, 47, '#7b7757'); rect(c, 625, 290, 3, 40, '#7b7757');
  [563, 582, 602].forEach((x, i) => path(c, [[x, 287 - i * 2], [x + 13, 286 - i * 2], [x + 6, 303 - i * 2]], ['#e5b276', '#d08a69', '#d9c48e'][i], null));
  // River boat: the stripe is deliberately a small, localized change.
  ellipse(c, 554, 384, 77, 7, '#5c9e9160');
  path(c, [[475, 350], [630, 350], [608, 375], [500, 375]], '#c48c65');
  path(c, [[483, 351], [622, 351], [613, 358], [491, 358]], '#e7c395', null);
  rect(c, 534, 361, 34, 6, changed ? '#e9bc78' : '#4b827b', null, 2);
  line(c, [[505, 350], [572, 350]], '#6e6650', 3);
  line(c, [[544, 337], [595, 388]], '#887451', 4); ellipse(c, 595, 388, 5, 9, '#af8b60');
  bush(c, 698, 281, 62, '#789575', '#4e765c');
  path(c, [[683, 323], [696, 323], [686, 174], [677, 176]], '#8b8d62', INK);
  bush(c, 684, 180, 63, '#7e9c78', '#527b5c'); bush(c, 635, 202, 45, '#87a27b', '#638565');
  line(c, [[680, 245], [651, 252], [651, 260]], '#567753', 3);
  rect(c, 640, 261, 22, 28, changed ? '#90b6a0' : '#e9bd6f', INK, 4);
  rect(c, 640, 260, 22, 4, '#8b7654', INK, 1); line(c, [[651, 263], [651, 286]], '#ac8e60', 1);
  line(c, [[646, 292], [655, 292]], '#6c7452', 2);
  [[76, 387], [194, 463], [285, 470], [419, 424], [612, 469]].forEach(([x, y]) => { ellipse(c, x, y, 17, 5, '#698e67'); line(c, [[x, y], [x + 9, y + 1]], '#a9b47b'); });
  ellipse(c, 228, 450, 21, 6, '#6b966f');
  line(c, [[228, 440], [228, 449]], '#5a825c');
  if (!changed) flower(c, 228, 440, 9, '#f3dfba');
  path(c, [[0, 503], [72, 496], [144, 520], [220, 527], [319, 548], [428, 542], [566, 518], [637, 496], [720, 495], [720, 560], [0, 560]], '#b2b38a', null);
  path(c, [[0, 531], [107, 524], [233, 552], [503, 551], [630, 520], [720, 526], [720, 560], [0, 560]], '#d3c7a0', null);
  reeds(c, 30, 520, 1.3); reeds(c, 115, 537, .7); reeds(c, 683, 522, 1.2); reeds(c, 599, 542, .8);
  [47, 157, 182, 535, 554, 653].forEach((x, i) => ellipse(c, x, 544 + i % 2 * 7, 5 + i % 3, 3, '#a7a98a'));
  flower(c, 86, 527, 5, '#f4d088'); flower(c, 669, 526, 4, '#f4d088'); texture(c);
}

function lantern(c, x, y, color = '#edb679', size = 20) {
  line(c, [[x, y - size * 1.8], [x, y - size * .9]], '#6a635c', 1.5);
  c.save(); c.globalAlpha = .09; ellipse(c, x, y, size * 1.7, size * 1.7, '#ffe4ab'); c.restore();
  ellipse(c, x, y, size * .72, size, color, '#705849');
  curve(c, x - 3, y - size * .8, x - 8, y - size * .2, x - 8, y + size * .2, x - 3, y + size * .8, '#c7875c', 1);
  curve(c, x + 3, y - size * .8, x + 8, y - size * .2, x + 8, y + size * .2, x + 3, y + size * .8, '#c7875c', 1);
  rect(c, x - size * .45, y - size, size * .9, 4, '#8b6150', null, 1);
  rect(c, x - size * .45, y + size - 3, size * .9, 4, '#8b6150', null, 1);
  line(c, [[x, y + size], [x, y + size + 10]], '#e7b87c', 2);
}
function market(c, changed) {
  gradient(c, '#323c56', '#7b757b', 0, 390);
  for (let i = 0; i < 44; i++) {
    const x = (i * 101 + 47) % 710, y = 23 + (i * 43) % 183;
    ellipse(c, x, y, i % 6 === 0 ? 1.7 : 1, i % 6 === 0 ? 1.7 : 1, '#c5bdab');
  }
  ellipse(c, 573, 80, 21, 21, '#f1d59d');
  if (!changed) ellipse(c, 583, 74, 18, 18, '#3b445b');
  path(c, [[0, 289], [55, 204], [103, 236], [141, 181], [208, 257], [273, 222], [336, 278], [407, 190], [477, 252], [567, 193], [621, 219], [684, 182], [720, 231], [720, 415], [0, 415]], '#53635d', null);
  for (let i = 0; i < 7; i++) {
    const x = i * 119 - 10; rect(c, x, 270 - i % 2 * 18, 91, 132, '#5f7266');
    path(c, [[x - 7, 270 - i % 2 * 18], [x + 44, 235 - i % 2 * 18], [x + 98, 270 - i % 2 * 18]], '#475950', null);
    rect(c, x + 15, 290 - i % 2 * 18, 17, 24, '#bba876', null, 2); rect(c, x + 58, 290 - i % 2 * 18, 17, 24, '#bba876', null, 2);
  }
  gradient(c, '#b4a488', '#d4bba0', 404, 156);
  for (let i = 0; i < 29; i++) {
    const x = (i * 123) % 720, y = 420 + (i * 31) % 140;
    line(c, [[x, y], [x + 28 + i % 4 * 9, y]], '#a7967a', 1.5);
  }
  curve(c, 0, 72, 149, 154, 279, 159, 410, 105, '#293d36', 2);
  curve(c, 400, 104, 526, 167, 634, 126, 720, 67, '#293d36', 2);
  [[47, 106, 16], [139, 139, 17], [241, 146, 18], [340, 130, 17], [433, 132, 17], [543, 149, 16], [656, 119, 18]].forEach(([x, y, s], i) => lantern(c, x, y, i === 1 && changed ? '#92bdaf' : i % 3 ? '#edb779' : '#de9677', s));
  if (!changed) {
    line(c, [[494, 133], [494, 149]], '#e4d5a6', 1.5); line(c, [[486, 141], [502, 141]], '#e4d5a6', 1.5);
  }
  bush(c, 678, 409, 57, '#77927c', '#416653'); bush(c, 29, 382, 42, '#708973', '#446953');
  ellipse(c, 363, 452, 177, 22, '#665e5426');
  // The market stall: hand painted sign, striped awning, warm little shelves.
  rect(c, 208, 250, 321, 161, '#bf8e6c', INK);
  rect(c, 218, 262, 301, 98, '#6f6957');
  rect(c, 223, 275, 290, 5, '#e0b185'); rect(c, 223, 314, 290, 5, '#d5a17d');
  [236, 272, 311, 474, 498].forEach((x, i) => {
    rect(c, x, 289 - i % 2 * 8, 20, 24 + i % 2 * 8, i % 2 ? '#9da991' : '#d8b28c', '#645e4c', 4);
    rect(c, x + 1, 284 - i % 2 * 8, 18, 5, '#b7a57f', null, 2);
  });
  rect(c, 190, 349, 353, 18, '#e3ba8d', INK, 2); rect(c, 201, 369, 331, 49, '#c69170', INK);
  for (let x = 216; x < 524; x += 27) line(c, [[x, 373], [x, 411]], '#ac7e63', 1);
  rect(c, 212, 417, 15, 32, '#8c7459', INK); rect(c, 505, 417, 15, 32, '#8c7459', INK);
  line(c, [[201, 242], [201, 353]], '#82694f', 9); line(c, [[530, 242], [530, 353]], '#82694f', 9);
  path(c, [[188, 240], [232, 183], [504, 183], [546, 240]], '#749787');
  for (let i = 0; i < 9; i++) {
    const x = 193 + i * 39;
    path(c, [[x, 237], [232 + i * 30, 184], [247 + i * 30, 184], [x + 19, 237]], '#eed7a7', null);
  }
  for (let i = 0; i < 17; i++) {
    c.beginPath(); c.moveTo(190 + i * 21, 238); c.lineTo(211 + i * 21, 238);
    c.quadraticCurveTo(201 + i * 21, 260, 190 + i * 21, 238); c.fillStyle = i % 2 ? '#7b9b86' : '#e8cfa2'; c.fill();
  }
  line(c, [[188, 240], [548, 240]], '#4f6553', 2);
  line(c, [[347, 195], [347, 204]], '#74634f'); line(c, [[398, 195], [398, 204]], '#74634f');
  rect(c, 340, 203, 66, 29, '#e9cca0', '#7b684e', 5);
  c.fillStyle = '#6f7054'; c.font = 'bold 12px Georgia'; c.textAlign = 'center'; c.fillText('TEA', 373, 223);
  if (changed) ellipse(c, 373, 209, 3, 3, '#b77357'); else flower(c, 373, 210, 4, '#d39765');
  // Oranges are separate from the permanently present larger basket below.
  path(c, [[241, 321], [284, 321], [279, 336], [247, 336]], '#b19369', INK, 1);
  [[250, 317], [276, 317], [257, 326], [270, 326]].forEach(([x, y]) => ellipse(c, x, y, 7, 7, '#e6a45d', '#aa7b49', 1));
  if (!changed) { ellipse(c, 263, 309, 8, 8, '#efb263', '#aa7b49', 1); leaf(c, 263, 303, 270, 300, '#849163', 3); }
  path(c, [[304, 327], [367, 327], [360, 345], [311, 345]], '#b48c61', INK);
  [[313, 325], [328, 321], [344, 323], [358, 326]].forEach(([x, y], i) => { ellipse(c, x, y, 8, 7, '#edd1a0', '#ab9166', 1); line(c, [[x - 3, y], [x + 3, y]], '#c4a273', 1); });
  ellipse(c, 443, 341, 45, 6, '#ac8565');
  [421, 443, 465].forEach(x => { rect(c, x - 6, 330, 12, 11, '#e3d2b0', '#8b866e', 2); ellipse(c, x, 329, 7, 2, '#6c7b63'); });
  // A teapot on a stool in front of the stall.
  ellipse(c, 435, 426, 33, 5, '#6b625533'); rect(c, 418, 405, 39, 7, '#b48c66', INK, 2);
  line(c, [[423, 412], [420, 441]], '#836e50', 4); line(c, [[451, 412], [455, 441]], '#836e50', 4);
  ellipse(c, 432, 387, 16, 18, '#7da294', '#446a5a');
  path(c, [[419, 386], [402, 378], [405, 391], [419, 397]], '#7da294', '#446a5a');
  ellipse(c, 432, 371, 10, 3, '#a6be9e', '#446a5a', 1); ellipse(c, 432, 367, 3, 3, '#4c7766');
  if (!changed) { ellipse(c, 449, 387, 10, 12, '#7da294', '#446a5a'); ellipse(c, 449, 387, 5, 7, '#bda286'); }
  curve(c, 430, 355, 420, 345, 440, 347, 432, 335, '#f0ddaf80', 2);
  // The sleepy cat, a leafy pot, and baskets at the market's edges.
  ellipse(c, 587, 429, 37, 6, '#6b62552b');
  ellipse(c, 589, 408, 25, 17, '#dbb688', INK);
  curve(c, 608, 410, 634, 393, 635, 432, 609, 424, '#c28e67', 8);
  path(c, [[562, 394], [564, 376], [578, 385], [590, 377], [596, 396]], '#d8ab80');
  ellipse(c, 578, 396, 18, 16, '#dfb88b', INK);
  line(c, [[568, 395], [573, 397]], '#725f46', 1.5); line(c, [[584, 397], [589, 395]], '#725f46', 1.5);
  ellipse(c, 578, 402, 2, 2, '#a37b57'); line(c, [[563, 403], [552, 400]], '#7c7556', 1); line(c, [[593, 403], [604, 400]], '#7c7556', 1);
  if (!changed) rect(c, 580, 392, 5, 10, '#a47b58', null, 2);
  pot(c, 101, 412, 38, 34, '#aa8466');
  line(c, [[102, 411], [103, 370]], '#436b51', 3);
  leaf(c, 103, 388, 124, 371, '#7d9b76', 10); leaf(c, 103, 378, 92, 357, '#8aa980', 9);
  leaf(c, 103, 409, 122, 392, '#7d9b76', 9);
  if (!changed) leaf(c, 102, 400, 80, 379, '#8aa980', 10);
  ellipse(c, 161, 446, 28, 6, '#6b625526'); path(c, [[136, 413], [185, 413], [182, 442], [141, 442]], '#ad946a', INK);
  for (let x = 142; x < 183; x += 7) line(c, [[x, 417], [x + 2, 439]], '#d3b17b', 1);
  [143, 154, 164, 175].forEach((x, i) => ellipse(c, x, 411 - i % 2 * 5, 8, 9, '#dbad71', '#9d8057', 1));
  lantern(c, 646, 333, '#e0a36f', 23); line(c, [[645, 302], [645, 264]], '#394f3e', 4);
  path(c, [[0, 535], [95, 521], [169, 543], [269, 560], [0, 560]], '#8c9a77', null);
  path(c, [[575, 560], [637, 527], [720, 523], [720, 560]], '#8c9a77', null);
  reeds(c, 36, 550, .8); reeds(c, 682, 549, .9); flower(c, 61, 540, 4, '#ebca8b'); texture(c);
}

function arch(c, x, y, w, h, fill, stroke = INK, width = 2) {
  c.beginPath(); c.moveTo(x, y + h); c.lineTo(x, y + w / 2);
  c.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0);
  c.lineTo(x + w, y + h); c.closePath(); c.fillStyle = fill; c.fill();
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
}
function butterfly(c, x, y, color = '#d79b71') {
  ellipse(c, x - 6, y - 2, 6, 8, color); ellipse(c, x + 6, y - 2, 6, 8, color);
  ellipse(c, x - 4, y + 6, 4, 4, '#e6bc85'); ellipse(c, x + 4, y + 6, 4, 4, '#e6bc85');
  line(c, [[x, y - 6], [x, y + 8]], '#736e4e', 2);
}
function garden(c, changed) {
  gradient(c, '#dbe4c4', '#f2e6c5', 0, 400);
  cloud(c, 433, 71, 1, '#f7f0d9'); cloud(c, 161, 48, .75, '#f7f0d9');
  bush(c, 61, 132, 103, '#a9b68d', '#879f7c'); bush(c, 659, 128, 106, '#acba90', '#879f7c');
  rect(c, 0, 127, 720, 227, '#d7c7a1'); rect(c, 0, 127, 720, 12, '#e9ddba', '#aaaf8c');
  for (let i = 0; i < 6; i++) {
    const y = 156 + i * 34; line(c, [[0, y], [720, y]], '#c6b993', 1);
    for (let x = i % 2 ? 45 : 0; x < 720; x += 91) line(c, [[x, y], [x, y + 32]], '#c6b993', 1);
  }
  arch(c, 293, 147, 144, 208, '#bcc39c', '#9ea381', 10);
  arch(c, 304, 160, 122, 195, '#6c8e70', '#e9dfbc', 12);
  c.save(); arch(c, 310, 166, 110, 195, '#89a47f', null); c.clip();
  gradient(c, '#c3d1a6', '#a1b68b', 166, 195);
  bush(c, 338, 272, 41, '#90a479', '#738f67'); bush(c, 402, 260, 45, '#839e72', '#688762');
  path(c, [[355, 302], [379, 302], [430, 357], [312, 357]], '#d9d1ab', null); c.restore();
  // Nine small differences reward careful looking in the final courtyard.
  path(c, [[398, 156], [409, 149], [423, 172], [413, 179]], changed ? '#d6c4a0' : '#abbd9b', '#939f7b', 1);
  [26, 52, 691].forEach(x => rect(c, x, 142, 12, 209, '#e6d9b4', '#b5b18d'));
  rect(c, 0, 347, 720, 13, '#b3b790', '#929f78');
  path(c, [[0, 360], [720, 360], [720, 560], [0, 560]], '#b2bd8d', null);
  path(c, [[336, 356], [391, 356], [564, 560], [169, 560]], '#e1d6b1', null);
  for (let i = 0; i < 10; i++) {
    const y = 369 + i * 21, spread = (y - 350) * .7;
    line(c, [[365 - spread, y], [365 + spread, y]], '#c9c19e', 1);
    line(c, [[365 + (i % 2 ? 10 : -25), y], [365 + (i % 2 ? 10 : -25), y + 20]], '#c9c19e', 1);
  }
  // Climbing vines, espalier leaves, little terracotta pots.
  curve(c, 164, 353, 126, 271, 240, 242, 213, 143, '#6b855c', 5);
  [[171, 328, 143, 308], [167, 301, 192, 280], [183, 270, 165, 242], [203, 243, 231, 224], [216, 216, 194, 194], [213, 174, 196, 147]].forEach(([x, y, ex, ey]) => leaf(c, x, y, ex, ey, '#879d6d', 12));
  if (!changed) leaf(c, 214, 190, 236, 168, '#8fa777', 12);
  [143, 231, 196].forEach((x, i) => flower(c, x, 308 - i * 81, 6, '#e5bf84'));
  pot(c, 119, 256, 43, 44, '#c58e6a');
  if (!changed) line(c, [[103, 277], [135, 277]], '#f0ce9b', 4);
  line(c, [[119, 255], [114, 199]], '#688658', 3);
  leaf(c, 116, 219, 95, 203, '#7a9a66', 10); leaf(c, 115, 226, 139, 201, '#8fa772', 11);
  leaf(c, 118, 243, 94, 231, '#7a9a66', 11); leaf(c, 119, 248, 141, 231, '#8fa772', 11);
  flower(c, 114, 195, 8, '#ecd099');
  // A little wooden potting bench.
  rect(c, 74, 307, 122, 11, '#b59b70', INK, 2);
  [83, 181].forEach(x => { rect(c, x, 318, 7, 61, '#9d8d64', INK); });
  rect(c, 84, 354, 107, 7, '#bc9f71', INK);
  pot(c, 160, 282, 27, 25, '#d29a73'); reeds(c, 160, 280, .6);
  pot(c, 109, 333, 25, 19, '#b38762'); pot(c, 151, 331, 28, 21, '#cda379');
  line(c, [[192, 307], [207, 283]], '#8c8960', 3); ellipse(c, 209, 279, 5, 8, '#6a8260');
  // Birdbath, water, and the small bird whose wing changes.
  ellipse(c, 370, 377, 48, 8, '#52644425');
  path(c, [[350, 369], [359, 337], [361, 312], [382, 312], [384, 337], [392, 369]], '#a3ae8a', INK);
  ellipse(c, 371, 371, 31, 6, '#bcc3a0', INK);
  ellipse(c, 371, 306, 50, 12, '#d4d6b4', INK); ellipse(c, 371, 303, 45, 9, '#83b3a0');
  curve(c, 348, 302, 361, 299, 376, 309, 392, 301, '#c3ddbe', 2);
  ellipse(c, 373, 289, 12, 8, '#c69a72', INK, 1);
  ellipse(c, 383, 282, 6, 6, '#cfa57c', INK, 1); path(c, [[388, 282], [396, 284], [388, 286]], '#d4b780', null);
  path(c, [[362, 288], [350, 280], [354, 292]], '#9b845f', INK, 1);
  ellipse(c, 385, 281, 1.3, 1.3, '#3b5140'); line(c, [[373, 296], [371, 301]], '#6d7652', 1.5);
  if (!changed) ellipse(c, 371, 289, 6, 4, '#83997a');
  // Garden trellis with flowers.
  [497, 566].forEach(x => rect(c, x, 178, 5, 178, '#9da27a', '#748966', 1));
  for (let y = 191; y < 354; y += 24) line(c, [[496, y], [571, y]], '#8c9d73', 2);
  curve(c, 524, 352, 476, 279, 573, 242, 532, 188, '#6c895c', 4);
  [[521, 334, 544, 316], [516, 311, 494, 296], [526, 279, 550, 264], [541, 245, 520, 224], [540, 217, 558, 195]].forEach(([x, y, ex, ey]) => leaf(c, x, y, ex, ey, '#8ba572', 10));
  flower(c, 548, 262, 7, '#dc9f80'); flower(c, 520, 226, 6, '#e4b594');
  flower(c, 531, 299, 7, changed ? '#f0d18c' : '#dba18d');
  pot(c, 531, 341, 50, 42, '#c79770'); rect(c, 514, 354, 34, 4, '#e1b288');
  if (!changed) butterfly(c, 600, 201, '#d69e75');
  butterfly(c, 266, 109, '#d8b777');
  // Watering can beside the path.
  ellipse(c, 251, 439, 38, 5, '#50644125');
  rect(c, 227, 391, 38, 42, '#85a895', '#496951', 7);
  ellipse(c, 246, 391, 18, 5, '#9dbba2', '#496951');
  curve(c, 232, 398, 205, 373, 198, 426, 229, 419, '#567d60', 5);
  path(c, [[261, 410], [278, 394], [283, 399], [266, 421]], '#85a895', '#496951', 1.5);
  if (!changed) path(c, [[275, 391], [284, 389], [289, 397], [280, 401]], '#afc6a3', '#496951', 1.5);
  line(c, [[242, 400], [242, 425]], '#b6ccaa', 2);
  // Thick foliage framing the foreground.
  bush(c, 636, 415, 60, '#829f74', '#567e5a'); bush(c, 55, 422, 49, '#879c71', '#5c7d55');
  bush(c, 679, 494, 57, '#6e9169', '#4e7852'); bush(c, 40, 513, 53, '#759469', '#4e7852');
  reeds(c, 116, 463, 1.2); reeds(c, 584, 484, 1.4); reeds(c, 163, 523, 1.1);
  [37, 57, 80, 616, 649, 679].forEach((x, i) => flower(c, x, 401 + i % 3 * 18, 5, '#e9cb8e'));
  [[451, 437], [489, 476], [323, 489], [413, 522], [234, 544]].forEach(([x, y], i) => ellipse(c, x, y, 7 + i % 2 * 3, 4, '#b1b89a', '#909d7c', 1));
  if (!changed) ellipse(c, 519, 458, 9, 5, '#b1b89a', '#909d7c', 1);
  line(c, [[86, 453], [86, 466]], '#eee0b8', 4);
  if (!changed) { ellipse(c, 85, 451, 11, 6, '#c48b68', '#816f50', 1); ellipse(c, 82, 449, 2, 1.5, '#ebd6a7'); ellipse(c, 90, 452, 2, 1.5, '#ebd6a7'); }
  texture(c);
}

export function drawScene(canvas, level, changed) {
  canvas.width = WIDTH; canvas.height = HEIGHT;
  const context = canvas.getContext('2d');
  [river, market, garden][level](context, changed);
}
