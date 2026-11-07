'use client';

import { useEffect, useState } from 'react';
import { CATEGORY_BY_ID } from '@/data/categories';
import { getComponentDefinition } from '@/data/components';
import { countConnections, DEFAULT_MAX_CONNECTIONS } from '@/electrical-engine/connections';
import { useSettingsStore } from '@/store/settings-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import { CONDUCTOR_LABELS, TERMINAL_KIND_LABELS } from '@/types/electrical';
import { TERMINAL_COLORS } from '../electrical-symbols/terminal-style';
import { ComponentVisualPreview } from '../electrical-symbols/ComponentVisualPreview';
import { Icon } from '../ui/Icon';

const SHORTCUTS: Array<[string, string]> = [
  ['Seret / Enter', 'Tambah dari Library'],
  ['R', 'Putar 90°'],
  ['Delete', 'Hapus pilihan'],
  ['Ctrl+Z / Ctrl+Y', 'Undo / Redo'],
  ['Ctrl+C / X / V', 'Salin / potong / tempel'],
  ['Ctrl+A', 'Pilih semua'],
  ['Shift+klik / seret', 'Pilih banyak'],
  ['Spasi + seret', 'Geser kanvas'],
  ['Roda mouse', 'Zoom'],
  ['Panah', 'Geser pilihan'],
  ['Esc', 'Batalkan kabel / pilihan'],
];

function LabelField({ id, value }: { id: string; value: string }) {
  const [text, setText] = useState(value);
  const rename = useWorkspaceStore((s) => s.renameSelected);
  useEffect(() => setText(value), [value, id]);
  const commit = () => {
    if (text.trim() && text.trim() !== value) rename(id, text);
    else setText(value);
  };
  return (
    <label className="block">
      <span className="text-xs text-muted">Designator</span>
      <input
        value={text}
        data-testid="inspector-label"
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          if (e.key === 'Escape') setText(value);
        }}
        className="mt-1 h-8 w-full rounded-md border border-line bg-bg px-2 text-sm focus:border-accent focus:outline-none"
      />
    </label>
  );
}

