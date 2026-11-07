import type { ReactNode } from 'react';

const P: Record<string, ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>,
  workspace: <><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H14a3 3 0 0 1 3 3v6.5" /></>,
  house: <><path d="M4 11 12 4l8 7" /><path d="M6 10v10h12V10" /></>,
  building: <><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 8h2M13 8h2M9 12h2M13 12h2M10 21v-4h4v4" /></>,
  motor: <><circle cx="12" cy="12" r="7" /><path d="M9 15V9l3 4 3-4v6" /></>,
  motorsim: <><path d="M5 12a7 7 0 0 1 12-5M19 12a7 7 0 0 1-12 5" /><path d="M17 3v4h-4M7 21v-4h4" /></>,
  plc: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h3M8 13h8M8 16h5" /></>,
  wrench: <><path d="M14.5 6.5a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3l8.5-8.5Z" /><path d="M14.5 6.5 17 4" /></>,
  book: <><path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" /><path d="M8 17h10" /></>,
  library: <><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>,
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  undo: <><path d="M9 14 4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 0 12h-3" /></>,
  redo: <><path d="m15 14 5-5-5-5" /><path d="M20 9H10a6 6 0 0 0 0 12h3" /></>,
  rotate: <><path d="M20 12a8 8 0 1 1-3-6.2" /><path d="M20 4v5h-5" /></>,
  trash: <><path d="M4 7h16M10 11v6M14 11v6" /><path d="M6 7l1 13h10l1-13M9 7V4h6v3" /></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></>,
  paste: <><rect x="6" y="5" width="12" height="16" rx="2" /><path d="M9 5V3h6v2M9 12h6M9 16h6" /></>,
  zoomin: <><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5M11 8v6M8 11h6" /></>,
  zoomout: <><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5M8 11h6" /></>,
  fit: <><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></>,
  grid: <><path d="M4 4h16v16H4zM4 12h16M12 4v16" /></>,
  pan: <><path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3" /></>,
  cursor: <path d="m5 3 14 8-6 2-2 6L5 3Z" />,
  save: <><path d="M5 4h11l3 3v13H5V4Z" /><path d="M8 4v5h7V4M8 20v-6h8v6" /></>,
  arrange: <><rect x="3" y="4" width="5" height="5" rx="1" /><rect x="3" y="15" width="5" height="5" rx="1" /><rect x="16" y="9.5" width="5" height="5" rx="1" /><path d="M8 6.5h4v11H8M12 12h4" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></>,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12 5 5 9-10" />,
  warn: <><path d="M12 4 3 20h18L12 4Z" /><path d="M12 10v4M12 17v.5" /></>,
  chevron: <path d="m9 6 6 6-6 6" />,
  chevdown: <path d="m6 9 6 6 6-6" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></>,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />,
  panelleft: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></>,
  panelright: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M15 4v16" /></>,
  bolt: <path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z" />,
  wire: <path d="M4 18h6V6h10" />,
};

export type IconName = keyof typeof P;

export function Icon({ name, size = 18, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {P[name]}
    </svg>
  );
}
