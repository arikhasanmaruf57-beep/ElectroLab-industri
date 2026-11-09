# Fuse + Fuse Holder (`fuse-1p`)

Fuse holder modular DIN 1 kutub: pembawa sekring abu-abu dengan alur genggam, sekring silinder berkeramik dengan tutup kuningan terlihat, lampu indikator merah kecil, baut terminal di atas dan bawah.

## Status gambar
`physical.png` adalah **ilustrasi buatan AI**, bukan foto produk pabrikan. Dibuat dari kode SVG lalu dirender ke PNG 1280x1280 px (RGBA, latar transparan). Bentuk generik: tanpa merek, logo, teks, atau angka rating.

## Terminal (2)
Koordinat relatif 0-1 terhadap gambar (x ke kanan, y ke bawah), menunjuk pusat lubang/baut terminal yang terlihat. Daftar dan ID terminal disalin dari katalog (`src/data/components`).

| ID | Nama | Sisi | Sambungan | Posisi (x, y) |
|---|---|---|---|---|
| 1 | LINE | top | screw | 0.5, 0.1607 |
| 2 | LOAD | bottom | screw | 0.5, 0.8339 |

Koordinat dihitung dari geometri yang sama dengan yang menggambar baut, lalu diperiksa ulang terhadap piksel PNG (lihat ASSET-INVENTORY.md).