export function Inspector() {
  const doc = useWorkspaceStore((s) => s.doc);
  const selection = useWorkspaceStore((s) => s.selection);
  const rotate = useWorkspaceStore((s) => s.rotateSelection);
  const del = useWorkspaceStore((s) => s.deleteSelection);
  const colors = useSettingsStore((s) => s.conductorColors);
  const viewMode = useSettingsStore((s) => s.componentViewMode);

  const total = selection.components.length + selection.wires.length;

  if (total === 0) {
    return (
      <div className="p-4 text-sm" data-testid="inspector-empty">
        <h2 className="text-sm font-semibold">Inspector</h2>
        <p className="mt-1 text-muted">Pilih komponen atau kabel untuk melihat propertinya.</p>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-md border border-line p-2"><dt className="text-xs text-muted">Komponen</dt><dd className="text-lg font-semibold tnum">{doc.components.length}</dd></div>
          <div className="rounded-md border border-line p-2"><dt className="text-xs text-muted">Kabel</dt><dd className="text-lg font-semibold tnum">{doc.wires.length}</dd></div>
        </dl>
        <h3 className="mt-5 text-xs font-semibold text-muted">Pintasan</h3>
        <ul className="mt-1.5 space-y-1">
          {SHORTCUTS.map(([k, v]) => (
            <li key={k} className="flex justify-between gap-2 text-xs"><span className="text-ink">{k}</span><span className="text-right text-muted">{v}</span></li>
          ))}
        </ul>
      </div>
    );
  }

  if (selection.components.length === 1 && selection.wires.length === 0) {
    const placed = doc.components.find((c) => c.id === selection.components[0]);
    const def = placed && getComponentDefinition(placed.type);
    if (!placed || !def) return null;
    return (
      <div className="space-y-4 p-4 text-sm" data-testid="inspector-component">
        <div className="rounded-md border border-line bg-bg p-2"><ComponentVisualPreview def={def} mode={viewMode} className="mx-auto h-24 w-full text-ink" /></div>
        <div>
          <h2 className="font-semibold">{def.name}</h2>
          <p className="text-xs text-muted">{CATEGORY_BY_ID[def.category].label}</p>
        </div>
        <LabelField id={placed.id} value={placed.label} />
        <dl className="grid grid-cols-3 gap-2 text-xs">
          <div><dt className="text-muted">X</dt><dd className="tnum">{Math.round(placed.x)}</dd></div>
          <div><dt className="text-muted">Y</dt><dd className="tnum">{Math.round(placed.y)}</dd></div>
          <div><dt className="text-muted">Rotasi</dt><dd className="tnum">{placed.rotation}°</dd></div>
        </dl>
        <div className="flex gap-2">
          <button type="button" onClick={rotate} className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-line text-xs hover:bg-raised"><Icon name="rotate" size={15} />Putar</button>
          <button type="button" onClick={del} data-testid="inspector-delete" className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-line text-xs text-fault hover:bg-fault/10"><Icon name="trash" size={15} />Hapus</button>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-muted">Spesifikasi (referensi)</h3>
          <dl className="mt-1 divide-y divide-line rounded-md border border-line">
            {def.specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-2 px-2.5 py-1.5 text-xs"><dt className="text-muted">{s.label}</dt><dd className="tnum text-right">{s.value}{s.unit ? ` ${s.unit}` : ''}</dd></div>
            ))}
          </dl>
          <p className="mt-1.5 text-[11px] text-muted">Parameter dapat diubah mulai Phase 2; perilaku simulasi mulai Phase {def.simulationPhase}.</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-muted">Terminal</h3>
          <ul className="mt-1 divide-y divide-line rounded-md border border-line" data-testid="inspector-terminals">
            {def.terminals.map((t) => {
              const n = countConnections(doc, { componentId: placed.id, terminalId: t.id });
              return (
                <li key={t.id} className="flex items-center gap-2 px-2.5 py-1.5 text-xs">
                  <span className="size-2.5 shrink-0 rounded-full border-2" style={{ borderColor: TERMINAL_COLORS[t.kind], background: n ? TERMINAL_COLORS[t.kind] : 'transparent' }} />
                  <span className="min-w-0 flex-1"><span className="font-medium">{t.id}</span> <span className="text-muted">{t.name} · {TERMINAL_KIND_LABELS[t.kind]}</span></span>
                  <span className={n ? 'text-ok' : 'text-muted'}>{n ? `${n}/${t.maxConnections ?? DEFAULT_MAX_CONNECTIONS}` : 'belum terhubung'}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  if (selection.wires.length === 1 && selection.components.length === 0) {
    const w = doc.wires.find((x) => x.id === selection.wires[0]);
    if (!w) return null;
    const name = (ref: { componentId: string; terminalId: string }) => `${doc.components.find((c) => c.id === ref.componentId)?.label ?? '?'}.${ref.terminalId}`;
    return (
      <div className="space-y-4 p-4 text-sm" data-testid="inspector-wire">
        <h2 className="font-semibold">Kabel</h2>
        <dl className="divide-y divide-line rounded-md border border-line text-xs">
          <div className="flex justify-between px-2.5 py-1.5"><dt className="text-muted">Dari</dt><dd>{name(w.from)}</dd></div>
          <div className="flex justify-between px-2.5 py-1.5"><dt className="text-muted">Ke</dt><dd>{name(w.to)}</dd></div>
          <div className="flex items-center justify-between px-2.5 py-1.5"><dt className="text-muted">Penghantar</dt><dd className="flex items-center gap-2"><span className="h-2.5 w-6 rounded-full border border-line" style={{ background: colors[w.conductor] }} />{CONDUCTOR_LABELS[w.conductor]}</dd></div>
        </dl>
        <p className="text-[11px] text-muted">Ukuran penampang, material, dan resistansi penghantar ditambahkan di Phase 2.</p>
        <button type="button" onClick={del} className="flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-line text-xs text-fault hover:bg-fault/10"><Icon name="trash" size={15} />Hapus kabel</button>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 text-sm" data-testid="inspector-multi">
      <h2 className="font-semibold">{total} item dipilih</h2>
      <p className="text-xs text-muted">{selection.components.length} komponen, {selection.wires.length} kabel.</p>
      <div className="flex gap-2">
        <button type="button" onClick={rotate} disabled={selection.components.length === 0} className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-line text-xs hover:bg-raised disabled:opacity-40"><Icon name="rotate" size={15} />Putar</button>
        <button type="button" onClick={del} className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-line text-xs text-fault hover:bg-fault/10"><Icon name="trash" size={15} />Hapus</button>
      </div>
    </div>
  );
}
