import type { CategoryId, ComponentDefinition, ComponentSource } from '@/types/component';
import { buildLayout } from '@/electrical-engine/terminal-system/layout';
import { CATEGORY_BY_ID } from '../categories';
import { ACCESSORIES } from './accessories';
import { AUTOMATION } from './automation';
import { CONTROL } from './control';
import { LIGHTING } from './lighting';
import { MEASUREMENT } from './measurement';
import { MOTOR } from './motor';
import { POWER_SOURCES } from './power';
import { PROTECTION } from './protection';
import { SWITCHING } from './switching';
import { WIRING } from './wiring';

const SOURCES: ComponentSource[] = [
  ...POWER_SOURCES,
  ...PROTECTION,
  ...WIRING,
  ...SWITCHING,
  ...CONTROL,
  ...MOTOR,
  ...LIGHTING,
  ...ACCESSORIES,
  ...MEASUREMENT,
  ...AUTOMATION,
];

function define(src: ComponentSource): ComponentDefinition {
  const layoutOpts: { minWidth?: number; minHeight?: number } = {};
  if (src.minWidth !== undefined) layoutOpts.minWidth = src.minWidth;
  if (src.minHeight !== undefined) layoutOpts.minHeight = src.minHeight;
  return { ...src, layout: buildLayout(src.terminals, layoutOpts) };
}

/** Seluruh komponen katalog (urutan = urutan kategori lalu urutan definisi). */
export const COMPONENTS: readonly ComponentDefinition[] = SOURCES.map(define);

const BY_TYPE = new Map<string, ComponentDefinition>(COMPONENTS.map((c) => [c.type, c]));

export function getComponentDefinition(type: string): ComponentDefinition | undefined {
  return BY_TYPE.get(type);
}

export function requireComponentDefinition(type: string): ComponentDefinition {
  const def = BY_TYPE.get(type);
  if (!def) throw new Error(`Komponen tidak dikenal: ${type}`);
  return def;
}

export function componentsByCategory(category: CategoryId): ComponentDefinition[] {
  return COMPONENTS.filter((c) => c.category === category);
}

/** Pencarian sederhana: setiap kata kueri harus muncul di nama/deskripsi/tag/kategori. */
export function searchComponents(query: string, category?: CategoryId | 'all'): ComponentDefinition[] {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  return COMPONENTS.filter((c) => {
    if (category && category !== 'all' && c.category !== category) return false;
    if (words.length === 0) return true;
    const hay = [c.name, c.type, c.description, c.function, CATEGORY_BY_ID[c.category].label, ...(c.tags ?? [])]
      .join(' ')
      .toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}
