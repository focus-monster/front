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

const defaultBannedSites = {
  "youtube.com": true,
  "instagram.com": true,
  "facebook.com": true,
  "X.com": true,
  "reddit.com": true,
  "tiktok.com": true,
};

function loadBannedSites() {
  const json = window.localStorage.getItem("bannedSites");
  if (!json || json === "{}") {
    window.localStorage.setItem(
      "bannedSites",
      JSON.stringify(defaultBannedSites),
    );
    return defaultBannedSites;
  }
  const bannedSites = JSON.parse(json) as BannedSite;

  return bannedSites;
}

export const useBannedSites = create<BannedSitesType>((set) => ({
  bannedSites: loadBannedSites(),
  toggle: (key: string) => {
    set((state) => {
      state.bannedSites[key] = !state.bannedSites[key];
      window.localStorage.setItem(
        "bannedSites",
        JSON.stringify(state.bannedSites),
      );
      return { ...state };
    });
  },
  add: (key: string) => {
    set((state) => {
      state.bannedSites[key] = true;
      window.localStorage.setItem(
        "bannedSites",
        JSON.stringify(state.bannedSites),
      );
      return { ...state };
    });
  },
  remove: (key: string) => {
    set((state) => {
      delete state.bannedSites[key];
      window.localStorage.setItem(
        "bannedSites",
        JSON.stringify(state.bannedSites),
      );
      return { ...state };
    });
  },
}));
