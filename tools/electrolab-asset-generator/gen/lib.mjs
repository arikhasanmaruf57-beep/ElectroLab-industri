// Mesin pembuat aset fisik ElectroLab. Gambar dan koordinat terminal berasal dari kode geometri yang SAMA.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire('/home/claude/.npm-global/lib/node_modules/');
export const sharp = require('sharp');

export const CANVAS = 1280;      // piksel (>= 1024)
export const FIT = 1000;         // sisi terpanjang objek di dalam kanvas

export class Ctx {
  constructor() { this.defs = new Map(); this.parts = []; this.sils = []; this.terms = []; this.bbox = null; this.notes = []; }
  lin(id, stops, o = {}) {
    const { x1 = 0, y1 = 0, x2 = 0, y2 = 1 } = o;
    this.defs.set(id, `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([off, c, op]) => `<stop offset="${off}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ''}/>`).join('')}</linearGradient>`);
    return `url(#${id})`;
  }
  rad(id, stops, o = {}) {
    const { cx = 0.38, cy = 0.32, r = 0.8 } = o;
    this.defs.set(id, `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([off, c, op]) => `<stop offset="${off}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ''}/>`).join('')}</radialGradient>`);
    return `url(#${id})`;
  }
  add(s) { this.parts.push(s); }
  sil(s) { this.sils.push(s); }
  /** Daftarkan titik terminal (pusat lubang/baut). */
  term(id, x, y, r, type = 'screw') {
    if (this.terms.some(t => t.id === id)) throw new Error(`terminal ganda digambar: ${id}`);
    this.terms.push({ id, x, y, r, type });
  }
  size(x, y, w, h) { this.bbox = { x, y, w, h }; }
}

/** Gradien standar yang dipakai bersama (gaya sama dengan MCB 1P). */
export function G(c) {
  return {
    body: c.lin('body', [[0, '#ECECE9'], [0.5, '#E2E2DE'], [1, '#D3D3CF']], { x2: 1, y2: 0 }),
    block: c.lin('block', [[0, '#EAEAE7'], [0.5, '#E1E1DD'], [1, '#D1D1CD']], { x2: 1, y2: 0 }),
    sheen: c.lin('sheen', [[0, '#FFFFFF', 0.55], [0.12, '#FFFFFF', 0], [0.9, '#000000', 0], [1, '#000000', 0.07]]),
    orange: c.lin('orange', [[0, '#F8AA45'], [0.45, '#F09128'], [1, '#DC7710']]),
    orangeEdge: c.lin('orangeEdge', [[0, '#8A4A06', 0.22], [0.08, '#8A4A06', 0], [0.92, '#8A4A06', 0], [1, '#8A4A06', 0.3]], { x2: 1, y2: 0 }),
    black: c.lin('blackLever', [[0, '#4A4F57'], [0.5, '#2E3237'], [1, '#1B1D21']], { x2: 1, y2: 0 }),
    darkBody: c.lin('darkBody', [[0, '#4B5057'], [0.5, '#363A40'], [1, '#26292D']], { x2: 1, y2: 0 }),
    darkFace: c.lin('darkFace', [[0, '#3C4046'], [1, '#2A2D32']]),
    win: c.lin('win', [[0, '#F4F4F1'], [1, '#E4E4E0']], { x2: 1, y2: 0 }),
    screw: c.rad('screw', [[0, '#F2F3F4'], [0.55, '#B4B8BD'], [1, '#6E747B']]),
    brass: c.rad('brass', [[0, '#F3DFA2'], [0.55, '#C9A24A'], [1, '#8A6A22']]),
    steel: c.lin('steel', [[0, '#E9ECEF'], [0.5, '#BFC5CC'], [1, '#8E959E']], { x2: 1, y2: 0 }),
    red: c.lin('redBtn', [[0, '#F0584E'], [0.5, '#D8362B'], [1, '#A82219']]),
    blue: c.lin('blueBtn', [[0, '#5C9BEA'], [0.5, '#2F6FD0'], [1, '#1B4A9B']]),
    green: c.lin('greenBtn', [[0, '#5BC47A'], [0.5, '#2EA05A'], [1, '#1B7040']]),
    yellow: c.lin('yellowBtn', [[0, '#FBE06A'], [0.5, '#F2C21C'], [1, '#C79A0A']]),
    hole: c.lin('hole', [[0, '#1D2025'], [1, '#3C4148']]),
  };
}

/** Kepala baut Phillips + cincin lubang (pusat = titik terminal). `s` = skala (1 = baut MCB 1P). */
export function screw(c, id, cx, cy, s = 1, style = 'phillips') {
  const g = G(c);
  const R = 27 * s, H = 22.5 * s, r = 18 * s;
  let h = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#DADAD7" stroke="#B6B6B2" stroke-width="${1.5 * s}"/>`;
  h += `<circle cx="${cx}" cy="${cy}" r="${H}" fill="#25272A"/>`;
  h += `<circle cx="${cx}" cy="${cy + 1.5 * s}" r="${r}" fill="${g.screw}" stroke="#5B6168" stroke-width="${1.2 * s}"/>`;
  if (style === 'hex') {
    const pts = Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 6 + i * Math.PI / 3; return `${cx + 9 * s * Math.cos(a)},${cy + 1.5 * s + 9 * s * Math.sin(a)}`; }).join(' ');
    h += `<polygon points="${pts}" fill="#1E2023"/>`;
  } else {
    h += `<rect x="${cx - 3.2 * s}" y="${cy - 13 * s}" width="${6.4 * s}" height="${29 * s}" rx="${2 * s}" fill="#1E2023"/>`;
    h += `<rect x="${cx - 14.5 * s}" y="${cy + 0.3 * s}" width="${29 * s}" height="${6.4 * s}" rx="${2 * s}" fill="#1E2023"/>`;
  }
  h += `<path d="M ${cx - 13 * s} ${cy - 4 * s} A ${14 * s} ${14 * s} 0 0 1 ${cx - 3 * s} ${cy - 13 * s}" fill="none" stroke="#FFFFFF" stroke-width="${2.2 * s}" stroke-linecap="round" opacity="0.7"/>`;
  c.add(h);
  c.term(id, cx, cy, H, 'screw');
}

