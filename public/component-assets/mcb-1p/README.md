# MCB 1 Pole (1P): aset Component Library ElectroLab

Eksperimen aset mandiri. Tidak mengubah proyek ElectroLab.

## Isi

| File | Keterangan |
|---|---|
| `physical.png` | Ilustrasi fisik MCB 1P tampak depan, 1400 x 1400 px, latar transparan |
| `schematic.svg` | Simbol skematik 1P, terpisah dari gambar fisik, memakai `currentColor` |
| `info.json` | Metadata komponen untuk Component Library |

## Status gambar: ILUSTRASI AI, BUKAN FOTO

`physical.png` adalah **ilustrasi buatan AI**, bukan foto produk asli. Dibuat dengan menulis kode SVG
(gradien, bayangan, proyeksi oblik) lalu merender ke PNG. Tidak dipakai model pembuat gambar, sehingga
hasilnya bergaya ilustrasi teknis, bukan fotorealistis. Nilai `imageType` di `info.json` adalah
`ai-generated-illustration`.

Gaya mengikuti foto referensi dari pengguna: bodi abu-abu terang, tuas oranye lebar, blok terminal yang lebih sempit
di atas dan bawah dengan sekrup terlihat, serta jendela kecil di bawah tuas. Yang **sengaja tidak disalin** dari foto:
logo dan nama merek, nama seri, kode produk, dan seluruh teks rating. Area penandaan dibiarkan kosong. Tanpa tangan atau panel.
Versi sebelumnya (perspektif oblik dengan DIN rail) tidak disertakan di folder ini.

## Yang terverifikasi dan yang tidak

Terverifikasi dari sumber yang ditemukan:
- Penanda posisi "I" = tertutup (ON) dan "O" = terbuka (OFF) menurut dokumen sertifikasi yang merujuk EN 60898-1;
  ilustrasi ini tidak lagi menampilkan huruf tersebut, hanya simbol lingkaran bergaris seperti foto referensi.
- Simbol skematik breaker IEC berupa simbol kontak/saklar miring dengan tanda silang (sumber sekunder,
  bukan teks standar IEC 60617). Simbol di sini versi generik sederhana; nomor simbol resmi tidak dicantumkan.

Tidak terverifikasi, karena itu bernilai `null`:
- Penomoran terminal: katalog satu pabrikan (ABB S400M, tipe 1 kutub) menampilkan angka 1 dan 2,
  tetapi itu bukan bukti ketentuan umum.
- Sisi suplai dan sisi beban, rating arus/tegangan, kurva trip, kapasitas pemutusan, lebar modul,
  kapasitas terminal, dan standar. Jangan diisi sebelum ada lembar data yang spesifik.
- `imageLicense` dikosongkan; pemilik proyek yang menentukan.

## Catatan pemakaian

- Hanya `count: 2` terminal yang dinyatakan di `info.json`; itu konsekuensi satu kutub (satu jalur arus).
- Tampak depan murni (tanpa perspektif dan tanpa DIN rail), seperti foto referensi.
- Untuk memakai logo/penandaan merek tertentu, perlu izin pemilik merek; tambahkan sebagai lapisan terpisah.
- Untuk tema gelap, atur `color` pada elemen yang memuat `schematic.svg` jika disisipkan inline.
- Ilustrasi ini cukup untuk perpustakaan komponen edukasi, tetapi bukan referensi dimensi.
