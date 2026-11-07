import type { TerminalKind } from '@/types/electrical';
import { TERMINAL_KIND_LABELS } from '@/types/electrical';

/**
 * Pasangan jenis terminal yang BOLEH dihubungkan langsung dengan kabel.
 * Tidak semua terminal dapat dihubungkan satu sama lain (spesifikasi §8).
 *
 * Catatan desain: aturan ini hanya memeriksa JENIS terminal. Apakah sebuah
 * sambungan yang valid secara jenis menimbulkan hubung singkat secara topologi
 * (mis. fase–netral lewat beban vs. tanpa beban) adalah tugas solver di Phase 3,
 * bukan validator terminal.
 */
const ALLOWED: ReadonlyArray<readonly [TerminalKind, TerminalKind]> = [
  ['power', 'power'],
  ['power', 'coil'],
  ['power', 'contact'],
  ['coil', 'neutral'],
  ['coil', 'dc-positive'],
  ['coil', 'dc-negative'],
  ['coil', 'contact'],
  ['coil', 'signal'],
  ['contact', 'contact'],
  ['contact', 'dc-positive'],
  ['contact', 'dc-negative'],
  ['contact', 'signal'],
  ['neutral', 'neutral'],
  ['earth', 'earth'],
  ['dc-positive', 'dc-positive'],
  ['dc-negative', 'dc-negative'],
  ['dc-positive', 'signal'],
  ['dc-negative', 'signal'],
  ['signal', 'signal'],
];

const ALLOWED_SET = new Set(ALLOWED.map(([a, b]) => pairKey(a, b)));

function pairKey(a: TerminalKind, b: TerminalKind): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export interface KindCheck {
  ok: boolean;
  /** Alasan dalam bahasa Indonesia jika ditolak. */
  reason?: string;
}

const AC_KINDS: TerminalKind[] = ['power', 'neutral', 'earth'];
const LOW_KINDS: TerminalKind[] = ['dc-positive', 'dc-negative', 'signal'];

export function checkKinds(a: TerminalKind, b: TerminalKind): KindCheck {
  if (a === 'probe' || b === 'probe') {
    if (a === 'probe' && b === 'probe') {
      return { ok: false, reason: 'Dua probe alat ukur tidak dihubungkan langsung satu sama lain.' };
    }
    return { ok: true };
  }
  if (ALLOWED_SET.has(pairKey(a, b))) return { ok: true };

  const has = (k: TerminalKind) => a === k || b === k;

  if (has('power') && has('neutral')) {
    return {
      ok: false,
      reason: 'Fase langsung ke netral adalah hubung singkat. Hubungkan melalui beban.',
    };
  }
  if (has('neutral') && has('earth')) {
    return {
      ok: false,
      reason: 'Netral (N) dan pembumian (PE) harus dibedakan; jangan disambung langsung.',
    };
  }
  if (has('earth')) {
    return { ok: false, reason: 'Penghantar PE hanya boleh dihubungkan ke terminal PE.' };
  }
  if (has('dc-positive') && has('dc-negative')) {
    return { ok: false, reason: 'Kutub + dan − langsung adalah hubung singkat catu DC.' };
  }
  if (AC_KINDS.includes(a) !== AC_KINDS.includes(b) && (LOW_KINDS.includes(a) || LOW_KINDS.includes(b))) {
    return {
      ok: false,
      reason: 'Jalur AC tidak boleh dicampur langsung dengan sirkuit DC/sinyal. Gunakan catu daya atau relay.',
    };
  }
  if (a === 'coil' && b === 'coil') {
    return { ok: false, reason: 'Dua kumparan tidak dihubungkan langsung.' };
  }
  return {
    ok: false,
    reason: `Terminal "${TERMINAL_KIND_LABELS[a]}" tidak dapat dihubungkan ke "${TERMINAL_KIND_LABELS[b]}".`,
  };
}
