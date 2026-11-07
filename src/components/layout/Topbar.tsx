'use client';

import { usePathname, useRouter } from 'next/navigation';
import { navForPath } from '@/data/navigation';
import { isEmpty } from '@/store/workspace-store/document';
import { useSettingsStore } from '@/store/settings-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import { formatTime } from '@/utils/cn';
import { useMounted } from '@/hooks/useHydrated';
import { Icon } from '../ui/Icon';

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  const savedAt = useWorkspaceStore((s) => s.savedAt);
  const newProject = useWorkspaceStore((s) => s.newProject);
  const title = navForPath(pathname)?.title ?? 'Electrical Simulator';

  const onNew = () => {
    const doc = useWorkspaceStore.getState().doc;
    if (!isEmpty(doc) && !window.confirm('Rangkaian saat ini akan dihapus dan draf diganti dengan rangkaian kosong. Lanjutkan?')) return;
    newProject();
    router.push('/workspace');
  };

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-5">
      <h1 className="flex-1 truncate text-[15px] font-semibold">{title}</h1>
      <span className="hidden text-xs text-muted sm:inline" data-testid="save-indicator">
        {mounted && savedAt ? `Draf tersimpan ${formatTime(savedAt)}` : mounted ? 'Belum ada draf' : ''}
      </span>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
        title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
        className="flex size-9 items-center justify-center rounded-md border border-line text-muted hover:bg-raised hover:text-ink"
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>
      <button
        type="button"
        onClick={onNew}
        className="flex h-9 items-center gap-2 rounded-md bg-accent px-3.5 text-sm font-medium text-accent-ink hover:brightness-110"
      >
        <Icon name="plus" size={16} />
        Rangkaian baru
      </button>
    </header>
  );
}
