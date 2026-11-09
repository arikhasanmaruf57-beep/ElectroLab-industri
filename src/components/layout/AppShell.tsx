'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useSettingsStore } from '@/store/settings-store';
import { startAutosave, useWorkspaceStore } from '@/store/workspace-store';
import { Toast } from '../notifications/Toast';
import { Topbar } from './Topbar';

export function AppShell({ children }: { children: ReactNode }) {
  const theme = useSettingsStore((s) => s.theme);
  const [compactNav, setCompactNav] = useState(false);

  useEffect(() => {
    useSettingsStore.getState().hydrate();
    useWorkspaceStore.getState().hydrate();
    return startAutosave();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="flex h-screen min-w-0 flex-col overflow-hidden bg-bg">
      <Topbar compact={compactNav} />
      <main
        className="scroll-thin min-h-0 min-w-0 flex-1 overflow-auto"
        onScroll={(event) => setCompactNav(event.currentTarget.scrollTop > 28)}
      >
        {children}
      </main>
      <Toast />
    </div>
  );
}
