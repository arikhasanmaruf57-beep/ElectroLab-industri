'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from './Icon';

export interface GuideStep {
  title: string;
  detail: string;
  check: string;
}

export interface GuideSection {
  title: string;
  description: string;
  points: string[];
}

export interface ModuleGuideProps {
  phase: number;
  title: string;
  subtitle: string;
  intro: string;
  objectives: string[];
  sections: GuideSection[];
  steps: GuideStep[];
  safety?: string;
  workspaceHint: string;
}

export function ModuleGuide({ phase, title, subtitle, intro, objectives, sections, steps, safety, workspaceHint }: ModuleGuideProps) {
  const [completed, setCompleted] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number | null>(0);
  const progress = steps.length ? Math.round((completed.length / steps.length) * 100) : 0;

  const toggleStep = (index: number) => {
    setCompleted((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-7 p-4 sm:p-6 lg:p-8" data-testid="module-guide">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Link href="/" className="transition-colors hover:text-ink">Beranda</Link>
        <Icon name="chevron" size={13} />
        <span>Modul pembelajaran</span>
        <Icon name="chevron" size={13} />
        <span className="text-ink">{title}</span>
        <span className="ml-auto rounded border border-line px-2 py-1">Phase {phase}</span>
      </div>

      <section className="border-b border-line pb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{subtitle}</p>
        <h2 className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">{intro}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/workspace" className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-ink hover:brightness-110"><Icon name="workspace" size={16} /> Buka workspace</Link>
          <Link href="/component-library" className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-4 text-sm hover:bg-raised"><Icon name="library" size={16} /> Component Library</Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]">
        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="flex items-center gap-2"><Icon name="target" size={17} className="text-accent" /><h3 className="text-sm font-semibold">Target pembelajaran</h3></div>
          <ul className="mt-4 space-y-3">
            {objectives.map((objective) => <li key={objective} className="flex gap-2.5 text-sm leading-6 text-muted"><Icon name="check" size={16} className="mt-1 shrink-0 text-accent" />{objective}</li>)}
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Icon name="list-checks" size={17} className="text-accent" /><h3 className="text-sm font-semibold">Progres latihan</h3></div><span className="text-sm font-semibold tabular-nums">{progress}%</span></div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-raised"><div className="h-full rounded-full bg-accent transition-all" style={{ width: progress + '%' }} /></div>
          <p className="mt-3 text-xs leading-5 text-muted">{completed.length} dari {steps.length} langkah ditandai selesai. Progres ini tersimpan selama halaman terbuka.</p>
          <button type="button" onClick={() => setCompleted([])} className="mt-3 text-xs text-muted underline decoration-line underline-offset-4 hover:text-ink">Atur ulang checklist</button>
        </div>
      </section>

      <section className="space-y-3">
        <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Materi inti</p><h3 className="mt-1 text-xl font-semibold">Pahami konsep sebelum praktik</h3></div>
        <div className="grid gap-3 md:grid-cols-2">
          {sections.map((section, index) => (
            <article key={section.title} className="rounded-lg border border-line bg-surface p-5">
              <div className="flex items-start gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-raised text-xs font-semibold text-accent">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0"><h4 className="text-sm font-semibold">{section.title}</h4><p className="mt-2 text-sm leading-6 text-muted">{section.description}</p></div></div>
              <ul className="mt-4 space-y-2 border-t border-line pt-3">{section.points.map((point) => <li key={point} className="flex gap-2 text-xs leading-5 text-muted"><span className="text-accent">•</span>{point}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Latihan bertahap</p><h3 className="mt-1 text-xl font-semibold">Checklist praktik</h3><p className="mt-1 text-sm text-muted">Baca instruksi, kerjakan secara berurutan, lalu tandai langkah yang sudah Anda pahami.</p></div>
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          {steps.map((step, index) => {
            const done = completed.includes(index);
            const open = expanded === index;
            return (
              <div key={step.title} className="border-b border-line last:border-b-0">
                <div className="flex items-center gap-3 p-4">
                  <button type="button" aria-label={done ? 'Batalkan langkah selesai' : 'Tandai langkah selesai'} aria-pressed={done} onClick={() => toggleStep(index)} className={`flex size-6 shrink-0 items-center justify-center rounded border ${done ? 'border-accent bg-accent text-accent-ink' : 'border-line text-transparent hover:border-accent'}`}><Icon name="check" size={15} /></button>
                  <button type="button" onClick={() => setExpanded(open ? null : index)} aria-expanded={open} className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"><span><span className="mr-2 text-xs text-muted">{String(index + 1).padStart(2, '0')}</span><span className={`text-sm font-medium ${done ? 'text-muted line-through' : 'text-ink'}`}>{step.title}</span></span><Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} className="shrink-0 text-muted" /></button>
                </div>
                {open && <div className="ml-10 space-y-2 px-4 pb-4"><p className="text-sm leading-6 text-muted">{step.detail}</p><p className="rounded-md bg-raised p-3 text-xs leading-5 text-muted"><span className="font-semibold text-ink">Periksa:</span> {step.check}</p></div>}
              </div>
            );
          })}
        </div>
      </section>

      {safety && <aside className="rounded-lg border border-line bg-surface p-4"><div className="flex gap-2"><Icon name="shield-alert" size={18} className="shrink-0 text-accent" /><div><h3 className="text-sm font-semibold">Catatan keselamatan</h3><p className="mt-1 text-sm leading-6 text-muted">{safety}</p></div></div></aside>}

      <section className="rounded-lg border border-line bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Lanjutkan praktik</p><h3 className="mt-2 text-lg font-semibold">Gunakan workspace untuk menyusun rangkaian</h3><p className="mt-2 text-sm leading-6 text-muted">{workspaceHint}</p><p className="mt-3 text-xs leading-5 text-muted">Catatan: halaman ini menyediakan materi dan panduan latihan. Simulasi otomatis khusus modul ini belum diaktifkan; jangan menganggap checklist sebagai hasil pengujian rangkaian.</p></div><Link href="/workspace" className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-ink hover:brightness-110"><Icon name="arrow-up-right" size={16} /> Ke workspace</Link></div>
      </section>
    </div>
  );
}
