'use client';

import { useMemo, useState } from 'react';
import { CATEGORIES } from '@/data/categories';
import { searchComponents } from '@/data/components';
import { useWorkspaceStore } from '@/store/workspace-store';
import type { CategoryId, ComponentDefinition } from '@/types/component';
import { cn } from '@/utils/cn';
import { SymbolPreview } from '../electrical-symbols/SymbolPreview';
import { LIBRARY_DRAG_TYPE } from '../workspace/WorkspaceCanvas';
import { Icon } from '../ui/Icon';

function Row({ def }: { def: ComponentDefinition }) {
  const add = useWorkspaceStore((s) => s.addComponentAtViewCenter);
  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        draggable
        data-testid="library-item"
        data-type={def.type}
        aria-label={`${def.name}. Seret ke kanvas atau tekan Enter untuk menambahkan`}
        title="Seret ke kanvas · klik dua kali / Enter untuk menaruh di tengah"
        onDragStart={(e) => {
          e.dataTransfer.setData(LIBRARY_DRAG_TYPE, def.type);
          e.dataTransfer.setData('text/plain', def.type);
          e.dataTransfer.effectAllowed = 'copy';
        }}
        onDoubleClick={() => add(def.type)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') add(def.type);
        }}
        className="group flex cursor-grab items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-raised active:cursor-grabbing"
      >
        <SymbolPreview def={def} className="h-10 w-12 shrink-0 text-ink" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium">{def.name}</span>
          <span className="block truncate text-[11px] text-muted">{def.terminals.length} terminal · {def.designator}</span>
        </span>
        <button
          type="button"
          aria-label={`Tambahkan ${def.name}`}
          onClick={() => add(def.type)}
          className="flex size-7 shrink-0 items-center justify-center rounded text-muted hover:bg-line hover:text-ink"
        >
          <Icon name="plus" size={15} />
        </button>
      </div>
    </li>
  );
}

export function LibraryPanel() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({ 'power-source': true, protection: true });
  const results = useMemo(() => searchComponents(query), [query]);
  const searching = query.trim().length > 0;

  const groups = CATEGORIES.map((c) => ({ cat: c, items: results.filter((r) => r.category === c.id) })).filter((g) => g.items.length > 0);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line p-3">
        <label className="relative block">
          <span className="sr-only">Cari komponen</span>
          <Icon name="search" size={16} className="pointer-events-none absolute left-2.5 top-2.5 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari komponen…"
            data-testid="library-search"
            className="h-9 w-full rounded-md border border-line bg-bg pl-8 pr-2 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </label>
        <p className="mt-2 text-[11px] text-muted tnum">{results.length} komponen</p>
      </div>
      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto p-2">
        {groups.length === 0 && <p className="p-3 text-sm text-muted">Tidak ada komponen yang cocok dengan “{query}”.</p>}
        {groups.map(({ cat, items }) => {
          const expanded = searching || open[cat.id];
          return (
            <section key={cat.id} className="mb-1">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen((o) => ({ ...o, [cat.id as CategoryId]: !o[cat.id] }))}
                className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-xs font-semibold text-muted hover:text-ink"
              >
                <Icon name="chevron" size={14} className={cn('transition-transform', expanded && 'rotate-90')} />
                <span className="flex-1">{cat.label}</span>
                <span className="font-normal tnum">{items.length}</span>
              </button>
              {expanded && <ul>{items.map((d) => <Row key={d.type} def={d} />)}</ul>}
            </section>
          );
        })}
      </div>
    </div>
  );
}
