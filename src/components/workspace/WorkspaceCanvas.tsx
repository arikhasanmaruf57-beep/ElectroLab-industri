'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getComponentDefinition } from '@/data/components';
import { terminalWorld, type Bounds } from '@/electrical-engine/core/geometry';
import { checkConnection, pointsToPath, routeWire, sameRef, type Anchor } from '@/electrical-engine/connections';
import { useSettingsStore, type ComponentViewMode } from '@/store/settings-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import { TERMINAL_KIND_LABELS } from '@/types/electrical';
import type { Point, TerminalRef, WorkspaceDocument } from '@/types/workspace';
import { ComponentNode, type PendingState } from './ComponentNode';
import { getPhysicalLayout } from '../electrical-symbols/physical-assets';

export const LIBRARY_DRAG_TYPE = 'application/x-esim-component';

function anchorOf(doc: WorkspaceDocument, ref: TerminalRef, viewMode: ComponentViewMode): Anchor | null {
  const placed = doc.components.find((c) => c.id === ref.componentId);
  const def = placed && getComponentDefinition(placed.type);
  const t = def?.terminals.find((x) => x.id === ref.terminalId);
  if (!placed || !def || !t) return null;
  const layout = viewMode === 'physical' ? getPhysicalLayout(def) : def.layout;
  return terminalWorld(placed, layout, t.side, t.id);
}

