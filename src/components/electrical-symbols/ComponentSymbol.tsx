import type { ComponentDefinition, PoleGlyph } from '@/types/component';

interface Pt {
  x: number;
  y: number;
}

const G = 14; // setengah tinggi glyph

/** Glyph di sepanjang jalur vertikal x dari y1 ke y2 (koordinat lokal komponen). */
function Pole({ glyph, x, y1, y2 }: { glyph: PoleGlyph; x: number; y1: number; y2: number }) {
  const mid = (y1 + y2) / 2;
  const lead = (a: number, b: number) => <line x1={x} y1={a} x2={x} y2={b} />;
  const blade = <line x1={x} y1={mid + G} x2={x - 9} y2={mid - 12} />;
  const upper = lead(y1, mid - G);
  const lower = lead(mid + G, y2);
  const actuator = (
    <>
      <line x1={x - 5} y1={mid} x2={x - 18} y2={mid} strokeDasharray="3 2" />
      <line x1={x - 18} y1={mid - 5} x2={x - 18} y2={mid + 5} />
    </>
  );
  const hook = <line x1={x - 9} y1={mid - 12} x2={x} y2={mid - 12} />;

  switch (glyph) {
    case 'wire':
    case 'bus':
      return lead(y1, y2);
    case 'breaker':
    case 'rccb':
      return (
        <>
          {upper}
          {lower}
          {blade}
          <path d={`M${x - 3} ${mid - 17}l6 6m0-6l-6 6`} />
          {glyph === 'rccb' && <circle cx={x} cy={y1 + (mid - G - y1) / 2} r={6} />}
        </>
      );
    case 'contact-no':
      return (
        <>
          {upper}
          {lower}
          {blade}
        </>
      );
    case 'switch':
      return (
        <>
          {upper}
          {lower}
          {blade}
          <circle cx={x - 9} cy={mid - 12} r={2} />
        </>
      );
    case 'contact-nc':
      return (
        <>
          {upper}
          {lower}
          {blade}
          {hook}
        </>
      );
    case 'pb-no':
      return (
        <>
          {upper}
          {lower}
          {blade}
          {actuator}
        </>
      );
    case 'pb-nc':
      return (
        <>
          {upper}
          {lower}
          {blade}
          {hook}
          {actuator}
        </>
      );
    case 'mushroom':
      return (
        <>
          {upper}
          {lower}
          {blade}
          {hook}
          <line x1={x - 5} y1={mid} x2={x - 16} y2={mid} strokeDasharray="3 2" />
          <path d={`M${x - 16} ${mid - 8}q-9 8 0 16z`} />
        </>
      );
    case 'limit-no':
    case 'limit-nc':
      return (
        <>
          {upper}
          {lower}
          {blade}
          {glyph === 'limit-nc' && hook}
          <line x1={x - 5} y1={mid} x2={x - 16} y2={mid} strokeDasharray="3 2" />
          <circle cx={x - 19} cy={mid} r={3} />
        </>
      );
    case 'fuse':
      return (
        <>
          {lead(y1, mid - 12)}
          {lead(mid + 12, y2)}
          <rect x={x - 5} y={mid - 12} width={10} height={24} />
          <line x1={x} y1={mid - 12} x2={x} y2={mid + 12} />
        </>
      );
    case 'coil':
      return (
        <>
          {lead(y1, mid - G)}
          {lead(mid + G, y2)}
          <rect x={x - 11} y={mid - G} width={22} height={2 * G} />
        </>
      );
    case 'thermal':
      return (
        <>
          {lead(y1, mid - 13)}
          {lead(mid + 13, y2)}
          <rect x={x - 8} y={mid - 13} width={16} height={26} />
          <polyline points={`${x - 4},${mid - 7} ${x + 4},${mid - 2} ${x - 4},${mid + 3} ${x + 4},${mid + 8}`} />
        </>
      );
    case 'spd':
      return (
        <>
          {lead(y1, mid - 13)}
          {lead(mid + 13, y2)}
          <rect x={x - 6} y={mid - 13} width={12} height={26} />
          <line x1={x - 3} y1={mid + 8} x2={x + 3} y2={mid - 8} />
        </>
      );
    default:
      return lead(y1, y2);
  }
}

