# RCCB 4P (`rccb-4p`)

Residual current circuit breaker (RCCB) 4 kutub modular: tuas hitam penghubung empat kutub, tombol uji biru, jendela indikator, baut terminal di atas dan bawah tiap kutub.

## Status gambar
`physical.png` adalah **ilustrasi buatan AI**, bukan foto produk pabrikan. Dibuat dari kode SVG lalu dirender ke PNG 1280x1280 px (RGBA, latar transparan). Bentuk generik: tanpa merek, logo, teks, atau angka rating.

## Terminal (8)
Koordinat relatif 0-1 terhadap gambar (x ke kanan, y ke bawah), menunjuk pusat lubang/baut terminal yang terlihat. Daftar dan ID terminal disalin dari katalog (`src/data/components`).

| ID | Nama | Sisi | Sambungan | Posisi (x, y) |
|---|---|---|---|---|
| 1 | L1 LINE | top | screw | 0.207, 0.1775 |
| 3 | L2 LINE | top | screw | 0.4023, 0.1775 |
| 5 | L3 LINE | top | screw | 0.5977, 0.1775 |
| 7 | N LINE | top | screw | 0.793, 0.1775 |
| 2 | L1 LOAD | bottom | screw | 0.207, 0.8174 |
| 4 | L2 LOAD | bottom | screw | 0.4023, 0.8174 |
| 6 | L3 LOAD | bottom | screw | 0.5977, 0.8174 |
| 8 | N LOAD | bottom | screw | 0.793, 0.8174 |

Koordinat dihitung dari geometri yang sama dengan yang menggambar baut, lalu diperiksa ulang terhadap piksel PNG (lihat ASSET-INVENTORY.md).
