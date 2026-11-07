import type { ComponentLayout } from '@/types/component';
import type { TerminalSide } from '@/types/electrical';
import type { PlacedComponent, Point, Rotation } from '@/types/workspace';

/** Semua posisi terminal jatuh pada kelipatan 10 satuan dunia. */
export const GRID_UNIT = 10;

export function snapValue(value: number, size: number): number {
  if (size <= 0) return value;
  return Math.round(value / size) * size;
}

/** Putar vektor searah jarum jam (sumbu y ke bawah, seperti layar/SVG). */
export function rotateVector(v: Point, rotation: Rotation): Point {
  switch (rotation) {
    case 0:
      return { x: v.x, y: v.y };
    case 90:
      return { x: -v.y, y: v.x };
    case 180:
      return { x: -v.x, y: -v.y };
    case 270:
      return { x: v.y, y: -v.x };
  }
}

export function nextRotation(r: Rotation): Rotation {
  return ((r + 90) % 360) as Rotation;
}

export const SIDE_VECTOR: Record<TerminalSide, Point> = {
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export interface WorldTerminal extends Point {
  /** Vektor arah keluar terminal (satuan), sudah memperhitungkan rotasi. */
  dir: Point;
}

/** Posisi dunia sebuah terminal pada komponen yang sudah ditempatkan. */
export function terminalWorld(
  placed: Pick<PlacedComponent, 'x' | 'y' | 'rotation'>,
  layout: ComponentLayout,
  side: TerminalSide,
  terminalId: string,
): WorldTerminal {
  const t = layout.terminals[terminalId];
  if (!t) throw new Error(`Terminal tidak ada pada layout: ${terminalId}`);
  const cx = placed.x + layout.width / 2;
  const cy = placed.y + layout.height / 2;
  const rel = rotateVector({ x: t.x - layout.width / 2, y: t.y - layout.height / 2 }, placed.rotation);
  return { x: cx + rel.x, y: cy + rel.y, dir: rotateVector(SIDE_VECTOR[side], placed.rotation) };
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Kotak pembatas komponen setelah rotasi (rotasi 90/270 menukar lebar-tinggi). */
export function componentBounds(
  placed: Pick<PlacedComponent, 'x' | 'y' | 'rotation'>,
  layout: ComponentLayout,
): Bounds {
  const cx = placed.x + layout.width / 2;
  const cy = placed.y + layout.height / 2;
  const swap = placed.rotation === 90 || placed.rotation === 270;
  const w = swap ? layout.height : layout.width;
  const h = swap ? layout.width : layout.height;
  return { x: cx - w / 2, y: cy - h / 2, width: w, height: h };
}

export function unionBounds(list: Bounds[]): Bounds | null {
  if (list.length === 0) return null;
  let x1 = Infinity;
  let y1 = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  for (const b of list) {
    x1 = Math.min(x1, b.x);
    y1 = Math.min(y1, b.y);
    x2 = Math.max(x2, b.x + b.width);
    y2 = Math.max(y2, b.y + b.height);
  }
  return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
}

export function boundsIntersect(a: Bounds, b: Bounds): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
