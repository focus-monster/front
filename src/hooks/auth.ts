import { useQuery } from "@tanstack/react-query";

export type Auth = {
  id: number;
  nickname: string;
  email: string;
  socialId: string | null;
  job: string | null;
  successCount: number;
  anonymous: boolean;
  verified: boolean;
  token: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  focusStatus: string;
  level: number;
};

export const dummyAuth: Auth = {
  id: 0,
  nickname: "dummy",
  email: "",
  socialId: null,
  job: null,
  successCount: 0,
  anonymous: false,
  verified: false,
  token: "",
  createdDateTime: "",
  lastModifiedDateTime: "",
  focusStatus: "",
  level: 0,
};

export function getTokenFromQueryParamsOrLocalStorage() {
  const urlSearch = new URLSearchParams(window.location.search);

  let socialId = urlSearch.get("socialId");
  let accessToken = urlSearch.get("accessToken");
  let refreshToken = urlSearch.get("refreshToken");

  if (!socialId) {
    socialId = localStorage.getItem("socialId");
  }
  if (!accessToken) {
    accessToken = localStorage.getItem("accessToken");
  }
  if (!refreshToken) {
    refreshToken = localStorage.getItem("refreshToken");
  }

  localStorage.setItem("socialId", socialId ?? "");
  localStorage.setItem("accessToken", accessToken ?? "");
  localStorage.setItem("refreshToken", refreshToken ?? "");

  const url = new URL(window.location.href);
  url.searchParams.delete("socialId");
  url.searchParams.delete("accessToken");
  url.searchParams.delete("refreshToken");
  window.history.replaceState({}, "", url.toString());

  if (!socialId) {
    return dummyAuth;
  }

  return socialId;
}

const query = async () => {
  // if (import.meta.env.DEV) {
  //   console.log("DEV MODE");
  //   return JSON.parse(import.meta.env.VITE_AUTH) as Auth;
  // }
  try {
    const response = await fetch(`/api/users/me`, {
      credentials: "include",
    });
    const data = await response.json();
    return data as Auth;
  } catch (e) {
    if (typeof e === "string" && e.includes("Invalid SocialId")) {
      localStorage.removeItem("socialId");
    }
  }
  return dummyAuth;
};

export function useAuth() {
  return useQuery<Auth>({
    queryKey: ["user"],
    queryFn: query,
  });
}
