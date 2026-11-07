import type { ComponentDefinition } from '@/types/component';
import type { ConductorType, TerminalDefinition } from '@/types/electrical';
import type { TerminalRef, WorkspaceDocument } from '@/types/workspace';
import { getComponentDefinition } from '@/data/components';
import { checkKinds } from '../terminal-system/compatibility';
import { inferConductor } from './conductor';

export type ConnectionErrorCode =
  | 'unknown-component'
  | 'unknown-terminal'
  | 'same-terminal'
  | 'incompatible'
  | 'duplicate'
  | 'terminal-full';

export type ConnectionCheck =
  | { ok: true; conductor: ConductorType }
  | { ok: false; code: ConnectionErrorCode; message: string };

export type DefinitionResolver = (type: string) => ComponentDefinition | undefined;

export const DEFAULT_MAX_CONNECTIONS = 2;

export function sameRef(a: TerminalRef, b: TerminalRef): boolean {
  return a.componentId === b.componentId && a.terminalId === b.terminalId;
}

export function terminalKey(ref: TerminalRef): string {
  return `${ref.componentId}::${ref.terminalId}`;
}

export function countConnections(doc: Pick<WorkspaceDocument, 'wires'>, ref: TerminalRef): number {
  let n = 0;
  for (const w of doc.wires) if (sameRef(w.from, ref) || sameRef(w.to, ref)) n++;
  return n;
}

interface Resolved {
  def: ComponentDefinition;
  terminal: TerminalDefinition;
}

function resolve(doc: WorkspaceDocument, ref: TerminalRef, defs: DefinitionResolver): Resolved | null {
  const placed = doc.components.find((c) => c.id === ref.componentId);
  if (!placed) return null;
  const def = defs(placed.type);
  if (!def) return null;
  const terminal = def.terminals.find((t) => t.id === ref.terminalId);
  return terminal ? { def, terminal } : null;
}

/**
 * Memeriksa apakah dua terminal boleh dihubungkan: komponen & terminal ada,
 * bukan terminal yang sama, jenis terminal kompatibel, belum ada kabel yang
 * sama, dan kapasitas terminal belum penuh.
 *
 * Ini validasi KONEKSI. Hubung singkat, beban lebih, dsb. (kesalahan fungsi dan
 * gangguan listrik) dinilai engine simulasi di fase berikutnya.
 */
export function checkConnection(
  doc: WorkspaceDocument,
  from: TerminalRef,
  to: TerminalRef,
  defs: DefinitionResolver = getComponentDefinition,
): ConnectionCheck {
  if (sameRef(from, to)) {
    return { ok: false, code: 'same-terminal', message: 'Terminal tidak dapat dihubungkan ke dirinya sendiri.' };
  }
  const a = resolve(doc, from, defs);
  const b = resolve(doc, to, defs);
  if (!a || !b) {
    const code = (!doc.components.some((c) => c.id === from.componentId) || !doc.components.some((c) => c.id === to.componentId))
      ? 'unknown-component'
      : 'unknown-terminal';
    return { ok: false, code, message: 'Terminal tidak ditemukan pada komponen.' };
  }

  const kinds = checkKinds(a.terminal.kind, b.terminal.kind);
  if (!kinds.ok) {
    return { ok: false, code: 'incompatible', message: kinds.reason ?? 'Terminal tidak kompatibel.' };
  }

  const dup = doc.wires.some((w) => (sameRef(w.from, from) && sameRef(w.to, to)) || (sameRef(w.from, to) && sameRef(w.to, from)));
  if (dup) {
    return { ok: false, code: 'duplicate', message: 'Dua terminal ini sudah dihubungkan.' };
  }

  for (const [ref, r] of [
    [from, a],
    [to, b],
  ] as const) {
    const max = r.terminal.maxConnections ?? DEFAULT_MAX_CONNECTIONS;
    if (countConnections(doc, ref) >= max) {
      return {
        ok: false,
        code: 'terminal-full',
        message: `Terminal ${r.terminal.id} sudah penuh (maksimum ${max} penghantar). Gunakan busbar atau terminal block.`,
      };
    }
  }

  return { ok: true, conductor: inferConductor(a.terminal, b.terminal) };
}
