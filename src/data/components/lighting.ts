import type { ComponentSource } from '@/types/component';
import { spec, term } from './factories';

function lamp(
  type: string,
  name: string,
  text: string,
  description: string,
  fn: string,
  specs: ComponentSource['specs'],
  hasPE: boolean,
  tags: string[] = [],
): ComponentSource {
  return {
    type,
    name,
    category: 'lighting',
    designator: 'H',
    description,
    function: fn,
    symbol: { kind: 'circle', text },
    terminals: [
      term('L', 'L', 'power', 'top', 'Terminal fase', { phase: 'L' }),
      term('N', 'N', 'neutral', 'bottom', 'Terminal netral'),
      ...(hasPE ? [term('PE', 'PE', 'earth', 'right', 'Pembumian rumah lampu')] : []),
    ],
    specs,
    simulationPhase: 5,
    tags,
  };
}

export const LIGHTING: ComponentSource[] = [
  lamp('lamp-led', 'Lampu LED', '✕', 'Lampu LED dengan driver internal.', 'Menghasilkan cahaya dengan daya rendah dan umur panjang.', [spec('Daya', '9', 'W'), spec('Tegangan', '220–240', 'V AC'), spec('Fluks', '800', 'lm'), spec('Faktor daya', '0.9')], false, ['bohlam', 'led']),
  lamp('lamp-incandescent', 'Lampu Pijar', '✕', 'Lampu filamen; beban resistif murni.', 'Menghasilkan cahaya dari filamen yang dipanaskan.', [spec('Daya', '40', 'W'), spec('Tegangan', '230', 'V AC'), spec('Faktor daya', '1.0')], false, ['incandescent', 'bohlam']),
  lamp('lamp-fluorescent', 'Lampu Fluorescent (TL)', 'FL', 'Lampu tabung dengan ballast.', 'Menghasilkan cahaya dari pelepasan gas; membutuhkan ballast/starter.', [spec('Daya', '36', 'W'), spec('Tegangan', '230', 'V AC'), spec('Faktor daya', '0.85')], true, ['tl', 'neon', 'tube']),
  lamp('downlight', 'Downlight', 'DL', 'Lampu tanam plafon.', 'Pencahayaan umum ruangan.', [spec('Daya', '12', 'W'), spec('Tegangan', '230', 'V AC')], false, ['plafon']),
  lamp('emergency-lamp', 'Lampu Darurat', 'EM', 'Lampu darurat dengan baterai internal.', 'Menyala otomatis saat suplai utama padam.', [spec('Daya', '8', 'W'), spec('Durasi', '180', 'menit')], false, ['emergency']),
  lamp('street-light', 'Lampu Jalan', 'SL', 'Armatur lampu jalan.', 'Pencahayaan luar ruangan; biasanya dikendalikan photocell.', [spec('Daya', '90', 'W'), spec('Tegangan', '230', 'V AC'), spec('IP', '65')], true, ['pju', 'street']),
];
