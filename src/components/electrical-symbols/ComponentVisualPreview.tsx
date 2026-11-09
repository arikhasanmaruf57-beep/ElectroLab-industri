'use client';

import type { ComponentDefinition } from '@/types/component';
import type { ComponentViewMode } from '@/store/settings-store';
import { cn } from '@/utils/cn';
import { getPhysicalAsset } from './physical-assets';
import { SymbolPreview } from './SymbolPreview';

export function ComponentVisualPreview({ def, mode, className }: { def: ComponentDefinition; mode: ComponentViewMode; className?: string }) {
  const image = mode === 'physical' ? getPhysicalAsset(def) : undefined;
  if (mode === 'schematic') return <SymbolPreview def={def} className={className} />;
  if (image) {
    return <div className={cn('flex items-center justify-center overflow-hidden', className)}><img src={image} alt={`Gambar fisik ${def.name}`} className="h-full w-full object-contain" /></div>;
  }
  return (
    <div className={cn('flex min-h-0 flex-col items-center justify-center gap-0.5 overflow-hidden', className)}>
      <SymbolPreview def={def} className="min-h-0 w-full flex-1 text-ink" />
      <span className="shrink-0 text-[9px] leading-tight text-muted">Gambar fisik belum tersedia</span>
    </div>
  );
}
