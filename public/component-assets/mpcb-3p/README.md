# MPCB 3P (`mpcb-3p`)

Motor protection circuit breaker (MPCB) 3 kutub: casing hitam ringkas, dial setelan arus di atas, gagang putar ON/OFF besar dengan penanda merah, tiga baut terminal di atas dan tiga di bawah.

## Status gambar
`physical.png` adalah **ilustrasi buatan AI**, bukan foto produk pabrikan. Dibuat dari kode SVG lalu dirender ke PNG 1280x1280 px (RGBA, latar transparan). Bentuk generik: tanpa merek, logo, teks, atau angka rating.

## Terminal (6)
Koordinat relatif 0-1 terhadap gambar (x ke kanan, y ke bawah), menunjuk pusat lubang/baut terminal yang terlihat. Daftar dan ID terminal disalin dari katalog (`src/data/components`).

| ID | Nama | Sisi | Sambungan | Posisi (x, y) |
|---|---|---|---|---|
| 1 | L1 LINE | top | screw | 0.3504, 0.1792 |
| 3 | L2 LINE | top | screw | 0.5, 0.1792 |
| 5 | L3 LINE | top | screw | 0.6496, 0.1792 |
| 2 | L1 LOAD | bottom | screw | 0.3504, 0.8208 |
| 4 | L2 LOAD | bottom | screw | 0.5, 0.8208 |
| 6 | L3 LOAD | bottom | screw | 0.6496, 0.8208 |

Koordinat dihitung dari geometri yang sama dengan yang menggambar baut, lalu diperiksa ulang terhadap piksel PNG (lihat ASSET-INVENTORY.md).
