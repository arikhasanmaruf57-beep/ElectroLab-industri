import type { ComponentSource } from '@/types/component';
import type { TerminalDefinition, TerminalKind } from '@/types/electrical';
import { spec, term } from './factories';

function bus(
  type: string,
  name: string,
  kind: TerminalKind,
  prefix: string,
  description: string,
  fn: string,
  tags: string[],
): ComponentSource {
  const ids = [1, 2, 3, 4].map((i) => `${prefix}${i}`);
  const make = (side: 'top' | 'bottom'): TerminalDefinition[] =>
    ids.map((id) => term(`${side === 'top' ? 'T' : 'B'}-${id}`, id, kind, side, 'Titik sambung busbar', { maxConnections: 3, ...(kind === 'power' ? { phase: 'L' as const } : {}) }));
  const top = make('top');
  const bottom = make('bottom');
  return {
    type,
    name,
    category: 'wiring',
    designator: 'X',
    description,
    function: fn,
    symbol: { kind: 'paths', paths: [{ glyph: 'bus', terminals: [...top, ...bottom].map((t) => t.id) }] },
    terminals: [...top, ...bottom],
    specs: [spec('Arus nominal', '63', 'A'), spec('Titik sambung', '8')],
    simulationPhase: 3,
    internalConnections: [[...top, ...bottom].map((t) => t.id)],
    tags,
  };
}

export const WIRING: ComponentSource[] = [
  bus('busbar-phase', 'Busbar Fase', 'power', 'L', 'Rel penghantar fase dengan 8 titik sambung.', 'Menggabungkan beberapa cabang pada satu fase; seluruh terminalnya satu node listrik.', ['busbar', 'rel']),
  bus('busbar-neutral', 'Neutral Bar', 'neutral', 'N', 'Rel netral dengan 8 titik sambung.', 'Titik kumpul netral dalam panel; terpisah dari PE.', ['neutral bar', 'netral']),
  bus('earth-bar', 'Earth Bar (PE)', 'earth', 'PE', 'Rel pembumian dengan 8 titik sambung.', 'Titik kumpul PE; tidak boleh disambung ke netral di sisi beban.', ['earth bar', 'grounding', 'pe']),
  {
    type: 'terminal-block',
    name: 'Terminal Block',
    category: 'wiring',
    designator: 'X',
    description: 'Terminal rel DIN dengan 4 pasang sambungan lurus.',
    function: 'Menyambung penghantar antara panel dan lapangan; setiap pasang atas–bawah satu node.',
    symbol: {
      kind: 'paths',
      paths: [1, 2, 3, 4].map((i) => ({ glyph: 'wire' as const, terminals: [`T${i}`, `B${i}`] })),
    },
    terminals: [
      ...[1, 2, 3, 4].map((i) => term(`T${i}`, `${i}`, 'power', 'top', `Terminal ${i} — sisi atas`, { phase: 'L' })),
      ...[1, 2, 3, 4].map((i) => term(`B${i}`, `${i}`, 'power', 'bottom', `Terminal ${i} — sisi bawah`, { phase: 'L' })),
    ],
    specs: [spec('Arus nominal', '24', 'A'), spec('Penampang', '2.5', 'mm²'), spec('Jumlah terminal', '4')],
    simulationPhase: 3,
    internalConnections: [1, 2, 3, 4].map((i) => [`T${i}`, `B${i}`]),
    tags: ['din rail', 'terminal'],
  },
];
