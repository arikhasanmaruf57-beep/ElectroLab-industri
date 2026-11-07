import type { ComponentDefinition } from '@/types/component';
import { ComponentSymbol } from './ComponentSymbol';
import { TERMINAL_COLORS } from './terminal-style';

/** Pratinjau simbol (untuk library & detail), dengan titik terminal berwarna. */
export function SymbolPreview({ def, className, showTerminalIds = false }: { def: ComponentDefinition; className?: string; showTerminalIds?: boolean }) {
  const { width: w, height: h } = def.layout;
  const pad = showTerminalIds ? 22 : 12;
  return (
    <svg viewBox={`${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`} className={className} role="img" aria-label={`Simbol ${def.name}`}>
      <ComponentSymbol def={def} />
      {def.terminals.map((t) => {
        const p = def.layout.terminals[t.id];
        if (!p) return null;
        const off = t.side === 'top' ? [0, -9] : t.side === 'bottom' ? [0, 15] : t.side === 'left' ? [-9, 3] : [9, 3];
        return (
          <g key={t.id}>
            <circle cx={p.x} cy={p.y} r={4} fill="var(--body-fill)" stroke={TERMINAL_COLORS[t.kind]} strokeWidth={1.6} />
            {showTerminalIds && (
              <text x={p.x + (off[0] ?? 0)} y={p.y + (off[1] ?? 0)} fontSize={9} fontWeight={600} fill="var(--muted)" textAnchor={t.side === 'left' ? 'end' : t.side === 'right' ? 'start' : 'middle'}>
                {t.id}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
