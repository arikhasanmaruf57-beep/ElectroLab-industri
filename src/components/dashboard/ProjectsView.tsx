'use client';

import Link from 'next/link';
import { useMounted } from '@/hooks/useHydrated';
import { useSettingsStore } from '@/store/settings-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import { isEmpty } from '@/store/workspace-store/document';
import { formatTime } from '@/utils/cn';
import { Icon } from '../ui/Icon';
import { CircuitThumbnail } from './CircuitThumbnail';

export function ProjectsView() {
  const mounted = useMounted();
  const doc = useWorkspaceStore((s) => s.doc);
  const savedAt = useWorkspaceStore((s) => s.savedAt);
  const newProject = useWorkspaceStore((s) => s.newProject);
  const notify = useWorkspaceStore((s) => s.notify);
  const colors = useSettingsStore((s) => s.conductorColors);
  const hasDraft = mounted && !isEmpty(doc);

  return (
    <div className="mx-auto max-w-4xl space-y-5 p-5">
      <p className="text-sm text-muted">
        Phase 1 menyimpan satu draf workspace secara otomatis di browser ini (localStorage). Beberapa proyek, duplikasi, ganti nama, impor/ekspor, dan penyimpanan ke database (Supabase) hadir di Phase 2.
      </p>
      {hasDraft ? (
        <article className="overflow-hidden rounded-lg border border-line bg-surface" data-testid="draft-card">
          <div className="grid md:grid-cols-[280px_1fr]">
            <div className="flex h-48 items-center justify-center border-b border-line bg-canvas p-2 md:border-b-0 md:border-r">
              <CircuitThumbnail doc={doc} colors={colors} className="h-full w-full" />
            </div>
            <div className="flex flex-col justify-between gap-4 p-4">
              <div>
                <h2 className="font-semibold">Draf workspace</h2>
                <p className="mt-1 text-sm text-muted">{doc.components.length} komponen · {doc.wires.length} kabel{savedAt ? ` · disimpan ${formatTime(savedAt)}` : ''}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/workspace" className="flex h-9 items-center gap-2 rounded-md bg-accent px-3 text-sm font-medium text-accent-ink hover:brightness-110"><Icon name="workspace" size={16} />Buka di workspace</Link>
                <button
                  type="button"
                  data-testid="delete-draft"
                  onClick={() => {
                    if (!window.confirm('Hapus draf workspace ini? Tindakan ini tidak dapat dibatalkan.')) return;
                    newProject();
                    notify('info', 'Draf dihapus.');
                  }}
                  className="flex h-9 items-center gap-2 rounded-md border border-line px-3 text-sm text-fault hover:bg-fault/10"
                >
                  <Icon name="trash" size={16} />Hapus draf
                </button>
              </div>
            </div>
          </div>
        </article>
      ) : (
        <div className="rounded-lg border border-dashed border-line p-8 text-center" data-testid="no-projects">
          <p className="font-medium">Belum ada proyek</p>
          <p className="mt-1 text-sm text-muted">Rangkaian yang Anda buat di workspace akan tersimpan otomatis sebagai draf.</p>
          <Link href="/workspace" className="mt-4 inline-flex h-9 items-center gap-2 rounded-md bg-accent px-3 text-sm font-medium text-accent-ink hover:brightness-110"><Icon name="plus" size={16} />Mulai di workspace</Link>
        </div>
      )}
    </div>
  );
}
