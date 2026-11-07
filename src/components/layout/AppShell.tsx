'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useSettingsStore } from '@/store/settings-store';
import { startAutosave, useWorkspaceStore } from '@/store/workspace-store';
import { Toast } from '../notifications/Toast';
import { Topbar } from './Topbar';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const theme = useSettingsStore((s) => s.theme);

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
      <Topbar />
      <main className="scroll-thin min-h-0 min-w-0 flex-1 overflow-auto">{children}</main>
      <Toast />
    </div>
  );
}
