import { sharp } from './lib.mjs';
import fs from 'node:fs';
const [,, dir, outFile, cols = '4', size = '420', ...types] = process.argv;
const list = types.length ? types : fs.readdirSync(dir).filter(f => f.endsWith('.png')).map(f => f.replace('.png', ''));
const S = +size, C = +cols, R = Math.ceil(list.length / C);
const comps = await Promise.all(list.map(async (t, i) => ({ input: await sharp(`${dir}/${t}.png`).flatten({ background: '#f3f4f6' }).resize(S, S).png().toBuffer(), left: (i % C) * S, top: Math.floor(i / C) * S })));
await sharp({ create: { width: C * S, height: R * S, channels: 3, background: '#f3f4f6' } }).composite(comps).png().toFile(outFile);
console.log(list.join(' '));
