import { sanitizeDocument } from '@/store/workspace-store/document';
import type { WorkspaceDocument } from '@/types/workspace';

export interface DraftRecord {
  name: string;
  savedAt: number;
  doc: WorkspaceDocument;
}

/**
 * Antarmuka penyimpanan proyek. Phase 1: satu draf di localStorage.
 * Phase 2 menambahkan implementasi Supabase/PostgreSQL dengan antarmuka yang sama
 * (daftar proyek, duplikasi, rename, impor/ekspor) tanpa mengubah store atau UI.
 */
export interface ProjectRepository {
  loadDraft(): DraftRecord | null;
  saveDraft(doc: WorkspaceDocument, name?: string): DraftRecord;
  clearDraft(): void;
}

export const DRAFT_KEY = 'esim.draft.v1';
export const DEFAULT_DRAFT_NAME = 'Draf workspace';

export function createLocalStorageRepository(storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>): ProjectRepository {
  return {
    loadDraft() {
      try {
        const raw = storage.getItem(DRAFT_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { name?: unknown; savedAt?: unknown; doc?: unknown };
        const doc = sanitizeDocument(parsed.doc);
        if (!doc) return null;
        return {
          doc,
          name: typeof parsed.name === 'string' ? parsed.name : DEFAULT_DRAFT_NAME,
          savedAt: typeof parsed.savedAt === 'number' ? parsed.savedAt : Date.now(),
        };
      } catch {
        return null;
      }
    },
    saveDraft(doc, name = DEFAULT_DRAFT_NAME) {
      const record: DraftRecord = { name, savedAt: Date.now(), doc };
      try {
        storage.setItem(DRAFT_KEY, JSON.stringify(record));
      } catch {
        /* kuota penuh / mode privat: abaikan, record tetap dikembalikan */
      }
      return record;
    },
    clearDraft() {
      try {
        storage.removeItem(DRAFT_KEY);
      } catch {
        /* abaikan */
      }
    },
  };
}

export function getBrowserRepository(): ProjectRepository | null {
  if (typeof window === 'undefined') return null;
  try {
    return createLocalStorageRepository(window.localStorage);
  } catch {
    return null;
  }
}
