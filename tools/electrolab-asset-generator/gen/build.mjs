import fs from 'node:fs';
import path from 'node:path';
import { Ctx, buildSVG, renderPNG, CANVAS } from './lib.mjs';

const catalog = JSON.parse(fs.readFileSync('/home/claude/catalog.json', 'utf8'));
const OUT = process.argv[2] || '/home/claude/out/public/component-assets';
const batches = process.argv.slice(3);
fs.mkdirSync(OUT, { recursive: true });
const DEBUG = '/home/claude/debug'; fs.mkdirSync(DEBUG, { recursive: true });

const SRC = 'Ilustrasi vektor hasil karya AI: kode SVG (gradien, bayangan) ditulis oleh Claude (Anthropic) lalu dirender ke PNG. Bentuk generik tanpa merek, logo, atau rating; bukan foto produk dan bukan keluaran model pembuat gambar. Gaya mengikuti aset mcb-1p.';
const report = [];

for (const b of batches) {
  const { drawers } = await import(`./batches/${b}.mjs`);
  for (const [type, fn] of Object.entries(drawers)) {
    const def = catalog.find(x => x.type === type);
    if (!def) throw new Error(`type tidak ada di katalog: ${type}`);
    if (type === 'mcb-1p') throw new Error('mcb-1p tidak boleh dibuat ulang');
    const c = new Ctx();
    const desc = fn(c, def);
    // PEMERIKSAAN KERAS: himpunan terminal yang digambar harus identik dengan katalog
    const drawn = c.terms.map(t => t.id).sort().join('|'), want = def.terminals.map(t => t.id).sort().join('|');
    if (drawn !== want) throw new Error(`${type}: terminal tidak cocok katalog.\n digambar: ${drawn}\n katalog : ${want}`);
    const { svg, pos, scale } = buildSVG(c);
    fs.mkdirSync('/home/claude/meta', { recursive: true });
    fs.writeFileSync(`/home/claude/meta/${type}.json`, JSON.stringify(Object.fromEntries(c.terms.map(t => [t.id, { rpx: t.r * scale, type: t.type }]))));
    const dir = path.join(OUT, type); fs.mkdirSync(dir, { recursive: true });
    await renderPNG(svg, path.join(dir, 'physical.png'));
    await renderPNG(buildSVG(c, true).svg, path.join(DEBUG, `${type}.png`));
    const terminals = def.terminals.map(t => {
      const o = { id: t.id, label: t.name, kind: t.kind, side: t.side };
      if (t.phase) o.phase = t.phase;
      o.position = pos(t.id);
      o.connectionType = c.terms.find(q => q.id === t.id).type;
      return o;
    });
    const info = { id: type, name: def.name, category: def.category, designator: def.designator, description: def.description, image: 'physical.png', imageSize: { width: CANVAS, height: CANVAS }, imageType: 'ai-generated-illustration', imageSource: SRC, imageLicense: null, terminalCount: terminals.length, terminals };
    fs.writeFileSync(path.join(dir, 'info.json'), JSON.stringify(info, null, 2) + '\n');
    const rows = terminals.map(t => `| ${t.id} | ${t.label} | ${t.side} | ${t.connectionType} | ${t.position.x}, ${t.position.y} |`).join('\n');
    fs.writeFileSync(path.join(dir, 'README.md'), `# ${def.name} (\`${type}\`)

${desc}

## Status gambar
\`physical.png\` adalah **ilustrasi buatan AI**, bukan foto produk pabrikan. Dibuat dari kode SVG lalu dirender ke PNG ${CANVAS}x${CANVAS} px (RGBA, latar transparan). Bentuk generik: tanpa merek, logo, teks, atau angka rating.

## Terminal (${terminals.length})
Koordinat relatif 0-1 terhadap gambar (x ke kanan, y ke bawah), menunjuk pusat lubang/baut terminal yang terlihat. Daftar dan ID terminal disalin dari katalog (\`src/data/components\`).

| ID | Nama | Sisi | Sambungan | Posisi (x, y) |
|---|---|---|---|---|
${rows}

Koordinat dihitung dari geometri yang sama dengan yang menggambar baut, lalu diperiksa ulang terhadap piksel PNG (lihat ASSET-INVENTORY.md).
`);
    report.push({ type, name: def.name, category: def.category, terminals: terminals.length });
  }
}
fs.writeFileSync('/home/claude/last-batch.json', JSON.stringify(report, null, 1));
console.log('dibuat:', report.length, report.map(r => r.type).join(', '));
