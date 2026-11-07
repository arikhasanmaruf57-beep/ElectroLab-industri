import type { IconName } from '@/components/ui/Icon';

export interface NavItem {
  href: string;
  label: string;
  title: string;
  icon: IconName;
  /** Phase ketika halaman ini berfungsi penuh; undefined = sudah berfungsi di Phase 1. */
  phase?: number;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', title: 'Dashboard', icon: 'dashboard' },
  { href: '/workspace', label: 'Electrical Workspace', title: 'Electrical Workspace', icon: 'workspace' },
  { href: '/house-installation', label: 'House Installation', title: 'Instalasi Listrik Rumah', icon: 'house', phase: 5 },
  { href: '/building-installation', label: 'Building Installation', title: 'Instalasi Listrik Gedung', icon: 'building', phase: 5 },
  { href: '/industrial', label: 'Industrial Motor Control', title: 'Industrial Motor Control', icon: 'motor', phase: 6 },
  { href: '/motor-control', label: 'Motor Simulation', title: 'Motor Simulation', icon: 'motorsim', phase: 6 },
  { href: '/plc', label: 'PLC & Automation', title: 'PLC & Automation', icon: 'plc', phase: 8 },
  { href: '/troubleshooting', label: 'Troubleshooting', title: 'Troubleshooting', icon: 'wrench', phase: 9 },
  { href: '/learning', label: 'Learning Center', title: 'Learning Center', icon: 'book', phase: 9 },
  { href: '/component-library', label: 'Component Library', title: 'Component Library', icon: 'library' },
  { href: '/projects', label: 'My Projects', title: 'My Projects', icon: 'folder' },
  { href: '/settings', label: 'Settings', title: 'Pengaturan', icon: 'settings' },
];

export function navForPath(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find((n) => pathname === n.href || pathname.startsWith(n.href + '/'));
}

/** Peta jalan pengerjaan (dipakai dashboard dan halaman placeholder). */
export const ROADMAP: ReadonlyArray<{ phase: number; title: string; summary: string }> = [
  { phase: 1, title: 'Fondasi', summary: 'Dashboard, library komponen, workspace, drag & drop, terminal dasar.' },
  { phase: 2, title: 'Wiring & proyek', summary: 'Validasi koneksi lanjutan, inspector parameter, simpan/muat proyek (Supabase).' },
  { phase: 3, title: 'Engine listrik', summary: 'Solver DC/AC, hukum Ohm, alat ukur virtual.' },
  { phase: 4, title: 'Proteksi & gangguan', summary: 'MCB, MCCB, RCCB, RCBO, TOR, deteksi fault.' },
  { phase: 5, title: 'Instalasi rumah', summary: 'Lampu, saklar, stopkontak, panel distribusi.' },
  { phase: 6, title: 'Motor', summary: 'Motor 1/3 phase, DOL, Forward-Reverse, Star-Delta.' },
  { phase: 7, title: 'Drive & relay', summary: 'VFD, soft starter, timer, relay, kontrol otomatis.' },
  { phase: 8, title: 'PLC', summary: 'Editor ladder, sensor, HMI, kontrol sekuensial.' },
  { phase: 9, title: 'Belajar', summary: 'Troubleshooting, Learning Center, mode tantangan, laporan.' },
];

export const CURRENT_PHASE = 1;
