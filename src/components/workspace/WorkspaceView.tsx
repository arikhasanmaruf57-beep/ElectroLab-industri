'use client';

import { useEffect, useState } from 'react';
import { useWorkspaceShortcuts } from '@/hooks/useWorkspaceShortcuts';
import { cn } from '@/utils/cn';
import { LibraryPanel } from '../component-library/LibraryPanel';
import { Inspector } from './Inspector';
import { StatusBar } from './StatusBar';
import { Toolbar } from './Toolbar';
import { WorkspaceCanvas } from './WorkspaceCanvas';

export function WorkspaceView() {
  useWorkspaceShortcuts();
  const [showLibrary, setShowLibrary] = useState(true);
  const [showInspector, setShowInspector] = useState(true);

  // Layar sempit (tablet portrait): mulai dengan panel tertutup agar kanvas lega.
  useEffect(() => {
    if (window.innerWidth < 1100) {
      setShowLibrary(false);
      setShowInspector(false);
    }
  }, []);

  return (
    <div className="flex h-full flex-col" data-testid="workspace">
      <Toolbar
        showLibrary={showLibrary}
        showInspector={showInspector}
        onToggleLibrary={() => setShowLibrary((v) => !v)}
        onToggleInspector={() => setShowInspector((v) => !v)}
      />
      <div className="flex min-h-0 flex-1">
        <aside aria-label="Component Library" className={cn('w-72 shrink-0 border-r border-line bg-surface', !showLibrary && 'hidden')} data-testid="library-panel">
          <LibraryPanel />
        </aside>
        <div className="min-w-0 flex-1">
          <WorkspaceCanvas />
        </div>
        <aside aria-label="Component Inspector" className={cn('scroll-thin w-72 shrink-0 overflow-y-auto border-l border-line bg-surface', !showInspector && 'hidden')} data-testid="inspector-panel">
          <Inspector />
        </aside>
      </div>
      <StatusBar />
    </div>
  );
}
