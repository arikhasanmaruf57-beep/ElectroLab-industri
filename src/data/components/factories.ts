import type { SpecRow } from '@/types/component';
import type { PhaseLabel, TerminalDefinition, TerminalKind, TerminalSide } from '@/types/electrical';

export function term(
  id: string,
  name: string,
  kind: TerminalKind,
  side: TerminalSide,
  fn: string,
  extra: Partial<Pick<TerminalDefinition, 'phase' | 'maxConnections'>> = {},
): TerminalDefinition {
  return { id, name, kind, side, function: fn, ...extra };
}

export const spec = (label: string, value: string, unit?: string): SpecRow =>
  unit ? { label, value, unit } : { label, value };

export interface Pole {
  inId: string;
  outId: string;
  label: string;
  kind: 'power' | 'neutral';
  phase?: PhaseLabel;
}

const L = (inId: string, outId: string, label: string, phase: PhaseLabel): Pole => ({ inId, outId, label, kind: 'power', phase });
const N = (inId: string, outId: string): Pole => ({ inId, outId, label: 'N', kind: 'neutral' });

export const POLES_1P: Pole[] = [L('1', '2', 'L', 'L')];
export const POLES_1PN: Pole[] = [L('1', '2', 'L', 'L'), N('3', '4')];
export const POLES_3P: Pole[] = [L('1', '2', 'L1', 'L1'), L('3', '4', 'L2', 'L2'), L('5', '6', 'L3', 'L3')];
export const POLES_3PN: Pole[] = [...POLES_3P, N('7', '8')];

/**
 * Perangkat berkutub (MCB, RCCB, kontaktor, ...): sisi masuk di atas, sisi keluar di bawah,
 * kolom ke-i atas berpasangan dengan kolom ke-i bawah.
 */
export function poleDevice(poles: Pole[]): { terminals: TerminalDefinition[]; pairs: string[][] } {
  const terminals: TerminalDefinition[] = [];
  for (const p of poles) {
    terminals.push(
      term(p.inId, `${p.label} LINE`, p.kind, 'top', `Sisi suplai (masuk) kutub ${p.label}`, p.phase ? { phase: p.phase } : {}),
    );
  }
  for (const p of poles) {
    terminals.push(
      term(p.outId, `${p.label} LOAD`, p.kind, 'bottom', `Sisi beban (keluar) kutub ${p.label}`, p.phase ? { phase: p.phase } : {}),
    );
  }
  return { terminals, pairs: poles.map((p) => [p.inId, p.outId]) };
}
