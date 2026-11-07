'use client';

import { useSettingsStore } from '@/store/settings-store';
import { useWorkspaceStore } from '@/store/workspace-store';

export function StatusBar() {
  const cursor = useWorkspaceStore((s) => s.cursor);
  const zoom = useWorkspaceStore((s) => s.viewport.zoom);
  const comps = useWorkspaceStore((s) => s.doc.components.length);
  const wires = useWorkspaceStore((s) => s.doc.wires.length);
  const sel = useWorkspaceStore((s) => s.selection.components.length + s.selection.wires.length);
  const pending = useWorkspaceStore((s) => s.pendingFrom !== null);
  const snap = useSettingsStore((s) => s.snapSize);

  return (
    <div className="flex h-8 shrink-0 items-center gap-4 border-t border-line bg-surface px-3 text-xs text-muted tnum" data-testid="status-bar">
      <span className="min-w-0 truncate">
        {pending ? <span className="text-accent">Pilih terminal tujuan (hijau = kompatibel). Esc untuk batal.</span> : 'Tarik dari satu terminal ke terminal lain untuk memasang kabel.'}
      </span>
      <span className="flex-1" />
      <span>{cursor ? `x ${Math.round(cursor.x)}  y ${Math.round(cursor.y)}` : 'x –  y –'}</span>
      <span>{Math.round(zoom * 100)}%</span>
      <span>Snap {snap || 'off'}</span>
      <span>{comps} komponen · {wires} kabel{sel ? ` · ${sel} dipilih` : ''}</span>
      <span className="hidden md:inline">Simulasi: belum aktif (Phase 3)</span>
    </div>
  );
}
