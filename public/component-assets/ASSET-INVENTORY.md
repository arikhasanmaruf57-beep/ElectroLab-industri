# ASSET-INVENTORY: aset fisik Component Library ElectroLab Industri

Sumber daftar komponen: `src/data/components/*.ts` (hasil evaluasi kode: **73 komponen**, tanpa type duplikat).
Dibuat: 2026-11-08.

## Ringkasan

| Status | Jumlah |
|---|---|
| SELESAI (dibuat dan lolos validasi) | 12 |
| SUDAH ADA (mcb-1p, tidak disentuh) | 1 |
| GAGAL VALIDASI | 0 |
| BELUM DIBUAT | 60 |
| Total di katalog | 73 |

Terminal pada aset baru yang selesai: 68 dari 326 terminal di katalog (di luar mcb-1p).

| Kategori | Di katalog | Punya aset | Belum |
|---|---|---|---|
| power-source | 9 | 0 | 9 |
| protection | 13 | 13 | 0 |
| wiring | 4 | 0 | 4 |
| switching | 8 | 0 | 8 |
| control | 12 | 0 | 12 |
| motor | 5 | 0 | 5 |
| lighting | 6 | 0 | 6 |
| accessories | 5 | 0 | 5 |
| measurement | 4 | 0 | 4 |
| automation | 7 | 0 | 7 |

## Daftar lengkap

