import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChildInfo {
  name: string;
  birthDate: string;
  ageLimit: number;
}

interface Store {
  childInfo: ChildInfo | null;
  setChildInfo: (info: ChildInfo) => void;
  resetData: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      childInfo: null,
      setChildInfo: (info) => set({ childInfo: info }),
      resetData: () => set({ childInfo: null }),
    }),
    {
      name: 'dear-time-storage',
    }
  )
);