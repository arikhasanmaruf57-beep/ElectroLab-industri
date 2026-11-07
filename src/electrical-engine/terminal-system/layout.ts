import type { ComponentLayout } from '@/types/component';
import type { TerminalDefinition, TerminalSide } from '@/types/electrical';

/** Jarak antar terminal pada satu sisi. */
export const TERMINAL_SPACING = 20;

interface LayoutOptions {
  minWidth?: number;
  minHeight?: number;
}

/**
 * Menghitung ukuran komponen dan posisi lokal setiap terminal.
 *
 * Aturan: lebar/tinggi kelipatan 20, jarak terminal 20, terminal dipusatkan
 * per sisi → semua koordinat terminal kelipatan 10 (cocok dengan grid snapping).
 * Terminal berada tepat di tepi badan komponen.
 */
export function buildLayout(terminals: TerminalDefinition[], opts: LayoutOptions = {}): ComponentLayout {
  const bySide: Record<TerminalSide, TerminalDefinition[]> = { top: [], bottom: [], left: [], right: [] };
  for (const t of terminals) bySide[t.side].push(t);

  const cols = Math.max(bySide.top.length, bySide.bottom.length, 2);
  const rows = Math.max(bySide.left.length, bySide.right.length);

  const width = roundUp20(Math.max(opts.minWidth ?? 80, (cols + 1) * TERMINAL_SPACING));
  const height = roundUp20(Math.max(opts.minHeight ?? 100, (rows + 1) * TERMINAL_SPACING));

  const out: ComponentLayout['terminals'] = {};
  const place = (list: TerminalDefinition[], length: number, at: (pos: number) => { x: number; y: number }) => {
    const start = (length - (list.length - 1) * TERMINAL_SPACING) / 2;
    list.forEach((t, i) => {
      out[t.id] = at(start + i * TERMINAL_SPACING);
    });
  };
  place(bySide.top, width, (p) => ({ x: p, y: 0 }));
  place(bySide.bottom, width, (p) => ({ x: p, y: height }));
  place(bySide.left, height, (p) => ({ x: 0, y: p }));
  place(bySide.right, height, (p) => ({ x: width, y: p }));

  return { width, height, terminals: out };
}

function roundUp20(v: number): number {
  return Math.ceil(v / 20) * 20;
}
