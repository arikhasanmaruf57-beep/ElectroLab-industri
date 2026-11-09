import { G, screw, termBlock, rrect, bySide } from '../lib.mjs';

const P = 152, H = 578; // lebar satu kutub modular & tinggi (skala sama dengan MCB 1P)

/** Bodi modular DIN multi-kutub (MCB/RCCB/RCBO/Main Switch) bergaya MCB 1P. */
function modular(c, def, o) {
  const g = G(c), n = o.poles, W = n * P;
  const tops = bySide(def, 'top'), bots = bySide(def, 'bottom');
  c.size(0, 0, W, H);
  for (let i = 0; i < n; i++) { termBlock(c, i * P + 12, 0, 128, 86); termBlock(c, i * P + 12, 464, 128, 114); }
  c.sil(rrect(0, 74, W, 394, 8, '#E8E8E5'));
  // blok atas, badan, blok bawah
  for (let i = 0; i < n; i++) {
    // (blok atas sudah digambar oleh termBlock; screw ditambahkan setelah badan)
  }
  c.add(rrect(0, 74, W, 394, 8, g.body) + rrect(0, 74, W, 394, 8, g.sheen) + rrect(0.75, 74.75, W - 1.5, 392.5, 8, 'none', '#C9C9C5'));
  c.add(`<line x1="4" y1="76.5" x2="${W - 4}" y2="76.5" stroke="#FFFFFF" stroke-width="1.6" opacity="0.9"/>`);
  for (let i = 1; i < n; i++) c.add(`<line x1="${i * P}" y1="80" x2="${i * P}" y2="462" stroke="#C3C3BF" stroke-width="1.6"/><line x1="${i * P + 1.6}" y1="80" x2="${i * P + 1.6}" y2="462" stroke="#FFFFFF" stroke-width="1" opacity="0.8"/>`);
  for (let i = 0; i < n; i++) c.add(`<line x1="${i * P + 12}" y1="84" x2="${i * P + 140}" y2="84" stroke="#CDCDC9" stroke-width="1.2"/>`);
  c.add(`<line x1="4" y1="466" x2="${W - 4}" y2="466" stroke="#C9C9C5" stroke-width="1.4"/>`);
  // tuas
  const lv = { orange: g.orange, black: g.black, red: g.red }[o.lever];
  c.add(`<rect x="4" y="298" width="${W - 8}" height="12" fill="#000" opacity="0.28" filter="url(#blur3)"/>`);
  c.add(rrect(0, 244, W, 66, 14, lv) + (o.lever === 'orange' ? rrect(0, 244, W, 66, 14, g.orangeEdge) : '') + rrect(8, 248, W - 16, 12, 6, '#FFFFFF', null, 0, 'opacity="0.14"') + rrect(0.6, 244.6, W - 1.2, 64.8, 14, 'none', o.lever === 'orange' ? '#C86A0C' : '#101214', 1.2, 'opacity="0.8"'));
  // jendela indikator / simbol
  const wx = W / 2 - 47;
  c.add(rrect(wx, 312, 94, 98, 3, '#BEBEBA', '#A8A8A4') + rrect(wx + 5, 316, 84, 88, 2, g.win, '#D2D2CE', 1));
  if (o.indicator === 'bar') c.add(`<rect x="${W / 2 - 4}" y="338" width="8" height="36" rx="2" fill="#8E8E8A"/>`);
  else c.add(`<circle cx="${W / 2}" cy="360" r="12" fill="none" stroke="#8E8E8A" stroke-width="2.6"/><line x1="${W / 2}" y1="351" x2="${W / 2}" y2="369" stroke="#8E8E8A" stroke-width="2.6" stroke-linecap="round"/>`);
  c.add(rrect(5, 424, 64, 22, 3, 'none', '#A9A9A5', 1.4));
  // tombol uji RCD
  if (o.test) c.add(`<circle cx="${W / 2}" cy="166" r="30" fill="#CFCFCB" stroke="#B0B0AC" stroke-width="1.5"/><circle cx="${W / 2}" cy="166" r="22" fill="${g.blue}" stroke="#163A78" stroke-width="1.2"/><ellipse cx="${W / 2 - 6}" cy="158" rx="9" ry="5" fill="#fff" opacity="0.35"/>`);
  // baut terminal
  tops.forEach((id, i) => screw(c, id, i * P + 76, 38));
  bots.forEach((id, i) => screw(c, id, i * P + 76, 536));
  return o.desc;
}

