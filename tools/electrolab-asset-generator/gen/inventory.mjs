import fs from 'node:fs';
import path from 'node:path';
const catalog = JSON.parse(fs.readFileSync('/home/claude/catalog.json', 'utf8'));
const ROOT = '/home/claude/out/public/component-assets';
const val = JSON.parse(fs.readFileSync('/home/claude/validation.json', 'utf8'));
const CATS = ['power-source', 'protection', 'wiring', 'switching', 'control', 'motor', 'lighting', 'accessories', 'measurement', 'automation'];
const rows = []; let done = 0, existing = 0, pending = 0, fail = 0, totalTerm = 0, doneTerm = 0;
let n = 0;
for (const cat of CATS) for (const c of catalog.filter(x => x.category === cat)) {
  n++; totalTerm += c.terminals.length;
  let status, v = '-';
  if (c.type === 'mcb-1p') { status = 'SUDAH ADA (tidak diubah)'; existing++; v = 'tidak diperiksa (dilarang diubah)'; }
  else if (fs.existsSync(path.join(ROOT, c.type, 'physical.png'))) {
    const r = val[c.type];
    if (r?.ok) { status = 'SELESAI'; done++; doneTerm += c.terminals.length; v = `lolos (${r.checked}/${r.terminals} terminal terverifikasi di piksel)`; }
    else { status = 'GAGAL VALIDASI'; fail++; v = (r?.errs || ['belum divalidasi']).join('; '); }
  } else { status = 'BELUM DIBUAT'; pending++; }
  rows.push(`| ${n} | \`${c.type}\` | ${c.name} | ${cat} | ${c.terminals.length} | ${status} | ${v} |`);
}
const perCat = CATS.map(cat => { const l = catalog.filter(x => x.category === cat); const d = l.filter(x => x.type === 'mcb-1p' || fs.existsSync(path.join(ROOT, x.type, 'physical.png'))).length; return `| ${cat} | ${l.length} | ${d} | ${l.length - d} |`; }).join('\n');
const md = `# ASSET-INVENTORY: aset fisik Component Library ElectroLab Industri

Sumber daftar komponen: \`src/data/components/*.ts\` (hasil evaluasi kode: **${catalog.length} komponen**, tanpa type duplikat).
Dibuat: ${new Date().toISOString().slice(0, 10)}.

## Ringkasan

| Status | Jumlah |
|---|---|
| SELESAI (dibuat dan lolos validasi) | ${done} |
| SUDAH ADA (mcb-1p, tidak disentuh) | ${existing} |
| GAGAL VALIDASI | ${fail} |
| BELUM DIBUAT | ${pending} |
| Total di katalog | ${catalog.length} |

Terminal pada aset baru yang selesai: ${doneTerm} dari ${totalTerm - 2} terminal di katalog (di luar mcb-1p).

| Kategori | Di katalog | Punya aset | Belum |
|---|---|---|---|
${perCat}

## Daftar lengkap

| No | Type (nama folder) | Nama | Kategori | Jumlah terminal | Status | Validasi |
|---|---|---|---|---|---|---|
${rows.join('\n')}

## Cara validasi

Setiap aset melewati pemeriksaan berikut (skrip \`validate.mjs\`):
1. Folder bernama sama dengan \`type\` katalog; ada \`physical.png\`, \`info.json\`, \`README.md\`; JSON dapat dibaca.
2. Himpunan ID terminal di \`info.json\` identik dengan katalog (tidak ada yang hilang atau tambahan); \`side\` dan \`kind\` sama dengan katalog.
3. PNG berformat RGBA, minimal 1024x1024 (hasil: 1280x1280), sudut dan tepi transparan, objek tidak terpotong (margin >= 3%) dan berada di tengah.
4. Semua koordinat berada pada rentang 0-1 dan tidak ada dua terminal yang saling menumpuk.
5. **Pemeriksaan piksel independen:** di koordinat setiap terminal berbaut, piksel PNG harus menunjukkan cincin lubang gelap mengelilingi kepala baut yang lebih terang. Pemeriksaan ini membaca PNG akhir, bukan data penggambar. Pada uji mutasi, koordinat yang digeser 0,03 (~38 px) terdeteksi, terminal yang hilang terdeteksi.
6. Dilengkapi tinjauan visual manual dengan penanda terminal di atas gambar.

Yang **tidak** dapat diperiksa otomatis: apakah bentuk suatu komponen "meyakinkan" bagi teknisi. Itu dinilai secara visual.

## Catatan penting

- Semua gambar adalah **ilustrasi buatan AI** (kode SVG dirender ke PNG), bukan foto produk pabrikan dan bukan keluaran model pembuat gambar. Generik: tanpa merek, logo, teks, atau angka rating. \`imageType\` = \`ai-generated-illustration\`; \`imageLicense\` = \`null\` (ditentukan pemilik proyek).
- **\`mcb-1p\` tidak diubah.** Format \`info.json\`-nya berbeda dari format baru: \`terminals\` di sana berupa objek (\`count: 2\`), tanpa daftar terminal berkoordinat. Katalog mendefinisikan terminalnya sebagai \`1\` (atas) dan \`2\` (bawah). Agar Workspace dapat membaca semua komponen dengan satu format, koordinat \`mcb-1p\` perlu ditambahkan; saya tidak melakukannya karena Anda melarang mengubah folder itu. Bila Anda setuju, saya bisa membuat \`info.json\` berformat baru terpisah.
- Posisi terminal mengikuti \`side\` di katalog (\`top\`/\`bottom\`/\`left\`/\`right\`) dan urutan definisi kiri ke kanan (atau atas ke bawah). Mis. kutub ke-i di sisi atas berpasangan dengan kutub ke-i di sisi bawah, seperti \`poleDevice()\` di \`factories.ts\`.
- Perangkat dengan terminal baut digambar dengan baut terlihat. Perangkat dengan konektor plug-in/soket digambar dengan konektor yang sesuai dan \`connectionType\` yang sesuai (bukan dipaksa baut).
- \`src/electrical-engine/terminal-system/layout.ts\` tidak ada di ZIP yang diberikan; tidak memengaruhi aset ini karena posisi terminal pada gambar fisik dihitung terpisah dari tata letak simbol.
`;
fs.writeFileSync(path.join(ROOT, 'ASSET-INVENTORY.md'), md);
console.log(`selesai=${done} ada=${existing} gagal=${fail} belum=${pending}`);
