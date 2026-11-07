import type { WorkspaceDocument } from '@/types/workspace';

export const HISTORY_LIMIT = 100;

export interface History {
  past: WorkspaceDocument[];
  future: WorkspaceDocument[];
}

export const emptyHistory = (): History => ({ past: [], future: [] });

/** Catat `before` sebagai titik undo (dipanggil sebelum/atau saat dokumen berubah). */
export function commit(h: History, before: WorkspaceDocument): History {
  const past = [...h.past, before];
  if (past.length > HISTORY_LIMIT) past.shift();
  return { past, future: [] };
}

export function undo(h: History, current: WorkspaceDocument): { history: History; doc: WorkspaceDocument } | null {
  const prev = h.past[h.past.length - 1];
  if (!prev) return null;
  return { doc: prev, history: { past: h.past.slice(0, -1), future: [current, ...h.future] } };
}

export function redo(h: History, current: WorkspaceDocument): { history: History; doc: WorkspaceDocument } | null {
  const next = h.future[0];
  if (!next) return null;
  return { doc: next, history: { past: [...h.past, current], future: h.future.slice(1) } };
}