function mcb(n) { return (c, def) => modular(c, def, { poles: n, lever: 'orange', desc: `Miniature circuit breaker ${n} kutub bergaya modular DIN: tuas oranye tunggal yang menyatukan ${n} kutub, jendela indikator, baut terminal di atas (suplai) dan bawah (beban) pada tiap kutub.` }); }

function mccb3(c, def) {
  const g = G(c), W = 360, Ht = 480, xs = [60, 180, 300];
  c.size(0, 0, W, Ht);
  const lug = (x, y) => { c.sil(rrect(x - 48, y, 96, 92, 8, '#2B2E33')); c.add(rrect(x - 48, y, 96, 92, 8, g.darkBody, '#1A1C1F') + `<path d="M ${x - 36} ${y + 14} H ${x + 36} L ${x + 30} ${y + 78} H ${x - 30} Z" fill="#1F2226" opacity="0.55"/>`); };
  xs.forEach(x => { lug(x, 0); lug(x, 388); });
  c.sil(rrect(0, 78, W, 324, 14, '#2B2E33'));
  c.add(rrect(0, 78, W, 324, 14, g.darkBody, '#17191C', 1.5) + rrect(0, 78, W, 324, 14, g.sheen, null, 0, 'opacity="0.35"'));
  c.add(rrect(22, 98, 316, 284, 10, g.darkFace, '#17191C', 1.5));
  // tuas toggle (posisi ON)
  c.add(rrect(100, 180, 160, 52, 8, '#14161A', '#0B0C0E'));
  c.add(rrect(120, 188, 120, 28, 6, '#1F2226', null, 0));
  c.add(`<rect x="132" y="170" width="96" height="14" rx="4" fill="#000" opacity="0.35" filter="url(#blur3)"/>`);
  c.add(rrect(140, 112, 80, 96, 12, g.black, '#0B0C0E', 1.5) + rrect(146, 118, 68, 12, 6, '#FFFFFF', null, 0, 'opacity="0.16"'));
  for (let i = 0; i < 5; i++) c.add(`<line x1="152" y1="${148 + i * 12}" x2="208" y2="${148 + i * 12}" stroke="#0B0C0E" stroke-width="3" stroke-linecap="round"/><line x1="152" y1="${150 + i * 12}" x2="208" y2="${150 + i * 12}" stroke="#6A717A" stroke-width="1" opacity="0.8"/>`);
  // tombol push-to-trip
  c.add(`<circle cx="298" cy="154" r="24" fill="#1A1C1F" stroke="#0B0C0E"/><circle cx="298" cy="154" r="17" fill="${g.blue}" stroke="#163A78"/><ellipse cx="293" cy="148" rx="7" ry="4" fill="#fff" opacity="0.35"/>`);
  // unit trip: pelat kosong + dua dial
  c.add(rrect(44, 250, 272, 112, 6, '#CDD0D5', '#9AA0A8', 1.2));
  for (const x of [112, 248]) {
    c.add(`<circle cx="${x}" cy="306" r="38" fill="#2A2D32" stroke="#12141 6" stroke-width="1"/>`.replace('#12141 6', '#121416'));
    for (let k = 0; k < 9; k++) { const a = (-135 + k * 33.75) * Math.PI / 180; c.add(`<line x1="${x + 30 * Math.sin(a)}" y1="${306 - 30 * Math.cos(a)}" x2="${x + 36 * Math.sin(a)}" y2="${306 - 36 * Math.cos(a)}" stroke="#C9CDD2" stroke-width="2"/>`); }
    c.add(`<circle cx="${x}" cy="306" r="20" fill="${g.steel}" stroke="#5B6168"/><line x1="${x}" y1="306" x2="${x + 12}" y2="${306 - 12}" stroke="#1E2023" stroke-width="4" stroke-linecap="round"/>`);
  }
  bySide(def, 'top').forEach((id, i) => screw(c, id, xs[i], 44, 1.15, 'hex'));
  bySide(def, 'bottom').forEach((id, i) => screw(c, id, xs[i], 436, 1.15, 'hex'));
  return 'Molded case circuit breaker 3 kutub: casing hitam besar, tuas toggle di tengah, tombol push-to-trip, dua dial setelan trip, dan tiga terminal lug dengan baut hex di atas serta di bawah.';
}

