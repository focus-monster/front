import { getSocialId, useAuth } from "@/hooks/auth";
import Folder from "../components/folder";
import Loading from "@/components/loading";
import { useSessions, Session, applyTimezoneOffset } from "@/hooks/sessions";
import { SessionCard } from "./session-card";
import { Character } from "@/components/character";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LoginPopup } from "@/components/login-popup";

export default function Today() {
  const { data: auth } = useAuth();
  const { isLoading, todaysSessions } = useSessions();
  const [open, setOpen] = useState(false);

  const finishedTodaysSessions = [...(todaysSessions ?? [])]
    .reverse()
    .filter((session) => session.focusStatus !== "FOCUSING");

  return (
    <>
      <div className="flex min-h-1 grow flex-row gap-8 px-6">
        <div className="w-full grow">
          <Folder
            landing=""
            title={
              <div className="">
                {auth?.anonymous && open ? (
                  <LoginPopup
                    onClick={() => setOpen(false)}
                    className="left-[50px] top-[200px] z-30"
                  />
                ) : null}
                <div
                  style={{
                    backgroundImage: "url(/word-border.png)",
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                  onClick={() => {
                    setOpen(true);
                  }}
                  className="absolute left-[50%] top-[250px] z-20 w-fit min-w-[300px] -translate-x-1/2 px-10 py-8 text-center"
                >
                  <span className="pr-3 text-xl font-bold">
                    {auth?.nickname === "Anonymous" ? "Guest" : auth?.nickname}
                  </span>
                  <span>{" / "}</span>
                  <span>Lv{auth?.level ?? 0}</span>
                </div>
                {auth?.anonymous ? (
                  <div className="absolute left-[150px] top-[360px] z-10 w-fit rounded-full bg-yellow-400 px-4">
                    *Log in to save your monster's level and logs.
                  </div>
                ) : null}
                <TotalFocusTime />
              </div>
            }
            insert={
              <div className="absolute left-[50%] top-[30%] -translate-x-1/2 -translate-y-1/2">
                <Character className="aspect-auto w-60" />
              </div>
            }
          />
        </div>
        <div className="flex max-h-[580px] w-full grow flex-col gap-6 overflow-y-scroll">
          {isLoading ? (
            <Loading />
          ) : finishedTodaysSessions && finishedTodaysSessions.length > 0 ? (
            finishedTodaysSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))
          ) : (
            <div className="w-full py-40 text-center text-2xl text-neutral-100">
              No session yet
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function Time({ session }: { session: Session }) {
  const fromTo =
    applyTimezoneOffset(session.createdDateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }) +
    " ~ " +
    applyTimezoneOffset(session.lastModifiedDateTime).toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );

  const timeDiff =
    new Date(session.lastModifiedDateTime).getTime() -
    new Date(session.createdDateTime).getTime();

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  let Duration = () => <></>;

  if (session.focusStatus === "SUCCEED") {
    Duration = () => (
      <span className="text-green-500">
        {" (Focused for "}
        {hours}h {minutes}m{")"}
      </span>
    );
  }

  if (session.focusStatus === "FAILED") {
    Duration = () => (
      <span className="text-neutral-500">
        {" (Focused for "}
        {hours}h {minutes}m{" but got distracted)"}
      </span>
    );
  }

  return (
    <>
      {fromTo} <Duration />
    </>
  );
}

function TotalFocusTime() {
  const { data: auth } = useAuth();
  const { data, isLoading } = useQuery<{
    hours: number;
    minutes: number;
  }>({
    queryKey: ["totalFocusTime"],
    queryFn: async () => {
      const socialId = auth?.socialId ?? getSocialId();
      const response = await fetch(
        `/api/focus/today-time?socialId=${socialId}`,
      );
      return response.json();
    },
  });
  if (isLoading) return null;
  return (
    <div className="absolute bottom-5 left-16 z-10 flex items-end justify-center gap-4 font-semibold">
      <span className="">TOTAL FOCUS TIME</span>
      <span className="text-4xl">
        {data?.hours} h {data?.minutes} m
      </span>
    </div>
  );
}
