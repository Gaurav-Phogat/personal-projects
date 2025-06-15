import { create } from 'zustand';

type Role = 'guest' | 'user' | 'admin' | null;
type Theme = 'light' | 'dark';

interface AppState {
  role: Role;
  theme: Theme;
  setRole: (role: Role) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: null,
  theme: 'light',
  setRole: (role) => set({ role }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));