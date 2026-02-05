/**
 * Отрисовка одного большого аквариума: вода, дно, водоросли, пузыри, рыбы (Kenney).
 */

import {
  loadSpritesheet,
  getSheetImage,
  drawSprite,
  SPRITES,
  FISH_SPRITE_NAMES,
  FISH_SKELETON_NAMES,
} from './sprites.js';

const FISH_SCALE = 1.2;
const BUBBLE_SCALE = 0.5;
const SEAWEED_SCALE = 1.2;

/** Состояние одной рыбы на экране */
export function createFishView(id, spriteIndex, x, y, dir = 1) {
  return { id, spriteIndex, x, y, dir, vx: 0, vy: 0 };
}

let canvas, ctx;
let bubbles = [];
let seaweedPositions = [];
let animationTime = 0;

export function initAquarium(canvasEl) {
  canvas = canvasEl;
  ctx = canvas.getContext('2d');
  // Позиции водорослей по дну
  const tw = 64 * SEAWEED_SCALE;
  const count = Math.ceil(canvas.width / tw) + 2;
  seaweedPositions = [];
  for (let i = 0; i < count; i++) {
    seaweedPositions.push({
      x: i * tw * 0.8 - tw * 0.5,
      sprite: ['background_seaweed_a', 'background_seaweed_b', 'background_seaweed_c', 'background_seaweed_d'][i % 4],
    });
  }
  // Пузыри
  for (let i = 0; i < 12; i++) {
    bubbles.push({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 80,
      speed: 0.4 + Math.random() * 0.6,
      size: 0.3 + Math.random() * 0.4,
      sprite: ['bubble_a', 'bubble_b', 'bubble_c'][i % 3],
    });
  }
}

function drawWater() {
  const t = animationTime * 0.015;
  const drift = Math.sin(t) * 0.03 + Math.sin(t * 0.7) * 0.02;
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, '#071c2e');
  g.addColorStop(0.2 + drift, '#0c3d52');
  g.addColorStop(0.45 + drift * 0.5, '#065872');
  g.addColorStop(0.7, '#064d68');
  g.addColorStop(1, '#052d42');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSandBottom() {
  const tileW = 64;
  const tileH = 64;
  const rows = Math.ceil(canvas.height / tileH) + 1;
  const cols = Math.ceil(canvas.width / tileW) + 1;
  const sandSprites = ['terrain_sand_top_a', 'terrain_sand_top_b', 'terrain_sand_top_c', 'terrain_sand_top_d', 'terrain_sand_top_e', 'terrain_sand_top_f', 'terrain_sand_top_g', 'terrain_sand_top_h'];
  for (let row = rows - 2; row <= rows + 1; row++) {
    for (let col = 0; col <= cols + 1; col++) {
      const name = sandSprites[(row + col) % sandSprites.length];
      const s = SPRITES[name];
      if (!s || !getSheetImage()) continue;
      ctx.drawImage(getSheetImage(), s.x, s.y, s.w, s.h, col * tileW, row * tileH, tileW, tileH);
    }
  }
}

function drawSeaweed() {
  const baseY = canvas.height - 64 * SEAWEED_SCALE;
  seaweedPositions.forEach(({ x, sprite }, i) => {
    const sway = Math.sin(animationTime * 0.02 + i * 0.7) * 4;
    drawSprite(ctx, sprite, x + sway, baseY, SEAWEED_SCALE);
  });
}

function updateAndDrawBubbles() {
  bubbles.forEach(b => {
    b.y -= b.speed;
    if (b.y < -40) {
      b.y = canvas.height + Math.random() * 40;
      b.x = Math.random() * canvas.width;
    }
    drawSprite(ctx, b.sprite, b.x, b.y, BUBBLE_SCALE * b.size);
  });
}

/** Форма аквариума — эллипс «пузырь» (обрезка по стеклу) */
function clipToAquariumShape() {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2 - 24;
  const ry = h / 2 - 24;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.clip();
}

