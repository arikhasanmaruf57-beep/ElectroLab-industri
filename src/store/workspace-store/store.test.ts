import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { componentBounds, boundsIntersect } from '@/electrical-engine/core/geometry';
import { getComponentDefinition } from '@/data/components';
import {
  addComponent, autoArrange, connect, copyItems, emptyDocument, nextDesignator, pasteItems, removeItems, rotateComponents, sanitizeDocument,
} from './document';
import { commit, emptyHistory, redo, undo } from './history';
import { useWorkspaceStore } from './index';

const ref = (componentId: string, terminalId: string) => ({ componentId, terminalId });

describe('operasi dokumen', () => {
  it('designator bertambah per awalan', () => {
    let doc = emptyDocument();
    const labels: string[] = [];
    for (const t of ['mcb-1p', 'mcb-3p', 'contactor-3p', 'mcb-1p']) { const r = addComponent(doc, t, 0, 0)!; doc = r.doc; labels.push(doc.components.find((c) => c.id === r.id)!.label); }
    assert.deepEqual(labels, ['Q1', 'Q2', 'KM1', 'Q3']);
    assert.equal(nextDesignator(doc, { designator: 'M' }), 'M1');
  });
  it('tipe tak dikenal tidak ditambahkan', () => assert.equal(addComponent(emptyDocument(), 'x', 0, 0), null));
  it('hapus komponen ikut menghapus kabelnya', () => {
    let doc = emptyDocument();
    const a = addComponent(doc, 'mcb-1p', 0, 0)!; doc = a.doc;
    const b = addComponent(doc, 'mcb-1p', 200, 0)!; doc = b.doc;
    const c = connect(doc, ref(a.id, '2'), ref(b.id, '1')); doc = c.doc;
    assert.equal(doc.wires.length, 1);
    assert.equal(removeItems(doc, [a.id], []).wires.length, 0);
    assert.equal(removeItems(doc, [], [c.wireId!]).components.length, 2);
  });
  it('rotasi memutar 90° berulang kembali ke 0', () => {
    const r = addComponent(emptyDocument(), 'motor-1p', 0, 0)!;
    let d = r.doc; for (let i = 0; i < 4; i++) d = rotateComponents(d, [r.id]);
    assert.equal(d.components[0]!.rotation, 0);
    assert.equal(rotateComponents(r.doc, [r.id]).components[0]!.rotation, 90);
  });
  it('copy/paste: ID baru, kabel internal ikut, kabel keluar tidak', () => {
    let doc = emptyDocument();
    const ids = ['mcb-1p', 'mcb-1p', 'mcb-1p'].map((t, i) => { const r = addComponent(doc, t, i * 200, 0)!; doc = r.doc; return r.id; });
    doc = connect(doc, ref(ids[0]!, '2'), ref(ids[1]!, '1')).doc;
    doc = connect(doc, ref(ids[1]!, '2'), ref(ids[2]!, '1')).doc;
    const clip = copyItems(doc, [ids[0]!, ids[1]!]);
    assert.equal(clip.wires.length, 1);
    const p = pasteItems(doc, clip, 20, 20);
    assert.equal(p.doc.components.length, 5); assert.equal(p.doc.wires.length, 3);
    assert.ok(p.componentIds.every((id) => !ids.includes(id)));
    const newWire = p.doc.wires.find((w) => w.id === p.wireIds[0])!;
    assert.ok(p.componentIds.includes(newWire.from.componentId) && p.componentIds.includes(newWire.to.componentId));
    assert.deepEqual(p.doc.components.slice(3).map((c) => c.label), ['Q4', 'Q5']);
  });
  it('susun otomatis: tidak ada komponen yang bertumpuk, posisi pada grid', () => {
    let doc = emptyDocument();
    for (const t of ['motor-3p-6t', 'ac-3p-source', 'mcb-3p', 'contactor-3p', 'tor-3p', 'lamp-led', 'pb-start-no', 'pb-stop-nc', 'mcb-1p', 'plc-basic']) doc = addComponent(doc, t, 0, 0)!.doc;
    doc = { ...doc, components: doc.components.map((c, i) => (i % 3 === 0 ? { ...c, rotation: 90 as const } : c)) };
    const out = autoArrange(doc);
    const bs = out.components.map((c) => componentBounds(c, getComponentDefinition(c.type)!.layout));
    for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) assert.equal(boundsIntersect(bs[i]!, bs[j]!), false, `${i}/${j}`);
    for (const c of out.components) { assert.equal(c.x % 10, 0); assert.equal(c.y % 10, 0); }
    const src = out.components.find((c) => c.type === 'ac-3p-source')!, mot = out.components.find((c) => c.type === 'motor-3p-6t')!;
    assert.ok(src.x < mot.x, 'sumber di kiri beban');
  });
  it('sanitizeDocument membuang data tidak valid', () => {
    let doc = emptyDocument();
    const a = addComponent(doc, 'mcb-1p', 0, 0)!; doc = a.doc;
    const b = addComponent(doc, 'ac-1p-source', 0, 0)!; doc = b.doc;
    doc = connect(doc, ref(a.id, '1'), ref(b.id, 'L')).doc;
    const raw = JSON.parse(JSON.stringify(doc));
    assert.deepEqual(sanitizeDocument(raw), doc);
    raw.components.push({ id: 'z', type: 'tidak-ada', x: 0, y: 0, rotation: 0, label: 'Z' });
    raw.wires.push({ id: 'w9', from: { componentId: a.id, terminalId: '2' }, to: { componentId: b.id, terminalId: 'N' }, conductor: 'L' });
    raw.wires.push({ id: 'w8', from: { componentId: 'hilang', terminalId: '1' }, to: { componentId: a.id, terminalId: '2' }, conductor: 'L' });
    const clean = sanitizeDocument(raw)!;
    assert.equal(clean.components.length, 2);
    assert.equal(clean.wires.length, 1);
    assert.equal(sanitizeDocument({ schemaVersion: 2 }), null);
    assert.equal(sanitizeDocument(null), null);
  });
});

