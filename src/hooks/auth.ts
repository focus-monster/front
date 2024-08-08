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
};

const query = async () => {
  const socialId = localStorage.getItem("socialId");

  if (!socialId) {
    const urlSearch = new URLSearchParams(window.location.search);
    const socialId = urlSearch.get("socialId");
    if (!socialId) {
      return dummyAuth;
    }
    localStorage.setItem("socialId", socialId);
  }

  const url = new URL(window.location.href);
  url.searchParams.delete("socialId");
  window.history.replaceState({}, "", url.toString());

  // if (import.meta.env.DEV) {
  //   console.log("DEV MODE");
  //   return JSON.parse(import.meta.env.VITE_AUTH) as Auth;
  // }

  const response = await fetch(`/api/users/${socialId}`);
  const data = await response.json();

  return data as Auth;
};

export function useAuth() {
  return useQuery<Auth>({
    queryKey: ["user"],
    queryFn: query,
  });
}
