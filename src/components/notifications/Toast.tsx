'use client';

import { useEffect } from 'react';
import { useWorkspaceStore } from '@/store/workspace-store';
import { cn } from '@/utils/cn';
import { Icon } from '../ui/Icon';

export function Toast() {
  const notice = useWorkspaceStore((s) => s.notice);
  const dismiss = useWorkspaceStore((s) => s.dismissNotice);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(dismiss, notice.kind === 'error' ? 6000 : 3500);
    return () => clearTimeout(t);
  }, [notice, dismiss]);

  if (!notice) return null;
  const tone = notice.kind === 'error' ? 'border-fault/60 text-fault' : notice.kind === 'success' ? 'border-ok/60 text-ok' : 'border-line text-ink';
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-12 z-50 flex justify-center px-4">
      <div
        key={notice.id}
        role={notice.kind === 'error' ? 'alert' : 'status'}
        data-testid="toast"
        data-kind={notice.kind}
        className={cn('toast-in pointer-events-auto flex max-w-xl items-start gap-3 rounded-md border bg-raised px-4 py-2.5 text-sm shadow-lg', tone)}
      >
        <Icon name={notice.kind === 'error' ? 'warn' : notice.kind === 'success' ? 'check' : 'bolt'} size={16} className="mt-0.5 shrink-0" />
        <span className="text-ink">{notice.text}</span>
        <button type="button" onClick={dismiss} aria-label="Tutup notifikasi" className="-mr-1 text-muted hover:text-ink">
          <Icon name="x" size={14} />
        </button>
      </div>
    </div>
  );
}
