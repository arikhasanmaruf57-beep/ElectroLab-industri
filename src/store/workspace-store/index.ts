import { create } from 'zustand';
import { getComponentDefinition } from '@/data/components';
import {
  boundsIntersect,
  componentBounds,
  snapValue,
  type Bounds,
} from '@/electrical-engine/core/geometry';
import type { ConnectionCheck } from '@/electrical-engine/connections';
import {
  DEFAULT_DRAFT_NAME,
  getBrowserRepository,
} from '@/services/project-repository';
import type { Point, Selection, TerminalRef, Viewport, WorkspaceDocument } from '@/types/workspace';
import { useSettingsStore } from '../settings-store';
import {
  addComponent,
  autoArrange,
  connect,
  copyItems,
  documentBounds,
  emptyDocument,
  isEmpty,
  pasteItems,
  removeItems,
  renameComponent,
  rotateComponents,
  setPositions,
  type Clipboard,
} from './document';
import { commit, emptyHistory, redo as redoHistory, undo as undoHistory, type History } from './history';

export type Tool = 'select' | 'pan';
export type NoticeKind = 'info' | 'success' | 'error';

export interface Notice {
  id: number;
  kind: NoticeKind;
  text: string;
}

export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 3;

const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
const NO_SELECTION: Selection = { components: [], wires: [] };

interface DragBase {
  doc: WorkspaceDocument;
  start: Record<string, Point>;
}

interface WorkspaceState {
  doc: WorkspaceDocument;
  history: History;
  selection: Selection;
  viewport: Viewport;
  canvasSize: { width: number; height: number };
  tool: Tool;
  /** Terminal asal kabel yang sedang dibuat (menunggu terminal tujuan). */
  pendingFrom: TerminalRef | null;
  clipboard: Clipboard | null;
  pasteCount: number;
  notice: Notice | null;
  cursor: Point | null;
  hydrated: boolean;
  /** Waktu draf terakhir tersimpan (ms epoch) atau null bila belum ada. */
  savedAt: number | null;
  dragBase: DragBase | null;

  hydrate: () => void;
  saveNow: () => void;
  newProject: () => void;
  notify: (kind: NoticeKind, text: string) => void;
  dismissNotice: () => void;

  addComponentAt: (type: string, worldX: number, worldY: number) => string | null;
  addComponentAtViewCenter: (type: string) => string | null;
  renameSelected: (id: string, label: string) => void;

  selectOnly: (id: string) => void;
  toggleComponent: (id: string) => void;
  selectWire: (id: string, additive?: boolean) => void;
  selectInRect: (rect: Bounds, additive: boolean) => void;
  selectAll: () => void;
  clearSelection: () => void;

  beginDrag: () => void;
  dragBy: (dx: number, dy: number) => void;
  endDrag: () => void;
  nudge: (dx: number, dy: number) => void;

  rotateSelection: () => void;
  deleteSelection: () => void;
  copySelection: () => void;
  cutSelection: () => void;
  paste: () => void;
  autoArrange: () => void;

  startWire: (ref: TerminalRef) => void;
  cancelWire: () => void;
  connectTerminals: (from: TerminalRef, to: TerminalRef) => ConnectionCheck;

  undo: () => void;
  redo: () => void;

  setTool: (t: Tool) => void;
  setCanvasSize: (w: number, h: number) => void;
  setCursor: (p: Point | null) => void;
  setViewport: (v: Viewport) => void;
  panBy: (dx: number, dy: number) => void;
  zoomBy: (factor: number, cx?: number, cy?: number) => void;
  resetView: () => void;
  fitToContent: () => void;
}

const snapSize = () => useSettingsStore.getState().snapSize;

let noticeSeq = 0;

