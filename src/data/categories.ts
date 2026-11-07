import type { CategoryId, CategoryInfo } from '@/types/component';

/** Urutan di sini juga menjadi urutan kolom pada "Susun otomatis" (sumber → proteksi → ... → beban). */
export const CATEGORIES: readonly CategoryInfo[] = [
  { id: 'power-source', label: 'Sumber Daya', description: 'Sumber AC/DC, generator, UPS, baterai, trafo, catu daya.' },
  { id: 'protection', label: 'Proteksi', description: 'MCB, MCCB, RCCB, RCBO, MPCB, TOR, SPD, sekring.' },
  { id: 'wiring', label: 'Kabel & Distribusi', description: 'Busbar, bar netral/PE, terminal block.' },
  { id: 'switching', label: 'Saklar', description: 'Saklar instalasi rumah, dimmer, timer, sensor gerak.' },
  { id: 'control', label: 'Kontrol', description: 'Push button, kontaktor, relay, timer, limit switch.' },
  { id: 'motor', label: 'Motor & Drive', description: 'Motor induksi 1/3 phase, VFD, soft starter.' },
  { id: 'lighting', label: 'Penerangan', description: 'Lampu LED, pijar, fluorescent, downlight, lampu darurat.' },
  { id: 'accessories', label: 'Aksesori', description: 'Stopkontak, steker, junction box.' },
  { id: 'measurement', label: 'Pengukuran', description: 'Multimeter, voltmeter, ammeter, kWh meter.' },
  { id: 'automation', label: 'Otomasi', description: 'PLC, sensor, solenoid valve.' },
];

export const CATEGORY_BY_ID: Record<CategoryId, CategoryInfo> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryInfo>;
