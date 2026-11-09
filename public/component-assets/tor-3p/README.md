# Thermal Overload Relay (`tor-3p`)

Thermal overload relay (TOR) 3 kutub: bodi abu-abu terang, dial setelan arus bergradasi, tombol STOP merah dan RESET biru, jendela indikator trip, baut daya besar (1/3/5 atas; 2/4/6 bawah) dan baut kontak bantu lebih kecil (95/97 atas; 96/98 bawah).

## Status gambar
`physical.png` adalah **ilustrasi buatan AI**, bukan foto produk pabrikan. Dibuat dari kode SVG lalu dirender ke PNG 1280x1280 px (RGBA, latar transparan). Bentuk generik: tanpa merek, logo, teks, atau angka rating.

## Terminal (10)
Koordinat relatif 0-1 terhadap gambar (x ke kanan, y ke bawah), menunjuk pusat lubang/baut terminal yang terlihat. Daftar dan ID terminal disalin dari katalog (`src/data/components`).

| ID | Nama | Sisi | Sambungan | Posisi (x, y) |
|---|---|---|---|---|
| 1 | L1 LINE | top | screw | 0.2939, 0.1792 |
| 3 | L2 LINE | top | screw | 0.4202, 0.1792 |
| 5 | L3 LINE | top | screw | 0.5465, 0.1792 |
| 95 | 95 (NC) | top | screw | 0.6729, 0.1792 |
| 97 | 97 (NO) | top | screw | 0.756, 0.1792 |
| 2 | T1 LOAD | bottom | screw | 0.2939, 0.8208 |
| 4 | T2 LOAD | bottom | screw | 0.4202, 0.8208 |
| 6 | T3 LOAD | bottom | screw | 0.5465, 0.8208 |
| 96 | 96 (NC) | bottom | screw | 0.6729, 0.8208 |
| 98 | 98 (NO) | bottom | screw | 0.756, 0.8208 |

Koordinat dihitung dari geometri yang sama dengan yang menggambar baut, lalu diperiksa ulang terhadap piksel PNG (lihat ASSET-INVENTORY.md).
