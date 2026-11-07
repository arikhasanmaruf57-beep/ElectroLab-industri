/**
 * Operasi murni pada dokumen workspace. Tidak ada React/Zustand di sini sehingga
 * seluruhnya dapat diuji tanpa DOM, dan Phase 2+ (Save/Load, solver) memakai fungsi yang sama.
 */
import { CATEGORIES } from '@/data/categories';
import { getComponentDefinition } from '@/data/components';
import { componentBounds, nextRotation, snapValue, type Bounds } from '@/electrical-engine/core/geometry';
import { uid } from '@/electrical-engine/core/ids';
import { checkConnection, type ConnectionCheck } from '@/electrical-engine/connections';
import type { ComponentDefinition } from '@/types/component';
import {
  DOCUMENT_SCHEMA_VERSION,
  type PlacedComponent,
  type Rotation,
  type TerminalRef,
  type Wire,
  type WorkspaceDocument,
} from '@/types/workspace';

export function emptyDocument(): WorkspaceDocument {
  return { schemaVersion: DOCUMENT_SCHEMA_VERSION, components: [], wires: [] };
}

export function isEmpty(doc: WorkspaceDocument): boolean {
  return doc.components.length === 0 && doc.wires.length === 0;
}

/** Designator berikutnya untuk awalan definisi, mis. "Q" → "Q3" bila Q1, Q2 sudah ada. */
export function nextDesignator(doc: WorkspaceDocument, def: Pick<ComponentDefinition, 'designator'>): string {
  const prefix = def.designator;
  let max = 0;
  for (const c of doc.components) {
    const m = new RegExp(`^${escapeRegExp(prefix)}(\\d+)$`).exec(c.label);
    if (m && m[1]) max = Math.max(max, Number(m[1]));
  }
  return `${prefix}${max + 1}`;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function addComponent(
  doc: WorkspaceDocument,
  type: string,
  x: number,
  y: number,
  rotation: Rotation = 0,
): { doc: WorkspaceDocument; id: string } | null {
  const def = getComponentDefinition(type);
  if (!def) return null;
  const placed: PlacedComponent = {
    id: uid('c'),
    type,
    x,
    y,
    rotation,
    label: nextDesignator(doc, def),
  };
  return { doc: { ...doc, components: [...doc.components, placed] }, id: placed.id };
}

export function getComponent(doc: WorkspaceDocument, id: string): PlacedComponent | undefined {
  return doc.components.find((c) => c.id === id);
}

/** Setel posisi absolut beberapa komponen sekaligus. */
export function setPositions(doc: WorkspaceDocument, positions: Record<string, { x: number; y: number }>): WorkspaceDocument {
  return {
    ...doc,
    components: doc.components.map((c) => {
      const p = positions[c.id];
      return p ? { ...c, x: p.x, y: p.y } : c;
    }),
  };
}

export function rotateComponents(doc: WorkspaceDocument, ids: readonly string[]): WorkspaceDocument {
  const set = new Set(ids);
  return {
    ...doc,
    components: doc.components.map((c) => (set.has(c.id) ? { ...c, rotation: nextRotation(c.rotation) } : c)),
  };
}

export function renameComponent(doc: WorkspaceDocument, id: string, label: string): WorkspaceDocument {
  return { ...doc, components: doc.components.map((c) => (c.id === id ? { ...c, label } : c)) };
}

/** Hapus komponen terpilih beserta kabel yang menempel padanya, serta kabel terpilih. */
export function removeItems(doc: WorkspaceDocument, componentIds: readonly string[], wireIds: readonly string[]): WorkspaceDocument {
  const cs = new Set(componentIds);
  const ws = new Set(wireIds);
  return {
    ...doc,
    components: doc.components.filter((c) => !cs.has(c.id)),
    wires: doc.wires.filter((w) => !ws.has(w.id) && !cs.has(w.from.componentId) && !cs.has(w.to.componentId)),
  };
}

export function connect(
  doc: WorkspaceDocument,
  from: TerminalRef,
  to: TerminalRef,
): { doc: WorkspaceDocument; result: ConnectionCheck; wireId?: string } {
  const result = checkConnection(doc, from, to);
  if (!result.ok) return { doc, result };
  const wire: Wire = { id: uid('w'), from, to, conductor: result.conductor };
  return { doc: { ...doc, wires: [...doc.wires, wire] }, result, wireId: wire.id };
}

export interface Clipboard {
  components: PlacedComponent[];
  wires: Wire[];
}

/** Salin komponen terpilih dan hanya kabel yang kedua ujungnya ikut terpilih. */
export function copyItems(doc: WorkspaceDocument, componentIds: readonly string[]): Clipboard {
  const set = new Set(componentIds);
  return {
    components: doc.components.filter((c) => set.has(c.id)).map((c) => ({ ...c })),
    wires: doc.wires.filter((w) => set.has(w.from.componentId) && set.has(w.to.componentId)).map((w) => ({ ...w, from: { ...w.from }, to: { ...w.to } })),
  };
}

/** Tempel dengan ID baru, designator baru, dan offset posisi. */
export function pasteItems(
  doc: WorkspaceDocument,
  clip: Clipboard,
  dx: number,
  dy: number,
): { doc: WorkspaceDocument; componentIds: string[]; wireIds: string[] } {
  const idMap = new Map<string, string>();
  let next = doc;
  const componentIds: string[] = [];
  for (const c of clip.components) {
    const def = getComponentDefinition(c.type);
    if (!def) continue;
    const id = uid('c');
    idMap.set(c.id, id);
    const placed: PlacedComponent = { ...c, id, x: c.x + dx, y: c.y + dy, label: nextDesignator(next, def) };
    next = { ...next, components: [...next.components, placed] };
    componentIds.push(id);
  }
  const wireIds: string[] = [];
  for (const w of clip.wires) {
    const a = idMap.get(w.from.componentId);
    const b = idMap.get(w.to.componentId);
    if (!a || !b) continue;
    const id = uid('w');
    next = { ...next, wires: [...next.wires, { ...w, id, from: { ...w.from, componentId: a }, to: { ...w.to, componentId: b } }] };
    wireIds.push(id);
  }
  return { doc: next, componentIds, wireIds };
}

const ARRANGE_ORIGIN = 80;
const ARRANGE_GAP_X = 120;
const ARRANGE_GAP_Y = 40;

/** Susun otomatis: satu kolom per kategori (sumber → proteksi → ... → beban), snap ke grid. */
export function autoArrange(doc: WorkspaceDocument, snap = 10): WorkspaceDocument {
  const order = new Map(CATEGORIES.map((c, i) => [c.id, i]));
  const sorted = [...doc.components].sort((a, b) => {
    const da = getComponentDefinition(a.type);
    const db = getComponentDefinition(b.type);
    const oa = da ? order.get(da.category) ?? 99 : 99;
    const ob = db ? order.get(db.category) ?? 99 : 99;
    return oa - ob || a.label.localeCompare(b.label, undefined, { numeric: true });
  });
  const positions: Record<string, { x: number; y: number }> = {};
  let colX = ARRANGE_ORIGIN;
  let y = ARRANGE_ORIGIN;
  let colWidth = 0;
  let currentCat: number | undefined;
  for (const c of sorted) {
    const def = getComponentDefinition(c.type);
    if (!def) continue;
    const cat = order.get(def.category) ?? 99;
    if (currentCat !== undefined && cat !== currentCat) {
      colX += colWidth + ARRANGE_GAP_X;
      y = ARRANGE_ORIGIN;
      colWidth = 0;
    }
    currentCat = cat;
    const dummy = { x: 0, y: 0, rotation: c.rotation };
    const b = componentBounds(dummy, def.layout);
    // posisikan agar kotak pembatas (setelah rotasi) berawal di (colX, y)
    const x = snapValue(colX - b.x, snap);
    const py = snapValue(y - b.y, snap);
    positions[c.id] = { x, y: py };
    y += b.height + ARRANGE_GAP_Y;
    colWidth = Math.max(colWidth, b.width);
  }
  return setPositions(doc, positions);
}

export function documentBounds(doc: WorkspaceDocument): Bounds | null {
  const list: Bounds[] = [];
  for (const c of doc.components) {
    const def = getComponentDefinition(c.type);
    if (def) list.push(componentBounds(c, def.layout));
  }
  if (list.length === 0) return null;
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const b of list) {
    x1 = Math.min(x1, b.x);
    y1 = Math.min(y1, b.y);
    x2 = Math.max(x2, b.x + b.width);
    y2 = Math.max(y2, b.y + b.height);
  }
  return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
}

