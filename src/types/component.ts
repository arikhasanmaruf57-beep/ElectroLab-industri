import type { TerminalDefinition } from './electrical';

export type CategoryId =
  | 'power-source'
  | 'protection'
  | 'switching'
  | 'control'
  | 'motor'
  | 'lighting'
  | 'wiring'
  | 'measurement'
  | 'automation'
  | 'accessories';

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  description: string;
}

/** Glyph simbol IEC yang digambar di sepanjang jalur antar-terminal. */
export type PoleGlyph =
  | 'wire'
  | 'breaker'
  | 'rccb'
  | 'contact-no'
  | 'contact-nc'
  | 'switch'
  | 'fuse'
  | 'coil'
  | 'thermal'
  | 'pb-no'
  | 'pb-nc'
  | 'mushroom'
  | 'limit-no'
  | 'limit-nc'
  | 'spd'
  | 'bus'
  | 'changeover'
  | 'cross';

/**
 * Satu jalur simbol. `terminals` berisi ID terminal:
 *  - glyph 2-terminal: [atas, bawah] (kolom yang sama)
 *  - changeover: [COM(atas), A(bawah), B(bawah)]
 *  - cross: [in1, in2, out1, out2]
 *  - bus: seluruh terminal busbar
 */
export interface PathSpec {
  glyph: PoleGlyph;
  terminals: string[];
}

export type SymbolSpec =
  | { kind: 'paths'; paths: PathSpec[]; text?: string }
  | { kind: 'circle'; text: string; sub?: string }
  | { kind: 'box'; text: string; sub?: string };

export interface SpecRow {
  label: string;
  value: string;
  unit?: string;
}

/** Hasil tata letak terminal (koordinat lokal, sebelum rotasi). */
export interface TerminalLayout {
  x: number;
  y: number;
}

export interface ComponentLayout {
  width: number;
  height: number;
  terminals: Record<string, TerminalLayout>;
}

/** Input untuk mendefinisikan komponen katalog. */
export interface ComponentSource {
  /** Kunci unik, mis. "mcb-1p". */
  type: string;
  name: string;
  category: CategoryId;
  /** Awalan designator (IEC 81346 / IEC 61346): Q, KM, F, M, H, S, ... */
  designator: string;
  description: string;
  /** Fungsi komponen. */
  function: string;
  symbol: SymbolSpec;
  terminals: TerminalDefinition[];
  /** Spesifikasi referensi (datasheet virtual). */
  specs: SpecRow[];
  /**
   * Phase pengerjaan ketika komponen ini mendapat model perilaku/simulasi.
   * Di Phase 1 SEMUA komponen hanya bisa ditempatkan dan dihubungkan.
   */
  simulationPhase: number;
  tags?: string[];
  minWidth?: number;
  minHeight?: number;
  /**
   * Kelompok terminal yang secara internal adalah satu node listrik
   * (busbar, terminal block, junction box). Dipakai solver di Phase 3.
   */
  internalConnections?: string[][];
}

export interface ComponentDefinition extends ComponentSource {
  layout: ComponentLayout;
}