function mpcb3(c, def) {
  const g = G(c), W = 300, Ht = 470, xs = [60, 150, 240];
  c.size(0, 0, W, Ht);
  xs.forEach(x => { c.sil(rrect(x - 38, 0, 76, 84, 6, '#6A7078')); c.sil(rrect(x - 38, 386, 76, 84, 6, '#6A7078')); });
  const blk = (x, y) => c.add(rrect(x - 38, y, 76, 84, 6, g.steel, '#6A7078', 1.2) + rrect(x - 38, y, 76, 84, 6, g.sheen));
  xs.forEach(x => { blk(x, 0); blk(x, 386); });
  c.sil(rrect(0, 70, W, 330, 12, '#2B2E33'));
  c.add(rrect(0, 70, W, 330, 12, g.darkBody, '#17191C', 1.5) + rrect(0, 70, W, 330, 12, g.sheen, null, 0, 'opacity="0.3"'));
  // dial setelan arus
  c.add(`<circle cx="150" cy="150" r="52" fill="#16181B" stroke="#0B0C0E"/>`);
  for (let k = 0; k < 11; k++) { const a = (-135 + k * 27) * Math.PI / 180; c.add(`<line x1="${150 + 40 * Math.sin(a)}" y1="${150 - 40 * Math.cos(a)}" x2="${150 + 48 * Math.sin(a)}" y2="${150 - 48 * Math.cos(a)}" stroke="#D6D9DE" stroke-width="2.4"/>`); }
  c.add(`<circle cx="150" cy="150" r="30" fill="${g.steel}" stroke="#5B6168"/><line x1="150" y1="150" x2="168" y2="132" stroke="#1E2023" stroke-width="5" stroke-linecap="round"/>`);
  // gagang putar ON/OFF
  c.add(`<circle cx="150" cy="292" r="70" fill="#101214" stroke="#050607" stroke-width="1.5"/>`);
  for (let k = 0; k < 24; k++) { const a = k * 15 * Math.PI / 180; c.add(`<line x1="${150 + 62 * Math.sin(a)}" y1="${292 - 62 * Math.cos(a)}" x2="${150 + 70 * Math.sin(a)}" y2="${292 - 70 * Math.cos(a)}" stroke="#2B2F34" stroke-width="3"/>`); }
  c.add(`<circle cx="150" cy="292" r="56" fill="${g.black}" stroke="#050607"/><circle cx="150" cy="292" r="44" fill="#2C3035" opacity="0.7"/><rect x="144" y="238" width="12" height="44" rx="4" fill="${g.red}"/><ellipse cx="136" cy="268" rx="14" ry="30" fill="#fff" opacity="0.07"/>`);
  bySide(def, 'top').forEach((id, i) => screw(c, id, xs[i], 42));
  bySide(def, 'bottom').forEach((id, i) => screw(c, id, xs[i], 428));
  return 'Motor protection circuit breaker (MPCB) 3 kutub: casing hitam ringkas, dial setelan arus di atas, gagang putar ON/OFF besar dengan penanda merah, tiga baut terminal di atas dan tiga di bawah.';
}

function mainSwitch3(c, def) { return modular(c, def, { poles: 3, lever: 'red', indicator: 'bar', desc: 'Main switch (isolator) 3 kutub modular DIN: tuas merah lebar penghubung tiga kutub, jendela indikator posisi, baut terminal di atas dan bawah tiap kutub.' }); }