| No | Type (nama folder) | Nama | Kategori | Jumlah terminal | Status | Validasi |
|---|---|---|---|---|---|---|
| 1 | `ac-1p-source` | Sumber AC 1 Phase | power-source | 3 | BELUM DIBUAT | - |
| 2 | `ac-3p-source` | Sumber AC 3 Phase | power-source | 5 | BELUM DIBUAT | - |
| 3 | `dc-supply` | Catu Daya DC | power-source | 2 | BELUM DIBUAT | - |
| 4 | `power-supply-24v` | Power Supply AC/DC 24 V | power-source | 5 | BELUM DIBUAT | - |
| 5 | `control-transformer` | Trafo Kontrol | power-source | 4 | BELUM DIBUAT | - |
| 6 | `battery` | Baterai | power-source | 2 | BELUM DIBUAT | - |
| 7 | `solar-panel` | Panel Surya | power-source | 2 | BELUM DIBUAT | - |
| 8 | `generator-3p` | Generator 3 Phase | power-source | 5 | BELUM DIBUAT | - |
| 9 | `ups-1p` | UPS 1 Phase | power-source | 6 | BELUM DIBUAT | - |
| 10 | `mcb-1p` | MCB 1P | protection | 2 | SUDAH ADA (tidak diubah) | tidak diperiksa (dilarang diubah) |
| 11 | `mcb-2p` | MCB 2P | protection | 4 | SELESAI | lolos (4/4 terminal terverifikasi di piksel) |
| 12 | `mcb-3p` | MCB 3P | protection | 6 | SELESAI | lolos (6/6 terminal terverifikasi di piksel) |
| 13 | `mcb-4p` | MCB 4P | protection | 8 | SELESAI | lolos (8/8 terminal terverifikasi di piksel) |
| 14 | `mccb-3p` | MCCB 3P | protection | 6 | SELESAI | lolos (6/6 terminal terverifikasi di piksel) |
| 15 | `rccb-2p` | RCCB 2P | protection | 4 | SELESAI | lolos (4/4 terminal terverifikasi di piksel) |
| 16 | `rccb-4p` | RCCB 4P | protection | 8 | SELESAI | lolos (8/8 terminal terverifikasi di piksel) |
| 17 | `rcbo-2p` | RCBO 2P | protection | 4 | SELESAI | lolos (4/4 terminal terverifikasi di piksel) |
| 18 | `mpcb-3p` | MPCB 3P | protection | 6 | SELESAI | lolos (6/6 terminal terverifikasi di piksel) |
| 19 | `main-switch-3p` | Main Switch 3P | protection | 6 | SELESAI | lolos (6/6 terminal terverifikasi di piksel) |
| 20 | `fuse-1p` | Fuse + Fuse Holder | protection | 2 | SELESAI | lolos (2/2 terminal terverifikasi di piksel) |
| 21 | `tor-3p` | Thermal Overload Relay | protection | 10 | SELESAI | lolos (10/10 terminal terverifikasi di piksel) |
| 22 | `spd-1p` | SPD (Surge Protector) | protection | 4 | SELESAI | lolos (4/4 terminal terverifikasi di piksel) |
| 23 | `busbar-phase` | Busbar Fase | wiring | 8 | BELUM DIBUAT | - |
| 24 | `busbar-neutral` | Neutral Bar | wiring | 8 | BELUM DIBUAT | - |
| 25 | `earth-bar` | Earth Bar (PE) | wiring | 8 | BELUM DIBUAT | - |
| 26 | `terminal-block` | Terminal Block | wiring | 8 | BELUM DIBUAT | - |
| 27 | `switch-single` | Saklar Tunggal | switching | 2 | BELUM DIBUAT | - |
| 28 | `switch-double` | Saklar Seri | switching | 4 | BELUM DIBUAT | - |
| 29 | `switch-two-way` | Saklar Tukar | switching | 3 | BELUM DIBUAT | - |
| 30 | `switch-intermediate` | Saklar Silang | switching | 4 | BELUM DIBUAT | - |
| 31 | `dimmer` | Dimmer Switch | switching | 2 | BELUM DIBUAT | - |
| 32 | `timer-switch` | Timer Switch | switching | 3 | BELUM DIBUAT | - |
| 33 | `photocell` | Photocell | switching | 3 | BELUM DIBUAT | - |
| 34 | `motion-sensor` | Motion Sensor | switching | 3 | BELUM DIBUAT | - |
| 35 | `pb-start-no` | Push Button START (NO) | control | 2 | BELUM DIBUAT | - |
| 36 | `pb-stop-nc` | Push Button STOP (NC) | control | 2 | BELUM DIBUAT | - |
| 37 | `estop` | Emergency Stop | control | 2 | BELUM DIBUAT | - |
| 38 | `pb-jog` | Push Button JOG (NO + NC) | control | 4 | BELUM DIBUAT | - |
| 39 | `pb-reset` | Push Button RESET (NO) | control | 2 | BELUM DIBUAT | - |
| 40 | `selector-switch` | Selector Switch 2 Posisi | control | 4 | BELUM DIBUAT | - |
| 41 | `limit-switch` | Limit Switch | control | 4 | BELUM DIBUAT | - |
| 42 | `contactor-3p` | Kontaktor 3 Pole (koil AC) | control | 12 | BELUM DIBUAT | - |
| 43 | `relay-aux` | Relay Bantu | control | 10 | BELUM DIBUAT | - |
| 44 | `timer-on-delay` | Timer ON Delay | control | 6 | BELUM DIBUAT | - |
| 45 | `timer-off-delay` | Timer OFF Delay | control | 6 | BELUM DIBUAT | - |
| 46 | `star-delta-timer` | Timer Star-Delta | control | 6 | BELUM DIBUAT | - |
| 47 | `motor-3p-6t` | Motor Induksi 3 Phase (6 terminal) | motor | 7 | BELUM DIBUAT | - |
| 48 | `motor-3p-3t` | Motor Induksi 3 Phase (3 terminal) | motor | 4 | BELUM DIBUAT | - |
| 49 | `motor-1p` | Motor Induksi 1 Phase (kapasitor) | motor | 3 | BELUM DIBUAT | - |
| 50 | `vfd-3p` | VFD (Inverter) 3 Phase | motor | 11 | BELUM DIBUAT | - |
| 51 | `soft-starter-3p` | Soft Starter 3 Phase | motor | 10 | BELUM DIBUAT | - |
| 52 | `lamp-led` | Lampu LED | lighting | 2 | BELUM DIBUAT | - |
| 53 | `lamp-incandescent` | Lampu Pijar | lighting | 2 | BELUM DIBUAT | - |
| 54 | `lamp-fluorescent` | Lampu Fluorescent (TL) | lighting | 3 | BELUM DIBUAT | - |
| 55 | `downlight` | Downlight | lighting | 2 | BELUM DIBUAT | - |
| 56 | `emergency-lamp` | Lampu Darurat | lighting | 2 | BELUM DIBUAT | - |
| 57 | `street-light` | Lampu Jalan | lighting | 3 | BELUM DIBUAT | - |
| 58 | `socket-1p` | Stopkontak 1 Phase | accessories | 2 | BELUM DIBUAT | - |
| 59 | `socket-earthed` | Stopkontak Grounding | accessories | 3 | BELUM DIBUAT | - |
| 60 | `socket-industrial-3p` | Industrial Socket 3P+N+PE | accessories | 5 | BELUM DIBUAT | - |
| 61 | `plug-earthed` | Steker (Plug) Grounding | accessories | 3 | BELUM DIBUAT | - |
| 62 | `junction-box` | Junction Box | accessories | 6 | BELUM DIBUAT | - |
| 63 | `multimeter` | Digital Multimeter | measurement | 3 | BELUM DIBUAT | - |
| 64 | `voltmeter` | Voltmeter | measurement | 2 | BELUM DIBUAT | - |
| 65 | `ammeter` | Ammeter | measurement | 2 | BELUM DIBUAT | - |
| 66 | `energy-meter-1p` | kWh Meter 1 Phase | measurement | 4 | BELUM DIBUAT | - |
| 67 | `plc-basic` | PLC Kompak (4 DI / 4 DO) | automation | 11 | BELUM DIBUAT | - |
| 68 | `proximity-sensor` | Proximity Sensor | automation | 3 | BELUM DIBUAT | - |
| 69 | `photoelectric-sensor` | Photoelectric Sensor | automation | 3 | BELUM DIBUAT | - |
| 70 | `float-switch` | Float Switch | automation | 4 | BELUM DIBUAT | - |
| 71 | `pressure-switch` | Pressure Switch | automation | 4 | BELUM DIBUAT | - |
| 72 | `temperature-sensor` | Sensor Suhu (PT100) | automation | 2 | BELUM DIBUAT | - |
| 73 | `solenoid-valve` | Solenoid Valve | automation | 2 | BELUM DIBUAT | - |

