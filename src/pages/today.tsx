import { useAuth } from "@/hooks/auth";
import Folder from "../components/folder";
import Loading from "@/components/loading";
import { useSessions, Session } from "@/hooks/sessions";
import { SessionCard } from "./session-card";
import { FocusDialog } from "./focus-dialog";

export default function Today() {
  const { data: auth } = useAuth();
  const { isLoading, todaysSessions } = useSessions();

  return (
    <>
      <div className="flex min-h-1 grow flex-row gap-8 px-6">
        <div className="w-full grow">
          <Folder
            title={
              <>
                <span className="text-2xl font-bold">{auth?.nickname}</span>
                {" / "}
                <span>Lv{3}</span>
              </>
            }
          />
        </div>
        <div className="flex w-full grow flex-col gap-6 overflow-y-scroll">
          {isLoading ? (
            <Loading />
          ) : (
            todaysSessions?.map((session) => {
              if (session.focusStatus === "FOCUSING") return null;

              return <SessionCard key={session.id} session={session} />;
            })
          )}
        </div>
      </div>
      <FocusDialog />
    </>
  );
}

export function calculateTimeLeft(lastSession?: Session) {
  if (lastSession) {
    const duration =
      lastSession.duration.hours * 60 * 60 * 1000 +
      lastSession.duration.minutes * 60 * 1000;
    const elapsedTime =
      new Date().getTime() -
      new Date(lastSession.createdDateTime).getTime() +
      new Date(lastSession.createdDateTime).getTimezoneOffset() * 60 * 1000;

    const timeDiff = duration - elapsedTime;

    if (timeDiff > 0) {
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      return { hours, minutes };
    }
  }
  return { hours: 0, minutes: 0 };
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