function fuse1(c, def) {
  const g = G(c), W = 152;
  c.size(0, 0, W, H);
  termBlock(c, 12, 0, 128, 86); termBlock(c, 12, 464, 128, 114);
  c.sil(rrect(0, 74, W, 394, 8, '#E8E8E5'));
  c.add(rrect(0, 74, W, 394, 8, g.body) + rrect(0, 74, W, 394, 8, g.sheen) + rrect(0.75, 74.75, W - 1.5, 392.5, 8, 'none', '#C9C9C5'));
  c.add(`<line x1="4" y1="76.5" x2="${W - 4}" y2="76.5" stroke="#FFFFFF" stroke-width="1.6" opacity="0.9"/><line x1="12" y1="84" x2="140" y2="84" stroke="#CDCDC9" stroke-width="1.2"/><line x1="4" y1="466" x2="${W - 4}" y2="466" stroke="#C9C9C5" stroke-width="1.4"/>`);
  // pembawa sekring (carrier) dengan engsel
  c.add(rrect(16, 112, 120, 340, 14, '#C7CACF', '#9AA0A8', 1.4));
  c.add(rrect(22, 118, 108, 328, 11, g.win, '#D8DADE', 1));
  for (let i = 0; i < 6; i++) c.add(`<line x1="40" y1="${140 + i * 12}" x2="112" y2="${140 + i * 12}" stroke="#8E949C" stroke-width="3" stroke-linecap="round"/><line x1="40" y1="${142 + i * 12}" x2="112" y2="${142 + i * 12}" stroke="#FFFFFF" stroke-width="1" opacity="0.8"/>`);
  // sekring silinder terlihat lewat jendela
  c.add(rrect(36, 232, 80, 170, 8, '#2E3236', '#16181B', 1.2) + rrect(42, 238, 68, 158, 6, '#F1E9D6', '#CFC4A8', 1));
  c.add(rrect(36, 232, 80, 28, 8, g.brass, '#7A5C1C', 1) + rrect(36, 374, 80, 28, 8, g.brass, '#7A5C1C', 1));
  c.add(`<rect x="62" y="262" width="28" height="108" rx="6" fill="#E4DABF" opacity="0.8"/><line x1="76" y1="268" x2="76" y2="364" stroke="#B8AC8C" stroke-width="2"/>`);
  c.add(`<circle cx="76" cy="418" r="10" fill="#D8362B" stroke="#8E2018"/><ellipse cx="73" cy="415" rx="3.5" ry="2.2" fill="#fff" opacity="0.5"/>`);
  screw(c, bySide(def, 'top')[0], 76, 38); screw(c, bySide(def, 'bottom')[0], 76, 536);
  return 'Fuse holder modular DIN 1 kutub: pembawa sekring abu-abu dengan alur genggam, sekring silinder berkeramik dengan tutup kuningan terlihat, lampu indikator merah kecil, baut terminal di atas dan bawah.';
}

function tor3(c, def) {
  const g = G(c), W = 372, Ht = 470, mx = [62, 138, 214], ax = [290, 340];
  c.size(0, 0, W, Ht);
  mx.forEach(x => { termBlock(c, x - 34, 0, 68, 84); termBlock(c, x - 34, 386, 68, 84); });
  ax.forEach(x => { termBlock(c, x - 24, 0, 48, 84); termBlock(c, x - 24, 386, 48, 84); });
  c.sil(rrect(0, 70, W, 330, 10, '#E8E8E5'));
  c.add(rrect(0, 70, W, 330, 10, g.body) + rrect(0, 70, W, 330, 10, g.sheen) + rrect(0.75, 70.75, W - 1.5, 328.5, 10, 'none', '#C0C0BC', 1.4));
  c.add(`<line x1="6" y1="73" x2="${W - 6}" y2="73" stroke="#FFFFFF" stroke-width="1.6" opacity="0.9"/>`);
  // dial setelan arus
  c.add(`<circle cx="118" cy="190" r="70" fill="#C5C8CD" stroke="#9AA0A8" stroke-width="1.5"/><circle cx="118" cy="190" r="60" fill="#1C1E22"/>`);
  for (let k = 0; k < 13; k++) { const a = (-130 + k * 21.7) * Math.PI / 180; c.add(`<line x1="${118 + 46 * Math.sin(a)}" y1="${190 - 46 * Math.cos(a)}" x2="${118 + 56 * Math.sin(a)}" y2="${190 - 56 * Math.cos(a)}" stroke="#D6D9DE" stroke-width="2.4"/>`); }
  c.add(`<circle cx="118" cy="190" r="36" fill="${g.steel}" stroke="#5B6168"/><rect x="108" y="150" width="20" height="28" rx="3" fill="#D8362B"/><line x1="118" y1="190" x2="118" y2="154" stroke="#fff" stroke-width="2" opacity="0.0"/>`);
  // tombol STOP, RESET, indikator trip
  c.add(rrect(230, 112, 100, 34, 6, g.red, '#7E1A12', 1.2) + rrect(236, 116, 88, 8, 4, '#fff', null, 0, 'opacity="0.2"'));
  c.add(rrect(230, 162, 100, 44, 6, g.blue, '#163A78', 1.2) + rrect(236, 167, 88, 10, 5, '#fff', null, 0, 'opacity="0.22"'));
  c.add(rrect(230, 222, 100, 28, 5, '#9AA0A8', '#6A7078', 1) + rrect(236, 228, 38, 16, 3, '#F2C21C', '#C79A0A', 1) + rrect(280, 228, 38, 16, 3, '#2EA05A', '#1B7040', 1));
  c.add(rrect(36, 300, 300, 70, 5, '#FBFBFC', '#C6CBD2', 1.2));
  const t = bySide(def, 'top'), b = bySide(def, 'bottom');
  [...mx, ...ax].forEach((x, i) => { const s = i < 3 ? 0.95 : 0.68; screw(c, t[i], x, 42, s); screw(c, b[i], x, 428, s); });
  return 'Thermal overload relay (TOR) 3 kutub: bodi abu-abu terang, dial setelan arus bergradasi, tombol STOP merah dan RESET biru, jendela indikator trip, baut daya besar (1/3/5 atas; 2/4/6 bawah) dan baut kontak bantu lebih kecil (95/97 atas; 96/98 bawah).';
}

