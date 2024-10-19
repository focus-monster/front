import { CollectionDialogContext } from "@/components/dialog/collection-dialog";
import Loading from "@/components/loading";
import { Session, applyTimezoneOffset, useSessions } from "@/hooks/sessions";
import { useContext } from "react";

export default function Collection() {
  return (
    <div className="relative mx-auto">
      <div className="grid h-full w-full grid-cols-6 gap-12 p-8">
        <ImageCards />
      </div>
    </div>
  );
}

function ImageCards() {
  const { data: sessions, isLoading } = useSessions();
  const imageCardsObj = sessions?.reduce(
    (acc, session) => {
      const date = applyTimezoneOffset(session.createdDateTime);
      const dateString = date.toLocaleDateString();
      if (session.focusStatus === "FOCUSING") {
        return acc;
      }
      if (acc[dateString]) {
        acc[dateString].push(session);
      } else {
        acc[dateString] = [session];
      }
      return acc;
    },
    {} as { [key: string]: Session[] },
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!sessions || !imageCardsObj) {
    return <p>Your collection is empty</p>;
  }

  const imageCards = Object.entries(imageCardsObj).map(([date, sessions]) => ({
    key: date,
    sessions: [...sessions.reverse()],
  }));

  return [...imageCards.reverse()].map(({ key, sessions }) => (
    <ImageCard
      key={key}
      multiple={sessions.at(1)?.image || null}
      image={sessions.at(0)?.image || ""}
      date={key}
      sessions={sessions}
    />
  ));
}

function ImageCard({
  image,
  date,
  multiple,
  sessions,
}: {
  image: string;
  date: string;
  multiple: string | null;
  sessions: Session[];
}) {
  const { setOpen, setCollection } = useContext(CollectionDialogContext);
  return (
    <div
      onClick={() => {
        setOpen(true);
        setCollection(sessions);
      }}
      className="group space-y-6 hover:cursor-pointer"
    >
      <div className="relative">
        <div
          className="aspect-square w-[180px] overflow-clip rounded-lg drop-shadow transition-transform group-hover:scale-105"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        {multiple ? (
          <div
            className="absolute inset-0 -z-10 rotate-12 overflow-clip rounded-lg bg-gray-900/50 bg-neutral-600 drop-shadow transition-transform group-hover:rotate-[20deg]"
            style={{
              backgroundImage: `url(${multiple})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "brightness(0.5)",
            }}
          ></div>
        ) : null}
      </div>

      <p className="text-center text-neutral-50">{formatDate(date)}</p>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toDateString();
}
