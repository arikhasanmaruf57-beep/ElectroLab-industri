'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useSettingsStore } from '@/store/settings-store';
import { startAutosave, useWorkspaceStore } from '@/store/workspace-store';
import { Toast } from '../notifications/Toast';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    useSettingsStore.getState().hydrate();
    useWorkspaceStore.getState().hydrate();
    return startAutosave();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  if (isHome) {
    return (
      <>
        {children}
        <Toast />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="scroll-thin min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
      <Toast />
    </div>
  );
}
