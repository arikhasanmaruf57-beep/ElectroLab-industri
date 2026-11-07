import Link from 'next/link';
import { ROADMAP } from '@/data/navigation';
import { Icon } from './Icon';

/**
 * Halaman untuk modul yang belum diimplementasikan. Sengaja jujur: menjelaskan apa yang
 * akan ada, kapan, dan apa yang sudah bisa dipakai sekarang — tanpa tombol atau simulasi palsu.
 */
export function PhasePlaceholder({ phase, title, intro, plans, nowCanDo }: { phase: number; title: string; intro: string; plans: string[]; nowCanDo: string }) {
  const info = ROADMAP.find((r) => r.phase === phase);
  return (
    <div className="mx-auto max-w-3xl p-6" data-testid="phase-placeholder">
      <p className="text-sm text-muted">Belum diimplementasikan · direncanakan di Phase {phase}{info ? ` (${info.title})` : ''}</p>
      <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-[15px] text-muted">{intro}</p>
      <h3 className="mt-6 text-sm font-semibold">Yang akan tersedia</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
        {plans.map((p) => <li key={p}>{p}</li>)}
      </ul>
      <div className="mt-6 rounded-lg border border-line bg-surface p-4">
        <h3 className="text-sm font-semibold">Yang sudah bisa dilakukan sekarang</h3>
        <p className="mt-1 text-sm text-muted">{nowCanDo}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/workspace" className="flex h-9 items-center gap-2 rounded-md bg-accent px-3 text-sm font-medium text-accent-ink hover:brightness-110"><Icon name="workspace" size={16} />Buka workspace</Link>
          <Link href="/component-library" className="flex h-9 items-center gap-2 rounded-md border border-line px-3 text-sm hover:bg-raised"><Icon name="library" size={16} />Component Library</Link>
        </div>
      </div>
    </div>
  );
}
