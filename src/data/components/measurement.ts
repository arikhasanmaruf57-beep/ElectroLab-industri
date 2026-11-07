import type { ComponentSource } from '@/types/component';
import { spec, term } from './factories';

export const MEASUREMENT: ComponentSource[] = [
  {
    type: 'multimeter',
    name: 'Digital Multimeter',
    category: 'measurement',
    designator: 'P',
    description: 'Multimeter digital dengan probe merah/hitam. Mode ukur: V AC/DC, A, Ω, kontinuitas.',
    function: 'Mengukur besaran listrik pada titik yang dipilih. Pembacaan nyata tersedia setelah solver aktif (Phase 3).',
    symbol: { kind: 'box', text: 'DMM' },
    terminals: [
      term('COM', 'COM', 'probe', 'bottom', 'Probe hitam (common)'),
      term('V', 'VΩ', 'probe', 'bottom', 'Probe merah (tegangan/resistansi)'),
      term('A', 'A', 'probe', 'bottom', 'Probe merah (arus)'),
    ],
    specs: [spec('Mode', 'V AC/DC, A, Ω, kontinuitas'), spec('Impedansi masukan', '10', 'MΩ'), spec('Kategori', 'CAT III 600 V')],
    simulationPhase: 3,
    tags: ['avometer', 'multitester'],
  },
  {
    type: 'voltmeter',
    name: 'Voltmeter',
    category: 'measurement',
    designator: 'P',
    description: 'Voltmeter dengan dua titik probe, dipasang paralel terhadap titik ukur.',
    function: 'Mengukur beda potensial antara dua titik.',
    symbol: { kind: 'circle', text: 'V' },
    terminals: [
      term('V+', 'V+', 'probe', 'top', 'Probe positif'),
      term('V-', 'V−', 'probe', 'bottom', 'Probe negatif'),
    ],
    specs: [spec('Rentang', '0–500', 'V'), spec('Impedansi masukan', '10', 'MΩ')],
    simulationPhase: 3,
  },
  {
    type: 'ammeter',
    name: 'Ammeter',
    category: 'measurement',
    designator: 'P',
    description: 'Ammeter dua terminal, dipasang seri dengan beban.',
    function: 'Mengukur arus yang mengalir pada jalur tempat ia dipasang.',
    symbol: { kind: 'circle', text: 'A' },
    terminals: [
      term('A+', 'A+', 'probe', 'top', 'Masuk arus'),
      term('A-', 'A−', 'probe', 'bottom', 'Keluar arus'),
    ],
    specs: [spec('Rentang', '0–20', 'A'), spec('Resistansi dalam', '~0', 'Ω')],
    simulationPhase: 3,
  },
  {
    type: 'energy-meter-1p',
    name: 'kWh Meter 1 Phase',
    category: 'measurement',
    designator: 'P',
    description: 'Meter energi satu fase dengan terminal fase dan netral masuk/keluar.',
    function: 'Mengakumulasi energi (E = P × t) yang dikonsumsi beban.',
    symbol: {
      kind: 'paths',
      text: 'kWh',
      paths: [
        { glyph: 'wire', terminals: ['1', '2'] },
        { glyph: 'wire', terminals: ['3', '4'] },
      ],
    },
    terminals: [
      term('1', 'L IN', 'power', 'top', 'Fase masuk dari PLN', { phase: 'L' }),
      term('3', 'N IN', 'neutral', 'top', 'Netral masuk'),
      term('2', 'L OUT', 'power', 'bottom', 'Fase keluar ke instalasi', { phase: 'L' }),
      term('4', 'N OUT', 'neutral', 'bottom', 'Netral keluar'),
    ],
    specs: [spec('Arus', '5–60', 'A'), spec('Tegangan', '230', 'V'), spec('Kelas akurasi', '1.0')],
    simulationPhase: 3,
    tags: ['kwh', 'energy meter', 'meteran'],
  },
];
