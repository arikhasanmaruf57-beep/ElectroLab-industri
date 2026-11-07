import type { ConductorType, TerminalDefinition } from '@/types/electrical';

/**
 * Menentukan jenis penghantar dari dua terminal yang dihubungkan.
 * Urutan prioritas: PE → N → DC+ → DC− → fase (dari petunjuk `phase`) → kontrol.
 * Petunjuk fase dipakai hanya untuk warna; tidak membatasi sambungan
 * (mis. pertukaran fase pada forward-reverse adalah sah).
 */
export function inferConductor(a: TerminalDefinition, b: TerminalDefinition): ConductorType {
  const kinds = [a.kind, b.kind];
  if (kinds.includes('earth')) return 'PE';
  if (kinds.includes('neutral')) return 'N';
  if (kinds.includes('dc-positive')) return '+24VDC';
  if (kinds.includes('dc-negative')) return '0VDC';
  if (a.kind === 'power' || b.kind === 'power') return a.phase ?? b.phase ?? 'L';
  return 'CONTROL';
}
