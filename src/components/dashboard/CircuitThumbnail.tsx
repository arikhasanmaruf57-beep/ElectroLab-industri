import { getComponentDefinition } from '@/data/components';
import { componentBounds, terminalWorld } from '@/electrical-engine/core/geometry';
import { pointsToPath, routeWire } from '@/electrical-engine/connections';
import type { WorkspaceDocument } from '@/types/workspace';
import { documentBounds } from '@/store/workspace-store/document';
import type { ConductorType } from '@/types/electrical';

/** Pratinjau ringkas rangkaian (kotak komponen + kabel). */
export function CircuitThumbnail({ doc, colors, className }: { doc: WorkspaceDocument; colors: Record<ConductorType, string>; className?: string }) {
  const b = documentBounds(doc);
  if (!b) return null;
  const pad = 30;
  return (
    <svg viewBox={`${b.x - pad} ${b.y - pad} ${b.width + pad * 2} ${b.height + pad * 2}`} className={className} role="img" aria-label="Pratinjau rangkaian" preserveAspectRatio="xMidYMid meet">
      {doc.wires.map((w) => {
        const pa = doc.components.find((c) => c.id === w.from.componentId);
        const pb = doc.components.find((c) => c.id === w.to.componentId);
        const da = pa && getComponentDefinition(pa.type);
        const db = pb && getComponentDefinition(pb.type);
        const ta = da?.terminals.find((t) => t.id === w.from.terminalId);
        const tb = db?.terminals.find((t) => t.id === w.to.terminalId);
        if (!pa || !pb || !da || !db || !ta || !tb) return null;
        const d = pointsToPath(routeWire(terminalWorld(pa, da.layout, ta.side, ta.id), terminalWorld(pb, db.layout, tb.side, tb.id)));
        return <path key={w.id} d={d} fill="none" stroke={colors[w.conductor]} strokeWidth={4} strokeLinejoin="round" />;
      })}
      {doc.components.map((c) => {
        const def = getComponentDefinition(c.type);
        if (!def) return null;
        const r = componentBounds(c, def.layout);
        return <rect key={c.id} x={r.x} y={r.y} width={r.width} height={r.height} rx={6} fill="var(--raised)" stroke="var(--symbol-dim)" strokeWidth={2} />;
      })}
    </svg>
  );
}
