import { queryClient } from "@/app";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/auth";
import { Session, useSessions } from "@/hooks/sessions";
import { useTitle } from "@/hooks/title";
import { useVideo } from "@/hooks/video";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { ResultDialogContext } from "./result-dialog";

const SUCCESS_TITLES = [
  "집중 성공! 잠깐 쉬었다 갈까요?",
  "멋지게 해냈어요. 세션 완료!",
  "수고 많으셨어요. 세션이 끝났어요.",
  "집중 완료! 수고했어요~",
  "집중 성공! 이제 잠깐 숨 돌려요.",
] as const;

const FAILURE_TITLES = [
  "세션이 중단되었어요.",
  "목표 시간을 못 채웠어요.",
  "흐음, 다음엔 더 잘할 수 있어요!",
] as const;

const getOS = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes("win")) return "windows";
  if (userAgent.includes("mac")) return "macos";
  return "other";
};

export const FocusDialogContext = createContext(
  {} as { open: boolean; setOpen: (open: boolean) => void },
);

export const FocusDialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <FocusDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </FocusDialogContext.Provider>
  );
};

export function FocusDialog() {
  const { open, setOpen } = useContext(FocusDialogContext);
  const { data: auth } = useAuth();
  const { isFocusing, lastSession, currentFocusId } = useSessions();
  const { setOpen: setResultOpen, setResult } = useContext(ResultDialogContext);

  const { fetchVideoStreamAsync } = useVideo({
    interval: 1000 * 60,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (result: "succeed" | "fail") => {
      if (!isFocusing) return;

      const res = await fetch(`/api/focus/${result}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en",
        },
        body: JSON.stringify({
          socialId: auth?.socialId,
          focusId: String(lastSession?.id),
          banedSiteAccessLog: [],
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to end session: " + (await res.text()));
      }
      return (await res.json()) as Session;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      setOpen(false);
      if (data?.focusStatus === "SUCCEED") {
        toast.success("Session ended successfully");
      } else if (data?.focusStatus === "FAILED") {
        toast.success("Session quitted successfully");
      } else {
        toast.error("Failed to end session");
      }
      if (data) {
        setResultOpen(true);
        setResult(data);

        if ("Notification" in window && Notification.permission === "granted") {
          const os = getOS();

          if (data.focusStatus === "SUCCEED") {
            const randomTitle =
              SUCCESS_TITLES[Math.floor(Math.random() * SUCCESS_TITLES.length)];
            const hours = data.resultDuration.hours;
            const minutes = data.resultDuration.minutes;
            const level = auth?.level ?? 0; // NOTE: 세션 종료에 따라 level 값이 증가하는지 확인 필요

            if (os === "windows") {
              const notificationOptions: NotificationOptions & {
                image?: string;
              } = {
                body: `${hours}시간 ${minutes}분 동안 집중 | Lv.${level}로 레벨 업`,
                icon: "/icon-34.png",
                image: data.image,
              };
              new Notification(randomTitle, notificationOptions);
            } else {
              new Notification(randomTitle, {
                body: `${hours}시간 ${minutes}분 동안 집중 | Lv.${level}로 레벨 업`,
                icon: "/icon-34.png",
              });
            }
          } else {
            const randomTitle =
              FAILURE_TITLES[Math.floor(Math.random() * FAILURE_TITLES.length)];
            const hours = data.resultDuration.hours;
            const minutes = data.resultDuration.minutes;
            const level = auth?.level ?? 0;

            if (os === "windows") {
              const notificationOptions: NotificationOptions & {
                image?: string;
              } = {
                body: `${hours}시간 ${minutes}분 동안 집중 | Lv.${level}로 레벨 유지`,
                icon: "/icon-34.png",
                image: data.image,
              };
              new Notification(randomTitle, notificationOptions);
            } else {
              new Notification(randomTitle, {
                body: `${hours}시간 ${minutes}분 동안 집중 | Lv.${level}로 레벨 유지`,
                icon: "/icon-34.png",
              });
            }
          }
        }
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (isFocusing) {
      setOpen(true);
    }
    return () => setOpen(false);
  }, [isFocusing, setOpen]);

  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft(lastSession),
  );

  useEffect(() => {
    if (!isFocusing) return;
    const ref = setInterval(() => {
      const res = calculateTimeLeft(lastSession);
      if (res.hours < 0) {
        mutate("succeed");
        clearInterval(ref);
        return;
      }
      setTimeLeft(() => {
        return res;
      });
    }, 1000);
    setTimeLeft(() => calculateTimeLeft(lastSession));
    return () => clearInterval(ref);
  }, [lastSession, currentFocusId, mutate, isFocusing]);

  function handleClick() {
    mutate("fail");
  }

  const timeEnded = timeLeft?.hours < 0;

  const timeLeftString = `${Math.abs(timeLeft?.hours + (timeEnded ? 1 : 0))} h ${Math.abs(
    timeLeft?.minutes,
  )} m`;

  useTitle(timeLeftString, isFocusing);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-fit">
        <div
          style={{
            backgroundImage: 'url("/dialog-frame.png")',
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            width: "800px",
            height: "603px",
          }}
        >
          <div className="absolute -right-[110px] bottom-[40px] -z-50 w-[160px]">
            <img
              src="/focus-monster.png"
              alt="focus monster"
              className="-z-50"
            />
          </div>
          <DialogTitle className="sr-only"></DialogTitle>
          <div className="mt-[100px] grid h-[300px] place-content-center justify-items-center gap-8">
            <div className="text-center text-2xl font-bold">
              {timeEnded ? "LEVEL UP NOW" : "UNTIL LEVEL UP"}
            </div>
            <title>
              {Math.abs(timeLeft?.hours + (timeEnded ? 1 : 0))} h{" "}
              {Math.abs(timeLeft?.minutes)} m
            </title>
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
          <div className="flex h-fit flex-row justify-center gap-4">
            <Button
              variant="secondary"
              onClick={handleClick}
              className={cn(
                "group flex w-fit gap-2 text-lg",
                !timeEnded && "bg-neutral-400",
              )}
              disabled={isPending}
            >
              {isPending ? <Loader className="animate-spin" /> : "Quit Session"}
            </Button>
            <Button
              variant="default"
              onClick={() => {
                fetchVideoStreamAsync();
              }}
              className="text-lg"
            >
              Change My Monitor
            </Button>
          </div>
          <div className="pt-3 text-center">
            <p>'Quit session' is considered a failure</p>
          </div>
          <div
            style={{
              backgroundImage: "url(/word-border.png)",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              width: "400px",
              height: "100px",
            }}
            className="absolute left-0 top-[200px] flex w-[400px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-[21px]"
          >
            <p>Aren't you focused right now?</p>
            <p>Hang in there a litte longer!</p>
          </div>
        </div>
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
