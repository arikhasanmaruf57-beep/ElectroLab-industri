'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/data/navigation';
import { useSettingsStore } from '@/store/settings-store';
import { cn } from '@/utils/cn';
import { Icon } from '../ui/Icon';

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useSettingsStore((s) => s.sidebarCollapsed);
  const setCollapsed = useSettingsStore((s) => s.setSidebarCollapsed);

  return (
    <aside
      aria-label="Navigasi utama"
      className={cn(
        'flex shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-150',
        collapsed ? 'w-14' : 'w-64',
      )}
    >
      <div className={cn('flex h-14 items-center border-b border-line', collapsed ? 'justify-center' : 'gap-2.5 px-4')}>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-ink">
          <Icon name="bolt" size={18} />
        </span>
        {!collapsed && (
          <div className="leading-tight">
            <div className="text-[15px] font-semibold">Electrical Simulator</div>
            <div className="text-xs text-muted">Belajar instalasi & kontrol</div>
          </div>
        )}
      </div>

      <nav className="scroll-thin flex-1 overflow-y-auto py-2">
        <ul className="space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const href = item.href === '/dashboard' ? '/' : item.href;
            const active = pathname === href || (href !== '/' && pathname.startsWith(href + '/'));
            return (
              <li key={item.href}>
                <Link
                  href={href}
                  title={collapsed ? item.label : undefined}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-center rounded-md text-sm transition-colors',
                    collapsed ? 'h-10 justify-center' : 'h-9 gap-3 px-3',
                    active ? 'bg-raised text-ink' : 'text-muted hover:bg-raised hover:text-ink',
                  )}
                >
                  {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-accent" />}
                  <Icon name={item.icon} size={18} className={active ? 'text-accent' : undefined} />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!collapsed && item.phase && <span className="text-[11px] text-muted tnum">Phase {item.phase}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line p-2">
        {!collapsed && (
          <p className="px-2 pb-2 text-[11px] leading-snug text-muted">
            Simulator pembelajaran. Hasilnya tidak menggantikan perhitungan desain, pengujian, dan pemeriksaan instalasi sesuai PUIL/SNI.
          </p>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          className={cn('flex h-9 w-full items-center rounded-md text-muted hover:bg-raised hover:text-ink', collapsed ? 'justify-center' : 'gap-3 px-3')}
        >
          <Icon name="panelleft" size={18} />
          {!collapsed && <span className="text-sm">Ciutkan</span>}
        </button>
      </div>
    </aside>
  );
}
