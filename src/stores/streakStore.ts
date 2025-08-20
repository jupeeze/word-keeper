import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StreakState {
  streak: number;
  lastDate: string;
  incrementStreak: () => void;
}

export const useStreakStore = create(
  persist<StreakState>(
    (set, get) => ({
      streak: 0,
      lastDate: "",
      incrementStreak: () => {
        const today = new Date().toDateString();
        if (get().lastDate !== today) {
          set({ streak: get().streak + 1, lastDate: today });
        }
      },
    }),
    { name: "streak-storage" }
  )
);
