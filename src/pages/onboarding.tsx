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
import { queryClient } from "@/main";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const [open, setOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [myJob, setMyJob] = useState("");
  const [input, setInput] = useState("Virtual Reality");

  const auth = useAuth();
  const navigation = useNavigate();

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
      const data = await response.json();

      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      navigation("/");
      console.log("all done");
    },
  });

  console.log(auth.data);

  if (auth.data?.verified) {
    navigation("/");
    return null;
  }

  return (
    <div className="mx-auto min-h-svh w-full max-w-4xl place-content-center place-items-center p-10">
      <Card className="flex w-full flex-col gap-10 rounded-3xl p-8">
        <CardHeader>
          <CardTitle>Tell Us More About Yourself</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Label htmlFor="focusmon-name">
            Give your FocusMonster a lovely name!
          </Label>
          <Input
            value={nickname}
            onChange={(e) => {
              setNickname(e.currentTarget.value);
            }}
            id="focusmon-name"
            placeholder="FluffyPaw77"
          />
          <Label htmlFor="job">What's your job?</Label>
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {myJob.length > 0
                    ? data?.find((job) => job.value === myJob)?.label
                    : "Select your job..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Command>
                  <CommandInput
                    onChangeCapture={(e) => {
                      setInput(e.currentTarget.value);
                    }}
                    placeholder="Search your job..."
                  />
                  <CommandEmpty
                    style={{ textAlign: "initial" }}
                    className="relative m-1 flex cursor-default select-none items-center rounded-sm bg-accent py-1.5 pl-8 text-sm outline-none"
                    onClick={() => {
                      setMyJob(input);
                      data?.push({
                        value: lowercaseAllFirstLetters(input),
                        label: input,
                      });
                      setOpen(false);
                    }}
                  >
                    {input}
                  </CommandEmpty>
                  <CommandGroup
                    className="max-h-[300px] w-full overflow-y-scroll"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {data?.map((job) => (
                      <CommandItem
                        key={job.value}
                        value={job.value}
                        onSelect={(currentValue) => {
                          console.log(currentValue);
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
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              mutate();
            }}
            disabled={isPending}
            className="w-full rounded-full"
          >
            {isPending ? <Loader /> : null}
            Adopt your FocusMonster
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
