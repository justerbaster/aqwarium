/**
 * Kenney Fish Pack — спрайты из spritesheet (64×64 тайлы).
 * Путь относительно index.html.
 */
const SPRITESHEET_PATH = 'kenney_fish-pack_2/Spritesheet/spritesheet.png';

/** Позиции в spritesheet.png (x, y, w, h) — из spritesheet.xml */
export const SPRITES = {
  fish_blue:        { x: 576, y: 128, w: 64, h: 64 },
  fish_blue_skeleton: { x: 576, y: 0,   w: 64, h: 64 },
  fish_brown:       { x: 512, y: 640, w: 64, h: 64 },
  fish_brown_outline: { x: 512, y: 576, w: 64, h: 64 },
  fish_green:       { x: 512, y: 512, w: 64, h: 64 },
  fish_green_skeleton: { x: 512, y: 384, w: 64, h: 64 },
  fish_orange:      { x: 448, y: 640, w: 64, h: 64 },
  fish_orange_skeleton: { x: 448, y: 512, w: 64, h: 64 },
  fish_pink:        { x: 448, y: 384, w: 64, h: 64 },
  fish_pink_skeleton: { x: 448, y: 256, w: 64, h: 64 },
  fish_red:         { x: 448, y: 128, w: 64, h: 64 },
  fish_red_skeleton: { x: 448, y: 0,   w: 64, h: 64 },
  background_seaweed_a: { x: 640, y: 192, w: 64, h: 64 },
  background_seaweed_b: { x: 640, y: 128, w: 64, h: 64 },
  background_seaweed_c: { x: 640, y: 64, w: 64, h: 64 },
  background_seaweed_d: { x: 640, y: 0, w: 64, h: 64 },
  background_seaweed_e: { x: 576, y: 704, w: 64, h: 64 },
  background_seaweed_f: { x: 576, y: 640, w: 64, h: 64 },
  bubble_a: { x: 576, y: 320, w: 64, h: 64 },
  bubble_b: { x: 576, y: 256, w: 64, h: 64 },
  bubble_c: { x: 576, y: 192, w: 64, h: 64 },
  terrain_sand_top_a: { x: 64, y: 192, w: 64, h: 64 },
  terrain_sand_top_b: { x: 64, y: 64, w: 64, h: 64 },
  terrain_sand_top_c: { x: 0, y: 704, w: 64, h: 64 },
  terrain_sand_top_d: { x: 0, y: 576, w: 64, h: 64 },
  terrain_sand_top_e: { x: 0, y: 448, w: 64, h: 64 },
  terrain_sand_top_f: { x: 0, y: 320, w: 64, h: 64 },
  terrain_sand_top_g: { x: 0, y: 192, w: 64, h: 64 },
  terrain_sand_top_h: { x: 0, y: 64, w: 64, h: 64 },
  terrain_sand_a: { x: 64, y: 448, w: 64, h: 64 },
  terrain_sand_b: { x: 64, y: 384, w: 64, h: 64 },
  rock_a: { x: 320, y: 448, w: 64, h: 64 },
  rock_b: { x: 320, y: 320, w: 64, h: 64 },
};

/** Имена спрайтов рыб для 5 агентов (живые и скелет) */
export const FISH_SPRITE_NAMES = [
  'fish_blue',
  'fish_brown',
  'fish_green',
  'fish_orange',
  'fish_pink',
];

export const FISH_SKELETON_NAMES = [
  'fish_blue_skeleton',
  'fish_brown_outline', // у brown нет skeleton в паке — используем outline как "больной"
  'fish_green_skeleton',
  'fish_orange_skeleton',
  'fish_pink_skeleton',
];

let sheetImage = null;

export function getSpritesheetPath() {
  return SPRITESHEET_PATH;
}

export function loadSpritesheet() {
  return new Promise((resolve, reject) => {
    if (sheetImage) {
      resolve(sheetImage);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      sheetImage = img;
      resolve(img);
    };
    img.onerror = () => reject(new Error('Failed to load spritesheet: ' + SPRITESHEET_PATH));
    img.src = SPRITESHEET_PATH;
  });
}

export function getSheetImage() {
  return sheetImage;
}

export function drawSprite(ctx, name, dx, dy, scale = 1, flipH = false) {
  const s = SPRITES[name];
  if (!s || !sheetImage) return;
  const w = s.w * scale;
  const h = s.h * scale;
  ctx.save();
  if (flipH) {
    ctx.translate(dx + w, dy);
    ctx.scale(-1, 1);
    ctx.drawImage(sheetImage, s.x, s.y, s.w, s.h, 0, 0, w, h);
  } else {
    ctx.drawImage(sheetImage, s.x, s.y, s.w, s.h, dx, dy, w, h);
  }
  ctx.restore();
}
