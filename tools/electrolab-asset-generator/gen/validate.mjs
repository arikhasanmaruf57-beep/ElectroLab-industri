import fs from 'node:fs';
import path from 'node:path';
import { sharp } from './lib.mjs';
const catalog = JSON.parse(fs.readFileSync('/home/claude/catalog.json', 'utf8'));
const ROOT = process.argv[2];
const dirs = fs.readdirSync(ROOT).filter(d => fs.statSync(path.join(ROOT, d)).isDirectory() && d !== 'mcb-1p');
const results = {};
for (const type of dirs) {
  const errs = [], warn = [];
  const dir = path.join(ROOT, type);
  const def = catalog.find(c => c.type === type);
  if (!def) { results[type] = { ok: false, errs: ['folder bukan type katalog'] }; continue; }
  for (const f of ['physical.png', 'info.json', 'README.md']) if (!fs.existsSync(path.join(dir, f))) errs.push(`file hilang: ${f}`);
  let info; try { info = JSON.parse(fs.readFileSync(path.join(dir, 'info.json'), 'utf8')); } catch (e) { errs.push('JSON tidak valid'); }
  if (info) {
    if (info.id !== type) errs.push('id != nama folder');
    if (info.imageType !== 'ai-generated-illustration') errs.push('imageType salah');
    const a = info.terminals.map(t => t.id).sort().join('|'), b = def.terminals.map(t => t.id).sort().join('|');
    if (a !== b) errs.push('terminal tidak sama dengan katalog');
    if (info.terminals.length !== def.terminals.length) errs.push('jumlah terminal beda');
    for (const t of info.terminals) {
      const d = def.terminals.find(q => q.id === t.id);
      if (d && (d.side !== t.side || d.kind !== t.kind)) errs.push(`sisi/jenis terminal ${t.id} beda dari katalog`);
      if (!(t.position.x > 0 && t.position.x < 1 && t.position.y > 0 && t.position.y < 1)) errs.push(`posisi ${t.id} di luar 0-1`);
    }
    // gambar
    const img = sharp(path.join(dir, 'physical.png'));
    const meta = await img.metadata();
    if (meta.width < 1024 || meta.height < 1024) errs.push(`resolusi ${meta.width}x${meta.height} < 1024`);
    if (!meta.hasAlpha || meta.channels !== 4) errs.push('bukan RGBA');
    const { data, info: ri } = await sharp(path.join(dir, 'physical.png')).raw().toBuffer({ resolveWithObject: true });
    const W = ri.width, Hh = ri.height, ch = ri.channels;
    const A = (x, y) => data[(y * W + x) * ch + 3];
    for (const [x, y] of [[0, 0], [W - 1, 0], [0, Hh - 1], [W - 1, Hh - 1], [W >> 1, 0], [W >> 1, Hh - 1]]) if (A(x, y) !== 0) errs.push('latar tidak transparan di tepi');
    let minx = W, miny = Hh, maxx = 0, maxy = 0;
    for (let y = 0; y < Hh; y += 2) for (let x = 0; x < W; x += 2) if (A(x, y) > 8) { if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y; }
    const m = Math.min(minx, miny, W - maxx, Hh - maxy) / W;
    if (m < 0.03) errs.push(`objek terlalu dekat tepi (margin ${(m * 100).toFixed(1)}%)`);
    const cx = (minx + maxx) / 2 / W, cy = (miny + maxy) / 2 / Hh;
    if (Math.abs(cx - 0.5) > 0.03 || Math.abs(cy - 0.5) > 0.03) warn.push(`objek kurang di tengah (${cx.toFixed(2)}, ${cy.toFixed(2)})`);
    // pemeriksaan piksel pada titik terminal
    const rm = JSON.parse(fs.readFileSync(`/home/claude/meta/${type}.json`, 'utf8'));
    const lum = (x, y) => { const i = (Math.round(y) * W + Math.round(x)) * ch; return (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]); };
    let pass = 0;
    for (const t of info.terminals) {
      const px = t.position.x * W, py = t.position.y * Hh, r = rm[t.id].rpx;
      if (A(Math.round(px), Math.round(py)) !== 255) { errs.push(`titik ${t.id} jatuh di area transparan`); continue; }
      if (rm[t.id].type !== 'screw') { pass++; continue; }
      // cincin celah gelap antara kepala baut (0.8r) dan tepi lubang (r): harus gelap hampir di seluruh sudut
      let dark = 0; const N = 48;
      for (let k = 0; k < N; k++) { const a = k * 2 * Math.PI / N; if (lum(px + 0.9 * r * Math.cos(a), py + 0.9 * r * Math.sin(a)) < 90) dark++; }
      const frac = dark / N;
      // pusat kepala baut harus lebih terang daripada cincin (kepala baut ada di titik ini)
      const centerBright = lum(px - 0.45 * r, py - 0.45 * r) > lum(px + 0.9 * r, py);
      if (frac < 0.85 || !centerBright) errs.push(`titik ${t.id}: tidak tampak baut di piksel (cincin gelap ${(frac * 100).toFixed(0)}%)`); else pass++;
    }
    // tidak ada dua terminal yang tumpang tindih
    for (let i = 0; i < info.terminals.length; i++) for (let j = i + 1; j < info.terminals.length; j++) {
      const a = info.terminals[i], b = info.terminals[j];
      const d = Math.hypot((a.position.x - b.position.x) * W, (a.position.y - b.position.y) * Hh);
      if (d < 1.6 * Math.max(rm[a.id].rpx, rm[b.id].rpx)) errs.push(`terminal ${a.id} dan ${b.id} saling menumpuk`);
    }
    results[type] = { ok: errs.length === 0, errs, warn, terminals: info.terminals.length, checked: pass, size: `${meta.width}x${meta.height}` };
  } else results[type] = { ok: false, errs };
}
fs.writeFileSync('/home/claude/validation.json', JSON.stringify(results, null, 1));
for (const [t, r] of Object.entries(results)) console.log(r.ok ? 'OK  ' : 'GAGAL', t.padEnd(16), `${r.checked}/${r.terminals} terminal terverifikasi di piksel`, r.size, ...(r.errs.length ? ['\n   ' + r.errs.join('\n   ')] : []), ...(r.warn?.length ? ['\n   (peringatan) ' + r.warn.join('; ')] : []));
console.log(`\n${Object.values(results).filter(r => r.ok).length}/${Object.keys(results).length} folder lolos`);
