# MCB 2P (`mcb-2p`)

Miniature circuit breaker 2 kutub bergaya modular DIN: tuas oranye tunggal yang menyatukan 2 kutub, jendela indikator, baut terminal di atas (suplai) dan bawah (beban) pada tiap kutub.

## Status gambar
`physical.png` adalah **ilustrasi buatan AI**, bukan foto produk pabrikan. Dibuat dari kode SVG lalu dirender ke PNG 1280x1280 px (RGBA, latar transparan). Bentuk generik: tanpa merek, logo, teks, atau angka rating.

## Terminal (4)
Koordinat relatif 0-1 terhadap gambar (x ke kanan, y ke bawah), menunjuk pusat lubang/baut terminal yang terlihat. Daftar dan ID terminal disalin dari katalog (`src/data/components`).

| ID | Nama | Sisi | Sambungan | Posisi (x, y) |
|---|---|---|---|---|
| 1 | L LINE | top | screw | 0.3973, 0.1607 |
| 3 | N LINE | top | screw | 0.6027, 0.1607 |
| 2 | L LOAD | bottom | screw | 0.3973, 0.8339 |
| 4 | N LOAD | bottom | screw | 0.6027, 0.8339 |

Koordinat dihitung dari geometri yang sama dengan yang menggambar baut, lalu diperiksa ulang terhadap piksel PNG (lihat ASSET-INVENTORY.md).
