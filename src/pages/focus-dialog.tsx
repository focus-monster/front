import { useAuth } from "@/hooks/auth";
import { useSessions } from "@/hooks/sessions";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { Session } from "@/hooks/sessions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useVideo } from "@/hooks/video";

export function FocusDialog() {
  const [open, setOpen] = useState(false);
  const { data: auth } = useAuth();
  const { isFocusing, lastSession, currentFocusId } = useSessions();

  const { mutate } = useMutation({
    mutationFn: async (result: "succeed" | "fail") => {
      const res = await fetch(`/api/focus/${result}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socialId: auth?.socialId,
          focusId: String(lastSession?.id),
          banedSiteAccessLog: [{ name: "YouTube", count: 1 }],
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to end session: " + (await res.text()));
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      setOpen(false);
      toast.success("Session ended successfully");
      release?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: sendVideo, release } = useVideo({
    interval: 1000 * 60,
  });

  useEffect(() => {
    if (isFocusing) {
      setOpen(true);
    }
    return () => setOpen(false);
  }, [isFocusing, currentFocusId, sendVideo]);

  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft(lastSession),
  );

  useEffect(() => {
    const ref = setInterval(() => {
      setTimeLeft(() => calculateTimeLeft(lastSession));
      if (currentFocusId) sendVideo(currentFocusId);
    }, 1000);
    setTimeLeft(() => calculateTimeLeft(lastSession));
    if (currentFocusId) sendVideo(currentFocusId);
    return () => clearInterval(ref);
  }, [lastSession, currentFocusId, sendVideo]);

  function handleClick() {
    if (timeLeft?.hours < 0) {
      mutate("succeed");
    } else {
      mutate("fail");
    }
  }

  const timeEnded = timeLeft?.hours < 0;

  return (
    <Dialog open={open}>
      <DialogContent className="">
        <DialogTitle className="sr-only"></DialogTitle>
        <div className="mt-[100px] grid h-[300px] place-content-center justify-items-center gap-8">
          <div className="text-center text-2xl font-bold">
            {timeEnded ? "LEVEL UP NOW" : "UNTIL LEVEL UP"}
          </div>
          <div
            className={cn(
              "relative text-center text-9xl font-bold",
              timeLeft?.hours < 0 && "text-green-600",
            )}
          >
            {timeEnded ? (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 pt-4 text-center text-lg">
                You are over by
              </div>
            ) : null}
            {Math.abs(timeLeft?.hours + (timeEnded ? 1 : 0))} h{" "}
            {Math.abs(timeLeft?.minutes)} m
          </div>
        </div>
        <DialogFooter className="h-fit shrink items-center justify-center sm:justify-center md:justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleClick}
                  className={cn(
                    "group flex w-fit gap-2 p-6 text-lg",
                    !timeEnded && "bg-neutral-400",
                  )}
                >
                  {timeEnded ? "End Session" : "Quit Session"}
                  <ArrowRight />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {timeEnded
                    ? "End the session and level up"
                    : "Quitting the session is treated as a failure"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function calculateTimeLeft(lastSession?: Session) {
  if (lastSession) {
    const duration =
      lastSession.duration.hours * 60 * 60 * 1000 +
      lastSession.duration.minutes * 60 * 1000;
    const elapsedTime =
      new Date().getTime() -
      new Date(lastSession.createdDateTime).getTime() +
      new Date(lastSession.createdDateTime).getTimezoneOffset() * 60 * 1000;

    const timeDiff = duration - elapsedTime;

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.ceil((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
  }
  return { hours: 0, minutes: 0 };
}
