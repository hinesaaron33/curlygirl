import { create } from "zustand";

interface BillingToggleState {
  yearly: boolean;
  setYearly: (yearly: boolean) => void;
}

export const useBillingToggle = create<BillingToggleState>((set) => ({
  yearly: true,
  setYearly: (yearly) => set({ yearly }),
}));
