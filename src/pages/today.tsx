import { useAuth } from "@/hooks/auth";
import Folder from "../components/folder";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/loading";

type Session = {
  id: number;
  userSocialId: string;
  duration: {
    hours: number;
    minutes: number;
  };
  banedSiteAccessLog: {
    name: string;
    count: number;
  }[];
  history: string[];
  focusStatus: string;
  image: string;
  evaluation: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
};

export default function Today() {
  const { data: auth } = useAuth();
  const { data: sessions, isLoading } = useQuery<Session[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      const response = await fetch(`/api/focus?socialId=${auth?.socialId}`);
      const data = await response.json();
      return data as Session[];
    },
  });

  return (
    <div className="flex flex-row gap-8 px-6">
      <div className="w-full grow">
        <Folder
          title={
            <>
              <span className="text-2xl font-bold">{auth?.nickname}</span>
              {" / "}
              <span>Lv{3}</span>
            </>
          }
        />
      </div>
      <div className="flex w-full grow flex-col gap-6">
        {isLoading ? (
          <Loading />
        ) : (
          sessions?.map((session) => {
            if (session.focusStatus === "FOCUSING") return null;

            return <SessionCard key={session.id} session={session} />;
          })
        )}
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  return (
    <div
      style={{
        backgroundImage: `url(/square.png)`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
      className="h-[180px] overflow-clip rounded-lg"
    >
      <div className="w-full py-3 text-center">
        {new Date(session.createdDateTime).toLocaleDateString()}
      </div>
      <div className="flex gap-4 bg-transparent px-10 py-4">
        <div className="line-clamp-4">{JSON.parse(session.evaluation)}</div>
        <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-xl">
          <img
            className="object-cover"
            src={session.image}
            alt="session image"
          />
        </div>
      </div>
    </div>
  );
}