/** Имя рыбки над ней (движется вместе с рыбкой), снизу — шкала здоровья */
function drawFishName(fish) {
  const name = fish.displayName || '';
  if (!name) return;
  const x = fish.x;
  const y = fish.y - (64 * FISH_SCALE) / 2 - 38;
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillStyle = fish.dead ? 'rgba(180,190,200,0.9)' : 'rgba(255,255,255,0.95)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, x, y);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

/** Рисует шкалу здоровья под именем (движется вместе с рыбкой) */
function drawHealthBar(fish) {
  const segments = 3;
  const barW = 44;
  const barH = 8;
  const x = fish.x - barW / 2;
  const y = fish.y - (64 * FISH_SCALE) / 2 - 20;
  const reserve = Math.max(0, Math.min(segments, fish.foodReserve ?? 0));
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  ctx.fillStyle = 'rgba(20,30,50,0.7)';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, barW, barH, 4) : ctx.rect(x, y, barW, barH);
  ctx.fill();
  ctx.stroke();
  const segW = (barW - 4) / segments - 2;
  for (let i = 0; i < segments; i++) {
    const sx = x + 4 + i * (segW + 2);
    if (i < reserve) {
      ctx.fillStyle = fish.dead ? '#94a3b8' : '#4ade80';
    } else {
      ctx.fillStyle = reserve === 0 && !fish.dead ? '#f87171' : 'rgba(60,80,100,0.8)';
    }
    ctx.fillRect(sx, y + 2, segW, barH - 4);
  }
}

/** Маленькая подпись статуса под именем (думает / ответил · N) */
function drawStatusLabel(fish) {
  const status = fish.statusLabel;
  if (!status) return;
  const x = fish.x;
  const y = fish.y - (64 * FISH_SCALE) / 2 - 28;
  ctx.font = '10px system-ui, sans-serif';
  let text = status === 'answered' ? 'answered' : 'thinking';
  if (status === 'answered' && fish.votes != null && fish.votes > 0) {
    text += ` · ${fish.votes}`;
  }
  ctx.fillStyle = 'rgba(160,180,210,0.9)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

/**
 * Отрисовка аквариума и рыб.
 * fishViews: у каждой { x, y, dir, dead, spriteIndex, foodReserve, statusLabel: 'thinking'|'answered'|null }
 */
export function renderAquarium(state) {
  if (!ctx || !canvas) return;
  animationTime += 1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  clipToAquariumShape();

  drawWater();
  drawSandBottom();
  drawSeaweed();

  const fishViews = state?.fishViews ?? [];
  fishViews.forEach(fish => {
    const dx = fish.x - (64 * FISH_SCALE) / 2;
    const dy = fish.y - (64 * FISH_SCALE) / 2;
    const spriteName = fish.dead
      ? (FISH_SKELETON_NAMES[fish.spriteIndex] || FISH_SPRITE_NAMES[fish.spriteIndex])
      : FISH_SPRITE_NAMES[fish.spriteIndex];
    drawSprite(ctx, spriteName, dx, dy, FISH_SCALE, fish.dir < 0);
    drawFishName(fish);
    drawStatusLabel(fish);
    drawHealthBar(fish);
  });

  updateAndDrawBubbles();

  ctx.restore();
}

/**
 * Зона плавания — внутренний эллипс, чтобы имя и шкала здоровья над рыбкой не обрезались краем аквариума.
 * Имя/бар занимают ~55px над центром рыбки, ~45 по бокам.
 */
const SWIM_MARGIN_TOP = 58;
const SWIM_MARGIN_SIDE = 48;

/**
 * Обновление позиций рыб: плывут от одной стороны к другой внутри зоны, где видно имя и шкалу.
 */
export function updateFishPositions(fishViews, dt = 1) {
  const w = canvas ? canvas.width : 1280;
  const h = canvas ? canvas.height : 720;
  const cx = w / 2;
  const cy = h / 2;
  const rxFull = w / 2 - 50;
  const ryFull = h / 2 - 50;
  const rx = Math.max(40, rxFull - SWIM_MARGIN_SIDE);
  const ry = Math.max(40, ryFull - SWIM_MARGIN_TOP);
  fishViews.forEach(fish => {
    if (fish.dead) return;
    fish.x += (fish.vx || 0) * dt;
    fish.y += (fish.vy || 0) * dt;
    const dx = (fish.x - cx) / rx;
    const dy = (fish.y - cy) / ry;
    const inSwimZone = dx * dx + dy * dy <= 1;
    if (!inSwimZone) {
      const angle = Math.atan2(dy * ry, dx * rx);
      fish.x = cx + Math.cos(angle) * rx * 0.99;
      fish.y = cy + Math.sin(angle) * ry * 0.99;
      fish.vx = -(fish.vx || 0.3);
      fish.vy = (fish.vy || 0) * 0.5 + (Math.random() - 0.5) * 0.06;
      fish.dir = fish.vx > 0 ? 1 : -1;
    }
  });
}

export function getCanvasSize() {
  return canvas ? { width: canvas.width, height: canvas.height } : { width: 1280, height: 720 };
}

export { loadSpritesheet };
