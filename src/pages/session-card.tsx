import { Session } from "@/hooks/sessions";
import { Result } from "./result";

export function SessionCard({ session }: { session: Session }) {
  return (
    <div
      style={{
        backgroundImage: `url(/square.png)`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="h-[220px] w-[635px] rounded-lg"
    >
      <div className="w-full pt-4 text-center">
        <Result status={session} />
      </div>
      <div className="grid grid-cols-[1fr,96px] gap-4 bg-transparent px-8 pb-9 pt-4">
        <div className="line-clamp-4 text-lg">
          {JSON.parse(session.evaluation)}
        </div>
        <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-xl">
          <img
            className="h-full w-full object-cover"
            src={session.image}
            alt="session image"
          />
        </div>
      </div>
    </div>
  );
}
