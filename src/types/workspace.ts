import type { ConductorType } from './electrical';

export type Rotation = 0 | 90 | 180 | 270;

export interface Point {
  x: number;
  y: number;
}

export interface PlacedComponent {
  id: string;
  /** Kunci definisi di katalog. */
  type: string;
  /** Posisi pojok kiri-atas (sebelum rotasi), dalam satuan dunia. */
  x: number;
  y: number;
  rotation: Rotation;
  /** Designator, mis. "Q1", "KM2". Dapat diubah pengguna. */
  label: string;
}

export interface TerminalRef {
  componentId: string;
  terminalId: string;
}

export interface Wire {
  id: string;
  from: TerminalRef;
  to: TerminalRef;
  conductor: ConductorType;
}

export const DOCUMENT_SCHEMA_VERSION = 1 as const;

/** Dokumen rangkaian yang diserialisasi (dasar untuk Save/Load di Phase 2). */
export interface WorkspaceDocument {
  schemaVersion: typeof DOCUMENT_SCHEMA_VERSION;
  components: PlacedComponent[];
  wires: Wire[];
}

export interface Selection {
  components: string[];
  wires: string[];
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}
