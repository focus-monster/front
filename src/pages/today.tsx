import { useAuth } from "@/hooks/auth";
import Folder from "../components/folder";
import Loading from "@/components/loading";
import { useSessions, Session } from "@/hooks/sessions";
import { SessionCard } from "./session-card";
import { Character } from "@/components/character";
import { useQuery } from "@tanstack/react-query";

export default function Today() {
  const { data: auth } = useAuth();
  const { isLoading, todaysSessions } = useSessions();

  return (
    <>
      <div className="flex min-h-1 grow flex-row gap-8 px-6">
        <div className="w-full grow">
          <Folder
            landing=""
            title={
              <div>
                <div
                  style={{
                    backgroundImage: "url(/word-border.png)",
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                  className="absolute bottom-[15%] left-[50%] z-20 w-fit min-w-[300px] -translate-x-1/2 -translate-y-1/2 px-10 py-8 text-center"
                >
                  <span className="pr-3 text-xl font-bold">
                    {auth?.nickname}
                  </span>
                  <span>{"   / "}</span>
                  <span>Lv{auth?.level ?? 0}</span>
                </div>
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
        <div className="flex w-full grow flex-col gap-6 overflow-y-scroll">
          {isLoading ? (
            <Loading />
          ) : todaysSessions && todaysSessions.length > 0 ? (
            todaysSessions.reverse()?.map((session) => {
              if (session.focusStatus === "FOCUSING") return null;
              return <SessionCard key={session.id} session={session} />;
            })
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
    new Date(session.createdDateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }) +
    " ~ " +
    new Date(session.lastModifiedDateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

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
      const response = await fetch(
        `/api/focus/today-time?socialId=${auth?.socialId}`,
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