export function WorkspaceCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const doc = useWorkspaceStore((s) => s.doc);
  const selection = useWorkspaceStore((s) => s.selection);
  const viewport = useWorkspaceStore((s) => s.viewport);
  const tool = useWorkspaceStore((s) => s.tool);
  const pendingFrom = useWorkspaceStore((s) => s.pendingFrom);
  const colors = useSettingsStore((s) => s.conductorColors);
  const showGrid = useSettingsStore((s) => s.showGrid);
  const componentViewMode = useSettingsStore((s) => s.componentViewMode);

  const [hover, setHover] = useState<TerminalRef | null>(null);
  const [preview, setPreview] = useState<Point | null>(null);
  const [marquee, setMarquee] = useState<Bounds | null>(null);
  const [spaceDown, setSpaceDown] = useState(false);
  const [dropActive, setDropActive] = useState(false);

  const st = () => useWorkspaceStore.getState();

  const toWorld = (clientX: number, clientY: number): Point => {
    const rect = svgRef.current?.getBoundingClientRect();
    const vp = st().viewport;
    return { x: (clientX - (rect?.left ?? 0) - vp.x) / vp.zoom, y: (clientY - (rect?.top ?? 0) - vp.y) / vp.zoom };
  };

  // ukuran kanvas → store (dipakai fit/zoom/tambah ke tengah)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => st().setCanvasSize(el.clientWidth, el.clientHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // zoom dengan roda mouse (listener non-passive agar bisa preventDefault)
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      st().zoomBy(Math.exp(-e.deltaY * 0.0015), e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Spasi = mode geser sementara
  useEffect(() => {
    const isTyping = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.tagName === 'BUTTON' || el.isContentEditable);
    };
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isTyping(e.target)) {
        e.preventDefault();
        setSpaceDown(true);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceDown(false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const panMode = tool === 'pan' || spaceDown;

  const startPan = (e: React.PointerEvent) => {
    const start = { x: e.clientX, y: e.clientY };
    const vp0 = st().viewport;
    const move = (ev: PointerEvent) => st().setViewport({ ...vp0, x: vp0.x + ev.clientX - start.x, y: vp0.y + ev.clientY - start.y });
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const onBackgroundDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.button !== 1) return;
    e.preventDefault();
    if (e.button === 1 || panMode) return startPan(e);
    st().cancelWire();
    setPreview(null);
    if (!e.shiftKey) st().clearSelection();
    const startW = toWorld(e.clientX, e.clientY);
    const additive = e.shiftKey;
    let rect: Bounds | null = null;
    const move = (ev: PointerEvent) => {
      const p = toWorld(ev.clientX, ev.clientY);
      rect = { x: Math.min(startW.x, p.x), y: Math.min(startW.y, p.y), width: Math.abs(p.x - startW.x), height: Math.abs(p.y - startW.y) };
      if (rect.width > 3 || rect.height > 3) setMarquee(rect);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      if (rect && (rect.width > 3 || rect.height > 3)) st().selectInRect(rect, additive);
      setMarquee(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const onBodyDown = (e: React.PointerEvent, id: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    if (panMode) return startPan(e);
    const s = st();
    s.cancelWire();
    setPreview(null);
    if (e.shiftKey) return s.toggleComponent(id);
    if (!s.selection.components.includes(id)) s.selectOnly(id);
    else if (s.selection.wires.length) useWorkspaceStore.setState({ selection: { components: s.selection.components, wires: [] } });
    s.beginDrag();
    const start = toWorld(e.clientX, e.clientY);
    const move = (ev: PointerEvent) => {
      const p = toWorld(ev.clientX, ev.clientY);
      st().dragBy(p.x - start.x, p.y - start.y);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      st().endDrag();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const onTerminalDown = (e: React.PointerEvent, ref: TerminalRef) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    if (panMode) return startPan(e);
    const s = st();
    if (s.pendingFrom) {
      if (sameRef(s.pendingFrom, ref)) s.cancelWire();
      else s.connectTerminals(s.pendingFrom, ref);
      setPreview(null);
      return;
    }
    s.clearSelection();
    s.startWire(ref);
    const startPt = { x: e.clientX, y: e.clientY };
    let moved = false;
    const move = (ev: PointerEvent) => {
      if (Math.hypot(ev.clientX - startPt.x, ev.clientY - startPt.y) > 4) moved = true;
      setPreview(toWorld(ev.clientX, ev.clientY));
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      if (!moved) return; // klik biasa: tunggu klik terminal tujuan
      const el = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('[data-terminal]');
      const componentId = el?.getAttribute('data-component-id');
      const terminalId = el?.getAttribute('data-terminal-id');
      if (componentId && terminalId && !sameRef({ componentId, terminalId }, ref)) st().connectTerminals(ref, { componentId, terminalId });
      // mode tarik-lepas selalu selesai di sini, berhasil atau ditolak
      st().cancelWire();
      setPreview(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const onWireDown = (e: React.PointerEvent, id: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    if (panMode) return startPan(e);
    st().cancelWire();
    st().selectWire(id, e.shiftKey);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropActive(false);
    const type = e.dataTransfer.getData(LIBRARY_DRAG_TYPE) || e.dataTransfer.getData('text/plain');
    if (!type || !getComponentDefinition(type)) return;
    const p = toWorld(e.clientX, e.clientY);
    st().addComponentAt(type, p.x, p.y);
  };

  // ---- data turunan ----
  const connectedMap = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const w of doc.wires) {
      for (const r of [w.from, w.to]) {
        if (!m.has(r.componentId)) m.set(r.componentId, new Set());
        m.get(r.componentId)!.add(r.terminalId);
      }
    }
    return m;
  }, [doc.wires]);

  const pendingMap = useMemo(() => {
    if (!pendingFrom) return null;
    const out: Record<string, Record<string, PendingState>> = {};
    for (const c of doc.components) {
      const def = getComponentDefinition(c.type);
      if (!def) continue;
      const r: Record<string, PendingState> = {};
      for (const t of def.terminals) {
        const ref = { componentId: c.id, terminalId: t.id };
        r[t.id] = sameRef(ref, pendingFrom) ? 'origin' : checkConnection(doc, pendingFrom, ref).ok ? 'ok' : 'bad';
      }
      out[c.id] = r;
    }
    return out;
  }, [doc, pendingFrom]);

  const hoverInfo = useMemo(() => {
    if (!hover) return null;
    const a = anchorOf(doc, hover, componentViewMode);
    const placed = doc.components.find((c) => c.id === hover.componentId);
    const def = placed && getComponentDefinition(placed.type);
    const t = def?.terminals.find((x) => x.id === hover.terminalId);
    if (!a || !placed || !t) return null;
    let text = `${placed.label}.${t.id} · ${t.name} — ${TERMINAL_KIND_LABELS[t.kind]}`;
    let bad = false;
    if (pendingFrom && !sameRef(pendingFrom, hover)) {
      const r = checkConnection(doc, pendingFrom, hover);
      if (!r.ok) {
        text = r.message;
        bad = true;
      }
    }
    return { a, text, bad };
  }, [hover, doc, pendingFrom]);

  const pendingAnchor = pendingFrom ? anchorOf(doc, pendingFrom, componentViewMode) : null;
  const selectedWires = new Set(selection.wires);
  const selectedComps = new Set(selection.components);

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full overflow-hidden bg-canvas"
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes(LIBRARY_DRAG_TYPE) || e.dataTransfer.types.includes('text/plain')) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
          setDropActive(true);
        }
      }}
      onDragLeave={() => setDropActive(false)}
      onDrop={onDrop}
    >
      <svg
        ref={svgRef}
        data-testid="canvas"
        role="application"
        aria-label="Kanvas rangkaian listrik"
        className="block h-full w-full touch-none select-none"
        style={{ cursor: panMode ? 'grab' : pendingFrom ? 'crosshair' : 'default' }}
        onPointerDown={onBackgroundDown}
        onPointerMove={(e) => {
          const p = toWorld(e.clientX, e.clientY);
          st().setCursor(p);
          if (st().pendingFrom) setPreview(p);
        }}
        onPointerLeave={() => st().setCursor(null)}
      >
        <defs>
          <pattern id="grid-dots" width={20 * viewport.zoom} height={20 * viewport.zoom} patternUnits="userSpaceOnUse" x={viewport.x} y={viewport.y}>
            <circle cx={1} cy={1} r={Math.max(0.8, viewport.zoom)} fill="var(--grid-dot)" />
          </pattern>
        </defs>
        {showGrid && <rect width="100%" height="100%" fill="url(#grid-dots)" pointerEvents="none" />}

        <g transform={`translate(${viewport.x} ${viewport.y}) scale(${viewport.zoom})`}>
          {/* kabel */}
          {doc.wires.map((w) => {
            const a = anchorOf(doc, w.from, componentViewMode);
            const b = anchorOf(doc, w.to, componentViewMode);
            if (!a || !b) return null;
            const d = pointsToPath(routeWire(a, b));
            const sel = selectedWires.has(w.id);
            return (
              <g key={w.id} data-testid="wire" data-wire-id={w.id} data-conductor={w.conductor} data-selected={sel}>
                {sel && <path d={d} fill="none" stroke="var(--accent)" strokeWidth={9} strokeOpacity={0.35} strokeLinejoin="round" />}
                <path d={d} fill="none" stroke="var(--wire-casing)" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
                <path d={d} fill="none" stroke={colors[w.conductor]} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
                {w.conductor === 'PE' && <path d={d} fill="none" stroke="#f2d230" strokeWidth={3} strokeDasharray="7 7" strokeLinejoin="round" />}
                <path d={d} fill="none" stroke="transparent" strokeWidth={14} style={{ cursor: 'pointer' }} onPointerDown={(e) => onWireDown(e, w.id)} />
              </g>
            );
          })}

          {/* komponen */}
          {doc.components.map((c) => {
            const def = getComponentDefinition(c.type);
            if (!def) return null;
            return (
              <ComponentNode
                key={c.id}
                placed={c}
                def={def}
                selected={selectedComps.has(c.id)}
                viewMode={componentViewMode}
                connected={connectedMap.get(c.id)}
                pending={pendingMap?.[c.id]}
                onBodyDown={onBodyDown}
                onTerminalDown={onTerminalDown}
                onTerminalHover={setHover}
              />
            );
          })}

          {/* kabel yang sedang ditarik */}
          {pendingAnchor && preview && (
            <path
              d={pointsToPath(routeWire(pendingAnchor, { ...preview, dir: { x: 0, y: 0 } }))}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              pointerEvents="none"
              data-testid="wire-preview"
            />
          )}

          {marquee && (
            <rect x={marquee.x} y={marquee.y} width={marquee.width} height={marquee.height} fill="var(--accent)" fillOpacity={0.1} stroke="var(--accent)" strokeDasharray="4 3" strokeWidth={1 / viewport.zoom} pointerEvents="none" />
          )}

          {hoverInfo && (
            <g transform={`translate(${hoverInfo.a.x + 14} ${hoverInfo.a.y - 14}) scale(${1 / viewport.zoom})`} pointerEvents="none" data-testid="terminal-tooltip">
              <rect x={0} y={-16} rx={4} width={hoverInfo.text.length * 6.2 + 14} height={22} fill="var(--raised)" stroke={hoverInfo.bad ? 'var(--fault)' : 'var(--line)'} />
              <text x={7} y={-1} fontSize={11} fill={hoverInfo.bad ? 'var(--fault)' : 'var(--ink)'}>
                {hoverInfo.text}
              </text>
            </g>
          )}
        </g>
      </svg>

      {doc.components.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="max-w-sm text-center">
            <p className="text-base font-medium">Workspace kosong</p>
            <p className="mt-1 text-sm text-muted">
              Seret komponen dari Library di kiri, atau klik dua kali item Library untuk menaruhnya di tengah. Hubungkan terminal dengan menarik dari satu titik ke titik lain.
            </p>
          </div>
        </div>
      )}
      {dropActive && <div className="pointer-events-none absolute inset-2 rounded-lg border-2 border-dashed border-accent/70" />}
    </div>
  );
}
