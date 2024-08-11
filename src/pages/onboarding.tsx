import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { queryClient } from "@/app";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { regex } from "./settings";

export default function Onboarding() {
  const [nickname, setNickname] = useState("");
  const [myJob, setMyJob] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [jobError, setJobError] = useState("");

  const auth = useAuth();
  const navigation = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ["user"],
    mutationFn: async () => {
      const response = await fetch("/api/users/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socialId: auth.data?.socialId,
          job: myJob,
          nickname: nickname,
        }),
      });
      if (!response.ok) {
        throw new Error(
          "Failed to adopt your FocusMonster: " + (await response.text()),
        );
      }
      const data = await response.json();

      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Welcome to FocusMonster!");
      navigation("/");
    },
    onError: (error) => {
      console.log(error.message);
      if (error.message.includes("Invalid Nickname")) {
        setNicknameError("The nickname is already taken.");
        return;
      }
      toast.error(error.message);
    },
  });

  return (
    <div className="mx-auto min-h-svh w-full max-w-4xl place-content-center place-items-center p-10">
      <Card className="flex w-full flex-col gap-10 rounded-3xl p-8">
        <CardHeader>
          <CardTitle>Tell Us More About Yourself</CardTitle>
        </CardHeader>
        <CardContent className="relative flex flex-col gap-4">
          <Label htmlFor="focusmon-name">
            Give your FocusMonster a lovely name!
          </Label>
          <Input
            value={nickname}
            onChange={(e) => {
              if (e.target.value.length > 13) {
                setNicknameError("Nickname should be less than 13 characters");
                return;
              }
              if (e.target.value.length > 0 && !regex.test(e.target.value)) {
                setNicknameError(
                  "Nickname should be alphanumeric. No special characters",
                );
                return;
              }
              setNicknameError("");
              setNickname(e.currentTarget.value);
            }}
            id="focusmon-name"
            placeholder="FluffyPaw77"
            className={cn(nicknameError ? "border-red-500" : "")}
          />
          {nicknameError.length > 0 ? (
            <div className="absolute top-2 rounded-lg bg-red-100 px-4 py-1 text-red-800">
              {nicknameError}
            </div>
          ) : null}
          <Label htmlFor="job">What's your job?</Label>
          <div>
            <Job
              myJob={myJob}
              setMyJob={(e) => {
                setMyJob(e);
                setJobError("");
              }}
            />
          </div>
          {jobError.length > 0 ? (
            <div className="absolute top-24 rounded-lg bg-red-100 px-4 py-1 text-red-800">
              {jobError}
            </div>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              console.log(nickname, myJob);
              if (nickname.length === 0) {
                setNicknameError("Nickname is required");
                return;
              }
              if (myJob.length === 0) {
                setJobError("Job is required");
                return;
              }
              mutate();
            }}
            className={cn(
              "relative w-full rounded-full",
              (isPending || nickname.length === 0 || myJob.length === 0) &&
                "cursor-not-allowed",
            )}
          >
            <span className="relative">
              Adopt your FocusMonster
              {isPending ? (
                <Loader className="absolute -right-8 top-0 animate-spin" />
              ) : null}
            </span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function lowercaseAllFirstLetters(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
    .join(" ");
}

export function Job({
  myJob,
  setMyJob,
  transparent,
}: {
  myJob: string;
  setMyJob: Dispatch<SetStateAction<string>>;
  transparent?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await fetch("/api/jobs/list");
      const data = (await response.json()) as string[];
      return data.map((v) => ({
        value: lowercaseAllFirstLetters(v),
        label: v,
      }));
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            transparent &&
              "bg-transparent text-neutral-200 hover:bg-neutral-50/20",
          )}
        >
          {myJob.length > 0
            ? data?.find((job) => job.value === myJob)?.label
            : "Select your job..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className={"w-[400px] p-0"}>
        <Command>
          <CommandInput placeholder="Search your job..." />
          <CommandEmpty className="px-6 py-6 text-center text-sm">
            Your job sounds cool,
            <br />
            but FocusMonster can't understand it, yet.
          </CommandEmpty>
          <CommandGroup
            className={"max-h-[300px] w-full overflow-y-scroll"}
            style={{ scrollbarWidth: "none" }}
          >
            {data?.map((job) => (
              <CommandItem
                key={job.value}
                value={job.value}
                onSelect={(currentValue) => {
                  setMyJob(currentValue === myJob ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 shrink-0",
                    myJob === job.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {job.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
