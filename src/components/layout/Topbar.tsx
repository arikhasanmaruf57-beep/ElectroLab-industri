'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { NAV_ITEMS, navForPath } from '@/data/navigation';
import { isEmpty } from '@/store/workspace-store/document';
import { useSettingsStore } from '@/store/settings-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import { formatTime } from '@/utils/cn';
import { useMounted } from '@/hooks/useHydrated';
import { Icon } from '../ui/Icon';

export function Topbar({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const mounted = useMounted();
  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  const savedAt = useWorkspaceStore((s) => s.savedAt);
  const newProject = useWorkspaceStore((s) => s.newProject);
  const title = navForPath(pathname)?.title ?? 'ElectroLab Industri';
  const isHome = pathname === '/';

  const onNew = () => {
    const doc = useWorkspaceStore.getState().doc;
    if (!isEmpty(doc) && !window.confirm('Rangkaian saat ini akan dihapus dan draf diganti dengan rangkaian kosong. Lanjutkan?')) return;
    newProject();
    router.push('/workspace');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`relative z-40 mx-3 mt-3 flex shrink-0 items-center gap-2 rounded-2xl border border-line/80 bg-surface/85 px-3 shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-200 sm:mx-6 sm:gap-3 sm:px-4 ${compact ? 'h-12' : 'h-14'}`}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={menuOpen}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-line/80 text-muted transition-all duration-200 hover:border-accent/40 hover:bg-raised hover:text-ink active:scale-95"
        >
          {menuOpen ? <Icon name="x" size={18} /> : (
            <span className="flex flex-col gap-1">
              <span className="h-px w-4 bg-current" />
              <span className="h-px w-4 bg-current" />
              <span className="h-px w-4 bg-current" />
            </span>
          )}
        </button>

        <Link href="/" onClick={closeMenu} className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-ink"><Icon name="bolt" size={17} /></span>
          <span className="truncate text-sm font-semibold tracking-tight">ElectroLab <span className="font-normal text-muted">/ Industri</span></span>
        </Link>

        <nav aria-label="Navigasi cepat" className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
          {[
            { href: '/', label: 'Beranda' },
            { href: '/component-library', label: 'Komponen' },
            { href: '/learning', label: 'Belajar' },
            { href: '/workspace', label: 'Workspace' },
            { href: '/circuit-studio', label: 'Circuit Studio' },
          ].map((item) => {
            const active = item.href === '/' ? isHome : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                aria-current={active ? 'page' : undefined}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 ${active ? 'bg-accent/12 text-accent' : 'text-muted hover:bg-raised hover:text-ink'}`}
              >
                {item.label}
              </Link>
            );
          })}
          {isHome && <Link href="/#about" className="rounded-xl px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-raised hover:text-ink">Tentang</Link>}
        </nav>
        <h1 className="hidden min-w-0 flex-1 truncate text-sm font-medium text-muted xl:block lg:hidden">{title}</h1>
        <div className="flex-1 lg:hidden" />

        {!isHome && (
          <span className="hidden text-xs text-muted xl:inline" data-testid="save-indicator">
            {mounted && savedAt ? `Draf tersimpan ${formatTime(savedAt)}` : mounted ? 'Belum ada draf' : ''}
          </span>
        )}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
          title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-line/80 text-muted transition-all duration-200 hover:border-accent/40 hover:bg-raised hover:text-ink active:scale-95"
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        {!isHome && (
          <button
            type="button"
            onClick={onNew}
            className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-accent px-3.5 text-sm font-medium text-accent-ink transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
          >
            <Icon name="plus" size={16} />
            <span className="hidden sm:inline">Rangkaian baru</span>
            <span className="sm:hidden">Baru</span>
          </button>
        )}
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60]">
          <button type="button" aria-label="Tutup menu navigasi" onClick={closeMenu} className="absolute inset-0 bg-black/55" />
          <aside className="absolute inset-y-0 left-0 flex w-[min(340px,88vw)] flex-col border-r border-line bg-surface shadow-2xl">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
              <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-ink"><Icon name="bolt" size={17} /></span>
                <span className="text-sm font-semibold">ElectroLab Industri</span>
              </Link>
              <button type="button" onClick={closeMenu} aria-label="Tutup menu navigasi" className="rounded-md p-2 text-muted hover:bg-raised hover:text-ink"><Icon name="x" /></button>
            </div>
            <nav className="scroll-thin flex-1 overflow-y-auto p-3">
              <p className="px-3 pb-2 pt-1 text-[11px] font-medium uppercase tracking-wider text-muted">Navigasi utama</p>
              {isHome && (
                <Link
                  href="/#about"
                  onClick={closeMenu}
                  className="mb-2 flex h-10 items-center gap-3 rounded-md border border-accent/25 bg-accent/10 px-3 text-sm font-medium text-accent transition-colors hover:bg-accent/15"
                >
                  <Icon name="bolt" size={17} />
                  <span className="flex-1">Tentang saya</span>
                  <Icon name="chevron" size={14} />
                </Link>
              )}
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={active ? 'page' : undefined}
                    className={`mb-1 flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors ${active ? 'bg-raised font-medium text-ink' : 'text-muted hover:bg-raised hover:text-ink'}`}
                  >
                    <Icon name={item.icon} size={17} />
                    <span className="flex-1">{item.label}</span>
                    {item.phase && <span className="text-[11px] text-muted">Phase {item.phase}</span>}
                  </Link>
                );
              })}
            </nav>
            <p className="shrink-0 border-t border-line px-5 py-4 text-[11px] leading-relaxed text-muted">Simulator pembelajaran. Hasil simulasi tidak menggantikan perhitungan desain dan pemeriksaan instalasi sesuai PUIL/SNI.</p>
          </aside>
        </div>
      )}
    </>
  );
}
