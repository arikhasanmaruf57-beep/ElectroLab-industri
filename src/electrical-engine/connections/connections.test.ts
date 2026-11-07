import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { addComponent, connect, emptyDocument } from '@/store/workspace-store/document';
import type { WorkspaceDocument } from '@/types/workspace';
import { checkConnection } from './validate';
import { routeWire } from './routing';
import { SIDE_VECTOR } from '../core/geometry';

function setup(...types: string[]) {
  let doc: WorkspaceDocument = emptyDocument();
  const ids: string[] = [];
  types.forEach((t, i) => {
    const r = addComponent(doc, t, i * 200, 0)!;
    doc = r.doc; ids.push(r.id);
  });
  return { doc, ids };
}
const ref = (componentId: string, terminalId: string) => ({ componentId, terminalId });

describe('validasi koneksi', () => {
  it('menyambung L sumber ke MCB dan menyimpulkan konduktor', () => {
    const { doc, ids } = setup('ac-1p-source', 'mcb-1p');
    const r = checkConnection(doc, ref(ids[0]!, 'L'), ref(ids[1]!, '1'));
    assert.deepEqual(r, { ok: true, conductor: 'L' });
  });
  it('menyimpulkan N dan PE', () => {
    const { doc, ids } = setup('ac-1p-source', 'socket-earthed');
    assert.deepEqual(checkConnection(doc, ref(ids[0]!, 'N'), ref(ids[1]!, 'N')), { ok: true, conductor: 'N' });
    assert.deepEqual(checkConnection(doc, ref(ids[0]!, 'PE'), ref(ids[1]!, 'PE')), { ok: true, conductor: 'PE' });
  });
  it('menolak fase ke netral dan netral ke PE', () => {
    const { doc, ids } = setup('ac-1p-source', 'socket-earthed');
    const a = checkConnection(doc, ref(ids[0]!, 'L'), ref(ids[1]!, 'N'));
    assert.equal(a.ok, false); if (!a.ok) assert.equal(a.code, 'incompatible');
    assert.equal(checkConnection(doc, ref(ids[0]!, 'N'), ref(ids[1]!, 'PE')).ok, false);
  });
  it('menolak terminal sama, duplikat (dua arah), dan terminal penuh', () => {
    const { doc, ids } = setup('mcb-1p', 'mcb-1p', 'mcb-1p', 'mcb-1p');
    const same = checkConnection(doc, ref(ids[0]!, '2'), ref(ids[0]!, '2'));
    assert.equal(!same.ok && same.code, 'same-terminal');
    const c1 = connect(doc, ref(ids[0]!, '2'), ref(ids[1]!, '1'));
    assert.ok(c1.result.ok);
    const dup = checkConnection(c1.doc, ref(ids[1]!, '1'), ref(ids[0]!, '2'));
    assert.equal(!dup.ok && dup.code, 'duplicate');
    const c2 = connect(c1.doc, ref(ids[0]!, '2'), ref(ids[2]!, '1'));
    assert.ok(c2.result.ok);
    const full = checkConnection(c2.doc, ref(ids[0]!, '2'), ref(ids[3]!, '1'));
    assert.equal(!full.ok && full.code, 'terminal-full');
  });
  it('busbar menerima lebih banyak penghantar daripada terminal biasa', () => {
    const { doc, ids } = setup('busbar-phase', 'mcb-1p', 'mcb-1p', 'mcb-1p');
    let d = doc;
    for (const id of ids.slice(1)) {
      const r = connect(d, ref(ids[0]!, 'T-L1'), ref(id, '1'));
      assert.ok(r.result.ok); d = r.doc;
    }
    assert.equal(d.wires.length, 3);
  });
  it('komponen/terminal tak dikenal ditolak', () => {
    const { doc, ids } = setup('mcb-1p', 'mcb-1p');
    const r = checkConnection(doc, ref(ids[0]!, 'XX'), ref(ids[1]!, '1'));
    assert.equal(!r.ok && r.code, 'unknown-terminal');
    const r2 = checkConnection(doc, ref('nope', '1'), ref(ids[1]!, '1'));
    assert.equal(!r2.ok && r2.code, 'unknown-component');
  });
  it('koil ke netral & kontak ke kumparan valid; konduktor CONTROL / N', () => {
    const { doc, ids } = setup('contactor-3p', 'pb-start-no', 'ac-1p-source');
    assert.deepEqual(checkConnection(doc, ref(ids[0]!, 'A2'), ref(ids[2]!, 'N')), { ok: true, conductor: 'N' });
    assert.deepEqual(checkConnection(doc, ref(ids[1]!, '4'), ref(ids[0]!, 'A1')), { ok: true, conductor: 'CONTROL' });
    assert.equal(checkConnection(doc, ref(ids[0]!, 'A1'), ref(ids[0]!, 'A2')).ok, false, 'koil ke koil ditolak');
  });
});

describe('routing kabel', () => {
  it('semua segmen horizontal/vertikal untuk kombinasi arah', () => {
    const dirs = Object.values(SIDE_VECTOR);
    for (const da of dirs) for (const db of dirs) {
      const pts = routeWire({ x: 0, y: 0, dir: da }, { x: 120, y: 90, dir: db });
      for (let i = 1; i < pts.length; i++) assert.ok(pts[i]!.x === pts[i - 1]!.x || pts[i]!.y === pts[i - 1]!.y);
      assert.deepEqual(pts[0], { x: 0, y: 0 }); assert.deepEqual(pts[pts.length - 1], { x: 120, y: 90 });
    }
  });
});