/**
 * Validasi + pembersihan data mentah (mis. dari localStorage atau impor file).
 * Komponen dengan tipe tak dikenal dan kabel yang menunjuk terminal tak valid dibuang.
 * Mengembalikan null jika bentuk dasarnya bukan dokumen.
 */
export function sanitizeDocument(raw: unknown): WorkspaceDocument | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (r.schemaVersion !== DOCUMENT_SCHEMA_VERSION || !Array.isArray(r.components) || !Array.isArray(r.wires)) return null;

  const rotations: Rotation[] = [0, 90, 180, 270];
  const components: PlacedComponent[] = [];
  const seen = new Set<string>();
  for (const item of r.components) {
    if (!item || typeof item !== 'object') continue;
    const c = item as Record<string, unknown>;
    if (typeof c.id !== 'string' || typeof c.type !== 'string' || seen.has(c.id)) continue;
    if (!getComponentDefinition(c.type)) continue;
    if (typeof c.x !== 'number' || typeof c.y !== 'number' || !Number.isFinite(c.x) || !Number.isFinite(c.y)) continue;
    const rotation = rotations.find((v) => v === c.rotation) ?? 0;
    seen.add(c.id);
    components.push({ id: c.id, type: c.type, x: c.x, y: c.y, rotation, label: typeof c.label === 'string' ? c.label : c.type });
  }

  const wires: Wire[] = [];
  const wireIds = new Set<string>();
  const probe: WorkspaceDocument = { schemaVersion: DOCUMENT_SCHEMA_VERSION, components, wires: [] };
  for (const item of r.wires) {
    if (!item || typeof item !== 'object') continue;
    const w = item as Record<string, unknown>;
    const from = toRef(w.from);
    const to = toRef(w.to);
    if (typeof w.id !== 'string' || wireIds.has(w.id) || !from || !to) continue;
    const check = checkConnection({ ...probe, wires }, from, to);
    if (!check.ok) continue;
    wireIds.add(w.id);
    wires.push({ id: w.id, from, to, conductor: check.conductor });
  }
  return { schemaVersion: DOCUMENT_SCHEMA_VERSION, components, wires };
}

function toRef(v: unknown): TerminalRef | null {
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  return typeof o.componentId === 'string' && typeof o.terminalId === 'string'
    ? { componentId: o.componentId, terminalId: o.terminalId }
    : null;
}

