import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Electrical Simulator',
  description: 'Platform pembelajaran dan simulasi instalasi listrik serta kontrol motor industri.',
};

/** Terapkan tema tersimpan sebelum paint agar tidak berkedip. */
const THEME_SCRIPT = `try{var s=JSON.parse(localStorage.getItem('esim.settings.v1')||'{}');document.documentElement.dataset.theme=s.theme==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
