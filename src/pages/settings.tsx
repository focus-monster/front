import { Switch } from "@/components/ui/switch";
import { useBannedSites } from "@/hooks/banned-sites";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Settings() {
  return (
    <div className="mx-auto flex flex-col gap-8 p-8 lg:flex-row">
      <BannedSites />
      <UserProfile />
    </div>
  );
}

function BannedSites() {
  const [site, setSite] = useState("");
  const { bannedSites, add } = useBannedSites();
  const [error, setError] = useState(false);

  return (
    <div className="grow space-y-4">
      <h2 className="text-2xl font-semibold">Blocked Websites</h2>
      <p className="text-gray-800">
        Don't open the websites, let your FocusMonster grow!
      </p>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
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

  const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg p-2">
      <img
        width="24px"
        height="24px"
        src={`https://www.google.com/s2/favicons?domain=${site}.com`}
        alt=""
      />
      <a
        className="grow text-gray-50 underline"
        target="_blank"
        href={`https://${site}.com`}
      >
        {capitalize(site)}
      </a>
      <Switch
        checked={bannedSites[site]}
        onCheckedChange={() => toggle(site)}
      />
      <button
        onClick={() => remove(site)}
        className="ml-2 rounded-full p-1 hover:bg-gray-100/30"
      >
        <X className="text-white" />
      </button>
    </div>
  );
}

function UserProfile() {
  return (
    <div className="grow space-y-4">
      <h2 className="text-2xl font-semibold">User Profile</h2>
      <p className="text-gray-800">Your user profile information.</p>
      <div className="space-y-4"></div>
    </div>
  );
}

function getDomain(site: string) {
  const siteName = new URL(site).hostname;

  const parts = siteName.split(".");

  if (parts.length > 2) {
    return parts.at(-2);
  }

  return parts[0];
}