## Cara validasi

Setiap aset melewati pemeriksaan berikut (skrip `validate.mjs`):
1. Folder bernama sama dengan `type` katalog; ada `physical.png`, `info.json`, `README.md`; JSON dapat dibaca.
2. Himpunan ID terminal di `info.json` identik dengan katalog (tidak ada yang hilang atau tambahan); `side` dan `kind` sama dengan katalog.
3. PNG berformat RGBA, minimal 1024x1024 (hasil: 1280x1280), sudut dan tepi transparan, objek tidak terpotong (margin >= 3%) dan berada di tengah.
4. Semua koordinat berada pada rentang 0-1 dan tidak ada dua terminal yang saling menumpuk.
5. **Pemeriksaan piksel independen:** di koordinat setiap terminal berbaut, piksel PNG harus menunjukkan cincin lubang gelap mengelilingi kepala baut yang lebih terang. Pemeriksaan ini membaca PNG akhir, bukan data penggambar. Pada uji mutasi, koordinat yang digeser 0,03 (~38 px) terdeteksi, terminal yang hilang terdeteksi.
6. Dilengkapi tinjauan visual manual dengan penanda terminal di atas gambar.

Yang **tidak** dapat diperiksa otomatis: apakah bentuk suatu komponen "meyakinkan" bagi teknisi. Itu dinilai secara visual.

## Catatan penting

- Semua gambar adalah **ilustrasi buatan AI** (kode SVG dirender ke PNG), bukan foto produk pabrikan dan bukan keluaran model pembuat gambar. Generik: tanpa merek, logo, teks, atau angka rating. `imageType` = `ai-generated-illustration`; `imageLicense` = `null` (ditentukan pemilik proyek).
- **`mcb-1p` tidak diubah.** Format `info.json`-nya berbeda dari format baru: `terminals` di sana berupa objek (`count: 2`), tanpa daftar terminal berkoordinat. Katalog mendefinisikan terminalnya sebagai `1` (atas) dan `2` (bawah). Agar Workspace dapat membaca semua komponen dengan satu format, koordinat `mcb-1p` perlu ditambahkan; saya tidak melakukannya karena Anda melarang mengubah folder itu. Bila Anda setuju, saya bisa membuat `info.json` berformat baru terpisah.
- Posisi terminal mengikuti `side` di katalog (`top`/`bottom`/`left`/`right`) dan urutan definisi kiri ke kanan (atau atas ke bawah). Mis. kutub ke-i di sisi atas berpasangan dengan kutub ke-i di sisi bawah, seperti `poleDevice()` di `factories.ts`.
- Perangkat dengan terminal baut digambar dengan baut terlihat. Perangkat dengan konektor plug-in/soket digambar dengan konektor yang sesuai dan `connectionType` yang sesuai (bukan dipaksa baut).
- `src/electrical-engine/terminal-system/layout.ts` tidak ada di ZIP yang diberikan; tidak memengaruhi aset ini karena posisi terminal pada gambar fisik dihitung terpisah dari tata letak simbol.


## Katalog lengkap di branch `feature/component-display-modes`

Semua 73 komponen katalog sekarang memiliki aset fisik terdaftar. Aset Protection yang dibuat sebelumnya menggunakan PNG; aset kategori lainnya menggunakan SVG vektor agar titik terminal dapat disejajarkan dengan layout Workspace.

- Protection: 13 komponen
- Control: 12 komponen
- Switching: 8 komponen
- Motor: 5 komponen
- Lighting: 6 komponen
- Wiring: 4 komponen
- Measurement: 4 komponen
- Automation: 7 komponen
- Power Sources: 9 komponen
- Accessories: 5 komponen

Ilustrasi SVG bersifat generik, bukan foto pabrikan. Setiap folder memuat `physical.svg`, `info.json`, dan `README.md`.
