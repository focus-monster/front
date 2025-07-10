import { queryClient } from "@/app";
import { FocusDialogContext } from "@/components/dialog/focus-dialog";
import { Session, useSessions } from "@/hooks/sessions";
import { useVideo } from "@/hooks/video";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/auth";
import { useBannedSites } from "../hooks/banned-sites";
import { Input } from "./ui/input";

/**
 *  "socialId": "116618166312500650927",
    "duration": {
        "hours": 2,
        "minutes": 30
    },
    "banedSites": [
    "YouTube", "WhatsApp"
    ],
    "task": "개발 1시간, 피그마 1시간 30분"
 */

type SessionStart = {
  socialId: string;
  duration: {
    hours: number;
    minutes: number;
  };
  bannedSites: string[];
  task: string;
};

export default function Timer() {
  const [time, setTime] = useState<{
    hours: number | undefined;
    minutes: number | undefined;
  }>({
    hours: 0,
    minutes: 15,
  });
  const [task, setTask] = useState("");
  const { data } = useAuth();
  const [timeError, setTimeError] = useState("");

  const bannedSites = useBannedSites((state) =>
    Object.entries(state.bannedSites)
      .filter((v) => v[1])
      .map((v) => v[0]),
  );

  const { isLoading: isSessionLoading, isFocusing } = useSessions();
  const { setOpen } = useContext(FocusDialogContext);
  const { fetchVideoStreamAsync } = useVideo({
    interval: 60 * 1000,
  });

  const { mutate, isPending } = useMutation<Session>({
    mutationFn: async () => {
      const res = await fetch("/api/focus", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en",
        },
        body: JSON.stringify({
          socialId: data?.socialId,
          duration: time,
          task: task,
          bannedSites: bannedSites,
        } as SessionStart),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Session started successfully");
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  async function handleClick() {
    if (time.hours === 0) {
      if (Number(time.minutes) < 15) {
        toast.error("Minimum focus time is 15 minutes!");
        return;
      }
    }
    if (Number(time.hours) >= 5) {
      toast.error("Maximum focus time is 5 hours!");
      return;
    }
    if (Number(time.minutes) >= 60) {
      toast.error("Minutes should be less than or equal to 60");
      return;
    }
    if (isFocusing) {
      setOpen(true);
      return;
    }

    if ("Notification" in window) {
      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          toast.error(
            "Notification permission is required to start a focus session.",
          );
          return;
        }
      } else if (Notification.permission === "denied") {
        toast.error(
          "Please enable notifications in your browser settings to start a focus session.",
        );
        return;
      }
    }

    try {
      const res = await fetchVideoStreamAsync();
      if (res.isError) {
        toast.error("Please allow screen sharing to start the session.");
        return;
      }
      mutate();
    } catch (e) {
      toast.error("Didn't start the session.");
    }
  }

  return (
    <div className="flex items-center justify-start gap-6 px-6 py-4">
      <div
        style={{
          backgroundImage: "url(/input-doodle.png)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        className="relative flex w-fit flex-shrink-0 items-center justify-center gap-6 px-4 py-2"
      >
        <span className="flex-shrink-0 pr-4">Set Duration:</span>
        <div className="flex flex-row items-center justify-center gap-2">
          <Input
            className={cn(
              "w-16 border-2",
              timeError.length > 0 && "border-red-600",
            )}
            id="hour"
            type="number"
            placeholder="0"
            min="-1"
            max="6"
            value={time.hours}
            onBlur={(e) => {
              if (Number(e.target.value) >= 5) {
                if (time.minutes !== 0) {
                  setTime((prev) => ({ ...prev, hours: 5, minutes: 0 }));
                  setTimeError("Maximum focus hours is 5!");
                  return;
                }
              }
              if (Number(e.target.value) <= 0) {
                setTime((prev) => ({ ...prev, hours: 0, minutes: 15 }));
                setTimeError("Minium focus time is 15 minutes!");
                return;
              }
            }}
            onChange={(e) => {
              if (isFocusing) return;
              if (e.target.value === "") {
                setTime((prev) => ({ ...prev, hours: undefined }));
                return;
              }
              if (Number(e.target.value) > 5) {
                setTime((prev) => ({ ...prev, hours: 5 }));
                setTimeError("Maximum focus hours is 5!");
                return;
              }
              if (Number(e.target.value) <= 0) {
                setTime((prev) => ({ ...prev, hours: 0 }));
                setTimeError("Minium focus time is 15 minutes!");
                return;
              }
              setTimeError("");
              setTime((prev) => ({ ...prev, hours: Number(e.target.value) }));
            }}
          />
          <label htmlFor="hour">h</label>
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <Input
            className={cn(
              "w-16 border-2",
              timeError.length > 0 && "border-red-600",
            )}
            id="minutes"
            type="number"
            placeholder="15"
            min="-5"
            max="65"
            step="5"
            value={time.minutes}
            onBlur={(e) => {
              if (time.hours === 0) {
                if (Number(e.target.value) < 15) {
                  setTime((prev) => ({ ...prev, minutes: 15 }));
                  setTimeError("Minimum focus time is 15 minutes!");
                  return;
                }
              }
            }}
            onChange={(e) => {
              if (isFocusing) return;
              if (e.target.value === "") {
                setTime((prev) => ({ ...prev, minutes: undefined }));
                return;
              }
              if (time.hours === 0) {
                if (
                  Number(e.target.value) >= 10 &&
                  Number(e.target.value) < 15
                ) {
                  setTime((prev) => ({ ...prev, minutes: 15 }));
                  setTimeError("Minimum focus time is 15 minutes!");
                  return;
                }
              }

              if (Number(e.target.value) === -5) {
                if (time.hours === 0) {
                  setTime((prev) => ({ ...prev, minutes: 0 }));
                  setTimeError("Minimum focus time is 15 minutes!");
                  return;
                }
                setTime((prev) => ({
                  minutes: 55,
                  hours: Number(prev.hours) - 1,
                }));
                setTimeError("");
                return;
              }
              if (Number(time.hours) >= 5) {
                if (e.target.value !== "0") {
                  setTime((prev) => ({ ...prev, minutes: 0 }));
                  setTimeError("Maximum focus time is 5 hours!");
                  return;
                }
              }
              if (Number(e.target.value) === 60) {
                setTime((prev) => ({
                  ...prev,
                  hours: Number(prev.hours) + 1,
                  minutes: Number(0),
                }));
                setTimeError("");
                return;
              }
              if (Number(e.target.value) > 60) {
                setTime((prev) => ({ ...prev, minutes: 55 }));
                setTimeError("Minutes should be less than 60!");
                return;
              }

              setTimeError("");
              setTime((prev) => ({ ...prev, minutes: Number(e.target.value) }));
            }}
          />
          <label htmlFor="minutes">m</label>
        </div>
        <AlertTriangle
          className={cn(
            timeError.length === 0 ? "text-background" : "text-red-600",
          )}
        />
        <div>
          {timeError.length > 0 && (
            <span className="absolute -bottom-10 right-10 rounded-full bg-red-100 px-3 py-1 text-sm text-red-600">
              {timeError}
            </span>
          )}
        </div>
      </div>
      <div
        style={{
          backgroundImage: "url(/input-doodle.png)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        className="flex w-[350px] items-center gap-2 px-4 py-2"
      >
        <Input
          className="w-full rounded-lg border-2"
          id="task"
          type="text"
          placeholder="What is your task for this session? (optional)"
          disabled={isFocusing}
          value={task}
          onChange={(e) => {
            if (isFocusing) return;
            setTask(e.target.value);
          }}
        />
      </div>
      <div
        style={{
          backgroundImage: `radial-gradient(
            ${isFocusing ? "#FF7F0F, #FF7F0F" : "black, black"}
          )`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          maskImage: "url(/black-button.png)",
          maskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskImage: "url(/black-button.png)",
          WebkitMaskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
        }}
      >
        {/* NOTE: 홈에서 집중 모드 블로킹 */}
        <button
          style={{
            backgroundImage: "url(/button-outline.png)",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
          className={cn(
            "flex w-[180px] items-center justify-center gap-4 rounded-2xl px-6 py-3 text-lg text-neutral-50",
            (isPending || true) && "cursor-not-allowed",
          )}
          onClick={handleClick}
          disabled={isPending || isSessionLoading || true}
        >
          <ButtonText isPending={isPending} sessionStarted={isFocusing} />
        </button>
      </div>
    </div>
  );
}

function ButtonText({
  isPending,
  sessionStarted,
}: {
  isPending: boolean;
  sessionStarted: boolean;
}) {
  if (isPending) {
    return (
      <div className="flex flex-row gap-4">
        Starting...
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (sessionStarted) {
    return "See Status";
  }

  return "Focus Now!";
}
