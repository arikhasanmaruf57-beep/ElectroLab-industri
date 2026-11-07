'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/data/categories';
import { COMPONENTS } from '@/data/components';
import { CURRENT_PHASE, ROADMAP } from '@/data/navigation';
import { useMounted } from '@/hooks/useHydrated';
import { useSettingsStore } from '@/store/settings-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import { isEmpty } from '@/store/workspace-store/document';
import { cn, formatTime } from '@/utils/cn';
import { Icon } from '../ui/Icon';
import { CircuitThumbnail } from './CircuitThumbnail';

function Stat({ label, value, note, testId }: { label: string; value: string; note: string; testId: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4" data-testid={testId}>
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold tnum">{value}</div>
      <div className="mt-0.5 text-xs text-muted">{note}</div>
    </div>
  );
}

export function DashboardView() {
  const mounted = useMounted();
  const router = useRouter();
  const doc = useWorkspaceStore((s) => s.doc);
  const savedAt = useWorkspaceStore((s) => s.savedAt);
  const newProject = useWorkspaceStore((s) => s.newProject);
  const colors = useSettingsStore((s) => s.conductorColors);

  const hasDraft = mounted && !isEmpty(doc);
  const v = (n: number) => (mounted ? String(n) : '–');
  const maxCat = Math.max(...CATEGORIES.map((c) => COMPONENTS.filter((x) => x.category === c.id).length));

  const startNew = () => {
    if (hasDraft && !window.confirm('Rangkaian saat ini akan dihapus dan diganti rangkaian kosong. Lanjutkan?')) return;
    newProject();
    router.push('/workspace');
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-5 p-5">
      <section aria-label="Statistik" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat testId="stat-projects" label="Total proyek" value={v(hasDraft ? 1 : 0)} note={hasDraft ? 'Draf workspace tersimpan' : 'Belum ada proyek · simpan multi-proyek di Phase 2'} />
        <Stat testId="stat-components" label="Komponen di workspace" value={v(doc.components.length)} note={`${mounted ? doc.wires.length : '–'} kabel terpasang · katalog ${COMPONENTS.length} komponen`} />
        <Stat testId="stat-sim" label="Aktivitas simulasi" value="0" note="Engine simulasi hadir di Phase 3" />
        <Stat testId="stat-learning" label="Progress belajar" value="0%" note="0 dari 20 modul tersedia · Phase 9" />
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-line bg-surface" aria-labelledby="last-project">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 id="last-project" className="text-sm font-semibold">Proyek terakhir</h2>
            {hasDraft && savedAt && <span className="text-xs text-muted">Disimpan {formatTime(savedAt)}</span>}
          </div>
          {hasDraft ? (
            <div className="grid gap-4 p-4 md:grid-cols-[1fr_220px]">
              <div className="flex h-56 items-center justify-center rounded-md border border-line bg-canvas p-2" data-testid="dashboard-thumb">
                <CircuitThumbnail doc={doc} colors={colors} className="h-full w-full" />
              </div>
              <div className="flex flex-col justify-between gap-3">
                <div>
                  <p className="font-medium">Draf workspace</p>
                  <p className="mt-1 text-sm text-muted">{doc.components.length} komponen, {doc.wires.length} kabel.</p>
                </div>
                <Link href="/workspace" className="flex h-10 items-center justify-center gap-2 rounded-md bg-accent text-sm font-medium text-accent-ink hover:brightness-110">
                  <Icon name="workspace" size={16} /> Lanjutkan di workspace
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-3 p-6">
              <p className="text-sm text-muted">Belum ada rangkaian. Mulai dengan menaruh sumber daya, proteksi, dan beban di workspace lalu hubungkan terminalnya.</p>
              <Link href="/workspace" className="flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-ink hover:brightness-110">
                <Icon name="plus" size={16} /> Buka workspace kosong
              </Link>
            </div>
          )}
          <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
            <button type="button" onClick={startNew} data-testid="dash-new" className="flex h-9 items-center gap-2 rounded-md border border-line px-3 text-sm hover:bg-raised">
              <Icon name="plus" size={16} /> Rangkaian baru
            </button>
            <Link href="/component-library" className="flex h-9 items-center gap-2 rounded-md border border-line px-3 text-sm hover:bg-raised">
              <Icon name="library" size={16} /> Jelajahi Component Library
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-surface" aria-labelledby="roadmap">
          <h2 id="roadmap" className="border-b border-line px-4 py-3 text-sm font-semibold">Status pengembangan</h2>
          <ol className="divide-y divide-line">
            {ROADMAP.map((r) => {
              const state = r.phase < CURRENT_PHASE ? 'done' : r.phase === CURRENT_PHASE ? 'now' : 'todo';
              return (
                <li key={r.phase} className="flex items-start gap-3 px-4 py-2.5">
                  <span className={cn('mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold', state === 'now' ? 'bg-ok/20 text-ok' : 'bg-raised text-muted')}>{r.phase}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm"><span className="font-medium">{r.title}</span>{state === 'now' && <span className="rounded bg-ok/15 px-1.5 text-[11px] text-ok">Berfungsi</span>}</div>
                    <p className="text-xs text-muted">{r.summary}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <section className="rounded-lg border border-line bg-surface" aria-labelledby="cats">
        <h2 id="cats" className="border-b border-line px-4 py-3 text-sm font-semibold">Komponen tersedia per kategori</h2>
        <ul className="grid gap-x-8 gap-y-2.5 p-4 md:grid-cols-2">
          {CATEGORIES.map((c) => {
            const n = COMPONENTS.filter((x) => x.category === c.id).length;
            return (
              <li key={c.id} className="flex items-center gap-3 text-sm">
                <span className="w-36 shrink-0 text-muted">{c.label}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-raised"><span className="block h-full rounded-full bg-accent" style={{ width: `${(n / maxCat) * 100}%` }} /></span>
                <span className="w-6 text-right tnum">{n}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
