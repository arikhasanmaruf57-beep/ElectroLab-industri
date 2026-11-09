'use client';

import { useEffect } from 'react';
import Link from 'next/link';
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
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full bg-bg">
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 sm:px-7 sm:pt-12 lg:px-10 lg:pt-16">
        <section className="home-enter circuit-hero relative grid items-center gap-10 overflow-hidden rounded-2xl border border-line bg-surface px-6 py-9 sm:px-9 sm:py-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
          <div className="relative z-10 max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent"><span className="size-1.5 rounded-full bg-ok" /> Laboratorium kelistrikan digital</p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.05em] text-ink sm:text-5xl lg:text-6xl">Rancang. Simulasikan. <span className="text-accent">Pahami.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">Ruang belajar interaktif untuk mengeksplorasi instalasi listrik, kontrol motor, dan otomasi industri. Susun rangkaian, kenali fungsi setiap komponen, lalu pelajari bagaimana sistem bekerja.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/workspace" className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-accent-ink shadow-lg shadow-accent/15 transition duration-200 hover:-translate-y-0.5 hover:brightness-110">Mulai simulasi <Icon name="chevron" size={16} /></Link>
              <Link href="/learning" className="inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-bg/60 px-5 text-sm font-medium text-ink transition duration-200 hover:border-accent/50 hover:bg-raised">Jelajahi materi <Icon name="book" size={16} /></Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-line pt-5 text-xs text-muted"><span className="inline-flex items-center gap-2"><Icon name="check" size={14} className="text-ok" /> Belajar berbasis praktik</span><span className="inline-flex items-center gap-2"><Icon name="bolt" size={14} className="text-accent" /> Fokus kelistrikan industri</span><span className="inline-flex items-center gap-2"><Icon name="workspace" size={14} className="text-accent" /> Berjalan di browser</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-8 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-xl border border-line bg-canvas p-5 shadow-2xl shadow-black/20 sm:p-7">
              <div className="absolute inset-0 opacity-35" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(var(--grid-dot) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
              <div className="relative flex items-center justify-between border-b border-line pb-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Workspace preview</p><p className="mt-1 text-sm font-semibold text-ink">Motor control circuit</p></div><span className="rounded-md border border-ok/30 bg-ok/10 px-2 py-1 font-mono text-[10px] text-ok">READY</span></div>
              <div className="relative flex min-h-[220px] items-center justify-center py-7">
                <svg viewBox="0 0 440 220" role="img" aria-label="Ilustrasi rangkaian kontrol motor sederhana" className="w-full max-w-[440px] overflow-visible">
                  <g fill="none" stroke="var(--symbol-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M52 34V184H388V34" /><path d="M52 34H145M295 34H388" /><path d="M145 34V77M295 34V77" /><path d="M145 143V184M295 143V184" />
                    <path d="M145 77H185L205 110L225 77H255L275 110L295 77" />
                    <path d="M185 143H255" />
                  </g>
                  <g fill="var(--surface)" stroke="var(--accent)" strokeWidth="2">
                    <rect x="28" y="19" width="48" height="30" rx="5" /><rect x="121" y="77" width="48" height="66" rx="6" /><rect x="271" y="77" width="48" height="66" rx="6" /><circle cx="388" cy="109" r="30" />
                  </g>
                  <g fill="var(--ink)" fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="middle"><text x="52" y="38">L</text><text x="145" y="113">KM</text><text x="295" y="113">OL</text><text x="388" y="113">M</text><text x="220" y="18" fill="var(--muted)">CONTROL LINE</text></g>
                  <g fill="none" stroke="#34c27a" strokeWidth="2.5" strokeLinecap="round"><path d="M52 34H145V77" strokeDasharray="5 5" className="circuit-flow" /><path d="M295 143V184H388V139" strokeDasharray="5 5" className="circuit-flow" /></g>
                  <g fill="#34c27a"><circle cx="52" cy="34" r="4" /><circle cx="388" cy="184" r="4" /></g>
                </svg>
              </div>
              <div className="relative grid grid-cols-3 gap-2 border-t border-line pt-4">
                {[['01','Komponen'],['02','Koneksi'],['03','Simulasi']].map(([n,label]) => <div key={n}><p className="font-mono text-[10px] text-accent">{n}</p><p className="mt-1 text-xs font-medium text-ink">{label}</p></div>)}
              </div>
            </div>
            <div className="relative mt-3 flex items-center justify-between px-1 text-[10px] font-mono uppercase tracking-wider text-muted"><span>Electrical engineering tools</span><span>EL / 001</span></div>
          </div>
        </section>

        <section id="about" data-reveal className="reveal-on-scroll mt-12 grid scroll-mt-8 gap-6 rounded-2xl border border-line bg-raised/45 p-6 sm:mt-16 sm:grid-cols-[0.72fr_1.28fr] sm:gap-10 sm:p-9" style={{ animationDelay: '80ms' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Di balik ElectroLab</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">Hai, saya <span className="text-accent">aerikhm.</span></h2>
            <p className="mt-3 text-sm leading-6 text-muted">Senang belajar, bereksperimen, dan membangun sesuatu.</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-xs text-muted"><Icon name="bolt" size={15} className="text-accent" /> Creator & learner</div>
          </div>
          <div className="max-w-3xl space-y-4 text-sm leading-7 text-muted sm:text-base sm:leading-8">
            <p>Saya memiliki latar belakang Teknik Instalasi Tenaga Listrik dan sedang melanjutkan perjalanan belajar di bidang Teknik Elektro. Ketertarikan saya ada pada dunia kelistrikan, sistem kontrol, dan teknologi yang bisa membantu proses belajar menjadi lebih mudah dipahami.</p>
            <p>ElectroLab Industri saya kembangkan sebagai proyek belajar sekaligus ruang eksperimen. Saya ingin menggabungkan teori dengan praktik digital, supaya siapa pun bisa mencoba menyusun rangkaian, memahami fungsi komponen, dan belajar dari prosesnya.</p>
            <p className="border-l-2 border-accent pl-4 text-ink">Proyek ini masih terus berkembang. Dibangun sedikit demi sedikit, sambil belajar dan memperbaiki hal-hal yang belum sempurna.</p>
          </div>
        </section>

        <section data-reveal className="reveal-on-scroll mt-14 sm:mt-20">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Jelajahi platform</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Pilih area untuk mulai belajar</h2></div><span className="text-xs text-muted">Ruang belajar dan simulasi</span></div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {areas.map((area, index) => (
              <Link key={area.href} href={area.href} data-reveal className="group reveal-on-scroll flex min-h-[142px] gap-4 rounded-xl border border-line bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg hover:shadow-black/10" style={{ transitionDelay: `${index * 55}ms` }}>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-raised text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent"><Icon name={area.icon} size={19} /></span>
                <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">{area.title}{area.tag && <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">{area.tag}</span>}</span><span className="mt-2 block text-sm leading-6 text-muted">{area.description}</span><span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">Buka area <Icon name="chevron" size={13} /></span></span>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-xs text-muted"><span className="font-semibold text-ink">ElectroLab <span className="font-normal text-muted">Industri</span></span><span>Dibangun dari rasa ingin tahu dan proses belajar.</span></footer>
      </main>
    </div>
  );
}
