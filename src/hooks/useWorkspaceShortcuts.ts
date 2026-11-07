import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settings-store';
import { useWorkspaceStore } from '@/store/workspace-store';

function isTyping(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
}

/** Pintasan keyboard workspace. Dipasang hanya selama halaman workspace aktif. */
export function useWorkspaceShortcuts(): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      const s = useWorkspaceStore.getState();
      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();

      if (e.key === 'Escape') {
        s.cancelWire();
        s.clearSelection();
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        s.deleteSelection();
        return;
      }
      if (mod) {
        if (k === 'z') { e.preventDefault(); return e.shiftKey ? s.redo() : s.undo(); }
        if (k === 'y') { e.preventDefault(); return s.redo(); }
        if (k === 'c') { e.preventDefault(); return s.copySelection(); }
        if (k === 'x') { e.preventDefault(); return s.cutSelection(); }
        if (k === 'v') { e.preventDefault(); return s.paste(); }
        if (k === 'a') { e.preventDefault(); return s.selectAll(); }
        if (k === 's') {
          e.preventDefault();
          s.saveNow();
          return s.notify('success', 'Draf workspace disimpan di browser ini.');
        }
        return;
      }
      if (k === 'r') return s.rotateSelection();
      const step = useSettingsStore.getState().snapSize || 10;
      if (e.key === 'ArrowLeft') { e.preventDefault(); return s.nudge(-step, 0); }
      if (e.key === 'ArrowRight') { e.preventDefault(); return s.nudge(step, 0); }
      if (e.key === 'ArrowUp') { e.preventDefault(); return s.nudge(0, -step); }
      if (e.key === 'ArrowDown') { e.preventDefault(); return s.nudge(0, step); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
