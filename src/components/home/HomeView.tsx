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
  return (
    <div className="min-h-screen w-full bg-bg">
      <main className="w-full px-4 pb-16 pt-12 sm:px-7 sm:pt-16 lg:px-10 lg:pt-20 2xl:px-14">
        <section className="grid w-full items-center gap-10 border-b border-line pb-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-14 lg:pb-20">
          <div className="max-w-4xl">
            <p className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-accent"><span className="h-px w-6 bg-accent" /> Laboratorium kelistrikan digital</p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.1] tracking-[-0.045em] text-ink sm:text-5xl lg:text-6xl 2xl:text-7xl">Dari memahami rangkaian, menjadi mampu merancangnya.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">ElectroLab adalah ruang belajar untuk mengeksplorasi instalasi listrik, kontrol motor, dan otomasi industri melalui workspace interaktif. Belajar konsepnya, susun rangkaiannya, lalu pahami bagaimana sistem bekerja.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/workspace" className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-accent-ink transition-colors hover:brightness-110">Buka workspace <Icon name="chevron" size={16} /></Link>
              <Link href="/learning" className="inline-flex h-11 items-center rounded-md border border-line px-5 text-sm font-medium text-ink transition-colors hover:bg-raised">Lihat materi belajar</Link>
            </div>
          </div>
          <div className="relative min-h-[260px] overflow-hidden rounded-lg border border-line bg-surface p-5 sm:min-h-[320px] sm:p-7">
            <div className="absolute inset-0 opacity-40" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(var(--grid-dot) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
            <div className="relative flex h-full min-h-[220px] flex-col justify-between">
              <div className="flex items-center justify-between"><span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Ruang eksperimen</span><span className="rounded border border-line px-2 py-1 font-mono text-[10px] text-muted">EL / 001</span></div>
              <div className="flex items-center justify-center py-6">
                <div className="flex w-full max-w-md items-center justify-center gap-3 sm:gap-5">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-md border border-line bg-raised text-accent sm:size-20"><Icon name="bolt" size={30} /></div><div className="h-px flex-1 bg-accent/60" />
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-md border border-line bg-raised text-muted sm:size-20"><Icon name="workspace" size={27} /></div><div className="h-px flex-1 bg-accent/60" />
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-md border border-line bg-raised text-muted sm:size-20"><Icon name="motor" size={27} /></div>
                </div>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4"><div><p className="text-sm font-medium text-ink">Belajar melalui praktik</p><p className="mt-1 text-xs text-muted">Konsep · Rangkaian · Pemahaman</p></div><span className="font-mono text-[10px] text-muted">ELECTRICAL / INDUSTRIAL</span></div>
            </div>
          </div>
        </section>

        <section className="w-full border-b border-line py-12 sm:py-16">
          <div className="grid gap-5 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)] lg:gap-14">
            <div><p className="text-xs font-medium uppercase tracking-[0.13em] text-accent">Mengapa ElectroLab dibuat?</p><h2 className="mt-3 max-w-sm text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">Belajar teknik seharusnya tidak berhenti di atas kertas.</h2></div>
            <div className="max-w-4xl space-y-4 text-sm leading-7 text-muted sm:text-base sm:leading-8">
              <p>Ide ElectroLab berangkat dari pengalaman belajar di bidang Teknik Instalasi Tenaga Listrik. Saat mempelajari instalasi dan sistem kontrol, teori akan jauh lebih mudah dipahami ketika kita bisa melihat hubungan antar-komponen dan mencoba menyusun rangkaiannya sendiri.</p>
              <p>Dari pengalaman itu, lalu berlanjut ke perjalanan belajar Teknik Elektro, muncul keinginan untuk membangun ruang praktik digital yang bisa dibuka siapa saja. Bukan sekadar kumpulan materi, tetapi tempat untuk bereksperimen, melakukan kesalahan, memperbaiki rangkaian, dan memahami alasan di balik setiap koneksi.</p>
              <p className="border-l-2 border-accent/60 pl-4 text-ink">ElectroLab dibangun secara bertahap dari proses belajar nyata—dengan harapan bisa menjadi teman belajar bagi siapa pun yang ingin memahami dunia kelistrikan dan otomasi industri.</p>
            </div>
          </div>
        </section>

        <section className="w-full pt-12 sm:pt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-[0.13em] text-muted">Jelajahi ElectroLab</p><h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">Mulai dari bidang yang ingin kamu pelajari</h2></div><span className="text-xs text-muted">Ruang belajar dan simulasi</span></div>
          <div className="grid w-full gap-x-8 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-x-12">
            {areas.map((area) => (
              <Link key={area.href} href={area.href} className="group flex gap-4 border-t border-line py-5 transition-colors hover:border-accent/60">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-line text-muted transition-colors group-hover:border-accent/50 group-hover:text-accent"><Icon name={area.icon} size={18} /></span>
                <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">{area.title}{area.tag && <span className="rounded border border-accent/30 px-1.5 py-0.5 text-[10px] font-medium text-accent">{area.tag}</span>}</span><span className="mt-1 block text-sm leading-6 text-muted">{area.description}</span></span>
                <Icon name="chevron" size={16} className="mt-2 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-14 flex w-full flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-xs text-muted"><span>ElectroLab Industri</span><span>Dibangun dari rasa ingin tahu dan proses belajar.</span></footer>
      </main>
    </div>
  );
}
