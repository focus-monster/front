import { useAuth } from "@/hooks/auth";
import Loading from "@/components/loading";
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
import { calculateTimeLeft } from "./today";

export function FocusDialog() {
  const [open, setOpen] = useState(false);
  const { data: auth } = useAuth();
  const { isFocusing, lastSession, isLoading } = useSessions();
  console.log(lastSession, isLoading);

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

  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft(lastSession),
  );

  useEffect(() => {
    const ref = setInterval(
      () => setTimeLeft(() => calculateTimeLeft(lastSession)),
      1000,
    );
    return () => clearInterval(ref);
  }, [lastSession]);

  return (
    <Dialog open={open}>
      <DialogContent className="">
        <DialogTitle className="sr-only"></DialogTitle>
        <div className="mt-[100px] grid h-[300px] place-content-center justify-items-center gap-8">
          <div className="text-center text-2xl font-bold">UNTIL LEVEL UP</div>
          <div className="text-center text-9xl font-bold">
            {isLoading ? (
              <Loading />
            ) : (
              <>
                {timeLeft?.hours} h {timeLeft?.minutes} m
              </>
            )}
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
