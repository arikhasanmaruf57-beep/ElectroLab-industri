# MCCB 3P (`mccb-3p`)

Molded case circuit breaker 3 kutub: casing hitam besar, tuas toggle di tengah, tombol push-to-trip, dua dial setelan trip, dan tiga terminal lug dengan baut hex di atas serta di bawah.

## Status gambar
`physical.png` adalah **ilustrasi buatan AI**, bukan foto produk pabrikan. Dibuat dari kode SVG lalu dirender ke PNG 1280x1280 px (RGBA, latar transparan). Bentuk generik: tanpa merek, logo, teks, atau angka rating.

## Terminal (6)
Koordinat relatif 0-1 terhadap gambar (x ke kanan, y ke bawah), menunjuk pusat lubang/baut terminal yang terlihat. Daftar dan ID terminal disalin dari katalog (`src/data/components`).

| ID | Nama | Sisi | Sambungan | Posisi (x, y) |
|---|---|---|---|---|
| 1 | L1 LINE | top | screw | 0.3047, 0.181 |
| 3 | L2 LINE | top | screw | 0.5, 0.181 |
| 5 | L3 LINE | top | screw | 0.6953, 0.181 |
| 2 | L1 LOAD | bottom | screw | 0.3047, 0.819 |
| 4 | L2 LOAD | bottom | screw | 0.5, 0.819 |
| 6 | L3 LOAD | bottom | screw | 0.6953, 0.819 |

Koordinat dihitung dari geometri yang sama dengan yang menggambar baut, lalu diperiksa ulang terhadap piksel PNG (lihat ASSET-INVENTORY.md).
