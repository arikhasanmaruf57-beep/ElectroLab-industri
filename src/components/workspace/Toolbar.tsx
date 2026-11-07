'use client';

import { useSettingsStore, type SnapSize } from '@/store/settings-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import { cn } from '@/utils/cn';
import { Icon, type IconName } from '../ui/Icon';

function Btn({ icon, label, onClick, disabled, active, testId, text }: { icon: IconName; label: string; onClick: () => void; disabled?: boolean; active?: boolean; testId?: string; text?: string }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-8 items-center justify-center gap-1.5 rounded-md text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-35',
        text ? 'px-2' : 'w-8',
        active ? 'bg-accent/20 text-accent' : 'hover:bg-raised hover:text-ink disabled:hover:bg-transparent',
      )}
    >
      <Icon name={icon} size={17} />
      {text && <span className="text-xs tnum">{text}</span>}
    </button>
  );
}

const Sep = () => <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />;

export function Toolbar({ showLibrary, showInspector, onToggleLibrary, onToggleInspector }: { showLibrary: boolean; showInspector: boolean; onToggleLibrary: () => void; onToggleInspector: () => void }) {
  const tool = useWorkspaceStore((s) => s.tool);
  const setTool = useWorkspaceStore((s) => s.setTool);
  const canUndo = useWorkspaceStore((s) => s.history.past.length > 0);
  const canRedo = useWorkspaceStore((s) => s.history.future.length > 0);
  const hasSelection = useWorkspaceStore((s) => s.selection.components.length + s.selection.wires.length > 0);
  const hasComponentSel = useWorkspaceStore((s) => s.selection.components.length > 0);
  const hasClipboard = useWorkspaceStore((s) => s.clipboard !== null);
  const zoom = useWorkspaceStore((s) => s.viewport.zoom);
  const count = useWorkspaceStore((s) => s.doc.components.length);
  const snap = useSettingsStore((s) => s.snapSize);
  const setSnap = useSettingsStore((s) => s.setSnapSize);
  const showGrid = useSettingsStore((s) => s.showGrid);
  const setShowGrid = useSettingsStore((s) => s.setShowGrid);
  const componentViewMode = useSettingsStore((s) => s.componentViewMode);
  const setComponentViewMode = useSettingsStore((s) => s.setComponentViewMode);
  const s = useWorkspaceStore.getState;
  const nextSnap: SnapSize = snap === 10 ? 20 : snap === 20 ? 0 : 10;

  return (
    <div role="toolbar" aria-label="Alat workspace" className="flex flex-wrap items-center gap-0.5 border-b border-line bg-surface px-2 py-1.5">
      <Btn icon="panelleft" label={showLibrary ? 'Sembunyikan Library' : 'Tampilkan Library'} active={showLibrary} onClick={onToggleLibrary} testId="toggle-library" />
      <Sep />
      <Btn icon="workspace" label="Tampilkan simbol skematik" text="Skematik" active={componentViewMode === 'schematic'} onClick={() => setComponentViewMode('schematic')} testId="view-schematic" />
      <Btn icon="library" label="Tampilkan gambar fisik" text="Gambar fisik" active={componentViewMode === 'physical'} onClick={() => setComponentViewMode('physical')} testId="view-physical" />
      <Sep />
      <Btn icon="cursor" label="Alat pilih" active={tool === 'select'} onClick={() => setTool('select')} testId="tool-select" />
      <Btn icon="pan" label="Alat geser (atau tahan Spasi)" active={tool === 'pan'} onClick={() => setTool('pan')} testId="tool-pan" />
      <Sep />
      <Btn icon="undo" label="Undo (Ctrl+Z)" disabled={!canUndo} onClick={() => s().undo()} testId="undo" />
      <Btn icon="redo" label="Redo (Ctrl+Y)" disabled={!canRedo} onClick={() => s().redo()} testId="redo" />
      <Sep />
      <Btn icon="rotate" label="Putar 90° (R)" disabled={!hasComponentSel} onClick={() => s().rotateSelection()} testId="rotate" />
      <Btn icon="trash" label="Hapus (Delete)" disabled={!hasSelection} onClick={() => s().deleteSelection()} testId="delete" />
      <Btn icon="copy" label="Salin (Ctrl+C)" disabled={!hasComponentSel} onClick={() => s().copySelection()} testId="copy" />
      <Btn icon="paste" label="Tempel (Ctrl+V)" disabled={!hasClipboard} onClick={() => s().paste()} testId="paste" />
      <Sep />
      <Btn icon="zoomout" label="Perkecil" onClick={() => s().zoomBy(1 / 1.25)} testId="zoom-out" />
      <button type="button" title="Reset zoom 100%" onClick={() => s().resetView()} className="h-8 min-w-12 rounded-md px-1.5 text-xs text-muted tnum hover:bg-raised hover:text-ink" data-testid="zoom-level">
        {Math.round(zoom * 100)}%
      </button>
      <Btn icon="zoomin" label="Perbesar" onClick={() => s().zoomBy(1.25)} testId="zoom-in" />
      <Btn icon="fit" label="Sesuaikan ke seluruh rangkaian" onClick={() => s().fitToContent()} testId="fit" />
      <Sep />
      <Btn icon="grid" label={snap ? `Grid snapping ${snap} (klik untuk ganti)` : 'Grid snapping mati (klik untuk ganti)'} text={snap ? String(snap) : 'off'} active={snap > 0} onClick={() => setSnap(nextSnap)} testId="snap" />
      <Btn icon="grid" label={showGrid ? 'Sembunyikan titik grid' : 'Tampilkan titik grid'} active={showGrid} onClick={() => setShowGrid(!showGrid)} testId="toggle-grid" />
      <Btn icon="arrange" label="Susun otomatis" disabled={count === 0} onClick={() => s().autoArrange()} testId="auto-arrange" />
      <Btn
        icon="save"
        label="Simpan draf (Ctrl+S)"
        testId="save"
        onClick={() => {
          s().saveNow();
          s().notify('success', 'Draf workspace disimpan di browser ini.');
        }}
      />
      <span className="flex-1" />
      <Btn icon="panelright" label={showInspector ? 'Sembunyikan Inspector' : 'Tampilkan Inspector'} active={showInspector} onClick={onToggleInspector} testId="toggle-inspector" />
    </div>
  );
}
