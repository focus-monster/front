import { useAuth } from "@/hooks/auth";
import Folder from "../components/folder";
import Loading from "@/components/loading";
import { useSessions, Session } from "@/hooks/sessions";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";

export function isTimeOver(lastSession: Session) {
  return (
    new Date().getTime() - new Date(lastSession.createdDateTime).getTime() >
    lastSession.duration.hours * 60 * 60 * 1000 +
      lastSession.duration.minutes * 60 * 1000
  );
}

export default function Today() {
  const { data: auth } = useAuth();
  const { isLoading, isFocusing, lastSession, todaysSessions } = useSessions();
  const [open, setOpen] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async () => {
      await fetch(`/api/focus/success`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socialId: auth?.socialId,
          focusId: String(lastSession?.id),
          banedSiteAccessLog: lastSession?.banedSiteAccessLog,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      setOpen(false);
    },
  });

  useEffect(() => {
    if (isFocusing) {
      setOpen(true);
    }
  }, [isFocusing]);

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
      <Dialog open={open}>
        <DialogContent className="">
          <div className="mt-[100px] grid h-[300px] place-content-center justify-items-center gap-8">
            <div className="text-center text-2xl font-bold">UNTIL LEVEL UP</div>
            <div className="text-center text-9xl font-bold">X h X m</div>
          </div>
          <DialogFooter className="h-fit shrink sm:justify-center">
            <Button
              onClick={() => {
                mutate();
              }}
              className="group flex w-fit gap-2"
            >
              {"End Session"} <ArrowRight />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SessionCard({ session }: { session: Session }) {
  return (
    <div
      style={{
        backgroundImage: `url(/square.png)`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="h-[220px] w-[635px] rounded-lg"
    >
      <div className="w-full pt-4 text-center">
        <Result status={session} />
      </div>
      <div className="flex gap-4 bg-transparent px-8 pb-9 pt-4">
        <div className="line-clamp-4 text-lg">
          {JSON.parse(session.evaluation)}
        </div>
        <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-xl">
          <img
            className="h-full w-full object-cover"
            src={session.image}
            alt="session image"
          />
        </div>
      </div>
    </div>
  );
}

function Time({ session }: { session: Session }) {
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

function Result({ status }: { status: Session }) {
  return <Time session={status} />;
}
