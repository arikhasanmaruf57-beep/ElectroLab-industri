'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CATEGORIES, CATEGORY_BY_ID } from '@/data/categories';
import { COMPONENTS, searchComponents } from '@/data/components';
import { useWorkspaceStore } from '@/store/workspace-store';
import type { CategoryId } from '@/types/component';
import { TERMINAL_KINDS, TERMINAL_KIND_LABELS } from '@/types/electrical';
import { cn } from '@/utils/cn';
import { SymbolPreview } from '../electrical-symbols/SymbolPreview';
import { TERMINAL_COLORS } from '../electrical-symbols/terminal-style';
import { Icon } from '../ui/Icon';

export function LibraryPage() {
  const router = useRouter();
  const addAtCenter = useWorkspaceStore((s) => s.addComponentAtViewCenter);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>(COMPONENTS[0]?.type ?? '');

  const results = useMemo(() => searchComponents(query, category), [query, category]);
  const selected = results.find((c) => c.type === selectedType) ?? results[0];

  return (
    <div className="mx-auto flex h-full max-w-[1400px] flex-col gap-4 p-5 lg:flex-row">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative block w-full max-w-sm">
            <span className="sr-only">Cari komponen</span>
            <Icon name="search" size={16} className="pointer-events-none absolute left-2.5 top-2.5 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama, fungsi, atau kata kunci…"
              data-testid="catalog-search"
              className="h-9 w-full rounded-md border border-line bg-surface pl-8 pr-2 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </label>
          <span className="text-sm text-muted tnum" data-testid="catalog-count">{results.length} dari {COMPONENTS.length} komponen</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter kategori">
          {([{ id: 'all', label: 'Semua' }, ...CATEGORIES] as Array<{ id: CategoryId | 'all'; label: string }>).map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
              className={cn('h-8 rounded-full border px-3 text-[13px]', category === c.id ? 'border-accent bg-accent/15 text-ink' : 'border-line text-muted hover:text-ink')}
            >
              {c.label}
            </button>
          ))}
        </div>
        <ul className="scroll-thin mt-4 grid min-h-0 flex-1 auto-rows-min grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3 overflow-y-auto pb-2">
          {results.map((c) => (
            <li key={c.type}>
              <button
                type="button"
                data-testid="catalog-card"
                aria-pressed={selected?.type === c.type}
                onClick={() => setSelectedType(c.type)}
                className={cn('flex h-full w-full flex-col rounded-lg border bg-surface p-3 text-left transition-colors hover:border-muted', selected?.type === c.type ? 'border-accent' : 'border-line')}
              >
                <SymbolPreview def={c} className="mx-auto h-24 w-full text-ink" />
                <span className="mt-2 text-[13px] font-medium leading-snug">{c.name}</span>
                <span className="mt-0.5 text-[11px] text-muted">{CATEGORY_BY_ID[c.category].label} · {c.terminals.length} terminal</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="col-span-full text-sm text-muted">Tidak ada komponen yang cocok.</li>}
        </ul>
      </div>

      {selected && (
        <aside className="scroll-thin w-full shrink-0 overflow-y-auto rounded-lg border border-line bg-surface lg:w-[380px]" aria-label="Detail komponen" data-testid="catalog-detail">
          <div className="border-b border-line p-4">
            <SymbolPreview def={selected} showTerminalIds className="mx-auto h-44 w-full text-ink" />
          </div>
          <div className="space-y-4 p-4">
            <div>
              <h2 className="text-base font-semibold">{selected.name}</h2>
              <p className="text-xs text-muted">{CATEGORY_BY_ID[selected.category].label} · designator {selected.designator}</p>
              <p className="mt-2 text-sm">{selected.description}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted">Fungsi</h3>
              <p className="mt-1 text-sm">{selected.function}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted">Datasheet virtual</h3>
              <dl className="mt-1 divide-y divide-line rounded-md border border-line text-sm">
                {selected.specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-3 px-3 py-1.5">
                    <dt className="text-muted">{s.label}</dt>
                    <dd className="tnum text-right">{s.value}{s.unit ? ` ${s.unit}` : ''}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted">Terminal ({selected.terminals.length})</h3>
              <ul className="mt-1 divide-y divide-line rounded-md border border-line text-sm">
                {selected.terminals.map((t) => (
                  <li key={t.id} className="flex items-start gap-2 px-3 py-1.5">
                    <span className="mt-1.5 size-2.5 shrink-0 rounded-full border-2" style={{ borderColor: TERMINAL_COLORS[t.kind] }} />
                    <span className="min-w-0 flex-1">
                      <span className="font-medium">{t.id}</span> <span className="text-muted">· {t.name}</span>
                      <span className="block text-xs text-muted">{TERMINAL_KIND_LABELS[t.kind]} — {t.function}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="rounded-md bg-raised px-3 py-2 text-xs text-muted">
              Model perilaku & simulasi komponen ini tersedia di <span className="font-medium text-ink">Phase {selected.simulationPhase}</span>. Saat ini komponen dapat ditempatkan dan dihubungkan di workspace.
            </p>
            <button
              type="button"
              data-testid="add-to-workspace"
              onClick={() => {
                if (addAtCenter(selected.type)) router.push('/workspace');
              }}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-accent text-sm font-medium text-accent-ink hover:brightness-110"
            >
              <Icon name="plus" size={16} /> Tambah ke workspace
            </button>
            <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-line pt-3 text-[11px] text-muted">
              {TERMINAL_KINDS.map((k) => (
                <span key={k} className="flex items-center gap-1">
                  <span className="size-2 rounded-full border" style={{ borderColor: TERMINAL_COLORS[k] }} /> {TERMINAL_KIND_LABELS[k]}
                </span>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
