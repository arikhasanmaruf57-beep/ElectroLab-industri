import type { ComponentDefinition } from '@/types/component';

/** Aset foto/ilustrasi fisik yang sudah tersedia untuk komponen katalog. */
const PHYSICAL_ASSETS: Record<string, string> = {
  'mcb-1p': '/component-assets/mcb-1p/physical.png',
};

export function getPhysicalAsset(def: ComponentDefinition): string | undefined {
  return PHYSICAL_ASSETS[def.type];
}
