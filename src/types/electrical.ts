/**
 * Tipe dasar domain kelistrikan: terminal dan penghantar.
 * Tidak bergantung pada React/Next — dipakai oleh engine, store, dan UI.
 */

/**
 * Jenis terminal. Menentukan apa yang boleh dihubungkan ke terminal ini
 * (lihat `electrical-engine/terminal-system/compatibility.ts`).
 *
 * - power:        penghantar aktif AC (fase) atau jalur daya
 * - neutral:      netral (N)
 * - earth:        pembumian / proteksi (PE) — SELALU dibedakan dari netral
 * - dc-positive:  kutub + catu DC
 * - dc-negative:  kutub − / 0 V catu DC
 * - coil:         kumparan (kontaktor, relay, timer, solenoid)
 * - contact:      kontak bantu / kontak kendali (NO/NC, push button, limit switch)
 * - signal:       sinyal level rendah (sensor, I/O PLC)
 * - probe:        titik probe alat ukur (boleh menyentuh jenis apa pun)
 */
export type TerminalKind =
  | 'power'
  | 'neutral'
  | 'earth'
  | 'dc-positive'
  | 'dc-negative'
  | 'coil'
  | 'contact'
  | 'signal'
  | 'probe';

export const TERMINAL_KINDS: readonly TerminalKind[] = [
  'power',
  'neutral',
  'earth',
  'dc-positive',
  'dc-negative',
  'coil',
  'contact',
  'signal',
  'probe',
];

export const TERMINAL_KIND_LABELS: Record<TerminalKind, string> = {
  power: 'Daya (fase)',
  neutral: 'Netral',
  earth: 'Pembumian (PE)',
  'dc-positive': 'DC +',
  'dc-negative': 'DC −',
  coil: 'Kumparan',
  contact: 'Kontak kendali',
  signal: 'Sinyal',
  probe: 'Probe ukur',
};

export type TerminalSide = 'top' | 'bottom' | 'left' | 'right';

/** Label fase untuk terminal bertipe `power` (dipakai untuk warna penghantar). */
export type PhaseLabel = 'L' | 'L1' | 'L2' | 'L3';

export interface TerminalDefinition {
  /** ID unik di dalam satu komponen, mis. "1", "A1", "U1". */
  id: string;
  /** Nama tampilan, mis. "L1 LINE". */
  name: string;
  kind: TerminalKind;
  side: TerminalSide;
  /** Fungsi elektris dalam bahasa manusia. */
  function: string;
  phase?: PhaseLabel;
  /** Jumlah penghantar maksimum pada terminal ini (default 2). */
  maxConnections?: number;
}

/** Jenis penghantar (sesuai spesifikasi master prompt). */
export type ConductorType =
  | 'L'
  | 'L1'
  | 'L2'
  | 'L3'
  | 'N'
  | 'PE'
  | '+24VDC'
  | '0VDC'
  | 'CONTROL';

export const CONDUCTOR_TYPES: readonly ConductorType[] = [
  'L',
  'L1',
  'L2',
  'L3',
  'N',
  'PE',
  '+24VDC',
  '0VDC',
  'CONTROL',
];

export const CONDUCTOR_LABELS: Record<ConductorType, string> = {
  L: 'L (fase 1-phase)',
  L1: 'L1',
  L2: 'L2',
  L3: 'L3',
  N: 'N (netral)',
  PE: 'PE (pembumian)',
  '+24VDC': '+24VDC',
  '0VDC': '0VDC',
  CONTROL: 'Sinyal kontrol',
};
