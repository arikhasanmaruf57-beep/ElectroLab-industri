import type { ComponentDefinition } from '@/types/component';
import type { TerminalDefinition } from '@/types/electrical';
import type { PlacedComponent, TerminalRef } from '@/types/workspace';
import { ComponentSymbol } from '../electrical-symbols/ComponentSymbol';
import { TERMINAL_COLORS } from '../electrical-symbols/terminal-style';

export type PendingState = 'ok' | 'bad' | 'origin';

interface Props {
  placed: PlacedComponent;
  def: ComponentDefinition;
  selected: boolean;
  connected: ReadonlySet<string> | undefined;
  pending: Record<string, PendingState> | undefined;
  onBodyDown: (e: React.PointerEvent, id: string) => void;
  onTerminalDown: (e: React.PointerEvent, ref: TerminalRef) => void;
  onTerminalHover: (ref: TerminalRef | null) => void;
}

function labelPlacement(t: TerminalDefinition): { dx: number; dy: number; anchor: 'start' | 'middle' | 'end' } {
  switch (t.side) {
    case 'top':
      return { dx: 0, dy: 13, anchor: 'middle' };
    case 'bottom':
      return { dx: 0, dy: -7, anchor: 'middle' };
    case 'left':
      return { dx: 8, dy: 3, anchor: 'start' };
    case 'right':
      return { dx: -8, dy: 3, anchor: 'end' };
  }
}

export function ComponentNode({ placed, def, selected, connected, pending, onBodyDown, onTerminalDown, onTerminalHover }: Props) {
  const { width: w, height: h } = def.layout;
  const swap = placed.rotation === 90 || placed.rotation === 270;
  const bh = swap ? w : h;
  const cx = placed.x + w / 2;
  const cy = placed.y + h / 2;

  return (
    <g data-testid="component" data-component-id={placed.id} data-type={def.type} data-label={placed.label}>
      <g transform={`translate(${placed.x} ${placed.y}) rotate(${placed.rotation} ${w / 2} ${h / 2})`}>
        <g onPointerDown={(e) => onBodyDown(e, placed.id)} style={{ cursor: 'move' }}>
          <rect x={-4} y={-4} width={w + 8} height={h + 8} fill="transparent" />
          <ComponentSymbol def={def} />
        </g>
        {selected && (
          <rect x={-6} y={-6} width={w + 12} height={h + 12} rx={5} fill="none" stroke="var(--accent)" strokeWidth={1.4} strokeDasharray="5 3" pointerEvents="none" />
        )}
        {def.terminals.map((t) => {
          const p = def.layout.terminals[t.id];
          if (!p) return null;
          const color = TERMINAL_COLORS[t.kind];
          const isConnected = connected?.has(t.id) ?? false;
          const state = pending?.[t.id];
          const lp = labelPlacement(t);
          const ref: TerminalRef = { componentId: placed.id, terminalId: t.id };
          return (
            <g
              key={t.id}
              transform={`translate(${p.x} ${p.y})`}
              data-terminal=""
              data-testid="terminal"
              data-component-id={placed.id}
              data-terminal-id={t.id}
              data-state={state ?? (isConnected ? 'connected' : 'free')}
              opacity={state === 'bad' ? 0.3 : 1}
              style={{ cursor: 'crosshair' }}
              onPointerDown={(e) => onTerminalDown(e, ref)}
              onPointerEnter={() => onTerminalHover(ref)}
              onPointerLeave={() => onTerminalHover(null)}
            >
              <circle r={10} fill="transparent" />
              {state === 'ok' && <circle r={9} fill="none" stroke="var(--ok)" strokeWidth={2} />}
              {state === 'origin' && <circle r={9} fill="none" stroke="var(--accent)" strokeWidth={2} />}
              <circle r={4} fill={isConnected || state === 'origin' ? color : 'var(--body-fill)'} stroke={color} strokeWidth={1.6} />
              <g transform={`translate(${lp.dx} ${lp.dy}) rotate(${-placed.rotation})`} pointerEvents="none">
                <text textAnchor={lp.anchor} fontSize={8} fontWeight={600} fill="var(--symbol-dim)" stroke="var(--body-fill)" strokeWidth={2.5} paintOrder="stroke">
                  {t.id}
                </text>
              </g>
            </g>
          );
        })}
      </g>
      <text x={cx} y={cy + bh / 2 + 16} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--ink)" pointerEvents="none">
        {placed.label}
      </text>
      <text x={cx} y={cy + bh / 2 + 28} textAnchor="middle" fontSize={9} fill="var(--muted)" pointerEvents="none">
        {def.name.length > 26 ? def.name.slice(0, 25) + '…' : def.name}
      </text>
    </g>
  );
}