describe('history', () => {
  it('commit/undo/redo', () => {
    const d0 = emptyDocument(); const d1 = addComponent(d0, 'mcb-1p', 0, 0)!.doc;
    let h = commit(emptyHistory(), d0);
    const u = undo(h, d1)!; assert.equal(u.doc, d0); h = u.history;
    const r = redo(h, u.doc)!; assert.equal(r.doc, d1);
    assert.equal(undo(emptyHistory(), d0), null);
    const h2 = commit(commit(emptyHistory(), d0), d1);
    assert.equal(h2.future.length, 0);
  });
});

describe('store workspace', () => {
  beforeEach(() => { useWorkspaceStore.getState().newProject(); });
  const S = () => useWorkspaceStore.getState();

  it('tambah, pilih, undo, redo', () => {
    const id = S().addComponentAt('mcb-1p', 200, 200)!;
    assert.deepEqual(S().selection.components, [id]);
    assert.equal(S().doc.components.length, 1);
    assert.equal(S().doc.components[0]!.x % 10, 0);
    S().undo(); assert.equal(S().doc.components.length, 0);
    S().redo(); assert.equal(S().doc.components.length, 1);
  });
  it('drag memindahkan seleksi dan hanya satu entri undo', () => {
    const id = S().addComponentAt('mcb-1p', 200, 200)!;
    const x0 = S().doc.components[0]!.x;
    S().beginDrag(); S().dragBy(10, 5); S().dragBy(47, 33); S().endDrag();
    assert.equal(S().doc.components[0]!.x, Math.round((x0 + 47) / 10) * 10);
    assert.equal(S().history.past.length, 2);
    S().undo(); assert.equal(S().doc.components.find((c) => c.id === id)!.x, x0);
  });
  it('klik tanpa gerak tidak menambah riwayat', () => {
    S().addComponentAt('mcb-1p', 100, 100); const n = S().history.past.length;
    S().beginDrag(); S().endDrag(); assert.equal(S().history.past.length, n);
  });
  it('connectTerminals: sukses memilih kabel; gagal memberi notice error', () => {
    const a = S().addComponentAt('ac-1p-source', 100, 100)!, b = S().addComponentAt('mcb-1p', 300, 100)!;
    assert.ok(S().connectTerminals(ref(a, 'L'), ref(b, '1')).ok);
    assert.equal(S().doc.wires.length, 1); assert.equal(S().notice?.kind, 'success');
    assert.equal(S().connectTerminals(ref(a, 'N'), ref(b, '1')).ok, false);
    assert.equal(S().notice?.kind, 'error'); assert.equal(S().doc.wires.length, 1);
  });
  it('hapus, salin, tempel, potong', () => {
    const a = S().addComponentAt('mcb-1p', 100, 100)!;
    S().selectOnly(a); S().copySelection(); S().paste(); S().paste();
    assert.equal(S().doc.components.length, 3);
    assert.notEqual(S().doc.components[1]!.x, S().doc.components[2]!.x);
    S().cutSelection(); assert.equal(S().doc.components.length, 2);
    S().paste(); assert.equal(S().doc.components.length, 3);
  });
  it('zoom ke kursor mempertahankan titik dunia di bawah kursor; batas zoom', () => {
    S().zoomBy(2, 300, 200);
    const v = S().viewport; assert.equal(v.zoom, 2);
    assert.equal((300 - v.x) / v.zoom, 300); assert.equal((200 - v.y) / v.zoom, 200);
    for (let i = 0; i < 20; i++) S().zoomBy(2); assert.equal(S().viewport.zoom, 3);
    for (let i = 0; i < 40; i++) S().zoomBy(0.5); assert.equal(S().viewport.zoom, 0.25);
  });
  it('fitToContent memuat seluruh komponen di kanvas', () => {
    S().addComponentAt('mcb-3p', 0, 0); S().addComponentAt('motor-3p-6t', 900, 600);
    S().setCanvasSize(800, 500); S().fitToContent();
    const { viewport: v, canvasSize } = S();
    const toScreen = (x: number, y: number) => ({ x: x * v.zoom + v.x, y: y * v.zoom + v.y });
    for (const p of [toScreen(-40, -50), toScreen(900 + 40, 600 + 60)]) assert.ok(p.x >= 0 && p.x <= canvasSize.width && p.y >= 0 && p.y <= canvasSize.height, JSON.stringify(p));
  });
});