/** Blok terminal bergaya MCB (alas abu-abu terang + garis belahan). */
export function termBlock(c, x, y, w, h, flip = false) {
  const g = G(c);
  c.sil(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#E8E8E5"/>`);
  c.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${g.block}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${g.sheen}"/>`);
  c.add(`<line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="#CBCBC7" stroke-width="1.6"/><line x1="${x + w / 2 + 1.5}" y1="${y}" x2="${x + w / 2 + 1.5}" y2="${y + h}" stroke="#FFFFFF" stroke-width="1" opacity="0.8"/>`);
}

export function rrect(x, y, w, h, r, fill, stroke, sw = 1.2, extra = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''} ${extra}/>`;
}

/** Susun terminal berurutan kiri->kanan sesuai urutan di katalog. */
export function bySide(def, side) { return def.terminals.filter(t => t.side === side).map(t => t.id); }

const SHADOW = `<filter id="shadow" x="-30%" y="-15%" width="170%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="9"/><feOffset dx="9" dy="12" result="b"/><feComponentTransfer><feFuncA type="linear" slope="0.28"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="blur3"><feGaussianBlur stdDeviation="3"/></filter>`;

export function buildSVG(c, overlay = false) {
  const { x, y, w, h } = c.bbox;
  const s = FIT / Math.max(w, h);
  const tx = (CANVAS - w * s) / 2 - x * s, ty = (CANVAS - h * s) / 2 - y * s;
  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}" width="${CANVAS}" height="${CANVAS}"><defs>${[...c.defs.values()].join('')}${SHADOW}</defs>`;
  out += `<g transform="translate(${tx} ${ty}) scale(${s})"><g filter="url(#shadow)">${c.sils.join('')}</g>${c.parts.join('')}`;
  if (overlay) for (const t of c.terms) out += `<g stroke="#FF00CC" stroke-width="${2 / s}" fill="none"><circle cx="${t.x}" cy="${t.y}" r="${t.r * 1.9}"/><line x1="${t.x - t.r * 2.6}" y1="${t.y}" x2="${t.x + t.r * 2.6}" y2="${t.y}"/><line x1="${t.x}" y1="${t.y - t.r * 2.6}" x2="${t.x}" y2="${t.y + t.r * 2.6}"/></g>`;
  out += `</g></svg>`;
  const pos = id => { const t = c.terms.find(q => q.id === id); return { x: +(((t.x * s + tx) / CANVAS).toFixed(4)), y: +(((t.y * s + ty) / CANVAS).toFixed(4)) }; };
  return { svg: out, scale: s, tx, ty, pos };
}

export async function renderPNG(svg, file) {
  await sharp(Buffer.from(svg), { density: 96 }).resize(CANVAS, CANVAS).png({ compressionLevel: 9 }).toFile(file);
}
