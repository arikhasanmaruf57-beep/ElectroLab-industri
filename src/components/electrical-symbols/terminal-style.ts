import type { TerminalKind } from '@/types/electrical';

/** Warna titik terminal per jenis (juga dipakai legenda di Inspector & Library). */
export const TERMINAL_COLORS: Record<TerminalKind, string> = {
  power: '#6fa8ff',
  neutral: '#9fb0c3',
  earth: '#4fc46a',
  'dc-positive': '#ff8a72',
  'dc-negative': '#7b93ff',
  coil: '#c49bff',
  contact: '#f0c75a',
  signal: '#4fd8c8',
  probe: '#f5f7fa',
};
