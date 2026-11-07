# Electrical Simulator — Phase 1

Platform belajar & simulasi instalasi listrik rumah/gedung dan kontrol motor industri.
**Phase 1 (fondasi)**: dashboard, sidebar, Component Library (73 komponen), Electrical Workspace
(drag & drop, terminal, kabel tervalidasi, undo/redo, zoom/pan, dsb.).

> Simulator pembelajaran. Hasilnya tidak menggantikan perhitungan desain, pengujian, dan
> pemeriksaan instalasi sesuai PUIL/SNI. Belum ada engine simulasi: **tidak ada nilai tegangan/arus
> yang ditampilkan** di Phase 1, dan modul yang belum dibuat ditandai jelas "Belum diimplementasikan".

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm test             # unit test (node:test + tsx), 36 test
npm run build        # production build
npm run check        # ketiganya berurutan
```

Butuh Node ≥ 20. Stack: Next.js (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 · Zustand.

## Fitur Phase 1

- **Dashboard**: statistik nyata (komponen/kabel di workspace, draf), pratinjau proyek terakhir, status roadmap.
- **Sidebar** 12 menu; modul belum jadi menampilkan halaman jujur berisi rencana + apa yang sudah bisa dipakai.
- **Component Library** (`/component-library` dan panel di workspace): pencarian, filter kategori, simbol, spesifikasi
  (datasheet virtual), daftar terminal beserta jenisnya.
- **Workspace**: seret dari library (atau dblclick/Enter/tombol +), pindah, putar (R), hapus, salin/potong/tempel,
  pilih banyak (Shift+klik, marquee, Ctrl+A), undo/redo (100 langkah), zoom (roda/tombol), geser (Spasi/alat geser),
  fit, grid snapping 10/20/off, susun otomatis per kategori, autosave + Simpan (localStorage), Inspector.
- **Terminal & kabel**: tarik dari terminal ke terminal atau klik-klik. Saat kabel ditarik, terminal tujuan
  ditandai hijau (kompatibel) / redup (ditolak) dan alasan penolakan ditampilkan. Aturan:
  fase↔netral ditolak, netral↔PE ditolak, PE hanya ke PE, DC+↔DC− ditolak, AC↔DC/sinyal ditolak,
  koil↔koil ditolak, terminal penuh/duplikat ditolak. Jenis penghantar (L/L1/L2/L3/N/PE/+24VDC/0VDC/kontrol)
  disimpulkan otomatis; warnanya dapat diatur di Settings (preset PUIL lama / IEC 60446 / kustom).
- **Settings**: tema gelap/terang, snapping, grid, warna penghantar.

## Arsitektur (agar Phase 2+ tinggal menambah)

```
src/
  app/                    rute Next.js (tipis; hanya merakit komponen)
  components/             UI saja (layout, workspace, component-library, electrical-symbols, dashboard, ui)
  electrical-engine/      TANPA React — dapat diuji dan dipakai solver
    core/                 geometri (rotasi, bounds, snap), id
    terminal-system/      layout terminal, matriks kompatibilitas jenis terminal
    connections/          checkConnection, inferConductor, routeWire
    (circuit-solver/, topology/, ... → Phase 3)
  data/
    components/*.ts       katalog per kategori (data murni) + registry (index.ts)
    categories.ts, navigation.ts, configurations.ts
  store/
    workspace-store/      document.ts (operasi murni) · history.ts · index.ts (Zustand)
    settings-store/
  services/project-repository.ts   antarmuka penyimpanan (localStorage sekarang)
  types/                  electrical.ts · component.ts · workspace.ts
```

Titik perluasan:

| Phase | Tempat menambah |
|---|---|
| 2 Wiring/proyek | `ProjectRepository` + implementasi Supabase; field parameter di `PlacedComponent`; validasi di `connections/validate.ts`; Inspector |
| 3 Solver | `electrical-engine/circuit-solver` membaca `WorkspaceDocument` + `ComponentDefinition.internalConnections` (busbar, terminal block, junction box sudah menyatakan node internalnya) |
| 4 Proteksi | `protection-engine/*`; `simulationPhase` pada tiap komponen menunjukkan kapan ia mendapat perilaku |
| 6+ Motor/PLC | `motor-engine/`, `plc-engine/`; motor 6 terminal vs 3 terminal sudah dibedakan untuk Star-Delta |

Menambah komponen = menambah satu objek di `src/data/components/<kategori>.ts` (terminal + simbol + spesifikasi).
Test katalog memastikan ID terminal unik, simbol merujuk terminal yang ada, dan posisi terminal pada grid.

## Keputusan & batasan yang perlu Anda ketahui

- **Kanvas SVG kustom, bukan React Flow.** Aturan kompatibilitas terminal, rotasi, grid 10 dan routing
  ortogonal lebih sederhana dikendalikan langsung. Dependensi yang belum dipakai (React Flow, Framer Motion,
  Recharts, Supabase) sengaja **belum** dipasang; tambahkan saat fasenya tiba.
- **Cakupan katalog: 73 komponen** dari kira-kira 200 butir di spesifikasi. Dipilih yang punya terminal dan simbol
  benar. Belum ada: ELCB model, SPD tipe lain, kontaktor 4 kutub/koil DC, relay proteksi tegangan/fase,
  motor slip ring/synchronous/two-speed/brake, HMI, encoder, clamp meter, ATS, detektor asap, dsb.
  Motor 1 phase di Phase 1 hanya punya terminal suplai L/N/PE (belitan utama/bantu/kapasitor → Phase 6).
  Kontak timer/relay dimodelkan sebagai pasangan NO dan NC terpisah, bukan changeover.
- **Routing kabel** hanya satu belokan siku; belum menghindari komponen. Kabel bisa melintasi label.
- **Kompatibilitas** memeriksa *jenis* terminal. Apakah suatu sambungan menimbulkan hubung singkat (mis. L–N lewat
  beban vs tanpa beban) dinilai solver di Phase 3, sesuai spesifikasi.
- Belum ada: Save/Load multi-proyek, Supabase, simulasi, PDF, ekspor/impor (semua Phase 2+).
