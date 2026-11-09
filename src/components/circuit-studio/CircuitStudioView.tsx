'use client';

import { useMemo, useState } from 'react';
import { CATEGORIES } from '@/data/categories';
import { COMPONENTS } from '@/data/components';
import type { CategoryId } from '@/types/component';
import { Icon } from '@/components/ui/Icon';

type StudioMode = 'schematic' | 'breadboard' | 'panel';
const MODES: { id: StudioMode; label: string; description: string; icon: 'wire' | 'grid' | 'workspace' }[] = [
  { id: 'schematic', label: 'Schematic', description: 'Diagram listrik dan koneksi terminal', icon: 'wire' },
  { id: 'breadboard', label: 'Breadboard', description: 'Penempatan komponen elektronika', icon: 'grid' },
  { id: 'panel', label: 'Panel Layout', description: 'Tata letak perangkat panel industri', icon: 'workspace' },
];

export function CircuitStudioView() {
  const [mode, setMode] = useState<StudioMode>('schematic');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const [placed, setPlaced] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMPONENTS.filter((item) => {
      const categoryMatch = category === 'all' || item.category === category;
      const queryMatch = !q || [item.name, item.type, item.description, ...(item.tags ?? [])].join(' ').toLowerCase().includes(q);
      return categoryMatch && queryMatch;
    });
  }, [category, query]);
  const selectedDefinition = COMPONENTS.find((item) => item.type === selected);
  const addComponent = (type: string) => { setPlaced((items) => [...items, type]); setSelected(type); };
  const modeLabel = MODES.find((item) => item.id === mode)?.label ?? 'Schematic';

  return (
    <div className="flex h-full min-h-[680px] flex-col bg-bg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted"><span>ElectroLab</span><Icon name="chevron" size={12} /><span>Circuit Studio</span></div>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">Circuit Studio</h1>
          <p className="mt-1 text-sm text-muted">Ruang desain rangkaian dan panel dalam ekosistem ElectroLab.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-line bg-surface px-3 py-2 text-xs text-muted">Draft lokal · sesi ini</span>
          <button type="button" onClick={() => { setPlaced([]); setSelected(null); }} className="rounded-lg border border-line px-3 py-2 text-xs font-medium text-muted transition hover:bg-raised hover:text-ink">Kosongkan</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-surface/60 px-4 py-3 sm:px-6">
        {MODES.map((item) => (
          <button key={item.id} type="button" onClick={() => setMode(item.id)} aria-pressed={mode === item.id}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left transition-all ${mode === item.id ? 'border-accent/50 bg-accent/10 text-accent shadow-sm' : 'border-transparent text-muted hover:border-line hover:bg-raised hover:text-ink'}`}>
            <Icon name={item.icon} size={17} />
            <span><span className="block text-xs font-semibold">{item.label}</span><span className="hidden text-[10px] opacity-70 sm:block">{item.description}</span></span>
          </button>
        ))}
        <div className="ml-auto hidden items-center gap-2 text-[11px] text-muted xl:flex"><span className="size-1.5 rounded-full bg-amber-400" /> Fondasi editor · fitur wiring dalam pengembangan</div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_260px]">
        <aside className="order-2 flex min-h-[260px] flex-col border-t border-line bg-surface/70 xl:order-1 xl:min-h-0 xl:border-r xl:border-t-0">
          <div className="border-b border-line p-4">
            <div className="flex items-center justify-between"><h2 className="text-xs font-semibold uppercase tracking-wider text-ink">Component Library</h2><span className="text-[10px] text-muted">{filtered.length} item</span></div>
            <label className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-bg px-3 py-2.5">
              <Icon name="search" size={15} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari komponen..." className="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-muted" />
            </label>
            <select value={category} onChange={(event) => setCategory(event.target.value as CategoryId | 'all')} className="mt-2 w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-xs text-ink outline-none">
              <option value="all">Semua kategori</option>
              {CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </div>
          <div className="scroll-thin flex-1 space-y-1 overflow-y-auto p-2">
            {filtered.map((item) => (
              <button key={item.type} type="button" onClick={() => addComponent(item.type)} className="group flex w-full items-center gap-3 rounded-xl border border-transparent p-2.5 text-left transition hover:border-line hover:bg-raised">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-bg text-accent"><Icon name="bolt" size={16} /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium text-ink">{item.name}</span><span className="block truncate text-[10px] text-muted">{item.type}</span></span>
                <Icon name="plus" size={14} className="text-muted opacity-0 transition group-hover:opacity-100" />
              </button>
            ))}
            {filtered.length === 0 && <p className="px-3 py-8 text-center text-xs text-muted">Komponen tidak ditemukan.</p>}
          </div>
          <div className="border-t border-line p-3 text-[10px] leading-relaxed text-muted">Menggunakan katalog komponen ElectroLab yang sudah ada. Klik komponen untuk memasukkannya ke daftar desain sesi ini.</div>
        </aside>

        <section className="order-1 flex min-h-[430px] min-w-0 flex-col bg-bg xl:order-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
            <div><p className="text-xs font-semibold text-ink">{modeLabel} Workspace</p><p className="text-[10px] text-muted">Area kerja desain · {placed.length} komponen ditambahkan</p></div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted"><Icon name="grid" size={13} /> Grid aktif <span className="mx-1">·</span> 2D</div>
          </div>
          <div className="relative m-3 min-h-[360px] flex-1 overflow-hidden rounded-2xl border border-line bg-surface" style={{ backgroundImage: 'radial-gradient(var(--studio-grid, rgba(120,140,160,.22)) 1px, transparent 1px)', backgroundSize: '22px 22px' }}>
            {placed.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 text-accent"><Icon name={mode === 'panel' ? 'workspace' : mode === 'breadboard' ? 'grid' : 'wire'} size={30} /></div>
                <h2 className="text-base font-semibold text-ink">Mulai desain {modeLabel}</h2>
                <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted">{mode === 'panel' ? 'Tambahkan perangkat panel seperti MCB, kontaktor, TOR, PLC, dan terminal block.' : mode === 'breadboard' ? 'Pilih komponen dari library untuk mulai menyusun prototipe elektronika.' : 'Pilih komponen dari library untuk mulai menyusun diagram rangkaian listrik.'}</p>
                <span className="mt-4 rounded-lg border border-line bg-bg px-3 py-2 text-[10px] text-muted">Pilih komponen di panel kiri untuk memulai</span>
              </div>
            ) : (
              <div className="relative z-10 grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {placed.map((type, index) => {
                  const item = COMPONENTS.find((component) => component.type === type);
                  if (!item) return null;
                  return <button key={`${type}-${index}`} type="button" onClick={() => setSelected(type)} className={`rounded-xl border p-3 text-left transition ${selected === type ? 'border-accent bg-accent/10' : 'border-line bg-surface/90 hover:border-accent/40'}`}>
                    <span className="flex items-center justify-between"><span className="text-[10px] text-muted">#{String(index + 1).padStart(2, '0')}</span><Icon name="bolt" size={14} className="text-accent" /></span>
                    <span className="mt-2 block text-xs font-semibold text-ink">{item.name}</span>
                    <span className="mt-1 block text-[10px] text-muted">{item.terminals.length} terminal · {item.designator}</span>
                  </button>;
                })}
              </div>
            )}
            <div className="absolute bottom-3 left-3 rounded-lg border border-line bg-bg/90 px-2.5 py-1.5 text-[10px] text-muted backdrop-blur">ElectroLab · {modeLabel}</div>
          </div>
        </section>

        <aside className="order-3 border-t border-line bg-surface/70 xl:border-l xl:border-t-0">
          <div className="border-b border-line p-4"><h2 className="text-xs font-semibold uppercase tracking-wider text-ink">Inspector</h2><p className="mt-1 text-[10px] text-muted">Informasi komponen terpilih</p></div>
          {selectedDefinition ? (
            <div className="space-y-4 p-4">
              <div><p className="text-sm font-semibold text-ink">{selectedDefinition.name}</p><p className="mt-1 text-[10px] text-muted">{selectedDefinition.type}</p></div>
              <p className="text-xs leading-relaxed text-muted">{selectedDefinition.description}</p>
              <div className="rounded-xl border border-line bg-bg p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Terminal</p><div className="mt-2 space-y-2">{selectedDefinition.terminals.map((terminal) => <div key={terminal.id} className="flex items-center justify-between gap-2 text-xs"><span className="font-medium text-ink">{terminal.label}</span><span className="text-[10px] text-muted">{terminal.kind}</span></div>)}</div></div>
              <button type="button" onClick={() => { setPlaced((items) => { const index = items.lastIndexOf(selectedDefinition.type); return index < 0 ? items : items.filter((_, i) => i !== index); }); setSelected(null); }} className="w-full rounded-lg border border-line px-3 py-2 text-xs text-muted transition hover:border-red-400/40 hover:text-red-400">Hapus dari daftar desain</button>
            </div>
          ) : <div className="p-4 text-xs leading-relaxed text-muted">Belum ada komponen dipilih. Tambahkan komponen dari library untuk melihat informasi terminal dan spesifikasinya.</div>}
          <div className="mx-4 mt-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3"><div className="flex items-center gap-2 text-[11px] font-semibold text-amber-500"><Icon name="warn" size={14} /> Status pengembangan</div><p className="mt-2 text-[10px] leading-relaxed text-muted">Ini adalah fondasi UI Circuit Studio. Penempatan bebas pada kanvas, wiring interaktif, penyimpanan proyek, dan parser Fritzing akan ditambahkan bertahap.</p></div>
        </aside>
      </div>
    </div>
  );
}
