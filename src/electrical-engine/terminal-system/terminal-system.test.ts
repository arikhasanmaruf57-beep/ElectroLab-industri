import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { TERMINAL_KINDS } from '@/types/electrical';
import type { TerminalDefinition } from '@/types/electrical';
import { terminalWorld, componentBounds } from '../core/geometry';
import { checkKinds } from './compatibility';
import { buildLayout } from './layout';

describe('kompatibilitas terminal', () => {
  it('simetris untuk semua pasangan jenis', () => {
    for (const a of TERMINAL_KINDS) for (const b of TERMINAL_KINDS) {
      assert.equal(checkKinds(a, b).ok, checkKinds(b, a).ok, `${a}/${b}`);
    }
  });
  it('menolak fase↔netral, netral↔PE, PE↔lainnya, DC+↔DC−, AC↔DC', () => {
    for (const [a, b] of [['power', 'neutral'], ['neutral', 'earth'], ['earth', 'power'], ['dc-positive', 'dc-negative'], ['power', 'signal'], ['neutral', 'dc-positive'], ['coil', 'coil']] as const) {
      const r = checkKinds(a, b);
      assert.equal(r.ok, false, `${a}/${b}`);
      assert.ok(r.reason && r.reason.length > 5);
    }
  });
  it('menerima sambungan umum', () => {
    for (const [a, b] of [['power', 'power'], ['power', 'coil'], ['coil', 'neutral'], ['contact', 'contact'], ['earth', 'earth'], ['neutral', 'neutral'], ['dc-positive', 'coil'], ['signal', 'contact']] as const) {
      assert.equal(checkKinds(a, b).ok, true, `${a}/${b}`);
    }
  });
  it('probe boleh ke jenis apa pun kecuali probe', () => {
    for (const k of TERMINAL_KINDS) assert.equal(checkKinds('probe', k).ok, k !== 'probe');
  });
});

const t = (id: string, side: TerminalDefinition['side']): TerminalDefinition => ({ id, name: id, kind: 'power', side, function: '' });

describe('layout terminal', () => {
  it('semua terminal pada kelipatan 10 dan di tepi badan', () => {
    const l = buildLayout([t('a', 'top'), t('b', 'top'), t('c', 'bottom'), t('d', 'bottom'), t('e', 'right')]);
    for (const p of Object.values(l.terminals)) {
      assert.equal(p.x % 10, 0); assert.equal(p.y % 10, 0);
      assert.ok(p.x >= 0 && p.x <= l.width && p.y >= 0 && p.y <= l.height);
    }
    assert.equal(l.width % 20, 0); assert.equal(l.height % 20, 0);
    assert.equal(l.terminals.a!.y, 0); assert.equal(l.terminals.c!.y, l.height); assert.equal(l.terminals.e!.x, l.width);
  });
  it('rotasi 90° searah jarum jam memetakan terminal atas ke kanan', () => {
    const l = buildLayout([t('a', 'top'), t('b', 'bottom')]);
    const w0 = terminalWorld({ x: 100, y: 100, rotation: 0 }, l, 'top', 'a');
    const w90 = terminalWorld({ x: 100, y: 100, rotation: 90 }, l, 'top', 'a');
    assert.deepEqual(w0.dir, { x: 0, y: -1 });
    assert.deepEqual(w90.dir, { x: 1, y: 0 });
    // pusat tetap: jarak ke pusat sama
    const cx = 100 + l.width / 2, cy = 100 + l.height / 2;
    assert.equal(Math.hypot(w0.x - cx, w0.y - cy), Math.hypot(w90.x - cx, w90.y - cy));
    assert.ok(w90.x > cx);
  });
  it('bounds menukar lebar-tinggi pada rotasi 90', () => {
    const l = buildLayout([t('a', 'top'), t('b', 'bottom')], { minHeight: 140 });
    const b = componentBounds({ x: 0, y: 0, rotation: 90 }, l);
    assert.equal(b.width, l.height); assert.equal(b.height, l.width);
  });
});
