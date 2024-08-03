import { useQuery } from "@tanstack/react-query";

export type Auth = {
  socialId: string | null;
};

const query = () => {
  const socialId = localStorage.getItem("socialId");
  if (!socialId) {
    const urlSearch = new URLSearchParams(window.location.search);
    const socialId = urlSearch.get("socialId");
    if (socialId) {
      localStorage.setItem("socialId", socialId);
      return {
        socialId: socialId,
      } as Auth;
    }
  }
  return {
    socialId: null,
  } as Auth;
};

export function useAuth() {
  return useQuery<Auth>({
    queryKey: ["user"],
    queryFn: query,
  });
}
