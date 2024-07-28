import { create } from "zustand";

type BannedSite = {
  [key: string]: boolean;
};

type BannedSitesType = {
  bannedSites: BannedSite;
  toggle: (key: string) => void;
  add: (key: string) => void;
  remove: (key: string) => void;
};

function loadBannedSites() {
  const json = window.localStorage.getItem("bannedSites") ?? "{}";
  const bannedSites = JSON.parse(json) as BannedSite;
  return bannedSites;
}

export const useBannedSites = create<BannedSitesType>((set) => ({
  bannedSites: loadBannedSites(),
  toggle: (key: string) => {
    set((state) => {
      state.bannedSites[key] = !state.bannedSites[key];
      return state;
    });
  },
  add: (key: string) => {
    set((state) => {
      state.bannedSites[key] = true;
      return state;
    });
  },
  remove: (key: string) => {
    set((state) => {
      delete state.bannedSites[key];
      return state;
    });
  },
}));
