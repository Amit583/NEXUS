import { create } from "zustand";

interface AppState {
  backendOnline: boolean;
  backendVersion: string | null;
  setBackendStatus: (online: boolean, version?: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  backendOnline: false,
  backendVersion: null,

  setBackendStatus: (online, version) =>
    set({
      backendOnline: online,
      backendVersion: version ?? null,
    }),
}));
