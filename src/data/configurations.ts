import type { ConductorType } from '@/types/electrical';

export type ColorSchemeId = 'puil' | 'iec' | 'custom';

export const CONDUCTOR_PRESETS: Record<Exclude<ColorSchemeId, 'custom'>, { label: string; note: string; colors: Record<ConductorType, string> }> = {
  puil: {
    label: 'PUIL lama (merah–kuning–hitam)',
    note: 'L1 merah, L2 kuning, L3 hitam, N biru, PE hijau-kuning.',
    colors: {
      L: '#e5484d',
      L1: '#e5484d',
      L2: '#f2c230',
      L3: '#14171b',
      N: '#3b82f6',
      PE: '#3fa34d',
      '+24VDC': '#f0643b',
      '0VDC': '#4a6fd8',
      CONTROL: '#b086f5',
    },
  },
  iec: {
    label: 'IEC 60446 (coklat–hitam–abu-abu)',
    note: 'L1 coklat, L2 hitam, L3 abu-abu, N biru, PE hijau-kuning.',
    colors: {
      L: '#9a6232',
      L1: '#9a6232',
      L2: '#14171b',
      L3: '#9aa3ad',
      N: '#3b82f6',
      PE: '#3fa34d',
      '+24VDC': '#f0643b',
      '0VDC': '#4a6fd8',
      CONTROL: '#b086f5',
    },
  },
};

export const DEFAULT_SCHEME: ColorSchemeId = 'puil';
