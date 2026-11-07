'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NAV_ITEMS } from '@/data/navigation';
import { Icon } from '@/components/ui/Icon';

const areas = [
  { href: '/workspace', title: 'Electrical Workspace', description: 'Rancang rangkaian dan susun komponen pada area kerja.', icon: 'workspace' as const, tag: 'Mulai dari sini' },
  { href: '/house-installation', title: 'Instalasi Rumah', description: 'Pelajari rangkaian penerangan dan instalasi daya rumah.', icon: 'house' as const },
  { href: '/building-installation', title: 'Instalasi Gedung', description: 'Kenali distribusi daya dan sistem instalasi bangunan.', icon: 'building' as const },
  { href: '/industrial', title: 'Kontrol Motor Industri', description: 'Pelajari rangkaian kendali motor dan metode starting.', icon: 'motor' as const },
  { href: '/plc', title: 'PLC & Automation', description: 'Jelajahi dasar otomasi dan logika kendali.', icon: 'plc' as const },
  { href: '/learning', title: 'Learning Center', description: 'Buka materi dan panduan belajar kelistrikan.', icon: 'book' as const },
];

export function HomeView() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Buka menu navigasi"
              aria-expanded={menuOpen}
              className="flex size-9 items-center justify-center rounded-md border border-line text-muted transition-colors hover:bg-raised hover:text-ink"
            >
              <span className="flex flex-col gap-1">
                <span className="h-px w-4 bg-current" />
                <span className="h-px w-4 bg-current" />
                <span className="h-px w-4 bg-current" />
              </span>
            </button>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-ink"><Icon name="bolt" size={17} /></span>
              <span className="text-sm font-semibold tracking-tight">ElectroLab <span className="font-normal text-muted">/ Industri</span></span>
            </Link>
          </div>
          <Link href="/dashboard" className="text-sm text-muted transition-colors hover:text-ink">Dashboard <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <button type="button" aria-label="Tutup menu" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-black/55" />
          <aside className="relative flex h-full w-[min(320px,88vw)] flex-col border-r border-line bg-surface shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-ink"><Icon name="bolt" size={17} /></span>
                <span className="text-sm font-semibold">ElectroLab Industri</span>
              </div>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Tutup menu" className="rounded-md p-2 text-muted hover:bg-raised hover:text-ink"><Icon name="x" /></button>
            </div>
            <nav className="scroll-thin flex-1 overflow-y-auto p-3">
              <p className="px-3 pb-2 pt-1 text-[11px] font-medium uppercase tracking-wider text-muted">Menu utama</p>
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="flex h-10 items-center gap-3 rounded-md px-3 text-sm text-muted transition-colors hover:bg-raised hover:text-ink">
                  <Icon name={item.icon} size={17} />
                  <span className="flex-1">{item.label}</span>
                  {item.phase && <span className="text-[11px] text-muted">Phase {item.phase}</span>}
                </Link>
              ))}
            </nav>
            <p className="border-t border-line px-5 py-4 text-[11px] leading-relaxed text-muted">Simulator pembelajaran. Hasil simulasi tidak menggantikan perhitungan desain dan pemeriksaan instalasi sesuai PUIL/SNI.</p>
          </aside>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:px-8 sm:pt-20">
        <section className="max-w-3xl">
          <p className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-accent">
            <span className="h-px w-6 bg-accent" /> Laboratorium kelistrikan digital
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-[-0.045em] text-ink sm:text-5xl">
            Belajar sistem listrik dengan cara yang lebih praktis.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            ElectroLab adalah ruang belajar untuk mengenal instalasi listrik, rangkaian kontrol motor, dan otomasi industri melalui workspace interaktif.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/workspace" className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-accent-ink transition-colors hover:brightness-110">
              Buka workspace <Icon name="chevron" size={16} />
            </Link>
            <Link href="/learning" className="inline-flex h-11 items-center rounded-md border border-line px-5 text-sm font-medium text-ink transition-colors hover:bg-raised">
              Lihat materi belajar
            </Link>
          </div>
        </section>

        <section className="mt-16 border-t border-line pt-7 sm:mt-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.13em] text-muted">Jelajahi ElectroLab</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">Pilih area yang ingin dipelajari</h2>
            </div>
            <span className="text-xs text-muted">Ruang belajar dan simulasi</span>
          </div>
          <div className="grid gap-0 sm:grid-cols-2 sm:gap-x-8">
            {areas.map((area, index) => (
              <Link key={area.href} href={area.href} className="group flex gap-4 border-t border-line py-5 transition-colors hover:border-accent/60">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-line text-muted transition-colors group-hover:border-accent/50 group-hover:text-accent">
                  <Icon name={area.icon} size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
                    {area.title}
                    {area.tag && <span className="rounded border border-accent/30 px-1.5 py-0.5 text-[10px] font-medium text-accent">{area.tag}</span>}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted">{area.description}</span>
                </span>
                <Icon name="chevron" size={16} className="mt-2 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-xs text-muted">
          <span>ElectroLab Industri</span>
          <span>Belajar · Merancang · Memahami</span>
        </footer>
      </main>
    </div>
  );
}
