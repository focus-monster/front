import { useQuery } from "@tanstack/react-query";
import { getSocialId, useAuth } from "./auth";
import { useMemo } from "react";

export type Session = {
  id: number;
  userSocialId: string;
  duration: {
    hours: number;
    minutes: number;
  };
  banedSiteAccessLog: {
    name: string;
    count: number;
  }[];
  history: string[];
  focusStatus: string;
  image: string;
  evaluation: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
};

export function useSessions() {
  const { data: auth } = useAuth();

  const query = useQuery<Session[]>({
    queryKey: ["session"],
    queryFn: async () => {
      const socialId = auth?.socialId ?? getSocialId();
      const response = await fetch(`/api/focus?socialId=${socialId}`);
      const data = await response.json();
      return data as Session[];
    },
  });

  const todaysSessions = useMemo(
    () =>
      query?.data?.filter((session) => {
        const today = new Date().toLocaleDateString();
        const sessionStartDate = applyTimezoneOffset(
          session.createdDateTime,
        ).toLocaleDateString();
        const sessionEndDate = applyTimezoneOffset(
          session.lastModifiedDateTime,
        ).toLocaleDateString();
        return sessionStartDate === today || sessionEndDate === today;
      }),
    [query.data],
  );

  const lastSession = todaysSessions?.at(-1);
  const currentFocusId = lastSession
    ? lastSession?.focusStatus === "FOCUSING"
      ? lastSession.id
      : null
    : undefined;
  const isFocusing = useMemo(
    () => lastSession?.focusStatus === "FOCUSING",
    [lastSession],
  );

  return { ...query, currentFocusId, isFocusing, todaysSessions, lastSession };
}

export function applyTimezoneOffset(date: string) {
  console.log(new Date(date));
  const currentTime = new Date(
    new Date(date).getTime() - new Date().getTimezoneOffset() * 60 * 1000,
  );
  console.log(currentTime);

  return currentTime;
}