function spd1(c, def) {
  const g = G(c), W = 2 * P;
  c.size(0, 0, W, H);
  for (let i = 0; i < 2; i++) { termBlock(c, i * P + 12, 0, 128, 86); termBlock(c, i * P + 12, 464, 128, 114); }
  c.sil(rrect(0, 74, W, 394, 8, '#E8E8E5'));
  c.add(rrect(0, 74, W, 394, 8, g.body) + rrect(0, 74, W, 394, 8, g.sheen) + rrect(0.75, 74.75, W - 1.5, 392.5, 8, 'none', '#C9C9C5'));
  c.add(`<line x1="4" y1="76.5" x2="${W - 4}" y2="76.5" stroke="#FFFFFF" stroke-width="1.6" opacity="0.9"/><line x1="12" y1="84" x2="292" y2="84" stroke="#CDCDC9" stroke-width="1.2"/><line x1="4" y1="466" x2="${W - 4}" y2="466" stroke="#C9C9C5" stroke-width="1.4"/>`);
  // kartrid plug-in
  c.add(rrect(22, 120, 260, 300, 12, '#2F343A', '#15171A', 1.5) + rrect(22, 120, 260, 300, 12, g.sheen, null, 0, 'opacity="0.4"'));
  c.add(rrect(34, 132, 236, 40, 6, '#1B1E22') );
  for (let i = 0; i < 5; i++) c.add(`<line x1="${60 + i * 46}" y1="140" x2="${60 + i * 46}" y2="164" stroke="#4A4F57" stroke-width="3" stroke-linecap="round"/>`);
  c.add(rrect(102, 214, 100, 52, 6, '#0F1113', '#050607') + rrect(108, 220, 88, 40, 4, '#2EA05A', '#1B7040', 1) + rrect(112, 223, 80, 10, 3, '#fff', null, 0, 'opacity="0.28"'));
  c.add(rrect(46, 316, 212, 74, 5, '#E9ECEF', '#B7BDC6', 1.2));
  const t = bySide(def, 'top'), b = bySide(def, 'bottom');
  t.forEach((id, i) => screw(c, id, i * P + 76, 38)); b.forEach((id, i) => screw(c, id, i * P + 76, 536));
  return 'Surge protective device (SPD) modular: dasar DIN abu-abu terang dengan kartrid plug-in gelap, jendela indikator hijau, pelat label kosong; baut L dan N di atas, dua baut PE di bawah.';
}

export const drawers = {
  'mcb-2p': mcb(2), 'mcb-3p': mcb(3), 'mcb-4p': mcb(4),
  'mccb-3p': mccb3,
  'rccb-2p': (c, d) => modular(c, d, { poles: 2, lever: 'black', test: true, desc: 'Residual current circuit breaker (RCCB) 2 kutub modular: tuas hitam penghubung dua kutub, tombol uji biru, jendela indikator, baut terminal L dan N di atas dan bawah.' }),
  'rccb-4p': (c, d) => modular(c, d, { poles: 4, lever: 'black', test: true, desc: 'Residual current circuit breaker (RCCB) 4 kutub modular: tuas hitam penghubung empat kutub, tombol uji biru, jendela indikator, baut terminal di atas dan bawah tiap kutub.' }),
  'rcbo-2p': (c, d) => modular(c, d, { poles: 2, lever: 'orange', test: true, desc: 'RCBO 2 kutub modular: gabungan MCB dan RCD; tuas oranye, tombol uji biru, baut terminal di atas (suplai) dan bawah (beban) pada dua kutub.' }),
  'mpcb-3p': mpcb3,
  'main-switch-3p': mainSwitch3,
  'fuse-1p': fuse1,
  'tor-3p': tor3,
  'spd-1p': spd1,
};
