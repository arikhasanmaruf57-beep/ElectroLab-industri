import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CATEGORIES } from './categories';
import { COMPONENTS, getComponentDefinition, searchComponents } from './components';
import { TERMINAL_KINDS } from '@/types/electrical';

describe('integritas katalog komponen', () => {
  it('tipe unik dan setiap kategori terisi', () => {
    assert.equal(new Set(COMPONENTS.map((c) => c.type)).size, COMPONENTS.length);
    for (const cat of CATEGORIES) assert.ok(COMPONENTS.some((c) => c.category === cat.id), cat.id);
  });
  it('setiap komponen punya terminal unik, valid, dan pada grid', () => {
    for (const c of COMPONENTS) {
      assert.ok(c.terminals.length >= 2, `${c.type} minimal 2 terminal`);
      const ids = c.terminals.map((t) => t.id);
      assert.equal(new Set(ids).size, ids.length, `${c.type} ID terminal duplikat`);
      for (const t of c.terminals) {
        assert.ok(TERMINAL_KINDS.includes(t.kind));
        const p = c.layout.terminals[t.id];
        assert.ok(p, `${c.type}.${t.id} tanpa layout`);
        assert.equal(p.x % 10, 0); assert.equal(p.y % 10, 0);
      }
      assert.ok(c.specs.length > 0 && c.description && c.function && c.designator);
    }
  });
  it('simbol merujuk terminal yang ada; jalur 2-terminal vertikal (kolom sama)', () => {
    for (const c of COMPONENTS) {
      if (c.symbol.kind !== 'paths') continue;
      for (const p of c.symbol.paths) {
        for (const id of p.terminals) assert.ok(c.layout.terminals[id], `${c.type}: ${id}`);
        if (['changeover', 'cross', 'bus'].includes(p.glyph)) continue;
        const [a, b] = p.terminals.map((id) => c.layout.terminals[id]!);
        assert.equal(a!.x, b!.x, `${c.type} ${p.terminals.join('-')} tidak sekolom`);
        assert.ok(a!.y < b!.y);
      }
    }
  });
  it('internalConnections merujuk terminal yang ada', () => {
    for (const c of COMPONENTS) for (const g of c.internalConnections ?? []) for (const id of g) assert.ok(c.layout.terminals[id], `${c.type}:${id}`);
  });
  it('terminal kontrol penting benar (kontaktor, TOR, motor)', () => {
    const k = getComponentDefinition('contactor-3p')!;
    assert.deepEqual(['A1', 'A2', '13', '14', '21', '22'].filter((id) => !k.layout.terminals[id]), []);
    assert.equal(k.terminals.find((t) => t.id === 'A1')!.kind, 'coil');
    assert.equal(getComponentDefinition('motor-3p-6t')!.terminals.filter((t) => /^[UVW][12]$/.test(t.id)).length, 6);
    assert.equal(getComponentDefinition('motor-3p-3t')!.terminals.some((t) => /2$/.test(t.id)), false);
    assert.equal(getComponentDefinition('tor-3p')!.terminals.find((t) => t.id === '95')!.kind, 'contact');
  });
  it('pencarian', () => {
    assert.ok(searchComponents('kontaktor').some((c) => c.type === 'contactor-3p'));
    assert.ok(searchComponents('mcb', 'protection').every((c) => c.category === 'protection'));
    assert.equal(searchComponents('zzzz-tidak-ada').length, 0);
    assert.equal(searchComponents('').length, COMPONENTS.length);
  });
});
