import { useQuery } from "@tanstack/react-query";

type Token = {
  socialId: string;
  accessToken: string;
  refreshToken: string;
};

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
  accessToken?: string;
  refreshToken?: string;
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
  accessToken: "",
  refreshToken: "",
};

export function getTokenFromQueryParamsOrLocalStorage(): Token {
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
  window.postMessage({
    action: "FocusMonster-openPopup",
    payload: JSON.stringify(null),
  });

  return {
    socialId,
    accessToken,
    refreshToken,
  } as Token;
}

const query = async (token: Token) => {
  try {
    const response = await fetch(`/api/users/me`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
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
  const token = getTokenFromQueryParamsOrLocalStorage();
  return useQuery<Auth>({
    queryKey: ["user"],
    queryFn: () => query(token),
  });
}

export function useToken() {
  return getTokenFromQueryParamsOrLocalStorage();
}
