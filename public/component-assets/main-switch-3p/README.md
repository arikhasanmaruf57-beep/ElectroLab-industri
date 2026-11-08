# Main Switch 3P (`main-switch-3p`)

Main switch (isolator) 3 kutub modular DIN: tuas merah lebar penghubung tiga kutub, jendela indikator posisi, baut terminal di atas dan bawah tiap kutub.

## Status gambar
`physical.png` adalah **ilustrasi buatan AI**, bukan foto produk pabrikan. Dibuat dari kode SVG lalu dirender ke PNG 1280x1280 px (RGBA, latar transparan). Bentuk generik: tanpa merek, logo, teks, atau angka rating.

## Terminal (6)
Koordinat relatif 0-1 terhadap gambar (x ke kanan, y ke bawah), menunjuk pusat lubang/baut terminal yang terlihat. Daftar dan ID terminal disalin dari katalog (`src/data/components`).

| ID | Nama | Sisi | Sambungan | Posisi (x, y) |
|---|---|---|---|---|
| 1 | L1 LINE | top | screw | 0.2946, 0.1607 |
| 3 | L2 LINE | top | screw | 0.5, 0.1607 |
| 5 | L3 LINE | top | screw | 0.7054, 0.1607 |
| 2 | L1 LOAD | bottom | screw | 0.2946, 0.8339 |
| 4 | L2 LOAD | bottom | screw | 0.5, 0.8339 |
| 6 | L3 LOAD | bottom | screw | 0.7054, 0.8339 |

Koordinat dihitung dari geometri yang sama dengan yang menggambar baut, lalu diperiksa ulang terhadap piksel PNG (lihat ASSET-INVENTORY.md).
