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

export function FocusDialog() {
  const [open, setOpen] = useState(false);
  const { data: auth } = useAuth();
  const { isFocusing, lastSession } = useSessions();

  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/focus/succeed`, {
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
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (isFocusing) {
      setOpen(true);
    }
  }, [isFocusing]);

  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft(lastSession),
  );

  useEffect(() => {
    const ref = setInterval(
      () => setTimeLeft(() => calculateTimeLeft(lastSession)),
      1000,
    );
    setTimeLeft(() => calculateTimeLeft(lastSession));
    return () => clearInterval(ref);
  }, [lastSession]);

  return (
    <Dialog open={open}>
      <DialogContent className="">
        <DialogTitle className="sr-only"></DialogTitle>
        <div className="mt-[100px] grid h-[300px] place-content-center justify-items-center gap-8">
          {timeLeft?.hours < 0 ? (
            <div>
              <div className="text-center text-2xl font-bold">LEVEL UP NOW</div>
              <div className="pt-4 text-center text-lg">You are over by</div>
            </div>
          ) : (
            <div className="text-center text-2xl font-bold">UNTIL LEVEL UP</div>
          )}
          <div
            className={cn(
              "text-center text-9xl font-bold",
              timeLeft?.hours < 0 && "text-green-600",
            )}
          >
            {Math.abs(timeLeft?.hours)} h {Math.abs(timeLeft?.minutes)} m
          </div>
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

    console.log(duration, elapsedTime);

    if (timeDiff < 0) {
      const hours = Math.floor((timeDiff * -1) / (1000 * 60 * 60)) * -1;
      const minutes =
        Math.ceil(((timeDiff * -1) % (1000 * 60 * 60)) / (1000 * 60)) * -1;
      return { hours, minutes };
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.ceil((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
  }
  return { hours: 0, minutes: 0 };
}
