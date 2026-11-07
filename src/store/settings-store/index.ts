import { create } from 'zustand';
import { CONDUCTOR_PRESETS, DEFAULT_SCHEME, type ColorSchemeId } from '@/data/configurations';
import { CONDUCTOR_TYPES, type ConductorType } from '@/types/electrical';

export type Theme = 'dark' | 'light';
export type SnapSize = 0 | 10 | 20;

export const SETTINGS_KEY = 'esim.settings.v1';

interface PersistedSettings {
  theme: Theme;
  snapSize: SnapSize;
  showGrid: boolean;
  sidebarCollapsed: boolean;
  /** true bila pengguna sendiri yang memilih; jika tidak, tablet mulai dengan sidebar ringkas. */
  sidebarChosen: boolean;
  colorScheme: ColorSchemeId;
  conductorColors: Record<ConductorType, string>;
}

interface SettingsState extends PersistedSettings {
  hydrated: boolean;
  hydrate: () => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setSnapSize: (s: SnapSize) => void;
  setShowGrid: (v: boolean) => void;
  setSidebarCollapsed: (v: boolean) => void;
  applyPreset: (id: Exclude<ColorSchemeId, 'custom'>) => void;
  setConductorColor: (type: ConductorType, color: string) => void;
  resetSettings: () => void;
}

const defaults = (): PersistedSettings => ({
  theme: 'dark',
  snapSize: 10,
  showGrid: true,
  sidebarCollapsed: false,
  sidebarChosen: false,
  colorScheme: DEFAULT_SCHEME,
  conductorColors: { ...CONDUCTOR_PRESETS[DEFAULT_SCHEME as 'puil'].colors },
});

const HEX = /^#[0-9a-fA-F]{6}$/;

function parse(raw: string | null): Partial<PersistedSettings> {
  if (!raw) return {};
  try {
    const p = JSON.parse(raw) as Record<string, unknown>;
    const out: Partial<PersistedSettings> = {};
    if (p.theme === 'dark' || p.theme === 'light') out.theme = p.theme;
    if (p.snapSize === 0 || p.snapSize === 10 || p.snapSize === 20) out.snapSize = p.snapSize;
    if (typeof p.showGrid === 'boolean') out.showGrid = p.showGrid;
    if (typeof p.sidebarCollapsed === 'boolean') out.sidebarCollapsed = p.sidebarCollapsed;
    if (typeof p.sidebarChosen === 'boolean') out.sidebarChosen = p.sidebarChosen;
    if (p.colorScheme === 'puil' || p.colorScheme === 'iec' || p.colorScheme === 'custom') out.colorScheme = p.colorScheme;
    if (p.conductorColors && typeof p.conductorColors === 'object') {
      const colors = { ...defaults().conductorColors };
      const src = p.conductorColors as Record<string, unknown>;
      for (const t of CONDUCTOR_TYPES) {
        const v = src[t];
        if (typeof v === 'string' && HEX.test(v)) colors[t] = v;
      }
      out.conductorColors = colors;
    }
    return out;
  } catch {
    return {};
  }
}

function persist(state: PersistedSettings): void {
  if (typeof window === 'undefined') return;
  try {
    const { theme, snapSize, showGrid, sidebarCollapsed, sidebarChosen, colorScheme, conductorColors } = state;
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme, snapSize, showGrid, sidebarCollapsed, sidebarChosen, colorScheme, conductorColors }));
  } catch {
    /* abaikan */
  }
}

export const useSettingsStore = create<SettingsState>()((set, get) => {
  const update = (patch: Partial<PersistedSettings>) => {
    set(patch);
    persist(get());
  };
  return {
    ...defaults(),
    hydrated: false,
    hydrate: () => {
      if (get().hydrated || typeof window === 'undefined') return;
      let stored: Partial<PersistedSettings> = {};
      try {
        stored = parse(window.localStorage.getItem(SETTINGS_KEY));
      } catch {
        stored = {};
      }
      // Layar tablet/sempit: mulai dengan sidebar ringkas bila pengguna belum pernah memilih.
      if (!stored.sidebarChosen && window.innerWidth < 1024) stored.sidebarCollapsed = true;
      set({ ...stored, hydrated: true });
    },
    setTheme: (theme) => update({ theme }),
    toggleTheme: () => update({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    setSnapSize: (snapSize) => update({ snapSize }),
    setShowGrid: (showGrid) => update({ showGrid }),
    setSidebarCollapsed: (sidebarCollapsed) => update({ sidebarCollapsed, sidebarChosen: true }),
    applyPreset: (id) => update({ colorScheme: id, conductorColors: { ...CONDUCTOR_PRESETS[id].colors } }),
    setConductorColor: (type, color) => {
      if (!HEX.test(color)) return;
      update({ colorScheme: 'custom', conductorColors: { ...get().conductorColors, [type]: color } });
    },
    resetSettings: () => update(defaults()),
  };
});
