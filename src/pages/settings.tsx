import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/auth";
import { useBannedSites } from "@/hooks/banned-sites";
import { useMutation } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { Job } from "./onboarding";
import { cn } from "@/lib/utils";
import { useSessions } from "@/hooks/sessions";
import { LoginPopup } from "@/components/login-popup";

export default function Settings() {
  return (
    <div className="flex flex-row divide-y-0 p-8">
      <BannedSites />
      <UserProfile />
    </div>
  );
}

export const startsWithHttp = /^(http|https):\/\//;

function BannedSites() {
  const [site, setSite] = useState("");
  const { bannedSites, add } = useBannedSites();
  const [error, setError] = useState(false);
  const { isFocusing } = useSessions();

  return (
    <div className="flex grow flex-col space-y-4 pb-6 lg:pb-0 lg:pr-6">
      <h2 className="text-2xl font-semibold text-neutral-100">
        Blocked Websites
      </h2>
      <p className="text-neutral-100">
        Don't open the websites, let your FocusMonster grow!
      </p>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isFocusing) return;
            if (!site) {
              setError(true);
              return;
            }

            const siteName: string = getDomain(site);

            if (!siteName) {
              setError(true);
              return;
            }

            add(siteName);
          }}
          className="relative"
        >
          <input
            type="text"
            className={twMerge(
              "w-full rounded-full bg-gray-300/50 p-2 px-4 text-gray-50 placeholder-gray-300",
              error && "outline-4 outline-red-500",
            )}
            disabled={isFocusing}
            placeholder="Enter URL"
            value={site}
            onChange={(e) => {
              setSite(e.target.value);
              setError(false);
            }}
          />
          <button
            className="absolute right-1 top-1 grid aspect-square w-8 place-content-center rounded-full bg-blue-900/80"
            type="submit"
          >
            <Plus className="text-white" />
          </button>
        </form>
      </div>
      <div>
        {Object.keys(bannedSites).map((site) => (
          <BlockedItem key={site} site={site} />
        ))}
      </div>
    </div>
  );
}

function BlockedItem({ site }: { site: string }) {
  const { bannedSites, remove, toggle } = useBannedSites();
  const { isFocusing } = useSessions();

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg p-2">
      <img
        width="24px"
        height="24px"
        src={`https://www.google.com/s2/favicons?domain=${site}`}
        alt=""
      />
      <a
        className="grow text-gray-50 underline"
        target="_blank"
        href={`https://${site}`}
      >
        {site}
      </a>
      <Switch
        checked={bannedSites[site]}
        disabled={isFocusing}
        onCheckedChange={() => {
          if (isFocusing) return;
          toggle(site);
        }}
      />
      <button
        onClick={() => {
          if (isFocusing) return;
          remove(site);
        }}
        className={cn(
          "ml-2 rounded-full p-1 hover:bg-gray-100/30",
          isFocusing && "hover:bg-transparent",
        )}
        disabled={isFocusing}
      >
        <X className="text-white" />
      </button>
    </div>
  );
}

export const regex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;

function UserProfile() {
  const { data } = useAuth();
  const { isFocusing } = useSessions();

  const [nickname, setNickname] = useState(data?.nickname);
  const [job, setJob] = useState(data?.job ?? "");
  const [nicknameError, setNicknameError] = useState("");

  const { mutate, isSuccess } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async () => {
      if (isFocusing) {
        return;
      }
      const res = await fetch("/api/users/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socialId: data?.socialId,
          nickname,
          job,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to update profile: " + (await res.text()));
      }
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      if (error.message.includes("Invalid Nickname")) {
        setNicknameError("The nickname is already taken");
      }
    },
  });

  return (
    <div className="relative flex grow flex-col space-y-4 pl-6 pt-0">
      <h2 className="text-2xl font-semibold text-neutral-100">User Profile</h2>
      {data?.anonymous ? <LoginPopup className="left-16 top-6" /> : null}
      <div className="relative grid grid-cols-[200px__1fr] place-content-center items-center gap-2 pt-10">
        {nicknameError.length > 0 && (
          <div className="absolute -top-1 rounded-full bg-red-100 px-4 py-1 text-red-600">
            {nicknameError}
          </div>
        )}
        <div className="text-neutral-100">Nickname</div>
        <Button
          variant="outline"
          className="bg-transparent hover:bg-neutral-50/20"
          disabled={isFocusing}
          asChild
        >
          <input
            type="text"
            className="rounded-lg bg-transparent p-2 text-neutral-200"
            value={nickname}
            disabled={isFocusing}
            onChange={(e) => {
              if (
                e.target.value.length > 13 ||
                (e.target.value.length > 0 && !regex.test(e.target.value))
              ) {
                setNicknameError(
                  "*Nickname should be in English, Korean, or numbers, up to 13 characters.",
                );
                return;
              }
              setNicknameError("");
              setNickname(e.target.value);
            }}
            placeholder={data?.nickname}
          />
        </Button>
        <div className="text-neutral-100">Job</div>
        <Job myJob={job} setMyJob={setJob} transparent />
        <div className="text-neutral-100">Language</div>
        <p className="rounded-lg p-2 text-gray-400">English</p>
      </div>
      <Button
        onClick={() => {
          if (nicknameError.length > 0) {
            return;
          }
          if (job.length < 1) {
            toast.error("Please select your job");
            return;
          }
          mutate();
        }}
        className={cn(
          "self-end",
          isSuccess && "bg-green-100 text-green-900 hover:bg-green-300",
        )}
        disabled={isFocusing}
      >
        Update{isSuccess ? "d!" : null}
      </Button>
    </div>
  );
}

function getDomain(site: string) {
  if (startsWithHttp.test(site)) {
    const siteName = new URL(site).hostname;
    return siteName;
  }

  const siteName = new URL("https://" + site).hostname;
  return siteName;
}
