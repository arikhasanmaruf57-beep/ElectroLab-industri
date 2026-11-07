'use client';

import { CONDUCTOR_PRESETS } from '@/data/configurations';
import { useSettingsStore, type SnapSize } from '@/store/settings-store';
import { CONDUCTOR_LABELS, CONDUCTOR_TYPES } from '@/types/electrical';
import { cn } from '@/utils/cn';

function Seg<T extends string | number>({ value, options, onChange, label }: { value: T; options: Array<{ v: T; label: string }>; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-md border border-line p-0.5">
      {options.map((o) => (
        <button key={String(o.v)} type="button" role="radio" aria-checked={value === o.v} onClick={() => onChange(o.v)} className={cn('h-8 rounded px-3 text-sm', value === o.v ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink')}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Row({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0"><div className="text-sm font-medium">{title}</div>{hint && <div className="text-xs text-muted">{hint}</div>}</div>
      {children}
    </div>
  );
}

export function SettingsView() {
  const s = useSettingsStore();

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-5">
      <section className="divide-y divide-line rounded-lg border border-line bg-surface" aria-label="Tampilan">
        <Row title="Tema" hint="Dark industrial adalah tampilan utama.">
          <Seg label="Tema" value={s.theme} onChange={s.setTheme} options={[{ v: 'dark', label: 'Gelap' }, { v: 'light', label: 'Terang' }]} />
        </Row>
        <Row title="Grid snapping" hint="Komponen menempel ke kelipatan jarak ini saat dipindah.">
          <Seg<SnapSize> label="Grid snapping" value={s.snapSize} onChange={s.setSnapSize} options={[{ v: 10, label: '10' }, { v: 20, label: '20' }, { v: 0, label: 'Mati' }]} />
        </Row>
        <Row title="Titik grid di kanvas">
          <Seg label="Titik grid" value={s.showGrid ? 'on' : 'off'} onChange={(v) => s.setShowGrid(v === 'on')} options={[{ v: 'on', label: 'Tampil' }, { v: 'off', label: 'Sembunyi' }]} />
        </Row>
      </section>

      <section className="rounded-lg border border-line bg-surface" aria-label="Warna penghantar">
        <div className="border-b border-line px-4 py-3">
          <h2 className="text-sm font-semibold">Warna penghantar</h2>
          <p className="text-xs text-muted">Dipakai untuk semua kabel di workspace. Warna hitam diberi selubung terang agar tetap terlihat di tema gelap.</p>
        </div>
        <div className="flex flex-wrap gap-2 px-4 pt-3">
          {(Object.keys(CONDUCTOR_PRESETS) as Array<keyof typeof CONDUCTOR_PRESETS>).map((id) => (
            <button key={id} type="button" aria-pressed={s.colorScheme === id} onClick={() => s.applyPreset(id)} className={cn('rounded-md border px-3 py-1.5 text-left text-sm', s.colorScheme === id ? 'border-accent bg-accent/10' : 'border-line hover:bg-raised')}>
              <div>{CONDUCTOR_PRESETS[id].label}</div>
              <div className="text-xs text-muted">{CONDUCTOR_PRESETS[id].note}</div>
            </button>
          ))}
          {s.colorScheme === 'custom' && <span className="self-center text-xs text-muted">Skema kustom aktif</span>}
        </div>
        <ul className="grid gap-2 p-4 sm:grid-cols-2">
          {CONDUCTOR_TYPES.map((t) => (
            <li key={t} className="flex items-center gap-3 rounded-md border border-line px-3 py-2">
              <input type="color" aria-label={`Warna ${CONDUCTOR_LABELS[t]}`} value={s.conductorColors[t]} onChange={(e) => s.setConductorColor(t, e.target.value)} className="h-7 w-10 cursor-pointer rounded border border-line bg-transparent" />
              <span className="flex-1 text-sm">{CONDUCTOR_LABELS[t]}</span>
              <span className="text-xs text-muted tnum">{s.conductorColors[t]}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex justify-end">
        <button type="button" onClick={s.resetSettings} className="h-9 rounded-md border border-line px-3 text-sm hover:bg-raised">Kembalikan ke bawaan</button>
      </div>
    </div>
  );
}
