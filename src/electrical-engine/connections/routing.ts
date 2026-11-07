import type { Point } from '@/types/workspace';

export const WIRE_STUB = 20;

export interface Anchor extends Point {
  /** Arah keluar terminal (vektor satuan). */
  dir: Point;
}

/**
 * Rute kabel ortogonal sederhana: keluar dari terminal sejauh WIRE_STUB searah
 * sisi terminal, lalu satu belokan siku di antara dua stub. Semua segmen
 * horizontal atau vertikal. Routing yang menghindari komponen adalah pekerjaan fase berikutnya.
 */
export function routeWire(a: Anchor, b: Anchor): Point[] {
  const sa = { x: a.x + a.dir.x * WIRE_STUB, y: a.y + a.dir.y * WIRE_STUB };
  const sb = { x: b.x + b.dir.x * WIRE_STUB, y: b.y + b.dir.y * WIRE_STUB };
  const corner = a.dir.x === 0 ? { x: sb.x, y: sa.y } : { x: sa.x, y: sb.y };
  return dedupe([{ x: a.x, y: a.y }, sa, corner, sb, { x: b.x, y: b.y }]);
}

function dedupe(points: Point[]): Point[] {
  const out: Point[] = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (!last || last.x !== p.x || last.y !== p.y) out.push(p);
  }
  return out;
}

export function pointsToPath(points: Point[]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
}
