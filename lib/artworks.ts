import type { Artwork } from "./types";

const COLS = 5;
const ITEMS_PER_COL = 3;
const COL_GAP = 520;
const ROW_GAP = 240;
const COL_LANE = 300;

/** Odd columns shift down for a brick bond rhythm */
const BRICK_OFFSET = 320;

function ph(id: string, w: number, h: number) {
  return `https://picsum.photos/seed/beshta-${id}/${w}/${h}`;
}

const meta = [
  ["Untitled (Horizon)", "Agnes Marin", "2019", "Oil on linen", "180 × 140 cm"],
  ["Field Notes IV", "Henrik Voss", "2021", "Pigment and wax on panel", "120 × 200 cm"],
  ["Interior Silence", "Elena Kuroda", "2018", "Acrylic on canvas", "160 × 120 cm"],
  ["Chromatic Drift", "Marco Alves", "2022", "Oil and cold wax", "200 × 160 cm"],
  ["Study in White", "Claire Dubois", "2017", "Gesso and graphite on board", "90 × 90 cm"],
  ["After Rain", "Jonas Meier", "2020", "Watercolor on paper", "70 × 100 cm"],
  ["Monolith (Blue)", "Sofia Berg", "2023", "Ultramarine on canvas", "220 × 180 cm"],
  ["Composition 12", "Lars Nilsson", "2016", "Mixed media on linen", "150 × 220 cm"],
  ["Veil", "Mira Okonkwo", "2024", "Charcoal on cotton", "130 × 190 cm"],
  ["Nocturne", "Thomas Reid", "2015", "Oil on canvas", "110 × 150 cm"],
  ["Passage", "Yuki Tanaka", "2020", "Ink on rice paper", "100 × 140 cm"],
  ["Red Interval", "Ana Costa", "2023", "Acrylic and sand", "190 × 130 cm"],
  ["Still (Winter)", "Peter Hahn", "2018", "Tempera on panel", "80 × 80 cm"],
  ["Echo Chamber", "Rosa Vega", "2021", "Photograph, archival print", "150 × 100 cm"],
  ["Threshold", "Omar Khalil", "2024", "Graphite on plaster", "170 × 110 cm"],
] as const;

const descriptions = [
  "A restrained study in atmospheric distance. The surface holds light as if breathing slowly.",
  "Horizontal bands of muted earth tones suggest a landscape remembered rather than observed.",
  "Architectural voids and a single vertical gesture. The composition refuses narrative.",
  "Color moves across the plane in slow tides. The work rewards prolonged viewing.",
  "An almost imperceptible relief catches light at oblique angles.",
  "Translucent washes accumulate into a quiet luminosity.",
  "A single vertical mass anchors the field. Blue deepens toward the base.",
  "Geometric intervals breathe within a warm ground.",
  "Layers of charcoal are lifted and reapplied until the surface resembles stone.",
  "Dark values hold a faint warmth at the center.",
  "A narrow corridor of negative space divides two muted fields.",
  "Oxide red sits against raw linen. The edge remains deliberately unfinished.",
  "A square of winter light, barely differentiated from its ground.",
  "Documentary silence rendered as large-format stillness.",
  "Plaster dust and graphite merge at the boundary between wall and image.",
];

const sizes: { width: number; height: number }[] = [
  { width: 210, height: 290 },
  { width: 280, height: 205 },
  { width: 230, height: 275 },
  { width: 270, height: 215 },
  { width: 185, height: 185 },
  { width: 175, height: 255 },
  { width: 240, height: 300 },
  { width: 255, height: 225 },
  { width: 245, height: 205 },
  { width: 195, height: 275 },
  { width: 205, height: 245 },
  { width: 285, height: 200 },
  { width: 165, height: 165 },
  { width: 275, height: 195 },
  { width: 235, height: 225 },
];

type Layout = { x: number; y: number; width: number; height: number };

function buildBrickColumnLayouts(): Layout[] {
  const layouts: Layout[] = new Array(sizes.length);
  let cursorX = 0;

  for (let col = 0; col < COLS; col++) {
    const indices: number[] = [];
    for (let row = 0; row < ITEMS_PER_COL; row++) {
      const index = col + row * COLS;
      if (index < sizes.length) indices.push(index);
    }

    const laneW = Math.max(COL_LANE, ...indices.map((i) => sizes[i].width));

    let y = col % 2 === 1 ? 0 : BRICK_OFFSET;

    for (const index of indices) {
      const { width, height } = sizes[index];
      layouts[index] = {
        x: cursorX + (laneW - width) / 2,
        y,
        width,
        height,
      };
      y += height + ROW_GAP;
    }

    cursorX += laneW + COL_GAP;
  }

  const totalW = cursorX - COL_GAP;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const layout of layouts) {
    if (!layout) continue;
    minY = Math.min(minY, layout.y);
    maxY = Math.max(maxY, layout.y + layout.height);
  }

  const totalH = maxY - minY;
  const offsetX = -totalW / 2;
  const offsetY = -totalH / 2;

  return layouts.map((layout) =>
    layout
      ? {
          ...layout,
          x: layout.x + offsetX,
          y: layout.y + offsetY,
        }
      : layout,
  );
}

function buildTightGridLayouts(): Layout[] {
  const layouts: Layout[] = new Array(sizes.length);
  const GRID_COLS = 5;
  const GRID_GAP = 24;
  const THUMBNAIL_SIZE = 140;

  for (let i = 0; i < sizes.length; i++) {
    const col = i % GRID_COLS;
    const row = Math.floor(i / GRID_COLS);
    layouts[i] = {
      x: col * (THUMBNAIL_SIZE + GRID_GAP),
      y: row * (THUMBNAIL_SIZE + GRID_GAP),
      width: THUMBNAIL_SIZE,
      height: THUMBNAIL_SIZE,
    };
  }

  const totalW = GRID_COLS * (THUMBNAIL_SIZE + GRID_GAP) - GRID_GAP;
  const totalH = Math.ceil(sizes.length / GRID_COLS) * (THUMBNAIL_SIZE + GRID_GAP) - GRID_GAP;
  const offsetX = -totalW / 2;
  const offsetY = -totalH / 2;

  return layouts.map((layout) => ({
    ...layout,
    x: layout.x + offsetX,
    y: layout.y + offsetY,
  }));
}

const brickLayouts = buildBrickColumnLayouts();
const gridLayouts = buildTightGridLayouts();

export const artworks: Artwork[] = brickLayouts.map((layout, i) => {
  const id = String(i + 1).padStart(2, "0");
  const [title, artist, year, medium, dimensions] = meta[i];
  return {
    id,
    title,
    artist,
    year,
    medium,
    dimensions,
    description: descriptions[i],
    image: ph(id, layout.width, layout.height),
    ...layout,
  };
});

export const brickLayout = brickLayouts;
export const gridLayout = gridLayouts;

export const fieldOrigin = { x: 0, y: 0 };

export function getFieldCentroid() {
  let cx = 0;
  let cy = 0;
  for (const a of artworks) {
    cx += fieldOrigin.x + a.x + a.width / 2;
    cy += fieldOrigin.y + a.y + a.height / 2;
  }
  const n = artworks.length;
  return { x: cx / n, y: cy / n };
}

export function getFieldBounds() {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const a of artworks) {
    const x0 = fieldOrigin.x + a.x;
    const y0 = fieldOrigin.y + a.y;
    minX = Math.min(minX, x0);
    minY = Math.min(minY, y0);
    maxX = Math.max(maxX, x0 + a.width);
    maxY = Math.max(maxY, y0 + a.height);
  }

  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}
