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
import { useMutation } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JOBS: { value: string; label: string }[] = [
  { value: "aerospace", label: "Aerospace" },
  { value: "agricultural technology", label: "Agricultural Technology" },
  { value: "artificial intelligence", label: "Artificial Intelligence" },
  { value: "augmented reality", label: "Augmented Reality" },
  {
    value: "autonomous driving technology",
    label: "Autonomous Driving Technology",
  },
  { value: "big data", label: "Big Data" },
  { value: "bioinformatics", label: "Bioinformatics" },
  { value: "business strategy", label: "Business Strategy" },
  { value: "cloud technology", label: "Cloud Technology" },
  { value: "construction technology", label: "Construction Technology" },
  { value: "content creation", label: "Content Creation" },
  { value: "cultural arts", label: "Cultural Arts" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "data analysis", label: "Data Analysis" },
  { value: "digital marketing", label: "Digital Marketing" },
  {
    value: "distributed ledger technology",
    label: "Distributed Ledger Technology",
  },
  { value: "e-commerce", label: "E-commerce" },
  { value: "educational technology", label: "Educational Technology" },
  { value: "energy management", label: "Energy Management" },
  { value: "engineering design", label: "Engineering Design" },
  {
    value: "entrepreneurship and venture capital",
    label: "Entrepreneurship and Venture Capital",
  },
  { value: "environmental consulting", label: "Environmental Consulting" },
  { value: "environmental research", label: "Environmental Research" },
  { value: "financial technology", label: "Financial Technology" },
  { value: "food science", label: "Food Science" },
  { value: "game design", label: "Game Design" },
  { value: "healthcare technology", label: "Healthcare Technology" },
  { value: "human resources management", label: "Human Resources Management" },
  { value: "influencer management", label: "Influencer Management" },
  { value: "international trade", label: "International Trade" },
  { value: "legal technology", label: "Legal Technology" },
  { value: "leisure and entertainment", label: "Leisure and Entertainment" },
  { value: "logistics management", label: "Logistics Management" },
  { value: "manufacturing technology", label: "Manufacturing Technology" },
  { value: "media and broadcasting", label: "Media and Broadcasting" },
  { value: "medical research", label: "Medical Research" },
  { value: "product management", label: "Product Management" },
  { value: "public policy", label: "Public Policy" },
  { value: "publishing and editing", label: "Publishing and Editing" },
  { value: "real estate development", label: "Real Estate Development" },
  { value: "remote work management", label: "Remote Work Management" },
  { value: "renewable energy", label: "Renewable Energy" },
  { value: "robotics", label: "Robotics" },
  { value: "smart city", label: "Smart City" },
  { value: "social media", label: "Social Media" },
  { value: "sports management", label: "Sports Management" },
  { value: "tech development", label: "Tech Development" },
  { value: "tourism and travel", label: "Tourism and Travel" },
  { value: "user experience design", label: "User Experience Design" },
  { value: "virtual Reality", label: "Virtual Reality" },
];

export default function Onboarding() {
  const [open, setOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [myJob, setMyJob] = useState("");
  const [input, setInput] = useState("Virtual Reality");

  const auth = useAuth();
  const navigation = useNavigate();

  const { mutate } = useMutation({
    mutationKey: ["user"],
    mutationFn: async () => {
      const response = await fetch("/api/users/onboarding", {
        method: "POST",
        body: JSON.stringify({
          socialId: auth.data?.socialId,
          job: myJob,
          nickname: nickname,
        }),
      });
      const data = await response.json();

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigation("/");
    },
  });

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
                    ? JOBS.find((job) => job.value === myJob)?.label
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
                    className=""
                    onClick={() => {
                      setMyJob(input);
                      JOBS.push({
                        value: lowercaseAllFirstLetters(input),
                        label: input,
                      });
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4 shrink-0", "w-lg opacity-0")}
                    />
                    {input}
                  </CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-scroll">
                    {JOBS?.map((job) => (
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
            className="w-full rounded-full"
          >
            Adopt My FocusMonster
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
