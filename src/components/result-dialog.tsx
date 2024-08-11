import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/auth";
import { Session } from "@/hooks/sessions";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

export const ResultDialogContext = createContext(
  {} as {
    open: boolean;
    setOpen: (open: boolean) => void;
    result: Session | null;
    setResult: (result: Session | null) => void;
  },
);

export const ResultDialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<Session | null>(null);

  return (
    <ResultDialogContext.Provider value={{ open, setOpen, result, setResult }}>
      {children}
    </ResultDialogContext.Provider>
  );
};

export function ResultDialog() {
  const { open, setOpen, result } = useContext(ResultDialogContext);
  const { data: auth, isLoading } = useAuth();
  if (!result || isLoading)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          style={{
            backgroundImage: 'url("/box-lg.png")',
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            width: "694px",
            height: "602px",
          }}
          className=""
        ></DialogContent>
      </Dialog>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        style={{
          backgroundImage: 'url("/box-lg.png")',
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          width: "694px",
          height: "602px",
        }}
        className=""
      >
        <DialogTitle className="sr-only"></DialogTitle>
        <div className="flex flex-col items-center">
          <div className="flex h-[500px] w-full grow flex-col items-center overflow-hidden pb-6 pt-14">
            <div className="grid h-full grid-cols-[2fr,3fr] gap-2 px-4">
              <Result result={result.focusStatus} />
              <p>{JSON.parse(result.evaluation)}</p>
              <div className="flex flex-col items-center justify-between px-2">
                <Duration duration={result.resultDuration} />
                <Level level={auth?.level ?? 0} result={result.focusStatus} />
                <Character
                  result={result.focusStatus}
                  level={auth?.level ?? 0}
                />
              </div>
              <div className="overflow-hidden object-contain">
                <Image image={result.image} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Result({ result }: { result: string }) {
  if (result === "FAILED") {
    return <img src="/fail.png" alt="failed" />;
  }
  if (result === "SUCCEED") {
    return <img src="/success.png" alt="success" />;
  }
  return <></>;
}

function Duration({
  duration,
}: {
  duration: { hours: number; minutes: number };
}) {
  return (
    <div className="flex w-full flex-row gap-4 py-2">
      <div>
        <img src="/clock.png" width="46" height="45" alt="clock" />
      </div>
      <div>
        <div className="text-sm font-semibold">You stayed focus for</div>
        <div className="text-4xl font-bold">
          {duration.hours}h {duration.minutes}m
        </div>
      </div>
    </div>
  );
}

function Level({ level, result }: { level: number; result: string }) {
  return (
    <div className="flex w-full flex-row gap-4 py-2">
      <img
        src={result === "SUCCEED" ? "/up.png" : "/stop.png"}
        alt="level"
        width="52"
        height="54"
      />
      <div>
        <div className="text-sm font-semibold">
          {result === "SUCCEED" ? "Level up" : "Stays at"}
        </div>
        <div className="text-4xl font-bold">LV. {level}</div>
      </div>
    </div>
  );
}

function Character({ result, level }: { result: string; level: number }) {
  const url =
    `${result === "SUCCEED" ? "success/" : "fail/"}` + `${levelMap(level)}.png`;
  return (
    <div className="pt-4">
      <img src={url} alt={url} width="176px" height="162px"></img>
    </div>
  );
}

function levelMap(level: number) {
  if (level < 5) return 0;
  if (level < 30) return 5;
  if (level < 70) return 30;
  if (level < 100) return 70;
  return 100;
}

function Image({ image }: { image: string }) {
  return (
    <div
      style={{
        backgroundImage: `url(/frame.png)`,
        backgroundSize: "100% 100%",
        width: "fit-content",
        height: "fit-content",
        backgroundRepeat: "no-repeat",
      }}
      className="relative mx-auto p-2 pb-6"
    >
      <img
        src={image}
        alt="meme"
        className="h-[310px] object-contain object-center"
      />
      <img
        src="/frame.png"
        alt="frame"
        className="absolute left-0 top-0 h-full w-full"
      />
    </div>
  );
}