export const useWorkspaceStore = create<WorkspaceState>()((set, get) => {
  /** Terapkan dokumen baru dan catat undo. */
  const apply = (next: WorkspaceDocument, selection?: Selection) => {
    const { doc, history } = get();
    if (next === doc) return;
    set({ doc: next, history: commit(history, doc), ...(selection ? { selection } : {}) });
  };

  const label = (doc: WorkspaceDocument, ref: TerminalRef) => {
    const c = doc.components.find((x) => x.id === ref.componentId);
    return `${c?.label ?? '?'}.${ref.terminalId}`;
  };

  /** Hanya pertahankan seleksi yang masih ada di dokumen. */
  const pruneSelection = (doc: WorkspaceDocument, sel: Selection): Selection => ({
    components: sel.components.filter((id) => doc.components.some((c) => c.id === id)),
    wires: sel.wires.filter((id) => doc.wires.some((w) => w.id === id)),
  });

  return {
    doc: emptyDocument(),
    history: emptyHistory(),
    selection: NO_SELECTION,
    viewport: { x: 0, y: 0, zoom: 1 },
    canvasSize: { width: 1000, height: 700 },
    tool: 'select',
    pendingFrom: null,
    clipboard: null,
    pasteCount: 0,
    notice: null,
    cursor: null,
    hydrated: false,
    savedAt: null,
    dragBase: null,

    hydrate: () => {
      if (get().hydrated) return;
      const draft = getBrowserRepository()?.loadDraft() ?? null;
      set(draft ? { doc: draft.doc, savedAt: draft.savedAt, hydrated: true } : { hydrated: true });
    },

    saveNow: () => {
      const repo = getBrowserRepository();
      const { doc } = get();
      if (!repo) return;
      if (isEmpty(doc)) {
        repo.clearDraft();
        set({ savedAt: null });
        return;
      }
      const rec = repo.saveDraft(doc, DEFAULT_DRAFT_NAME);
      set({ savedAt: rec.savedAt });
    },

    newProject: () => {
      getBrowserRepository()?.clearDraft();
      set({
        doc: emptyDocument(),
        history: emptyHistory(),
        selection: NO_SELECTION,
        pendingFrom: null,
        savedAt: null,
        viewport: { x: 0, y: 0, zoom: 1 },
      });
    },

    notify: (kind, text) => set({ notice: { id: ++noticeSeq, kind, text } }),
    dismissNotice: () => set({ notice: null }),

    addComponentAt: (type, worldX, worldY) => {
      const def = getComponentDefinition(type);
      if (!def) return null;
      const s = snapSize();
      const { doc } = get();
      let x = snapValue(worldX - def.layout.width / 2, s || 10);
      let y = snapValue(worldY - def.layout.height / 2, s || 10);
      if (s === 0) {
        x = worldX - def.layout.width / 2;
        y = worldY - def.layout.height / 2;
      }
      const res = addComponent(doc, type, x, y);
      if (!res) return null;
      apply(res.doc, { components: [res.id], wires: [] });
      return res.id;
    },

    addComponentAtViewCenter: (type) => {
      const { viewport, canvasSize, doc } = get();
      const def = getComponentDefinition(type);
      if (!def) return null;
      let wx = (canvasSize.width / 2 - viewport.x) / viewport.zoom;
      let wy = (canvasSize.height / 2 - viewport.y) / viewport.zoom;
      // hindari penumpukan persis di atas komponen lain
      for (let i = 0; i < 30; i++) {
        const probe = { x: wx - def.layout.width / 2, y: wy - def.layout.height / 2, rotation: 0 as const };
        const clash = doc.components.some((c) => {
          const d = getComponentDefinition(c.type);
          return d ? boundsIntersect(componentBounds(c, d.layout), componentBounds(probe, def.layout)) : false;
        });
        if (!clash) break;
        wx += 40;
        wy += 40;
      }
      return get().addComponentAt(type, wx, wy);
    },

    renameSelected: (id, text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      apply(renameComponent(get().doc, id, trimmed));
    },

    selectOnly: (id) => set({ selection: { components: [id], wires: [] } }),
    toggleComponent: (id) => {
      const { selection } = get();
      const has = selection.components.includes(id);
      set({
        selection: {
          ...selection,
          components: has ? selection.components.filter((x) => x !== id) : [...selection.components, id],
        },
      });
    },
    selectWire: (id, additive = false) => {
      const { selection } = get();
      if (!additive) return set({ selection: { components: [], wires: [id] } });
      const has = selection.wires.includes(id);
      set({ selection: { ...selection, wires: has ? selection.wires.filter((x) => x !== id) : [...selection.wires, id] } });
    },
    selectInRect: (rect, additive) => {
      const { doc, selection } = get();
      const hit: string[] = [];
      for (const c of doc.components) {
        const def = getComponentDefinition(c.type);
        if (def && boundsIntersect(rect, componentBounds(c, def.layout))) hit.push(c.id);
      }
      const base = additive ? selection.components : [];
      set({ selection: { components: Array.from(new Set([...base, ...hit])), wires: additive ? selection.wires : [] } });
    },
    selectAll: () => {
      const { doc } = get();
      set({ selection: { components: doc.components.map((c) => c.id), wires: doc.wires.map((w) => w.id) } });
    },
    clearSelection: () => set({ selection: NO_SELECTION }),

    beginDrag: () => {
      const { doc, selection } = get();
      const start: Record<string, Point> = {};
      for (const c of doc.components) if (selection.components.includes(c.id)) start[c.id] = { x: c.x, y: c.y };
      set({ dragBase: { doc, start } });
    },
    dragBy: (dx, dy) => {
      const { dragBase, doc } = get();
      if (!dragBase) return;
      const s = snapSize();
      const positions: Record<string, Point> = {};
      for (const [id, p] of Object.entries(dragBase.start)) {
        positions[id] = { x: s ? snapValue(p.x + dx, s) : p.x + dx, y: s ? snapValue(p.y + dy, s) : p.y + dy };
      }
      set({ doc: setPositions(doc, positions) });
    },
    endDrag: () => {
      const { dragBase, doc, history } = get();
      if (!dragBase) return;
      set(dragBase.doc !== doc && moved(dragBase.doc, doc) ? { dragBase: null, history: commit(history, dragBase.doc) } : { dragBase: null });
    },
    nudge: (dx, dy) => {
      const { doc, selection } = get();
      if (selection.components.length === 0) return;
      const positions: Record<string, Point> = {};
      for (const c of doc.components) if (selection.components.includes(c.id)) positions[c.id] = { x: c.x + dx, y: c.y + dy };
      apply(setPositions(doc, positions));
    },

    rotateSelection: () => {
      const { doc, selection } = get();
      if (selection.components.length === 0) return get().notify('info', 'Pilih komponen yang akan diputar.');
      apply(rotateComponents(doc, selection.components));
    },
    deleteSelection: () => {
      const { doc, selection } = get();
      if (selection.components.length === 0 && selection.wires.length === 0) return;
      const next = removeItems(doc, selection.components, selection.wires);
      const nc = selection.components.length;
      const nw = selection.wires.length;
      apply(next, NO_SELECTION);
      set({ pendingFrom: null });
      get().notify('info', [nc ? `${nc} komponen` : '', nw ? `${nw} kabel` : ''].filter(Boolean).join(' dan ') + ' dihapus.');
    },
    copySelection: () => {
      const { doc, selection } = get();
      if (selection.components.length === 0) return get().notify('info', 'Pilih komponen yang akan disalin.');
      set({ clipboard: copyItems(doc, selection.components), pasteCount: 0 });
      get().notify('info', `${selection.components.length} komponen disalin.`);
    },
    cutSelection: () => {
      const { selection } = get();
      if (selection.components.length === 0) return get().notify('info', 'Pilih komponen yang akan dipotong.');
      set({ clipboard: copyItems(get().doc, selection.components), pasteCount: 0 });
      get().deleteSelection();
    },
    paste: () => {
      const { clipboard, doc, pasteCount } = get();
      if (!clipboard || clipboard.components.length === 0) return get().notify('info', 'Clipboard kosong. Salin komponen terlebih dahulu.');
      const offset = 20 * (pasteCount + 1);
      const res = pasteItems(doc, clipboard, offset, offset);
      apply(res.doc, { components: res.componentIds, wires: res.wireIds });
      set({ pasteCount: pasteCount + 1 });
    },
    autoArrange: () => {
      const { doc } = get();
      if (doc.components.length === 0) return get().notify('info', 'Belum ada komponen untuk disusun.');
      apply(autoArrange(doc, snapSize() || 10));
      get().fitToContent();
      get().notify('success', 'Komponen disusun per kategori: sumber → proteksi → kontrol → beban.');
    },

    startWire: (ref) => set({ pendingFrom: ref }),
    cancelWire: () => set({ pendingFrom: null }),
    connectTerminals: (from, to) => {
      const { doc } = get();
      const res = connect(doc, from, to);
      if (!res.result.ok) {
        get().notify('error', res.result.message);
        return res.result;
      }
      apply(res.doc, { components: [], wires: res.wireId ? [res.wireId] : [] });
      set({ pendingFrom: null });
      get().notify('success', `Tersambung ${label(res.doc, from)} → ${label(res.doc, to)} (${res.result.conductor}).`);
      return res.result;
    },

    undo: () => {
      const { history, doc, selection } = get();
      const r = undoHistory(history, doc);
      if (!r) return get().notify('info', 'Tidak ada yang bisa di-undo.');
      set({ doc: r.doc, history: r.history, selection: pruneSelection(r.doc, selection), pendingFrom: null });
    },
    redo: () => {
      const { history, doc, selection } = get();
      const r = redoHistory(history, doc);
      if (!r) return get().notify('info', 'Tidak ada yang bisa di-redo.');
      set({ doc: r.doc, history: r.history, selection: pruneSelection(r.doc, selection), pendingFrom: null });
    },

    setTool: (tool) => set({ tool }),
    setCanvasSize: (width, height) => {
      const cur = get().canvasSize;
      if (cur.width !== width || cur.height !== height) set({ canvasSize: { width, height } });
    },
    setCursor: (cursor) => set({ cursor }),
    setViewport: (viewport) => set({ viewport }),
    panBy: (dx, dy) => {
      const v = get().viewport;
      set({ viewport: { ...v, x: v.x + dx, y: v.y + dy } });
    },
    zoomBy: (factor, cx, cy) => {
      const { viewport: v, canvasSize } = get();
      const px = cx ?? canvasSize.width / 2;
      const py = cy ?? canvasSize.height / 2;
      const zoom = clampZoom(v.zoom * factor);
      const k = zoom / v.zoom;
      set({ viewport: { zoom, x: px - (px - v.x) * k, y: py - (py - v.y) * k } });
    },
    resetView: () => set({ viewport: { x: 0, y: 0, zoom: 1 } }),
    fitToContent: () => {
      const { doc, canvasSize } = get();
      const b = documentBounds(doc);
      if (!b) return set({ viewport: { x: 0, y: 0, zoom: 1 } });
      const pad = 60;
      const zoom = clampZoom(Math.min(canvasSize.width / (b.width + pad * 2), canvasSize.height / (b.height + pad * 2), 1.5));
      set({
        viewport: {
          zoom,
          x: canvasSize.width / 2 - (b.x + b.width / 2) * zoom,
          y: canvasSize.height / 2 - (b.y + b.height / 2) * zoom,
        },
      });
    },
  };
});

function moved(a: WorkspaceDocument, b: WorkspaceDocument): boolean {
  return a.components.some((c, i) => {
    const d = b.components[i];
    return !d || d.x !== c.x || d.y !== c.y;
  });
}

/**
 * Autosave draf ke penyimpanan lokal (debounce). Panggil sekali dari klien;
 * mengembalikan fungsi untuk berhenti.
 */
export function startAutosave(delayMs = 500): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const unsubscribe = useWorkspaceStore.subscribe((state, prev) => {
    if (!state.hydrated || state.doc === prev.doc) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => useWorkspaceStore.getState().saveNow(), delayMs);
  });
  return () => {
    unsubscribe();
    if (timer) clearTimeout(timer);
  };
}