function MultiGlyph({ glyph, pts, h }: { glyph: PoleGlyph; pts: Pt[]; h: number }) {
  if (glyph === 'changeover') {
    const [c, a, b] = pts as [Pt, Pt, Pt];
    const yTop = h * 0.32;
    const yBot = h * 0.66;
    return (
      <>
        <line x1={c.x} y1={c.y} x2={c.x} y2={yTop} />
        <line x1={c.x} y1={yTop} x2={a.x} y2={yBot - 2} />
        <line x1={a.x} y1={yBot} x2={a.x} y2={a.y} />
        <line x1={b.x} y1={yBot} x2={b.x} y2={b.y} />
        <circle cx={b.x} cy={yBot} r={1.6} />
      </>
    );
  }
  if (glyph === 'cross') {
    const [a1, a2, b1, b2] = pts as [Pt, Pt, Pt, Pt];
    const y1 = h * 0.3;
    const y2 = h * 0.7;
    return (
      <>
        <path d={`M${a1.x} ${a1.y}V${y1}L${b2.x} ${y2}V${b2.y}`} />
        <path d={`M${a2.x} ${a2.y}V${y1}L${b1.x} ${y2}V${b1.y}`} />
      </>
    );
  }
  // bus
  const mid = h / 2;
  const xs = pts.map((p) => p.x);
  return (
    <>
      {pts.map((p, i) => (
        <line key={i} x1={p.x} y1={p.y} x2={p.x} y2={mid} />
      ))}
      <line x1={Math.min(...xs) - 6} y1={mid} x2={Math.max(...xs) + 6} y2={mid} strokeWidth={4.5} />
    </>
  );
}

/** Badan + simbol komponen dalam koordinat lokal (0..width, 0..height). Terminal digambar terpisah. */
export function ComponentSymbol({ def }: { def: ComponentDefinition }) {
  const { width: w, height: h, terminals } = def.layout;
  const sym = def.symbol;
  const stroke = { stroke: 'var(--symbol)', fill: 'none', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const textBase = { fill: 'var(--symbol)', textAnchor: 'middle' as const, fontFamily: 'var(--font-sans)' };

  if (sym.kind === 'circle') {
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w / 2 - 8, h / 2 - 12);
    return (
      <g>
        <g {...stroke}>
          {def.terminals.map((t) => {
            const p = terminals[t.id];
            if (!p) return null;
            const dx = Math.min(Math.abs(p.x - cx), r * 0.92);
            const dy = Math.min(Math.abs(p.y - cy), r * 0.92);
            if (t.side === 'top') return <line key={t.id} x1={p.x} y1={p.y} x2={p.x} y2={cy - Math.sqrt(r * r - dx * dx)} />;
            if (t.side === 'bottom') return <line key={t.id} x1={p.x} y1={p.y} x2={p.x} y2={cy + Math.sqrt(r * r - dx * dx)} />;
            if (t.side === 'left') return <line key={t.id} x1={p.x} y1={p.y} x2={cx - Math.sqrt(r * r - dy * dy)} y2={p.y} />;
            return <line key={t.id} x1={p.x} y1={p.y} x2={cx + Math.sqrt(r * r - dy * dy)} y2={p.y} />;
          })}
          <circle cx={cx} cy={cy} r={r} fill="var(--body-fill)" />
        </g>
        <text x={cx} y={sym.sub ? cy + 2 : cy + 6} {...textBase} fontSize={sym.text.length > 2 ? 13 : 20} fontWeight={600}>
          {sym.text}
        </text>
        {sym.sub && (
          <text x={cx} y={cy + 15} {...textBase} fontSize={9} fill="var(--symbol-dim)">
            {sym.sub}
          </text>
        )}
      </g>
    );
  }

  const body = <rect x={0} y={0} width={w} height={h} rx={3} fill="var(--body-fill)" stroke="var(--symbol-dim)" strokeWidth={1.2} />;

  if (sym.kind === 'box') {
    return (
      <g>
        {body}
        <text x={w / 2} y={h / 2 + (sym.sub ? 0 : 6)} {...textBase} fontSize={sym.text.length > 4 ? 15 : 20} fontWeight={600}>
          {sym.text}
        </text>
        {sym.sub && (
          <text x={w / 2} y={h / 2 + 16} {...textBase} fontSize={10} fill="var(--symbol-dim)">
            {sym.sub}
          </text>
        )}
      </g>
    );
  }

  return (
    <g>
      {body}
      <g {...stroke}>
        {sym.paths.map((p, i) => {
          const pts = p.terminals.map((id) => terminals[id]).filter((t): t is { x: number; y: number } => !!t);
          if (['changeover', 'cross', 'bus'].includes(p.glyph)) return <MultiGlyph key={i} glyph={p.glyph} pts={pts} h={h} />;
          const [a, b] = pts;
          if (!a || !b) return null;
          return <Pole key={i} glyph={p.glyph} x={a.x} y1={a.y} y2={b.y} />;
        })}
      </g>
      {sym.text && (
        <text
          x={w / 2}
          y={h - 22}
          {...textBase}
          fontSize={9}
          fontWeight={600}
          fill="var(--symbol-dim)"
          stroke="var(--body-fill)"
          strokeWidth={3}
          paintOrder="stroke"
        >
          {sym.text}
        </text>
      )}
    </g>
  );
}
